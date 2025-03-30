import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const WIDGET_ID = "pbMzMN";

declare global {
  interface Window {
    Goftino?: {
      setUser: (userData: {
        email?: string;
        name?: string;
        phone?: string;
        forceUpdate?: boolean;
      }) => void;
    };
  }
}

export function useGoftino() {
  const [isGoftinoReady, setIsGoftinoReady] = useState(false);
  const { userPhoneNumber } = useSelector((state: RootState) => state.auth);
  const { user, loading } = useSelector((state: RootState) => state.users);

  const removeAllGoftinoScripts = (element: any) => {
    if (!element) return;
    const { id } = element;
    if (id && (id === "goftino" || id === "goftino_w")) {
      removeElem(element);
    }
  };

  const removeGoftinoElements = (): void => {
    setIsGoftinoReady(false);
    getAllTags("script", removeAllGoftinoScripts);
    getAllTags("iframe", removeAllGoftinoScripts);
    getAllTags("style", removeAllGoftinoScripts);
  };

  function loadGoftino() {
    var scriptElement = document.createElement("script");
    var widgetUrl = "https://www.goftino.com/widget/" + WIDGET_ID;
    var localStorageKey = "goftino_" + WIDGET_ID;
    var localStorageValue = localStorage.getItem(localStorageKey);

    scriptElement.id = "goftino";
    scriptElement.async = true;
    scriptElement.src = localStorageValue
      ? widgetUrl + "?o=" + localStorageValue
      : widgetUrl;

    document.getElementsByTagName("head")[0].appendChild(scriptElement);
  }

  function restartGoftino() {
    setIsGoftinoReady(false);
    removeGoftinoElements();
    loadGoftino();
  }

  useEffect(() => {
    restartGoftino();

    function handleGoftinoReady() {
      console.log("!@! data", userPhoneNumber, user, loading);
      if (userPhoneNumber && user && !loading) {
        console.log("!@! user data to goftino", {
          email: user.email,
          name: user.first_name + " " + user.last_name,
          phone: userPhoneNumber,
          forceUpdate: true,
        });
        window.Goftino?.setUser({
          email: user.email,
          name: user.first_name + " " + user.last_name,
          phone: userPhoneNumber,
          forceUpdate: true,
        });
      }
      setIsGoftinoReady(true);
    }

    if (document.readyState === "complete") {
      loadGoftino();
    } else {
      window.addEventListener("load", loadGoftino);
    }

    window.addEventListener("goftino_ready", handleGoftinoReady);

    return () => {
      window.removeEventListener("goftino_ready", handleGoftinoReady);
    };
  }, [userPhoneNumber, user, loading]);

  return { isGoftinoReady };
}

export const getAllTags = (tagName: string, cb: any) => {
  const elements = document.getElementsByTagName(tagName);
  const elementsArray = Array.prototype.slice.call(elements);
  elementsArray.forEach(cb);
};

export const removeElem = (element: Node): Node =>
  element.parentNode!.removeChild(element);

export const getElemById = (elemId: string): Node | null =>
  document.getElementById(elemId);
