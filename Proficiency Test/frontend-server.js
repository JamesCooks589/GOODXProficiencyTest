//A simple frontend server that serves static files and handles routing for the frontend of the application.
// The server listens on port 8000 and serves the index.html file at the root route ('/') and the diaries.html file at the '/diaries' route.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000; // Port 8000 is used for the frontend server

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for serving the diaries.html file
app.get('/diaries', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'diaries.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
