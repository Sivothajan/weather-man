import express, { json } from 'express';
import cors from 'cors';

import { getTime } from './utils/getTime.js';
import { addDataToDb } from './supabase/addToDb.js';
import { getDataFromDb } from './supabase/getDataFromDb.js';
import { getFarmingAdvice } from './claude-api/getFarmingAdvice.js';
import { takeIoTAction } from './claude-api/takeIoTAction.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(json());

app.get('/:path(*)', async (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  const url = req.url.toLowerCase(); // normalize the request URL once

  switch (true) {
    case url === '/api/check':
      return res.status(200).json({ message: { 'API Status Response': 'Weather Man API is Working!' } });

    case url.startsWith('/api/get/'): {
      const parts = url.split('/');
      const number = parseInt(parts[3], 10);
      if (isNaN(number) || number < 1) {
        return res.status(400).json({ message: 'Invalid number parameter. Must be greater than 0.' });
      }
      const data = await getDataFromDb(number);
      return res.status(200).json(data);
    }

    case url === '/farming-advice': {
      const location = process.env.LOCATION || 'Unknown Location';
      const dbData = await getDataFromDb(1);
      if (!dbData.success || dbData.data.length === 0) {
        return res.status(500).json({ message: 'Error fetching data from the database.' });
      }

      const data = {
        location,
        temperature: dbData.data[0].temperature,
        humidity: dbData.data[0].humidity,
        soil_moisture: dbData.data[0].soil_moisture,
        rain: dbData.data[0].rain,
        timestamp: dbData.data[0].timestamp
      };

      try {
        const farmingAdvice = await getFarmingAdvice(data);
        return res.status(200).json(farmingAdvice);
      } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ message: 'Error processing request.' });
      }
    }

    case url === '/take-action': {
      const location = process.env.LOCATION || 'Unknown Location';
      const dbData = await getDataFromDb(1);
      if (!dbData.success || dbData.data.length === 0) {
        return res.status(500).json({ message: 'Error fetching data from the database.' });
      }

      const data = {
        location,
        temperature: dbData.data[0].temperature,
        humidity: dbData.data[0].humidity,
        soil_moisture: dbData.data[0].soil_moisture,
        rain: dbData.data[0].rain,
        timestamp: dbData.data[0].timestamp
      };

      const action = takeIoTAction(data);
      if (action) {
        return res.status(200).json({ message: 'Action taken successfully!', action });
      } else {
        return res.status(500).json({ message: 'Error taking action.' });
      }
    }

    default:
      return res.status(404).json({ message: 'Route not found.' });
  }
});

app.post('/add', async (req, res) => {
  const { temperature, humidity, soil_moisture, rain } = req.body;
  const timestamp = getTime();

  const data = {
    temperature,
    humidity,
    soil_moisture,
    rain,
    timestamp
  };

  try {
    const addDataToDbResult = await addDataToDb(data, timestamp);
    if (addDataToDbResult.success) {
      res.status(201).json({ message: 'API Status Response: Data is Added to the Database!' });
    } else {
      res.status(500).json({ message: 'API Status Response: An Error Occurred!', error: addDataToDbResult.error });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ message: 'Error processing request.' });
  }
});

app.options('*', cors());

export default (req, res) => {
  app(req, res);
};
