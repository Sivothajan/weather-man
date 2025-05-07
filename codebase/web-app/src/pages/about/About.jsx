import React from "react";
import styles from "./About.module.css";
import systemArchitecture from "/images/System-Architecture-Diagram.png";
import scratch from "/images/scratch.jpg";
import topView from "/images/top-view.jpg";
import sideView from "/images/side-view.jpg";
import testingTopView from "/images/testing-top-view.jpg";
import testingSideView from "/images/testing-side-view.jpg";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button
        className={styles.dashboardButton}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>
      <h1 className={styles.heading}>
        The Weather Man – IoT-Based Smart Weather Monitoring System
      </h1>

      <img
        src={systemArchitecture}
        alt="Weather Man System Architecture"
        className={styles.architectureDiagram}
      />
      <p className={styles.figureCaption}>
        Figure 1: Weather Man System Overview
      </p>

      <hr />

      <section className={styles.descriptionSection}>
        <h2>Description</h2>
        <p>
          <strong>The Weather Man</strong> is an IoT-based smart weather
          monitoring system that collects, processes, and displays real-time
          environmental data. It uses a suite of sensors to measure temperature,
          humidity, soil moisture, and rainfall, transmitting data to a cloud
          platform for storage and analysis. The system features a web
          application for remote monitoring and is designed for future AI
          integration to provide advanced insights. Its modular hardware and
          software architecture make it ideal for educational, agricultural, and
          research applications.
        </p>
      </section>

      <hr />

      <section className={styles.teamSection}>
        <h2>Team Members</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>
                Student ID{" "}
                <span style={{ fontSize: "0.8em" }}>
                  (Ordered by ascending)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Afra</td>
              <td>S/21/005</td>
            </tr>
            <tr>
              <td>Hana</td>
              <td>S/21/063</td>
            </tr>
            <tr>
              <td>Mundhira</td>
              <td>S/21/102</td>
            </tr>
            <tr>
              <td>Anshaf</td>
              <td>S/21/315</td>
            </tr>
            <tr>
              <td>Arani</td>
              <td>S/21/317</td>
            </tr>
            <tr>
              <td>Danshika</td>
              <td>S/21/340</td>
            </tr>
            <tr>
              <td>Premasalini</td>
              <td>S/21/466</td>
            </tr>
            <tr>
              <td>Romesh</td>
              <td>S/21/489</td>
            </tr>
            <tr>
              <td>Shahama</td>
              <td>S/21/490</td>
            </tr>
            <tr>
              <td>Sivothayan</td>
              <td>S/21/513</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr />

      <section className={styles.progressSection}>
        <h2>Current Progress</h2>
        <p>
          <strong>PS:</strong> If you want to see the progress as of April 30,
          2025, please check the{" "}
          <a
            href="https://github.com/Sivothajan/weather-man/tree/31057a6575f7ccb06b0e44e5aa5a5fb1c9c69691"
            target="_blank"
            rel="noopener noreferrer"
          >
            As of April 30, 2025 GitHub Repo
          </a>
        </p>

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
            <tr>
              <td>Arduino Mega 2560</td>
              <td>Main controller</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>Capacitive Soil Moisture Sensor</td>
              <td>Measures soil moisture</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>AC to DC Converter</td>
              <td>Power supply</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>Breadboard</td>
              <td>For prototyping circuits</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>SD Card Module</td>
              <td>Logging weather data</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>Raindrop Sensor Plate</td>
              <td>Detects rainfall</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>Jumper Wires</td>
              <td>For circuit connections</td>
              <td>Available</td>
            </tr>
            <tr>
              <td>DHT11</td>
              <td>Temperature and Humidity sensor</td>
              <td>Defective</td>
            </tr>
            <tr>
              <td>LCD Display (16x2)</td>
              <td>Displays weather data</td>
              <td>Defective</td>
            </tr>
            <tr>
              <td>ESP8266 (ESP-01)</td>
              <td>Wi-Fi communication</td>
              <td>Defective</td>
            </tr>
            <tr>
              <td>Weather Station Production Case</td>
              <td>Enclosure for all components</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.note}>
          <strong>Note:</strong>
          <br />- <strong>Available</strong>: Component is on hand
          <br />- <strong>Defective</strong>: Component is on hand
          but not functional (component is defective)
          <br />- <strong>Pending</strong>: Component has been ordered and is
          awaiting delivery or installation/assembly
        </p>

        <h3>🧠 Software Progress</h3>
        <ul>
          <li>
            Basic sensor reading code: <strong>Completed</strong>
          </li>
          <li>
            Cloud data transmission via API: <strong>Completed</strong>
          </li>
          <li>
            Database integration: <strong>Completed</strong>
          </li>
          <li>
            Web app integration: <strong>Completed</strong>
          </li>
          <li>
            AI integration (Claude API): <strong>Completed</strong>
          </li>
          <li>
            SD card data logging: <strong>Completed</strong>
          </li>
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
            <tr>
              <td>Sensor Reading</td>
              <td>Completed</td>
              <td>All sensors tested and operational</td>
            </tr>
            <tr>
              <td>API Data Transmission</td>
              <td>Completed</td>
              <td>All APIs tested and operational</td>
            </tr>
            <tr>
              <td>Database Integration</td>
              <td>Completed</td>
              <td>Database set up and tested</td>
            </tr>
            <tr>
              <td>Web App Integration</td>
              <td>Completed</td>
              <td>Web app tested and operational</td>
            </tr>
            <tr>
              <td>AI Integration (Claude API)</td>
              <td>Completed</td>
              <td>AI integration tested and operational</td>
            </tr>
            <tr>
              <td>SD Card Data Logging</td>
              <td>Completed</td>
              <td>SD Card Data Logging tested and operational</td>
            </tr>
            <tr>
              <td>Documentation</td>
              <td>Completed</td>
              <td>User manual and technical documentation</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr />

      <section className={styles.codebaseSection}>
        <h2>📂 Explore the Codebase</h2>
        <p>
          You can browse the project source code in the following directories:
        </p>
        <ul>
          <li>
            <strong>
              <a
                href="https://github.com/Sivothajan/weather-man/tree/master/codebase/cloud-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Backend
              </a>
            </strong>{" "}
            – Handles data processing and cloud integration.
          </li>
          <li>
            <strong>
              <a
                href="https://github.com/Sivothajan/weather-man/tree/master/codebase/iot-firmware"
                target="_blank"
                rel="noopener noreferrer"
              >
                IoT Firmware
              </a>
            </strong>{" "}
            – Microcontroller and sensor code.
          </li>
          <li>
            <strong>
              <a
                href="https://github.com/Sivothajan/weather-man/tree/master/codebase/web-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Web Application
              </a>
            </strong>{" "}
            – User interface for monitoring and analytics.
          </li>
        </ul>
        <p>
          <a
            href="https://github.com/Sivothajan/weather-man/tree/master/codebase"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>View Full Codebase on GitHub</strong>
          </a>
        </p>
      </section>

      <hr />

      <section className={styles.gallerySection}>
        <h2>📸 Project Gallery</h2>
        <h3>Components Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Scratch</th>
              <th>Top View</th>
              <th>Side View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img
                  src={scratch}
                  alt="Scratch"
                  className={styles.galleryImg}
                />
              </td>
              <td>
                <img
                  src={topView}
                  alt="Top View"
                  className={styles.galleryImg}
                />
              </td>
              <td>
                <img
                  src={sideView}
                  alt="Side View"
                  className={styles.galleryImg}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Testing the Components (Overview)</h3>
        <table>
          <thead>
            <tr>
              <th>Top View</th>
              <th>Side View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img
                  src={testingTopView}
                  alt="Testing Top View"
                  className={styles.galleryImg}
                />
              </td>
              <td>
                <img
                  src={testingSideView}
                  alt="Testing Side View"
                  className={styles.galleryImg}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default About;
