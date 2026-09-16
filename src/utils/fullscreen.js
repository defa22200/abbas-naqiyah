// Cross-browser Fullscreen helper with complete toggle and mobile support

export function isFullscreenActive() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

export function enterFullscreen() {
  try {
    if (isFullscreenActive()) return;

    const doc = window.document;
    const elem = doc.documentElement || doc.body;

    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } catch (err) {
    // Graceful fallback for browsers that restrict automatic fullscreen
  }
}

export function exitFullscreen() {
  try {
    if (isFullscreenActive()) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  } catch (err) {}
}

export function toggleFullscreen() {
  if (isFullscreenActive()) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
}

// ponytail: single shared device check — iPadOS 13+ reports Macintosh, so sniff touch too.
export function isIOSDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return (
    /Macintosh/.test(ua) &&
    typeof window !== 'undefined' &&
    'ontouchstart' in window &&
    (navigator.maxTouchPoints || 0) > 1
  );
}

// ponytail: guarded clipboard — resolves false instead of throwing on http/denied.
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}
