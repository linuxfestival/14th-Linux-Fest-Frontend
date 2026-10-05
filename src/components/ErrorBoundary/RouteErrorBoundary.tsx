import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import CrashFallback from "./CrashFallback";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    console.error("Route rendering failed", error);
  }, [error]);

  return <CrashFallback />;
}
