import { createBrowserRouter } from "react-router-dom";
<<<<<<< Updated upstream:src/routes.ts
=======
import Home from "./components/Home/Home";
import Workshops from "./components/Workshops/Workshops";
>>>>>>> Stashed changes:src/routes.tsx

const router = createBrowserRouter([
  {
    path: "/",
    element: "Salam Bar Hamegi",
  },
  {
    path: "/workshops",
    element: <Workshops />,
  },
]);

export default router;
