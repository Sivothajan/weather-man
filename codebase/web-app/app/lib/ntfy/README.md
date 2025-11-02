# ntfy Notification API

A simple TS module to send notifications via [ntfy](https://ntfy.sh) using HTTP requests.

## Features

- Send notifications to ntfy channels
- Support for custom channel names and clickable actions
- Uses environment variables for configuration

## Usage

1. **Configure environment variables** in a `.env` file:

   ```env
   NTFY_USERNAME=your_username
   NTFY_PASSWORD=your_password
   NTFY_SERVER_DOMAIN=ntfy.yourdomain.com # optional, defaults to `ntfy.sh`
   NTFY_CHANEL_NAME=your_channel # optional, defaults to username
   ```

2. **Import and use the API:**

   ```ts
   import ntfy from '@/app/lib/ntfy/ntfy';

   // Send a basic notification
   await ntfy.sendNotification('Title', 'Message body');

   // Send to a specific channel
   await ntfy.sendNotificationToChanel(
     'Title',
     'Message body',
     'custom-channel'
   );

   // Send with a clickable action
   await ntfy.sendNotificationToChanelWithAction(
     'Title',
     'Message body',
     'ntfy',
     'https://example.com/action'
   );
   ```

## API

### `sendNotification(title, message)`

Sends a notification to the default channel.

### `sendNotificationToChanel(title, message, chanelName)`

Sends a notification to a specified channel.

### `sendNotificationToChanelWithAction(title, message, chanelName, clickToLink)`

Sends a notification with a clickable link.
