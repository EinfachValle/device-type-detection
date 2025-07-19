import "@testing-library/jest-dom";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";

if (!(ReactDOM as any).render) {
  (ReactDOM as any).render = (
    element: React.ReactElement,
    container: Element | DocumentFragment,
    callback?: () => void,
  ) => {
    const root = ReactDOMClient.createRoot(container);
    // @ts-ignore
    root.render(element, callback);
    return root;
  };
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
