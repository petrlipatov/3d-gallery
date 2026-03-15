import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

const METRIKA_ID = import.meta.env.VITE_YANDEX_METRIKA_ID;
const isProduction = import.meta.env.PROD;

export const YandexMetrika = () => {
  console.log('>>> Metrika component mounted. isProduction:', isProduction, 'METRIKA_ID:', METRIKA_ID);
  const location = useLocation();

  useEffect(() => {
    if (!isProduction || !METRIKA_ID) {
      console.log('>>> Metrika component returned early. isProduction:', isProduction, 'METRIKA_ID:', METRIKA_ID);
      return;
    }

    console.log(">>> Yandex.Metrika component is running. ID:", METRIKA_ID);

    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = new Date().getTime();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      ((k = e.createElement(t)),
        (a = e.getElementsByTagName(t)[0]),
        (k.async = 1),
        (k.src = r));
      k.setAttribute("data-injected-by", "gemini");
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    if (window.ym) {
      window.ym(Number(METRIKA_ID), "init", {
        url: window.location.href,
        referrer: document.referrer,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: "dataLayer",
      });
    }
  }, []);

  useEffect(() => {
    if (!isProduction || !METRIKA_ID) {
      return;
    }

    if (window.ym) {
      window.ym(Number(METRIKA_ID), "hit", location.pathname + location.search);
    }
  }, [location]);

  return null;
};
