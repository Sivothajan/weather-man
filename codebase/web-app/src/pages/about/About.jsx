import React from 'react';
import styles from './About.module.css';
import systemArchitecture from '/images/System-Architecture-Diagram.png';

function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>The Weather Man – IoT-Based Smart Weather Monitoring System</h1>

      <img
        src={systemArchitecture}
        alt="Weather Man System Architecture"
        className={styles.architectureDiagram}
      />
      <p className={styles.figureCaption}>Figure 1: Weather Man System Overview</p>

      <hr />

      <section className={styles.descriptionSection}>
        <h2>Description</h2>
        <p>
          <strong>The Weather Man</strong> is an innovative IoT-based smart weather monitoring system designed for comprehensive environmental data collection, processing, and real-time visualization. This system utilizes a network of interconnected sensors to accurately measure key atmospheric and soil conditions, including temperature, humidity, soil moisture levels, and rainfall. The collected data is seamlessly transmitted to a robust cloud platform, enabling secure storage and in-depth analysis.
        </p>
        <p>
          A key feature of The Weather Man is its intuitive web application, providing users with remote access to live weather data and historical trends. The system's modular design, both in its hardware components and software architecture, allows for easy customization and scalability, making it an ideal solution for diverse applications ranging from educational purposes and agricultural optimization to advanced environmental research. Furthermore, the system is architected with future integration of Artificial Intelligence (AI) capabilities in mind, paving the way for advanced predictive analytics and actionable insights.
        </p>
      </section>

      <hr />

      <section className={styles.teamSection}>
        <h2>Team Members</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Afra</td><td>S/21/005</td></tr>
            <tr><td>Hana</td><td>S/21/063</td></tr>
            <tr><td>Mundhira</td><td>S/21/102</td></tr>
            <tr><td>Anshaf</td><td>S/21/315</td></tr>
            <tr><td>Arani</td><td>S/21/317</td></tr>
            <tr><td>Danshika</td><td>S/21/340</td></tr>
            <tr><td>Premasalini</td><td>S/21/466</td></tr>
            <tr><td>Romesh</td><td>S/21/489</td></tr>
            <tr><td>Shahama</td><td>S/21/490</td></tr>
            <tr><td>Sivothayan</td><td>S/21/513</td></tr>
          </tbody>
        </table>
      </section>

      <hr />

      <section className={styles.progressSection}>
        <h2>Current Progress (As of April 30, 2025)</h2>

        <h3>🔧 Hardware Setup</h3>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Arduino Mega 2560</td><td>Main microcontroller unit</td><td>Available</td></tr>
            <tr><td>DHT11</td><td>Temperature and Humidity sensor</td><td>Available</td></tr>
            <tr><td>Capacitive Soil Moisture Sensor</td><td>Measures volumetric water content in soil</td><td>Available</td></tr>
            <tr><td>LCD Display (16x2)</td><td>Local display for real-time sensor readings</td><td>Available</td></tr>
            <tr><td>ESP8266 (ESP-01)</td><td>Wi-Fi module for internet connectivity</td><td>Available</td></tr>
            <tr><td>AC to DC Converter</td><td>Provides stable power supply to the system</td><td>Available</td></tr>
            <tr><td>Breadboard</td><td>Platform for prototyping and circuit building</td><td>Available</td></tr>
            <tr><td>SD Card Module</td><td>For offline logging of sensor data</td><td>Pending</td></tr>
            <tr><td>Raindrop Sensor Plate</td><td>Detects the presence and intensity of rainfall</td><td>Pending</td></tr>
            <tr><td>Jumper Wires</td><td>Essential for electrical connections</td><td>Pending</td></tr>
            <tr><td>Weather Station Production Case</td><td>Protective enclosure for the deployed system</td><td>Pending</td></tr>
          </tbody>
        </table>
        <p className={styles.note}><strong>Note:</strong> - <strong>Available</strong>: Component is on hand - <strong>Pending</strong>: Component ordered, awaiting delivery</p>

        <h3>🧠 Software Progress</h3>
        <ul>
          <li><strong>Basic sensor reading code:</strong> Complete – Firmware successfully reads data from all available sensors.</li>
          <li><strong>Cloud data transmission via API:</strong> Complete – Data is successfully transmitted to the cloud platform via a defined API. Web app integration for displaying this data is ongoing.</li>
          <li><strong>Database integration:</strong> Complete – The cloud database schema is defined, and sensor data is being stored correctly.</li>
          <li><strong>Web app integration:</strong> In Progress – Development of the user interface for real-time monitoring and historical data visualization is underway.</li>
          <li><strong>SD card data logging:</strong> Planned – Implementation will commence upon arrival of the SD card module.</li>
          <li><strong>AI integration (Claude API):</strong> Planned – Initial research into leveraging the Claude API for predictive analysis (e.g., forecasting soil moisture trends, predicting potential extreme weather events) is in progress.</li>
        </ul>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Sensor Reading</td><td>Completed</td><td>All sensors tested and providing accurate readings.</td></tr>
            <tr><td>API Data Transmission</td><td>Completed</td><td>Data is being sent to the cloud with timestamps.</td></tr>
            <tr><td>Database Integration</td><td>Completed</td><td>Data is organized and queryable in the cloud database.</td></tr>
            <tr><td>SD Card Data Logging</td><td>Pending</td><td>Waiting for hardware delivery to begin implementation.</td></tr>
            <tr><td>Web App Integration</td><td>In Progress</td><td>Focus on real-time data display and chart rendering.</td></tr>
            <tr><td>Documentation</td><td>In Progress</td><td>Creating user manuals, API documentation, and technical specs.</td></tr>
            <tr><td>AI Integration (Claude API)</td><td>Planned</td><td>Exploring API capabilities and potential use cases.</td></tr>
          </tbody>
        </table>
      </section>

      <hr />

      <section className={styles.codebaseSection}>
        <h2>Explore the Codebase</h2>
        <p>The project codebase is organized into the following key directories:</p>
        <ul>
          <li><strong><a href="./codebase/cloud-api/">API Backend</a></strong> – Handles data reception, processing, and interaction with the database.</li>
          <li><strong><a href="./codebase/iot-firmware/">IoT Firmware</a></strong> – Microcontroller and sensor code.</li>
          <li><strong><a href="./codebase/web-app/">Web Application</a></strong> – User interface for monitoring and analytics.</li>
        </ul>
        <p><a href="./codebase/"><strong>View Full Codebase on GitHub</strong></a></p>
      </section>

      <hr />

      <section className={styles.gallerySection}>
        <h2>Project Gallery</h2>
        <h3>Components Overview</h3>
        <div className={styles.galleryGrid}>
          <div className={styles.galleryItem}>
            <h4>Sensor Array & Microcontroller</h4>
            <img src="../../assets/scratch.jpg" alt="Sensor Array & Microcontroller" />
          </div>
          <div className={styles.galleryItem}>
            <h4>Local LCD Display</h4>
            <img src="../../assets/top-view.jpg" alt="Local LCD Display" />
          </div>
          <div className={styles.galleryItem}>
            <h4>Communication Module (ESP8266)</h4>
            <img src="../../assets/side-view.jpg" alt="Communication Module (ESP8266)" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;