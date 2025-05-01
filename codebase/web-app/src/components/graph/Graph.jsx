import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './Graph.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ csvData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const chartRef = useRef(null);

  useEffect(() => {
    if (csvData && csvData.length > 0) {
      const timestamps = csvData.map((item) => new Date(item.timestamp).toLocaleTimeString());
      const temperatureData = csvData.map((item) => parseFloat(item.temperature));
      const humidityData = csvData.map((item) => parseFloat(item.humidity));
      const soilMoistureData = csvData.map((item) => parseFloat(item.soil_moisture));
      const rainData = csvData.map((item) => parseFloat(item.rain));

      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatureData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
          },
          {
            label: 'Humidity (%)',
            data: humidityData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
          },
          {
            label: 'Soil Moisture (%)',
            data: soilMoistureData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
          },
          {
            label: 'Rain (mm)',
            data: rainData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [csvData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          // You might want to dynamically set this based on the selected dataset
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Environmental Data Over Time',
      },
    },
  };

  return (
    <div className={styles.graphContainer}>
      {chartData.labels.length > 0 ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <p>No data to display.</p>
      )}
    </div>
  );
};

export default Graph;