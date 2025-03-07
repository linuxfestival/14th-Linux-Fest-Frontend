import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: "/",
  },
  {
    path: "settings",
    element: <MainLayout />,
  },
]);

export default router;
