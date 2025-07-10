import dotenv from "dotenv";
import process from 'node:process';
import { Buffer } from 'node:buffer';

dotenv.config();

const base64Encode = (text) => Buffer.from(text).toString("base64");
const isDefined = (value) => value !== undefined && value !== null;

const NTFY_USERNAME = process.env.NTFY_USERNAME;
const NTFY_PASSWORD = process.env.NTFY_PASSWORD;
const NTFY_SERVER_DOMAIN = isDefined(process.env.NTFY_SERVER_DOMAIN)
  ? process.env.NTFY_SERVER_DOMAIN
  : "ntfy.sivothajan.me";
const NTFY_CHANEL_NAME = process.env.NTFY_CHANEL_NAME
  ? process.env.NTFY_CHANEL_NAME
  : process.env.NTFY_USERNAME;
const AUTH_HEADER =
  "Basic " + base64Encode(NTFY_USERNAME + ":" + NTFY_PASSWORD);
const NTFY_URL = `https://${NTFY_SERVER_DOMAIN}/${NTFY_CHANEL_NAME}`;

export const sendNotification = async (title, message) => {
  try {
    const response = await fetch(NTFY_URL, {
      method: "POST",
      body: message,
      headers: {
        "Content-Type": "text/plain",
        Title: title,
        Priority: "urgent",
        Tags: "warning",
        Authorization: AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: error.message };
  }
};

export const sendNotificationToChanel = async (title, message, chanelName) => {
  const NTFY_URL = `https://${NTFY_SERVER_DOMAIN}/${chanelName}`;

  try {
    const response = await fetch(NTFY_URL, {
      method: "POST",
      body: message,
      headers: {
        "Content-Type": "text/plain",
        Title: title,
        Priority: "urgent",
        Tags: "warning",
        Authorization: AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: error.message };
  }
};

export const sendNotificationToChanelWithAction = async (
  title,
  message,
  chanelName,
  clickToLink,
) => {
  const NTFY_URL = `https://${NTFY_SERVER_DOMAIN}/${chanelName}`;

  try {
    const response = await fetch(NTFY_URL, {
      method: "POST",
      body: message,
      headers: {
        "Content-Type": "text/plain",
        Title: title,
        Priority: "urgent",
        Tags: "warning",
        Click: clickToLink,
        Authorization: AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendNotification,
  sendNotificationToChanel,
  sendNotificationToChanelWithAction,
};
