const express = require('express');
const cors = require('cors');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Redis client setup with fallback to in-memory storage
let client;
let isRedisAvailable = false;
let memoryStore = new Map(); // Fallback in-memory storage

const initRedis = async () => {
  try {
    client = redis.createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectDelay: 1000,
        lazyConnect: true
      }
    });

    client.on('error', (err) => {
      console.log('Redis not available, using in-memory storage');
      isRedisAvailable = false;
    });

    client.on('connect', () => {
      console.log('Connected to Redis');
      isRedisAvailable = true;
    });

    await client.connect();
    isRedisAvailable = true;
  } catch (error) {
    console.log('Redis not available, using in-memory storage');
    isRedisAvailable = false;
  }
};

// Helper functions for storage operations
const storeGet = async (key) => {
  if (isRedisAvailable) {
    return await client.get(key);
  } else {
    return memoryStore.get(key);
  }
};

const storeSet = async (key, value) => {
  if (isRedisAvailable) {
    return await client.set(key, value);
  } else {
    memoryStore.set(key, value);
    return 'OK';
  }
};

const storeKeys = async (pattern) => {
  if (isRedisAvailable) {
    return await client.keys(pattern);
  } else {
    const keys = Array.from(memoryStore.keys());
    const regex = new RegExp(pattern.replace('*', '.*'));
    return keys.filter(key => regex.test(key));
  }
};

const storeDel = async (key) => {
  if (isRedisAvailable) {
    return await client.del(key);
  } else {
    const existed = memoryStore.has(key);
    memoryStore.delete(key);
    return existed ? 1 : 0;
  }
};

// Initialize Redis connection
initRedis();

// API Routes for snips

// GET /api/snips - Get all snips
app.get('/api/snips', async (req, res) => {
  try {
    const keys = await storeKeys('snip_*');
    const snips = [];
    
    for (const key of keys) {
      const data = await storeGet(key);
      if (data) {
        const parsedData = JSON.parse(data);
        const trackId = key.replace('snip_', '');
        snips.push({
          trackId,
          ...parsedData,
          storageKey: key
        });
      }
    }
    
    // Sort by lastModified date (most recent first)
    snips.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
    res.json(snips);
  } catch (error) {
    console.error('Error fetching snips:', error);
    res.status(500).json({ error: 'Failed to fetch snips' });
  }
});

// GET /api/snips/:trackId - Get a specific snip
app.get('/api/snips/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const data = await storeGet(`snip_${trackId}`);
    
    if (data) {
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'Snip not found' });
    }
  } catch (error) {
    console.error('Error fetching snip:', error);
    res.status(500).json({ error: 'Failed to fetch snip' });
  }
});

// POST /api/snips/:trackId - Save/update a snip
app.post('/api/snips/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const { startTime, endTime, episodeData } = req.body;
    
    const snipData = {
      startTime,
      endTime,
      episodeData,
      lastModified: new Date().toISOString()
    };
    
    await storeSet(`snip_${trackId}`, JSON.stringify(snipData));
    res.json({ message: 'Snip saved successfully', data: snipData });
  } catch (error) {
    console.error('Error saving snip:', error);
    res.status(500).json({ error: 'Failed to save snip' });
  }
});

// DELETE /api/snips/:trackId - Delete a snip
app.delete('/api/snips/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const result = await storeDel(`snip_${trackId}`);
    
    if (result === 1) {
      res.json({ message: 'Snip deleted successfully' });
    } else {
      res.status(404).json({ error: 'Snip not found' });
    }
  } catch (error) {
    console.error('Error deleting snip:', error);
    res.status(500).json({ error: 'Failed to delete snip' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});