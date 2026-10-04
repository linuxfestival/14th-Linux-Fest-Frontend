import "./ActivityTicker.css";
const activities = [
  "Community day",
  "Install Fest",
  "Workshops",
  "Talks",
  "Linux",
  "Open Source",
  "Development",
  "Networking",
];

const TICKER_COPIES = [0, 1, 2];

const ActivityTicker = () => (
  <div
    className="hero-ticker flex min-h-11 items-center overflow-hidden whitespace-nowrap bg-secondary py-2 text-sm font-black text-primary"
    aria-label="موضوعات جشنواره"
    dir="ltr"
  >
    <span className="sr-only">{activities.join(" · ")}</span>
    <div className="hero-ticker__track" aria-hidden="true">
      {TICKER_COPIES.map((copy) => (
        <div className="hero-ticker__group" key={copy} dir="ltr">
          {activities.map((activity) => (
            <span key={`${copy}-${activity}`}>✱&nbsp;&nbsp;{activity}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default ActivityTicker;
