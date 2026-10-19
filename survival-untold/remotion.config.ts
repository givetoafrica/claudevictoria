import {Config} from '@remotion/cli/config';

// Set REMOTION_BROWSER to a local Chromium (e.g. headless_shell) to skip Remotion's browser download.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
