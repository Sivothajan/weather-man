import { useEffect, useState } from "react";
import styles from "./Advice.module.css";

function Advice() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdvice() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/farming-advice");
        if (!res.ok) throw new Error("Failed to fetch advice");
        const data = await res.json();
        let adviceText = "";
        if (Array.isArray(data.content) && data.content[0]?.text) {
          adviceText = data.content[0].text;
        } else if (typeof data.content === "string") {
          adviceText = data.content;
        } else {
          adviceText = "No advice available.";
        }
        setAdvice(adviceText);
      } catch (err) {
        setError("Could not load advice.");
      } finally {
        setLoading(false);
      }
    }
    fetchAdvice();
  }, []);

  return (
    <div className={styles.overviewCard}>
      <div className={styles.cardHeader}>
        <h2>Farming Advice</h2>
      </div>
      <div className={styles.cardContent}>
        {loading && <p>Loading advice...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && <p className={styles.adviceText}>{advice}</p>}
      </div>
    </div>
  );
}

export default Advice;
