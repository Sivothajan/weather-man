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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/farming-advice`,
        );
        if (!res.ok) throw new Error("Failed to fetch advice");
        const data = await res.json();

        // Handle success response
        if (data.type === "message" && data.content) {
          setAdvice(data.content);
        }
        // Handle error response from the API
        else if (data.type === "error" && data.error) {
          setError(data.error.message || "Error getting farming advice.");
        }
        // Handle unexpected response format
        else {
          console.warn("Unexpected response format:", data);
          setError("Received unexpected data format from server.");
        }
      } catch (err) {
        console.error("Error fetching farming advice:", err);
        setError("Could not load advice. Please try again later.");
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
        {!loading && !error && (
          <div
            className={styles.adviceText}
            dangerouslySetInnerHTML={{ __html: advice }}
          />
        )}
      </div>
    </div>
  );
}

export default Advice;
