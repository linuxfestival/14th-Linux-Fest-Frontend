import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {RouterProvider} from "react-router-dom";
import router from "./routes";
import {ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import store from "./store.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <ToastContainer/>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>
);
