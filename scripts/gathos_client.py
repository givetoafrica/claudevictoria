"""
Gathos API client.

Reads credentials from environment variables -- never hardcode keys here:
  GATHOS_IMAGE_KEY  (img_live_...)
  GATHOS_TTS_KEY    (tts_live_...)
  GATHOS_I2I_KEY    (i2i_live_...)
  GATHOS_VIDEO_KEY  (vid_live_...; legacy img_live_* keys also work for video)
  GATHOS_API_URL    (optional; defaults to https://gathos.com/api/v1)

Video generation is fully confirmed against Gathos's published API docs:
request fields, the 5-field job response shape, status values
(queued/processing/done/failed), local-file multipart upload, frame-count
snapping, and the /styles endpoint.

Image generation, TTS, and image-to-image are NOT fully confirmed -- only
`{"prompt": ...}` is documented for image generation. This client guesses
common field/response names for those three and raises GathosError with
the full raw response if a guess is wrong, so a bad assumption is a
one-line fix to the relevant candidate list below, not a mystery.
"""

import os
import time
import requests

BASE_URL = os.environ.get("GATHOS_API_URL", "https://gathos.com/api/v1")
# image2image omits /v1 -- derive from BASE_URL so a custom GATHOS_API_URL
# (e.g. a proxy/mirror host) still routes image2image correctly.
IMAGE2IMAGE_BASE_URL = BASE_URL.rsplit("/v1", 1)[0] if BASE_URL.endswith("/v1") \
    else "https://gathos.com/api"

DEFAULT_POLL_INTERVAL_SECONDS = 3
DEFAULT_POLL_TIMEOUT_SECONDS = 300

# Video generation confirmed constants.
VIDEO_POLL_INTERVAL_SECONDS = 10  # recommended by the docs
VIDEO_MIN_FRAMES = 9
VIDEO_MAX_FRAMES = 513
VIDEO_MODES = {"t2av", "ti2av", "ta2v", "tia2v"}

# Best-guess candidates for image/TTS/i2i (unconfirmed). First match wins.
JOB_ID_KEYS = ["job_id", "jobId", "id"]
STATUS_KEYS = ["status", "state"]
DONE_VALUES = {"completed", "succeeded", "success", "done", "finished"}
FAILED_VALUES = {"failed", "error", "errored", "cancelled", "canceled"}
OUTPUT_KEYS = ["output_url", "url", "result_url", "asset_url",
               "image_url", "video_url", "audio_url", "output", "result"]


class GathosError(Exception):
    pass


def _headers(key: str) -> dict:
    return {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }


def _require_key(env_var: str) -> str:
    key = os.environ.get(env_var)
    if not key:
        raise GathosError(
            f"Missing {env_var}. Set it as an environment variable before "
            f"running -- never hardcode Gathos keys into scripts."
        )
    return key


def _first_present(d: dict, candidates: list):
    for k in candidates:
        if k in d and d[k] is not None:
            return k, d[k]
    return None, None


def _extract_job_id(job: dict) -> str:
    key, value = _first_present(job, JOB_ID_KEYS)
    if key is None:
        raise GathosError(
            f"No job id found under any of {JOB_ID_KEYS} in response: {job}\n"
            f"-> add the real key name to JOB_ID_KEYS in gathos_client.py"
        )
    return value


def _extract_status(job: dict):
    key, value = _first_present(job, STATUS_KEYS)
    if key is None:
        raise GathosError(
            f"No status found under any of {STATUS_KEYS} in response: {job}\n"
            f"-> add the real key name to STATUS_KEYS in gathos_client.py"
        )
    return str(value).lower()


def _extract_output(job: dict):
    key, value = _first_present(job, OUTPUT_KEYS)
    if key is None:
        raise GathosError(
            f"Job looks complete but no output found under any of "
            f"{OUTPUT_KEYS} in response: {job}\n"
            f"-> add the real key name to OUTPUT_KEYS in gathos_client.py"
        )
    return value


def _poll_job(url: str, key: str,
              interval: int = DEFAULT_POLL_INTERVAL_SECONDS,
              timeout: int = DEFAULT_POLL_TIMEOUT_SECONDS) -> dict:
    """Poll a job status endpoint until it completes or times out (guess-based;
    used for image/TTS/i2i, not video -- see _poll_video_job for that)."""
    elapsed = 0
    while elapsed < timeout:
        resp = requests.get(url, headers=_headers(key))
        resp.raise_for_status()
        data = resp.json()

        status = _extract_status(data)
        if status in DONE_VALUES:
            _extract_output(data)  # raises early with full context if missing
            return data
        if status in FAILED_VALUES:
            raise GathosError(f"Job failed (status={status!r}): {data}")
        if status not in ("queued", "processing", "pending", "running"):
            print(f"[gathos] unrecognized status {status!r}, still polling "
                  f"-- add to DONE_VALUES/FAILED_VALUES if this is terminal")

        time.sleep(interval)
        elapsed += interval

    raise GathosError(f"Job timed out after {timeout}s polling {url}")


def generate_image(prompt: str, resolution: str = None,
                    extra_fields: dict = None) -> dict:
    """Submit an image generation job and poll until complete.

    Returns the completed job's response dict; use extract_output(job) to
    get the asset URL/value.
    """
    key = _require_key("GATHOS_IMAGE_KEY")
    body = {"prompt": prompt}
    if resolution:
        body["resolution"] = resolution  # unconfirmed field name -- guess
    if extra_fields:
        body.update(extra_fields)

    resp = requests.post(f"{BASE_URL}/image-generation",
                          headers=_headers(key), json=body)
    resp.raise_for_status()
    job = resp.json()
    job_id = _extract_job_id(job)

    return _poll_job(f"{BASE_URL}/image-generation/jobs/{job_id}", key)


def generate_tts(text: str, voice_id: str = None,
                  extra_fields: dict = None) -> dict:
    """Submit a TTS job and poll until complete."""
    key = _require_key("GATHOS_TTS_KEY")
    body = {"text": text}  # unconfirmed field name -- guess
    if voice_id:
        body["voice_id"] = voice_id  # unconfirmed field name -- guess
    if extra_fields:
        body.update(extra_fields)

    resp = requests.post(f"{BASE_URL}/tts", headers=_headers(key), json=body)
    resp.raise_for_status()
    job = resp.json()
    job_id = _extract_job_id(job)

    return _poll_job(f"{BASE_URL}/tts/jobs/{job_id}", key)


def edit_image(image_url: str, prompt: str,
               extra_fields: dict = None) -> dict:
    """Submit an image-to-image edit job.

    Note: this endpoint group omits /v1 in the path (confirmed, not a typo).
    """
    key = _require_key("GATHOS_I2I_KEY")
    body = {"image_url": image_url, "prompt": prompt}  # unconfirmed field names -- guess
    if extra_fields:
        body.update(extra_fields)

    resp = requests.post(f"{IMAGE2IMAGE_BASE_URL}/image2image",
                          headers=_headers(key), json=body)
    resp.raise_for_status()
    job = resp.json()
    job_id = _extract_job_id(job)

    return _poll_job(f"{IMAGE2IMAGE_BASE_URL}/image2image/jobs/{job_id}", key)


def extract_output(job: dict):
    """Public helper: pull the finished asset value out of a completed
    job dict returned by generate_image / generate_tts / edit_image."""
    return _extract_output(job)


def snap_ltx_frames(raw_frames: float) -> int:
    """Preview the exact frame count the server will snap a request to.

    LTX frame groups require (num_frames - 1) % 8 == 0, clamped to
    [9, 513]. The API snaps automatically server-side; this is only for
    previewing/display before submitting. E.g. 120 -> 121, 240 -> 241.
    """
    clamped = max(VIDEO_MIN_FRAMES, min(VIDEO_MAX_FRAMES, round(raw_frames)))
    return max(VIDEO_MIN_FRAMES, min(VIDEO_MAX_FRAMES,
                                      round((clamped - 1) / 8) * 8 + 1))


def _poll_video_job(job_id: str, key: str,
                     interval: int = VIDEO_POLL_INTERVAL_SECONDS,
                     timeout: int = DEFAULT_POLL_TIMEOUT_SECONDS) -> dict:
    """Poll the video-generation job endpoint (confirmed 5-field shape)."""
    url = f"{BASE_URL}/video-generation/jobs/{job_id}"
    elapsed = 0
    while elapsed < timeout:
        resp = requests.get(url, headers=_headers(key))
        resp.raise_for_status()
        data = resp.json()

        status = data.get("status")
        if status == "done":
            if not data.get("video_url"):
                raise GathosError(f"Job reports done but video_url is empty: {data}")
            return data
        if status == "failed":
            raise GathosError(f"Video job failed: {data.get('error')!r} -- full response: {data}")
        if status not in ("queued", "processing"):
            print(f"[gathos] unrecognized video job status {status!r}, still polling: {data}")

        time.sleep(interval)
        elapsed += interval

    raise GathosError(f"Video job timed out after {timeout}s polling {url}")


def generate_video(prompt: str, mode: str = "t2av",
                    image: str = None, image_url: str = None, image_path: str = None,
                    audio: str = None, audio_url: str = None,
                    negative_prompt: str = None,
                    width: int = None, height: int = None,
                    num_frames: float = None, fps: float = None,
                    seed: int = None, style: str = None,
                    generate_audio: bool = None, enhance_prompt: bool = None,
                    prevent_text: bool = None,
                    poll_interval: int = VIDEO_POLL_INTERVAL_SECONDS,
                    poll_timeout: int = DEFAULT_POLL_TIMEOUT_SECONDS,
                    extra_fields: dict = None) -> dict:
    """Submit a Creator video job and poll until done (confirmed spec).

    mode: one of "t2av" (default), "ti2av", "ta2v", "tia2v".

    image/audio are LOCAL file paths (sent as multipart form-data
    uploads); image_url/audio_url are public http(s) URLs. Send at most
    one image source (image, image_url, image_path are mutually
    exclusive) and at most one audio source (audio, audio_url).

    A single clip is capped at 513 frames (~21s at 24fps) -- for longer
    videos, submit multiple scene-level clips and concatenate with
    ffmpeg rather than requesting one oversized clip.

    Returns the completed job dict: {job_id, status, error, video_url,
    input_image_url}. Use video_url directly (it's a time-limited
    download URL, no base64).
    """
    if mode not in VIDEO_MODES:
        raise GathosError(f"Unknown mode {mode!r}; must be one of {sorted(VIDEO_MODES)}")
    if sum(1 for v in (image, image_url, image_path) if v) > 1:
        raise GathosError("Pass only one of image, image_url, image_path -- never multiple")

    key = _require_key("GATHOS_VIDEO_KEY")

    fields = {"prompt": prompt, "mode": mode}
    if image_url:
        fields["image_url"] = image_url
    if image_path:
        fields["image_path"] = image_path
    if audio_url:
        fields["audio_url"] = audio_url
    if negative_prompt:
        fields["negative_prompt"] = negative_prompt
    if width is not None:
        fields["width"] = width
    if height is not None:
        fields["height"] = height
    if num_frames is not None:
        fields["num_frames"] = num_frames
    if fps is not None:
        fields["fps"] = fps
    if seed is not None:
        fields["seed"] = seed
    if style is not None:
        fields["style"] = style
    if generate_audio is not None:
        fields["generate_audio"] = generate_audio
    if enhance_prompt is not None:
        fields["enhance_prompt"] = enhance_prompt
    if prevent_text is not None:
        fields["prevent_text"] = prevent_text
    if extra_fields:
        fields.update(extra_fields)

    if image or audio:
        # Local file upload(s) present -- must use multipart form-data,
        # never a JSON Content-Type header alongside files.
        files = {}
        opened = []
        try:
            if image:
                f = open(image, "rb")
                opened.append(f)
                files["image"] = f
            if audio:
                f = open(audio, "rb")
                opened.append(f)
                files["audio"] = f
            form = {k: (str(v).lower() if isinstance(v, bool) else str(v))
                    for k, v in fields.items()}
            resp = requests.post(f"{BASE_URL}/video-generation",
                                  headers={"Authorization": f"Bearer {key}"},
                                  data=form, files=files)
        finally:
            for f in opened:
                f.close()
    else:
        resp = requests.post(f"{BASE_URL}/video-generation",
                              headers=_headers(key), json=fields)

    resp.raise_for_status()
    job = resp.json()
    job_id = job.get("job_id")
    if not job_id:
        raise GathosError(f"No job_id in submit response: {job}")

    return _poll_video_job(job_id, key, interval=poll_interval, timeout=poll_timeout)


def list_video_styles() -> list:
    """GET /video-generation/styles -- returns [{"name": ..., "description": ...}, ...].

    Send the style `name` exactly as returned (e.g. "Ghibli") in
    generate_video's style= param. Never send raw LoRA/.safetensors
    filenames.
    """
    key = _require_key("GATHOS_VIDEO_KEY")
    resp = requests.get(f"{BASE_URL}/video-generation/styles", headers=_headers(key))
    resp.raise_for_status()
    return resp.json()["styles"]
