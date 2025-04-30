
import express, { json } from 'express';
import cors from 'cors';

import { getTime } from './utils/getTime.js';
import { addDataToDb } from './supabase/addToDb.js';
import { sendNotification, sendNotificationToChanel, sendNotificationToChanelWithAction } from './ntfy/ntfy.js';
import { getDataFromDb } from './supabase/getFromDb.js';
import { getData } from './utils/getData.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST','OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(json());

app.get('/*', async (req, res) => {
  
    res.set('X-Robots-Tag', 'noindex, nofollow');

    if(req.url.toLowerCase() === '/api/check'){
        res.status(200).json({ message: {'API Status Response': 'Weather Man API is Working!'} });
    } else if(req.url.toLowerCase() === '/api/get'){
        const data = await getData();
        res.status(200).json(data);
    }
  }
);

app.post('/add', async (req, res) => {
  const { data } = req.body;
  const timestamp = getTime();
    
  try {
    const addDataToDbResult = await addDataToDb(data, timestamp);
    
    if (addDataToDbResult.success) {
      res.status(201).json({ message: 'API Status Response: Data is Added to the Database!' });
    } else {
      res.status(500).json({ message: 'API Status Response: An Error Occured!', error: addDataToDbResult.error });
    }
    } catch (error) {
      console.error('Error in API handler:', error);
      res.status(500).json({ message: 'Error processing request.' });
    }
  }
);
  
app.options('*', cors());

export default (req, res) => {
  app(req, res);
};
