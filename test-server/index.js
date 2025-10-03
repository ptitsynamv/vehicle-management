const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const file = fs.readFileSync('data.yml', 'utf8');
const data = yaml.load(file);
const PORT = 3000;

app.get('/', (req, res) => {
  res.json(data);
});

app.get('/raw', (req, res) => {
  res.type('text/yaml').send(file);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
