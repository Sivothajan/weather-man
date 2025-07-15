import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Widget from "../widget/Widget";
import styles from "./WeatherPage.module.css";

function WeatherPage() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h1 className={styles.logo}>WeatherMan</h1>
        </div>
        <div className={styles.navRight}>
          <button
            className={styles.dashboardButton}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? "🗗" : "⛶"}
          </button>
        </div>
      </nav>

      <div
        className={`${styles.mainContent} ${isFullscreen ? styles.fullscreen : ""}`}
      >
        <div className={styles.widgetWrapper}>
          <Widget isFullscreen={isFullscreen} />
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
