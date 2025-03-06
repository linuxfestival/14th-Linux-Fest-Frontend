import { createBrowserRouter } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
  },
  {
    path: "home",
    element: <Sidebar />,
  },
]);

export default router;
