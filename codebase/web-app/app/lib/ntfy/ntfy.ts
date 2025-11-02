import config from '@/app/env/env.config';

interface NotificationResponse {
  success: boolean;
  error?: string;
}

export const sendNotification = async (
  title: string,
  message: string
): Promise<NotificationResponse> => {
  try {
    const response = await fetch(config.DEFAULT_NTFY_URL, {
      method: 'POST',
      body: message,
      headers: {
        'Content-Type': 'text/plain',
        Title: title,
        Priority: 'urgent',
        Tags: 'warning',
        Authorization: config.NTFY_AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const sendNotificationToChannel = async (
  title: string,
  message: string,
  channelName: string
): Promise<NotificationResponse> => {
  const url = `https://${config.NTFY_SERVER_DOMAIN}/${channelName}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: message,
      headers: {
        'Content-Type': 'text/plain',
        Title: title,
        Priority: 'urgent',
        Tags: 'warning',
        Authorization: config.NTFY_AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const sendNotificationToChannelWithAction = async (
  title: string,
  message: string,
  channelName: string,
  clickToLink: string
): Promise<NotificationResponse> => {
  const url = `https://${config.NTFY_SERVER_DOMAIN}/${channelName}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: message,
      headers: {
        'Content-Type': 'text/plain',
        Title: title,
        Priority: 'urgent',
        Tags: 'warning',
        Click: clickToLink,
        Authorization: config.NTFY_AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const ntfy = {
  sendNotification,
  sendNotificationToChannel,
  sendNotificationToChannelWithAction,
};

export default ntfy;
