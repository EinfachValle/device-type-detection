export interface UAResult {
  isMobile: boolean;
  isTablet: boolean;
  isIPad: boolean;
  isTV: boolean;
}

const MOBILE_RE =
  /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
const TABLET_RE = /iPad|Android(?!.*Mobile)|tablet/i;
const IPAD_RE = /iPad/i;
const TV_RE =
  /SmartTV|SMART-TV|Smart-TV|Tizen|Web0S|WebOS|webOS|NetCast|NETTV|AppleTV|Roku|CrKey|FireTV|Silk.*Fire|Vizio|Hisense|BRAVIA/i;

export function parseUserAgent(ua: string, maxTouchPoints: number): UAResult {
  const isIPad =
    IPAD_RE.test(ua) || (ua.includes("Macintosh") && maxTouchPoints >= 1);
  const isMobile = MOBILE_RE.test(ua);
  const isTablet = TABLET_RE.test(ua) || isIPad;
  const isTV = TV_RE.test(ua);

  return { isMobile, isTablet, isIPad, isTV };
}
