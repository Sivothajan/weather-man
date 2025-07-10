import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Actions.module.css";

function Actions() {
  const { actionId } = useParams();
  const navigate = useNavigate();
  const [actionDetails, setActionDetails] = useState(null);

  useEffect(() => {
    setActionDetails({
      id: actionId,
      description: `Action has been taken for ${actionId}`,
      timestamp: new Date().toLocaleString(),
    });
  }, [actionId]);

  const handleEmergencyCall = () => {
    alert("Emergency call initiated!");
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
  };

  if (!actionDetails) {
    return <div className={styles.container}>Loading action details...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Action Confirmation</h1>

        <div className={styles.actionDetails}>
          <h2>Action ID: {actionDetails.id}</h2>
          <p>{actionDetails.description}</p>
          <p className={styles.timestamp}>
            Timestamp: {actionDetails.timestamp}
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            onClick={handleEmergencyCall}
            className={`${styles.button} ${styles.emergencyButton}`}
          >
            Emergency Call
          </button>

          <button onClick={handleDashboardNavigation} className={styles.button}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Actions;
