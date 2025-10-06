const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = './data.json';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);

app.use(bodyParser.json());

async function readVehicles() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading vehicles:', err.message);
    return [];
  }
}

async function writeVehicles(vehicles) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(vehicles, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing vehicles:', err.message);
  }
}

app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await readVehicles();
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load vehicles' });
  }
});

app.get('/vehicles/:id', async (req, res) => {
  await delay(500);

  const vehicles = await readVehicles();
  const vehicle = vehicles.find((v) => v.id === req.params.id);

  if (!vehicle) {
    res.status(404).json(null);
  }

  res.json(vehicle);
});

app.post('/vehicles', async (req, res) => {
  await delay(500);

  const vehicles = await readVehicles();
  const newVehicle = {
    id: (vehicles.length + 1).toString(),
    ...req.body,
  };
  vehicles.push(newVehicle);
  await writeVehicles(vehicles);

  res.status(201).json(newVehicle);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
