import { useCallback, useRef } from "react";

type Direction = "right" | "bottom" | "corner";

interface UseResizableOptions {
  onResize: (width: number, height: number) => void;
  minWidth?: number;
  minHeight?: number;
}

export function useResizable({
  onResize,
  minWidth = 200,
  minHeight = 200,
}: UseResizableOptions) {
  const startRef = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (direction: Direction, currentWidth: number, currentHeight: number) =>
      (e: React.MouseEvent) => {
        e.preventDefault();
        startRef.current = {
          x: e.clientX,
          y: e.clientY,
          w: currentWidth,
          h: currentHeight,
        };

        // Disable pointer events on all iframes so they don't swallow mouse events during drag
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach((f) => (f.style.pointerEvents = "none"));

        const handleMouseMove = (e: MouseEvent) => {
          if (!startRef.current) return;
          const { x, y, w, h } = startRef.current;
          const dx = e.clientX - x;
          const dy = e.clientY - y;

          let newWidth = w;
          let newHeight = h;

          if (direction === "right" || direction === "corner") {
            newWidth = Math.max(minWidth, w + dx);
          }
          if (direction === "bottom" || direction === "corner") {
            newHeight = Math.max(minHeight, h + dy);
          }

          onResize(Math.round(newWidth), Math.round(newHeight));
        };

        const handleMouseUp = () => {
          startRef.current = null;
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
          iframes.forEach((f) => (f.style.pointerEvents = ""));
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor =
          direction === "corner"
            ? "nwse-resize"
            : direction === "right"
              ? "ew-resize"
              : "ns-resize";
        document.body.style.userSelect = "none";
      },
    [onResize, minWidth, minHeight],
  );

  return { handleMouseDown };
}
