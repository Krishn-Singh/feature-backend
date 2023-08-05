const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/data', (req, res) => {
  fs.readFile('files.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data from file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    try {
      const jsonData = JSON.parse(data);
      const groupedData = groupDataByPath(jsonData);
      return res.json(groupedData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Function to group the data array by path
function groupDataByPath(data) {
  const groupedData = {};
  data.forEach(item => {
    const pathParts = item.path.split('/');
    const rootFolder = pathParts[0];
    const folder = pathParts[1];
    const dateFolder = pathParts[2];
    const filename = pathParts[3];

    if (!groupedData[rootFolder]) {
      groupedData[rootFolder] = {};
    }

    if (!groupedData[rootFolder][folder]) {
      groupedData[rootFolder][folder] = {};
    }

    if (!groupedData[rootFolder][folder][dateFolder]) {
      groupedData[rootFolder][folder][dateFolder] = [];
    }

    groupedData[rootFolder][folder][dateFolder].push(filename);
  });

  return groupedData;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});