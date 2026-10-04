import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import Fallback from "./components/Fallback/Fallback.tsx";
import { DashboardLoading } from "./components/Dashboard/DashboardUI";

const ProfileLayout = React.lazy(() => import("./layout/ProfileLayout.tsx"));
const Home = React.lazy(() => import("./components/Home/Home"));
const Sponsor = React.lazy(() => import("./components/Sponsor/Sponsor"));
const WorkshopsList = React.lazy(
  () => import("./components/WorkshopsList/WorkshopsList.tsx"),
);
// const ComingSoon = React.lazy(
//   () => import("./components/ComingSoon/ComingSoon.tsx"),
// );
const Staff = React.lazy(() => import("./components/Staff/Staff.tsx"));
const Login = React.lazy(() => import("./components/Login/Login"));
const Signup = React.lazy(() => import("./components/Signup/Signup"));
const VerifyEmail = React.lazy(
  () => import("./components/VerifyEmail/VerifyEmail"),
);
const ForgotPassword = React.lazy(
  () => import("./components/ForgotPassword/ForgotPassword"),
);
const Onboarding = React.lazy(
  () => import("./components/Onboarding/Onboarding"),
);
const FAQ = React.lazy(() => import("./components/FAQ/FAQ.tsx"));
const PaymentStatus = React.lazy(
  () => import("./components/PaymentStatus/PaymentStatus.tsx"),
);
const NotFound = React.lazy(() => import("./components/notFound/NotFound.tsx"));
const Edit = React.lazy(() => import("./components/Dashboard/Edit/Edit.tsx"));
const ProfileWorkshops = React.lazy(
  () => import("./components/Dashboard/ProfileWorkshops/ProfileWorkshops.tsx"),
);
const Billings = React.lazy(
  () => import("./components/Dashboard/Billings/Billings.tsx"),
);
const CartLayout = React.lazy(
  () => import("./components/Dashboard/Cart/CartLayout.tsx"),
);
const CartsList = React.lazy(
  () => import("./components/Dashboard/Cart/pages/CartsList.tsx"),
);
const CartPayment = React.lazy(
  () => import("./components/Dashboard/Cart/pages/CartPayment.tsx"),
);
const Workshop = React.lazy(() => import("./components/Workshop/Workshop.tsx"));
const Presenters = React.lazy(
  () => import("./components/Presenters/Presenters.tsx"),
);
const MainLayout = React.lazy(() => import("./layout/MainLayout.tsx"));
// const Contest = React.lazy(() => import("./components/Contest/Contest.tsx"));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Fallback />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Fallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/sponsor",
        element: (
          <Suspense fallback={<Fallback />}>
            <Sponsor />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Fallback />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<Fallback />}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: "/verify-email",
        element: (
          <Suspense fallback={<Fallback />}>
            <VerifyEmail />
          </Suspense>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <Suspense fallback={<Fallback />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <Suspense fallback={<Fallback />}>
            <Onboarding />
          </Suspense>
        ),
      },
      {
        path: "profile/*",
        element: (
          <Suspense fallback={<Fallback />}>
            <ProfileLayout />
          </Suspense>
        ),
        children: [
          {
            path: "edit",
            element: (
              <Suspense fallback={<Fallback />}>
                <Edit />
              </Suspense>
            ),
          },
          {
            path: "workshops",
            element: (
              <Suspense fallback={<Fallback />}>
                <ProfileWorkshops />
              </Suspense>
            ),
          },
          {
            path: "billing",
            element: (
              <Suspense fallback={<Fallback />}>
                <Billings />
              </Suspense>
            ),
          },
          {
            path: "cart",
            element: (
              <Suspense fallback={<DashboardLoading />}>
                <CartLayout />
              </Suspense>
            ),
            children: [
              {
                path: "list",
                element: (
                  <Suspense fallback={<DashboardLoading />}>
                    <CartsList />
                  </Suspense>
                ),
              },
              {
                path: "checkout",
                element: (
                  <Suspense fallback={<DashboardLoading />}>
                    <CartPayment />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "payment/perhaps",
        element: (
          <Suspense fallback={<Fallback />}>
            <PaymentStatus />
          </Suspense>
        ),
      },
      {
        path: "workshops",
        element: (
          <Suspense fallback={<Fallback />}>
            <WorkshopsList />
          </Suspense>
        ),
      },
      {
        path: "workshop/:id",
        element: (
          <Suspense fallback={<Fallback />}>
            <Workshop />
          </Suspense>
        ),
      },
      {
        path: "presenters",
        element: (
          <Suspense fallback={<Fallback />}>
            <Presenters />
          </Suspense>
        ),
      },
      {
        path: "faq",
        element: (
          <Suspense fallback={<Fallback />}>
            <FAQ />
          </Suspense>
        ),
      },
      {
        path: "staff",
        element: (
          <Suspense fallback={<Fallback />}>
            <Staff />
          </Suspense>
        ),
      },
      // {
      //   path: "contest",
      //   element: (
      //     <Suspense fallback={<Fallback />}>
      //       <Contest />
      //     </Suspense>
      //   ),
      // },
      {
        path: "*",
        element: (
          <Suspense fallback={<Fallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
