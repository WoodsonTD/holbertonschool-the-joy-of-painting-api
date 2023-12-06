const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('my_database.db');

// Route to filter episodes by month
app.get('/episodes/filter/byMonth', (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required.' });
  }

  // Example: Filtering episodes based on the month parameter
  const query = `SELECT * FROM Episode WHERE strftime('%m', air_date) = ?;`;

  db.all(query, [month], (err, episodes) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(episodes);
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
