import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Graph.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const graphConfigs = [
  {
    label: "Temperature (°C)",
    key: "temperature",
    borderColor: "rgba(255, 99, 132, 1)",
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    yTitle: "Temperature (°C)",
  },
  {
    label: "Humidity (%)",
    key: "humidity",
    borderColor: "rgba(54, 162, 235, 1)",
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    yTitle: "Humidity (%)",
  },
  {
    label: "Soil Moisture (%)",
    key: "soil_moisture",
    borderColor: "rgba(75, 192, 192, 1)",
    backgroundColor: "rgba(75, 192, 192, 0.2)",
    yTitle: "Soil Moisture (%)",
  },
  {
    label: "Soil Raw",
    key: "soil_raw",
    borderColor: "rgba(255, 206, 86, 1)",
    backgroundColor: "rgba(255, 206, 86, 0.2)",
    yTitle: "Soil Raw",
  },
  {
    label: "Rain (Raining: 1, Not Raining: 0)",
    key: "rain",
    borderColor: "rgba(153, 102, 255, 1)",
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    yTitle: "Rain Detection",
    isBoolean: true,
  },
  {
    label: "Rain Raw",
    key: "rain_raw",
    borderColor: "rgba(255, 159, 64, 1)",
    backgroundColor: "rgba(255, 159, 64, 0.2)",
    yTitle: "Rain Raw",
  },
  {
    label: "Fire (Detected: 1, Not Detected: 0)",
    key: "fire",
    borderColor: "rgba(255, 0, 0, 1)",
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    yTitle: "Fire Detection",
    isBoolean: true,
  },
];

const Graph = ({ jsonData }) => {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (jsonData && jsonData.length > 0) {
      setLabels(
        jsonData.map((item) => new Date(item.timestamp).toLocaleTimeString()),
      );
    }
  }, [jsonData]);

  return (
    <div className={styles.graphContainer}>
      {jsonData && jsonData.length > 0 ? (
        graphConfigs.map((config) => {
          const data = {
            labels,
            datasets: [
              {
                label: config.label,
                data: jsonData.map((item) =>
                  config.isBoolean
                    ? item[config.key]
                      ? 1
                      : 0
                    : parseFloat(item[config.key]),
                ),
                borderColor: config.borderColor,
                backgroundColor: config.backgroundColor,
                tension: 0.1,
              },
            ],
          };

          const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: config.yTitle,
                },
                ...(config.isBoolean && {
                  min: 0,
                  max: 1,
                  ticks: {
                    stepSize: 1,
                    callback: function (value) {
                      if (config.key === "rain") {
                        return value === 0 ? "0 (Not Raining)" : "1 (Raining)";
                      } else if (config.key === "fire") {
                        return value === 0
                          ? "0 (Not Detected)"
                          : "1 (Detected)";
                      }
                      return value;
                    },
                  },
                }),
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: config.label,
              },
            },
          };

          return (
            <div key={config.key} className={styles.singleGraph}>
              <Line data={data} options={options} />
            </div>
          );
        })
      ) : (
        <p>No data to display.</p>
      )}
    </div>
  );
};

export default Graph;
