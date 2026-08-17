"""
Pictory API client.

Reads credentials from environment variables -- never hardcode them here:
  PICTORY_CLIENT_ID      (from Pictory; API credentials are issued separately
                          from your app.pictory.ai subscription)
  PICTORY_CLIENT_SECRET
  PICTORY_USER_ID        (sent as the X-Pictory-User-Id header)
  PICTORY_API_URL        (optional; defaults to https://api.pictory.ai/pictoryapis)

WHAT IS CONFIRMED vs INFERRED
-----------------------------
Confirmed against Pictory's published docs:
  * Base host and the /pictoryapis prefix.
  * Auth is POST /v1/oauth2/token with client_id + client_secret, returning a
    bearer-style token that expires in ~1 hour.
  * Every subsequent call needs BOTH an `Authorization` header (the raw token,
    NOT prefixed with "Bearer") and an `X-Pictory-User-Id` header.
  * Video creation is a two-phase async flow: storyboard -> render, each
    returning a job id that you poll. Poll every 10-30s; faster gets you
    rate-limited.

Inferred (field names may need a one-line fix on first real run):
  * The exact JSON keys inside job payloads (`renderParams`, `videoURL`,
    `shareVideoURL`, ...). Everything below extracts these through candidate
    lists and raises PictoryError with the FULL raw response when no candidate
    matches -- so a wrong guess is a one-line fix, not a mystery.

This mirrors the deliberate style of gathos_client.py in this same directory.
"""

import os
import time

import requests

BASE_URL = os.environ.get("PICTORY_API_URL", "https://api.pictory.ai/pictoryapis")

TOKEN_PATH = "/v1/oauth2/token"
STORYBOARD_PATH = "/v2/video/storyboard"
RENDER_PATH = "/v2/video/render"
JOB_PATH = "/v1/jobs"

# Pictory explicitly recommends 10-30s between polls.
POLL_INTERVAL_SECONDS = 15
POLL_TIMEOUT_SECONDS = 1800  # rendering a several-minute video is slow

# Tokens last ~1h; refresh a little early so a long render never dies mid-poll.
TOKEN_TTL_SECONDS = 3600
TOKEN_REFRESH_MARGIN_SECONDS = 300

# Candidate key names -- first match wins. Add the real name here if a call
# fails with "no ... found under any of [...]".
TOKEN_KEYS = ["access_token", "accessToken", "token"]
JOB_ID_KEYS = ["jobId", "job_id", "id"]
STATUS_KEYS = ["status", "state"]
RENDER_PARAMS_KEYS = ["renderParams", "render_params", "storyboard"]
VIDEO_URL_KEYS = ["videoURL", "videoUrl", "video_url", "shareVideoURL",
                  "shareVideoUrl", "url"]

DONE_VALUES = {"completed", "complete", "succeeded", "success", "done", "finished"}
FAILED_VALUES = {"failed", "error", "errored", "cancelled", "canceled", "rejected"}
PENDING_VALUES = {"queued", "pending", "processing", "in-progress", "in_progress",
                  "running", "started"}


class PictoryError(Exception):
    pass


def _require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise PictoryError(
            f"Missing {name}. Set it as an environment variable (or a GitHub "
            f"Actions secret) before running -- never hardcode Pictory "
            f"credentials into scripts."
        )
    return value


def _first_present(payload: dict, candidates: list):
    for key in candidates:
        if isinstance(payload, dict) and payload.get(key) is not None:
            return key, payload[key]
    return None, None


def _extract(payload: dict, candidates: list, what: str, list_name: str):
    """Pull a value out of a response, or fail loudly with the raw response."""
    _, value = _first_present(payload, candidates)
    if value is None:
        # Job responses often nest the interesting bits under "data".
        nested = payload.get("data") if isinstance(payload, dict) else None
        if isinstance(nested, dict):
            _, value = _first_present(nested, candidates)
    if value is None:
        raise PictoryError(
            f"No {what} found under any of {candidates} in response: {payload}\n"
            f"-> add the real key name to {list_name} in pictory_client.py"
        )
    return value


class PictoryClient:
    """Thin, honest wrapper over the Pictory REST API.

    Holds one OAuth2 token and refreshes it automatically before expiry, so a
    long render that outlives the 1-hour token still finishes.
    """

    def __init__(self, client_id: str = None, client_secret: str = None,
                 user_id: str = None, base_url: str = None):
        self.client_id = client_id or _require_env("PICTORY_CLIENT_ID")
        self.client_secret = client_secret or _require_env("PICTORY_CLIENT_SECRET")
        self.user_id = user_id or _require_env("PICTORY_USER_ID")
        self.base_url = (base_url or BASE_URL).rstrip("/")
        self._token = None
        self._token_expires_at = 0.0

    # -- auth ------------------------------------------------------------

    def _fetch_token(self) -> str:
        body = {"client_id": self.client_id, "client_secret": self.client_secret}
        # Pictory's own examples send the credentials as BOTH headers and body.
        headers = {
            "Content-Type": "application/json",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }
        resp = requests.post(f"{self.base_url}{TOKEN_PATH}",
                             headers=headers, json=body, timeout=60)
        if resp.status_code >= 400:
            raise PictoryError(
                f"Token request failed ({resp.status_code}): {resp.text}\n"
                f"-> check PICTORY_CLIENT_ID / PICTORY_CLIENT_SECRET. Note that "
                f"API credentials are NOT part of an app.pictory.ai subscription; "
                f"they are issued separately by Pictory."
            )
        return _extract(resp.json(), TOKEN_KEYS, "access token", "TOKEN_KEYS")

    def token(self) -> str:
        if self._token is None or time.time() >= self._token_expires_at:
            self._token = self._fetch_token()
            self._token_expires_at = (
                time.time() + TOKEN_TTL_SECONDS - TOKEN_REFRESH_MARGIN_SECONDS
            )
        return self._token

    def _headers(self) -> dict:
        return {
            # Confirmed: the raw token, with no "Bearer " prefix.
            "Authorization": self.token(),
            "X-Pictory-User-Id": self.user_id,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def _post(self, path: str, body: dict) -> dict:
        resp = requests.post(f"{self.base_url}{path}", headers=self._headers(),
                             json=body, timeout=120)
        if resp.status_code >= 400:
            raise PictoryError(f"POST {path} failed ({resp.status_code}): {resp.text}")
        return resp.json()

    def _get(self, path: str) -> dict:
        resp = requests.get(f"{self.base_url}{path}", headers=self._headers(),
                            timeout=60)
        if resp.status_code >= 400:
            raise PictoryError(f"GET {path} failed ({resp.status_code}): {resp.text}")
        return resp.json()

    # -- jobs ------------------------------------------------------------

    def poll_job(self, job_id: str, label: str = "job",
                 interval: int = POLL_INTERVAL_SECONDS,
                 timeout: int = POLL_TIMEOUT_SECONDS) -> dict:
        """Poll GET /v1/jobs/{jobId} until it reaches a terminal state."""
        deadline = time.time() + timeout
        while time.time() < deadline:
            data = self._get(f"{JOB_PATH}/{job_id}")
            status = str(
                _extract(data, STATUS_KEYS, "status", "STATUS_KEYS")
            ).lower()

            if status in DONE_VALUES:
                return data
            if status in FAILED_VALUES:
                raise PictoryError(f"{label} {job_id} failed: {data}")
            if status not in PENDING_VALUES:
                print(f"[pictory] unrecognized {label} status {status!r}, still "
                      f"polling -- add it to DONE_VALUES/FAILED_VALUES if terminal")

            remaining = int(deadline - time.time())
            print(f"[pictory] {label} {job_id}: {status} "
                  f"(<={remaining}s budget left)")
            time.sleep(interval)

        raise PictoryError(
            f"{label} {job_id} timed out after {timeout}s. The job may still "
            f"finish on Pictory's side -- check the Pictory dashboard."
        )

    # -- the two-phase video flow ---------------------------------------

    def create_storyboard(self, body: dict) -> dict:
        """Phase 1: POST /v2/video/storyboard, then wait for the job.

        Returns the completed storyboard job payload, which carries the
        renderParams that phase 2 consumes.
        """
        job = self._post(STORYBOARD_PATH, body)
        job_id = _extract(job, JOB_ID_KEYS, "job id", "JOB_ID_KEYS")
        print(f"[pictory] storyboard job submitted: {job_id}")
        return self.poll_job(job_id, label="storyboard")

    def render_storyboard(self, storyboard_job: dict) -> dict:
        """Phase 2: feed the storyboard's renderParams to POST /v2/video/render.

        Returns the completed render job payload; use video_url() on it.
        """
        render_params = _extract(storyboard_job, RENDER_PARAMS_KEYS,
                                 "renderParams", "RENDER_PARAMS_KEYS")
        job = self._post(RENDER_PATH, render_params)
        job_id = _extract(job, JOB_ID_KEYS, "job id", "JOB_ID_KEYS")
        print(f"[pictory] render job submitted: {job_id}")
        return self.poll_job(job_id, label="render")


def video_url(render_job: dict) -> str:
    """Public helper: pull the finished MP4 URL out of a completed render job.

    Pictory returns a time-limited download URL, so fetch it promptly rather
    than storing it for later.
    """
    return _extract(render_job, VIDEO_URL_KEYS, "video URL", "VIDEO_URL_KEYS")


def build_storyboard_body(scenes: list, video_name: str,
                          voice: str = "Jackson",
                          background_music: bool = True,
                          music_volume: float = 0.5,
                          language: str = "en",
                          webhook: str = None,
                          extra_fields: dict = None) -> dict:
    """Assemble a text-to-video storyboard request.

    `scenes` is a list of plain narration strings -- one scene per string.
    Pictory picks stock footage per scene from the text, reads it in the
    chosen AI voice, and burns in captions.

    Field names follow Pictory's documented text-to-video examples. If the API
    rejects the body, the error carries the full server response; pass
    corrections through `extra_fields` rather than editing this helper.
    """
    body = {
        "videoName": video_name,
        "language": language,
        "audio": {
            "aiVoiceOver": {
                "speaker": voice,
                "speed": "100",
                "amplifyLevel": "0",
            },
            "autoBackgroundMusic": background_music,
            "backGroundMusicVolume": music_volume,
        },
        "scenes": [
            {
                "text": scene,
                "voiceOver": True,
                "splitTextOnNewLine": False,
                "splitTextOnPeriod": True,
            }
            for scene in scenes
        ],
    }
    if webhook:
        body["webhook"] = webhook
    if extra_fields:
        body.update(extra_fields)
    return body
