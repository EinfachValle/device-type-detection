# v2.1.3 — Viewport cascade hotfix

## Highlights

- **Laptop-Viewports korrekt** — 1025–1366px gibt jetzt `laptop` statt `tablet_l` zurück, wenn kein Tablet-UA erkannt wird
- **`isTablet` nur für echte Tablets** — `tablet_l` wird nur noch über UA-basierte Erkennung (Branch 2) zugewiesen
- **TypeScript IDE-Fix** — `describe`/`it` Typen in Test-Dateien werden korrekt aufgelöst

## Bug

Der Viewport-Cascade (Branch 4 in `detectDeviceType()`) wurde nur erreicht wenn die UA **nicht** mobile, tablet oder TV war — also bei Desktop-Browsern. Trotzdem klassifizierte der Cascade 1025–1366px als `TABLET_L`, was `isTablet = true` setzte.

### Vorher (2.1.2)

| Viewport | UA             | deviceType | isTablet        |
| -------- | -------------- | ---------- | --------------- |
| 1280px   | Desktop Chrome | `tablet_l` | `true` ← falsch |
| 1366px   | Desktop Chrome | `tablet_l` | `true` ← falsch |

### Nachher (2.1.3)

| Viewport | UA             | deviceType | isTablet | isLaptop  |
| -------- | -------------- | ---------- | -------- | --------- |
| 1280px   | Desktop Chrome | `laptop`   | `false`  | `true` ✓  |
| 1366px   | Desktop Chrome | `laptop`   | `false`  | `true` ✓  |
| 1024px   | iPad (UA)      | `tablet_m` | `true`   | `false` ✓ |

## Detection Cascade (unchanged)

```text
1. UA mobile + touch + !iPad  → mobile_s / mobile_m / mobile_l
2. UA tablet/iPad + touch     → tablet_s / tablet_m / tablet_l
3. UA TV                      → tv / tv_4k
4. Viewport-only              → mobile_s ... laptop ... desktop (max)  ← FIXED
```
