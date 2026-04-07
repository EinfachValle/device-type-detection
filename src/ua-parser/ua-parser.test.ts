import { parseUserAgent } from ".";

describe("parseUserAgent", () => {
  describe("iPhone / iOS", () => {
    it("iPhone Safari -> isMobile=true, isTablet=false, isIPad=false", () => {
      const ua =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(true);
      expect(result.isTablet).toBe(false);
      expect(result.isIPad).toBe(false);
    });

    it("iPod Touch -> isMobile=true", () => {
      const ua =
        "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(true);
    });
  });

  describe("Android", () => {
    it("Android Chrome Mobile -> isMobile=true", () => {
      const ua =
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(true);
      expect(result.isTablet).toBe(false);
    });

    it('Android Tablet (no "Mobile") -> isTablet=true, isMobile=false', () => {
      const ua =
        "Mozilla/5.0 (Linux; Android 13; SM-X810) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const result = parseUserAgent(ua, 0);
      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
    });
  });

  describe("iPad", () => {
    it("iPad Safari (classic UA) -> isIPad=true, isTablet=true, isMobile=false", () => {
      const ua =
        "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";
      const result = parseUserAgent(ua, 0);
      expect(result.isIPad).toBe(true);
      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
    });

    it("iPad as Macintosh (modern iPad) + maxTouchPoints=5 -> isIPad=true", () => {
      const ua =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
      const result = parseUserAgent(ua, 5);
      expect(result.isIPad).toBe(true);
      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
    });

    it("Macintosh UA with maxTouchPoints=0 -> NOT iPad", () => {
      const ua =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
      const result = parseUserAgent(ua, 0);
      expect(result.isIPad).toBe(false);
      expect(result.isTablet).toBe(false);
    });

    it("Macintosh UA with maxTouchPoints=1 -> isIPad=true", () => {
      const ua =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const result = parseUserAgent(ua, 1);
      expect(result.isIPad).toBe(true);
      expect(result.isTablet).toBe(true);
    });
  });

  describe("Desktop browsers", () => {
    it("Chrome Desktop -> all false", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isIPad).toBe(false);
    });

    it("Firefox Desktop -> all false", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isIPad).toBe(false);
    });

    it("Safari Desktop (macOS) -> all false", () => {
      const ua =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isIPad).toBe(false);
    });

    it("Edge Desktop -> all false", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isIPad).toBe(false);
    });
  });

  describe("Other mobile devices", () => {
    it("BlackBerry -> isMobile=true", () => {
      const uaBB =
        "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+";
      const result = parseUserAgent(uaBB, 0);
      expect(result.isMobile).toBe(true);
    });

    it("Opera Mini -> isMobile=true", () => {
      const ua =
        "Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(true);
    });

    it("Windows Phone -> isMobile=true", () => {
      const ua =
        "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(true);
    });

    it("IEMobile -> isMobile=true", () => {
      const ua =
        "Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0) like Gecko";
      const result = parseUserAgent(ua, 0);
      expect(result.isMobile).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("empty UA string -> all false", () => {
      const result = parseUserAgent("", 0);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isIPad).toBe(false);
    });

    it('UA with "tablet" keyword -> isTablet=true', () => {
      const ua = "some-random-agent/1.0 tablet browser";
      const result = parseUserAgent(ua, 0);
      expect(result.isTablet).toBe(true);
    });
  });
});
