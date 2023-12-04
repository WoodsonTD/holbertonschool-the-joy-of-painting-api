const fs = require('fs');
const fastcsv = require('fast-csv');
const sqlite3 = require('sqlite3');
const { callbackify } = require('util');

// Connect to the SQLite database
const db = new sqlite3.Database('my_database.db');

// Specify the file paths for the CSV files
const paintingsFilePath = 'Datasets/paintings.csv';
const episodeDatesFilePath = 'Datasets/episode-dates.csv';
const subjectFilePath = 'Datasets/subject.csv';

// Function to read CSV file and insert data into the database
function readCSVAndInsertIntoDB(filePath, tableName, callback) {
  const stream = fs.createReadStream(filePath);

  fastcsv
    .parseStream(stream, { headers: true })
    .on('data', (data) => {
      const columns = Object.keys(data);
      const values = columns.map((column) => data[column]);

      // Filter out empty column names
      const nonEmptyColumns = columns.filter((column) => column);

      const placeholders = Array(nonEmptyColumns.length).fill('?').join(', ');
      const query = `INSERT INTO ${tableName} (${nonEmptyColumns.join(', ')}) VALUES (${placeholders});`;

      console.log('Query: ${query}'); // print query before execution
      console.log('Values: ${values}'); // print the values

      // Insert data into the database
      db.run(query, values, function (err) {
        if (err) {
          console.error(`Error executing query for ${filePath}:`, err.message);
        }
      });
    })
    .on('end', () => {
      console.log(`Data from ${filePath} has been successfully inserted into ${tableName}`);
      callback(); // Call the callback when the operation is completed
    })
    .on('error', (error) => {
      console.error(`Error reading ${filePath}:`, error.message);
    });
}


// Call the function for each CSV file
readCSVAndInsertIntoDB(paintingsFilePath, 'PaintingsTable', () => {
  readCSVAndInsertIntoDB(episodeDatesFilePath, 'EpisodeDatesTable', () => {
    readCSVAndInsertIntoDB(subjectFilePath, 'SubjectTable', () => {
      // Close the database connection when all operations are done
      db.close();
    });
  });
});
