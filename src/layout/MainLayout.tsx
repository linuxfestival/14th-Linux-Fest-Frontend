import React, { useEffect, useLayoutEffect, useState } from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Outlet, useLocation } from "react-router-dom";
import { useGoftino } from "../hooks/useGoftino";
import { Helmet } from "react-helmet-async";
import { PageInformationOptions, PageMetaInformation } from "../constants";

const MainLayout = () => {
  const [pageInformation, setPageInformation] = useState<
    PageInformationOptions | undefined
  >();
  useGoftino();

  const { pathname, hash, key } = useLocation();

  useLayoutEffect(() => {
    setPageInformation(PageMetaInformation[pathname]);
  }, [pathname]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (target) {
        target.scrollIntoView({ block: "start" });
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return (
    <>
      {pageInformation && (
        <Helmet>
          <title>لینوکس فست | {pageInformation.title}</title>
          <meta
            name="description"
            content={pageInformation.description || ""}
          />
          <meta
            name="keywords"
            content={pageInformation.keywords?.join(", ")}
          />
          <meta
            property="og:title"
            content={`لینوکس فست | ${pageInformation.title}`}
          />
          <meta
            property="og:description"
            content={pageInformation.description || ""}
          />
          <meta property="og:image" content="/favicon.ico" />
          <meta property="og:site_name" content="لینوکس فست" />
          <meta
            property="og:url"
            content={`https://linux-fest.ir${pathname === "/" ? "" : pathname}`}
          />
          <link
            rel="canonical"
            href={`https://linux-fest.ir${pathname === "/" ? "" : pathname}`}
          />
        </Helmet>
      )}
      <Outlet />
    </>
  );
};

export default MainLayout;
