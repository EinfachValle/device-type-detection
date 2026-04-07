export interface UAResult {
  isMobile: boolean;
  isTablet: boolean;
  isIPad: boolean;
}

const MOBILE_RE =
  /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
const TABLET_RE = /iPad|Android(?!.*Mobile)|tablet/i;
const IPAD_RE = /iPad/i;

export function parseUserAgent(ua: string, maxTouchPoints: number): UAResult {
  const isIPad =
    IPAD_RE.test(ua) || (ua.includes("Macintosh") && maxTouchPoints >= 1);
  const isMobile = MOBILE_RE.test(ua);
  const isTablet = TABLET_RE.test(ua) || isIPad;

  return { isMobile, isTablet, isIPad };
}
