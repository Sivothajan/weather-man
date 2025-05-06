import React from "react";
import styles from "./Automation.module.css";

const API_URL = "https://API_URL"; // Replace with API URL

function Automation() {
  const handleWatering = async () => {
    try {
      const response = await fetch(`${API_URL}/action/watering`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Watering action initiated successfully!");
      } else {
        alert("Failed to initiate watering.");
        console.error("Watering API error:", response);
      }
    } catch (error) {
      alert("Network error while initiating watering.");
      console.error("Watering error:", error);
    }
  };

  const handleCall = async () => {
    try {
      const response = await fetch(`${API_URL}/action/call`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Call action initiated successfully!");
      } else {
        alert("Failed to initiate call.");
        console.error("Call API error:", response);
      }
    } catch (error) {
      alert("Network error while initiating call.");
      console.error("Call error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.actionButton} onClick={handleWatering}>
        Start Watering
      </button>
      <button className={styles.actionButton} onClick={handleCall}>
        Make a Call
      </button>
    </div>
  );
}

export default Automation;
