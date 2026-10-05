import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";
import store from "./store.ts";
import AuthContainer from "./components/Container/AuthContainer.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

if (import.meta.hot) {
  import.meta.hot.accept();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <AuthContainer>
            <Helmet>
              <title>لینوکس فست</title>
              <link rel="canonical" href="https://linux-fest.ir/" />
            </Helmet>
            <ToastContainer
              rtl
              theme="colored"
              hideProgressBar
              closeOnClick
              position="bottom-center"
              limit={5}
            />
            <RouterProvider router={router} />
          </AuthContainer>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
