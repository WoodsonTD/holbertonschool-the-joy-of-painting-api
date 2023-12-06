const fs = require('fs');
const fastcsv = require('fast-csv');
const sqlite3 = require('sqlite3');

// Connect to the SQLite database
const db = new sqlite3.Database('my_database.db');

// Specify the file paths for the CSV files
const paintingsFilePath = 'Datasets/paintings.csv';
const episodeDatesFilePath = 'Datasets/episode-dates.csv';
const subjectFilePath = 'Datasets/subject.csv';

// Function to read CSV file and insert data into the database
function readCSVAndInsertIntoDB(filePath, tableName) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);

  fastcsv
    .parseStream(stream, { headers: true })
    .on('data', (data) => {
      console.log(data);
      const columns = Object.keys(data);
      const values = columns.map((column) => data[column]);

      // Filter out empty column names
      const nonEmptyColumns = columns.filter((column) => column);

      const placeholders = Array(nonEmptyColumns.length).fill('?').join(', ');
      const query = `INSERT INTO ${tableName} (${nonEmptyColumns.join(', ')}) VALUES (${placeholders});`;

      console.log(`Query: ${query}`); // print query before execution
      console.log(`Values: ${values}`); // print the values

      // Insert data into the database
      db.run(query, values, function (err) {
        if (err) {
          console.error(`Error executing query for ${filePath}:`, err.message);
          reject(err);
        }
      });
    })
    .on('end', () => {
      console.log(`Data from ${filePath} has been successfully inserted into ${tableName}`);
      resolve(); // Call the callback when the operation is completed
    })
    .on('error', (error) => {
      console.error(`Error reading ${filePath}:`, error.message);
      console.error(error);
      reject(error);
    });
},

// Use Promise.all to execute the tasks concurrently
Promise.all([
  readCSVAndInsertIntoDB(paintingsFilePath, 'PaintingsTable'),
  readCSVAndInsertIntoDB(episodeDatesFilePath, 'EpisodeDatesTable'),
  readCSVAndInsertIntoDB(subjectFilePath, 'SubjectTable'),
])
  .then(() => {
    // Close the database connection when all operations are done
    db.close();
  })
  .catch((error) => {
    console.error('An error occurred:', error);
    db.close();
  });
