const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = './data.json';
const delayTime = 500;

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);

app.use(bodyParser.json());

function readVehicles() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function writeVehicles(vehicles) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(vehicles, null, 2));
}

app.get('/vehicles', (req, res) => {
  const vehicles = readVehicles();

  setTimeout(() => {
    res.json(vehicles);
  }, delayTime);
});

app.get('/vehicles/:id', (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json(null);
  }

  setTimeout(() => {
    res.json(vehicle);
  }, delayTime);
});

app.post('/vehicles', (req, res) => {
  const vehicles = readVehicles();
  const newVehicle = {
    id: (vehicles.length + 1).toString(),
    ...req.body,
  };
  vehicles.push(newVehicle);
  writeVehicles(vehicles);

  setTimeout(() => {
    res.status(201).json(newVehicle);
  }, delayTime);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
