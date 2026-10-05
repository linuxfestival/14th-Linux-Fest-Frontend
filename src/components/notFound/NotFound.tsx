import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import notFoundImage from "../../assets/404.png";
import ErrorScreen from "../ErrorBoundary/ErrorScreen";
import { primaryActionClass, secondaryActionClass } from "../ErrorBoundary/errorScreen.styles";

const NotFound = () => (
  <>
    <Helmet>
      <title>لینوکس‌فست | صفحه پیدا نشد</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <ErrorScreen
      title="۴۰۴ — صفحه پیدا نشد"
      description="صفحه‌ای که به دنبال آن هستید یافت نشد!"
      illustration={
        <img src={notFoundImage} className="mb-6 h-auto max-h-56 w-full max-w-xs object-contain" alt="" />
      }
    >
      <Link to="/" className={primaryActionClass}>بازگشت به صفحه اصلی</Link>
      <p className="mb-4 mt-8 text-base leading-8 text-dark-gray">یا به یکی از صفحات زیر بروید:</p>
      <nav aria-label="صفحات پیشنهادی" className="flex flex-wrap justify-center gap-3">
        <Link to="/profile/workshops" className={secondaryActionClass}>کارگاه‌های من</Link>
        <Link to="/profile/billing" className={secondaryActionClass}>پرداخت‌ها</Link>
        <Link to="/workshops" className={secondaryActionClass}>کارگاه‌ها</Link>
        <Link to="/faq" className={secondaryActionClass}>سوالات متداول</Link>
      </nav>
    </ErrorScreen>
  </>
);

export default NotFound;
