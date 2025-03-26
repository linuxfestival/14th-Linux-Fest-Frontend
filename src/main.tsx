import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./store.ts";
import AuthContainer from "./components/Container/AuthContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthContainer>
        <ToastContainer
          rtl
          theme="dark"
          hideProgressBar
          closeOnClick
          position="bottom-center"
        />
        <RouterProvider router={router} />
      </AuthContainer>
    </Provider>
  </StrictMode>
);
