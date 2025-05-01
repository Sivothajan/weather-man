## The Weather Man – IoT-Based Smart Weather Monitoring System
![Scratch](./assets/System-Architecture-Diagram.png)
Figure 1: Weather Man System Overview

---

### Description

**The Weather Man** is an IoT-based smart weather monitoring system that collects, processes, and displays real-time environmental data. It uses a suite of sensors to measure temperature, humidity, soil moisture, and rainfall, transmitting data to a cloud platform for storage and analysis. The system features a web application for remote monitoring and is designed for future AI integration to provide advanced insights. Its modular hardware and software architecture make it ideal for educational, agricultural, and research applications.

---

### Team Members <sub>(Ordered by ascending Student IDs)</sub>

| Name         | Student ID  |
|--------------|-------------|
| Afra         | S/21/005    |
| Hana         | S/21/063    |
| Mundhira     | S/21/102    |
| Anshaf       | S/21/315    |
| Arani        | S/21/317    |
| Danshika     | S/21/340    |
| Premasalini  | S/21/466    |
| Romesh       | S/21/489    |
| Shahama      | S/21/490    |
| Sivothayan   | S/21/513    |

---

### Current Progress
#### PS: If you want to see the progress as of April 30, 2025, please check the [As of April 30, 2025 GitHub Repo](https://github.com/Sivothajan/weather-man/tree/31057a6575f7ccb06b0e44e5aa5a5fb1c9c69691)

#### 🔧 Hardware Setup

| Component                        | Description                                 | Availability      |
|----------------------------------|---------------------------------------------|-------------------|
| Arduino Mega 2560                | Main controller                             | Available         |
| DHT11                            | Temperature and Humidity sensor             | Available         |
| Capacitive Soil Moisture Sensor  | Measures soil moisture                      | Available         |
| LCD Display (16x2)               | Displays weather data                       | Available         |
| ESP8266 (ESP-01)                 | Wi-Fi communication                         | Available         |
| AC to DC Converter               | Power supply                                | Available         |
| Breadboard                       | For prototyping circuits                    | Available         |
| SD Card Module                   | Logging weather data                        | Pending           |
| Raindrop Sensor Plate            | Detects rainfall                            | Pending           |
| Jumper Wires                     | For circuit connections                     | Pending           |
| Weather Station Production Case  | Enclosure for all components                | Pending           |

> **Note:**  
> - **Available**: Component is on hand  
> - **Pending**: Component ordered, awaiting delivery

---

#### 🧠 Software Progress

- Basic sensor reading code: **Complete**
- Cloud data transmission via API: **Complete**
- Database integration: **Complete**
- Web app integration: **Complete**
- AI integration (Claude API): **Complete**
- SD card data logging: **Planned**

| Feature                     | Status      | Notes                                     |
|-----------------------------|-------------|-------------------------------------------|
| Sensor Reading              | Complete    | All sensors tested and operational        |
| API Data Transmission       | Complete    | All APIs tested and operational           |
| Database Integration        | Complete    | Database set up and tested                |
| Web App Integration         | Complete    | Web app tested and operational            |
| AI Integration (Claude API) | Complete    | AI integration tested and operational     |
| SD Card Data Logging        | Pending     | Awaiting component delivery               |
| Documentation               | In Progress | User manual and technical documentation   |

---

### 📂 Explore the Codebase

You can browse the project source code in the following directories:

- [API Backend](./codebase/cloud-api/) – Handles data processing and cloud integration.
- [IoT Firmware](./codebase/iot-firmware/) – Microcontroller and sensor code.
- [Web Application](./codebase/web-app/) – User interface for monitoring and analytics.

[**View Full Codebase on GitHub**](./codebase/)

---

### 📸 Project Gallery

#### Components Overview

| Scratch   | Top View   | Side View  |
|:---------:|:----------:|:----------:|
| ![Scratch](./assets/scratch.jpg) | ![Top View](./assets/top-view.jpg) | ![Side View](./assets/side-view.jpg) |

