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

app.get('/api/check', (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.status(200).json({ message: { 'API Status Response': 'Weather Man API is Working!' } });
});

app.get('/api/get/:number', async (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  const number = parseInt(req.params.number.toLowerCase(), 10);

  if (isNaN(number) || number < 1) {
    return res.status(400).json({ message: 'Invalid number parameter. Must be greater than 0.' });
  }

  const data = await getDataFromDb(number);
  res.status(200).json(data);
});

app.get('/farming-advice', async (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
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
    res.status(200).json(farmingAdvice);
  } catch (error) {
    console.error('Error in farming advice handler:', error);
    res.status(500).json({ message: 'Error processing request.' });
  }
});

app.get('/take-action', async (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
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
    const action = takeIoTAction(data);
    if (action) {
      res.status(200).json({ message: 'Action taken successfully!', action });
    } else {
      res.status(500).json({ message: 'Error taking action.' });
    }
  } catch (error) {
    console.error('Error in take-action handler:', error);
    res.status(500).json({ message: 'Error processing request.' });
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
    const result = await addDataToDb(data, timestamp);
    if (result.success) {
      res.status(201).json({ message: 'API Status Response: Data is Added to the Database!' });
    } else {
      res.status(500).json({ message: 'API Status Response: An Error Occurred!', error: result.error });
    }
  } catch (error) {
    console.error('Error in add handler:', error);
    res.status(500).json({ message: 'Error processing request.' });
  }
});

app.options('*', cors());

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

export default (req, res) => {
  app(req, res);
};
