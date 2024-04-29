//Server.js
// Proxy server for adding session cookies to cross-origin requests

const express = require('express');
const session = require('express-session'); // Use express-session for session management
const cookieParser = require('cookie-parser'); // Use cookie-parser for handling cookies
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Secure CORS configuration
const corsOptions = {
  origin: 'http://localhost:8000',
  credentials: true, // Allow cookies for cross-origin requests
};
app.use(cors(corsOptions));
let authenticated = false;

// Secret for session signing (replace with a strong, random string)
const sessionSecret = 'your_strong_secret_here';

// Configure session middleware
app.use(cookieParser());
app.use(session({
  secret: sessionSecret,
  resave: false, // Don't resave session if unmodified
  saveUninitialized: false, // Don't create sessions for every request
  cookie: {
    secure: false, // Set to true for HTTPS in production
    httpOnly: true, // Protect cookie from client-side JavaScript access
  },
}));

// Custom route handler for authentication (replace with your authentication logic)
app.post('/authenticate', (req, res) => {
  let username;
  let session_id;

  try {
    let body = "";
    //Using this to parse the request body as body-parser was giving issues with forever pending requests
    req.on('data', (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        const data = JSON.parse(body);
        username = "_" + data.model.username;
        session_id = data.model.uid;

        // Validate username and session_id (replace with your validation logic)
        if (!username || !session_id) {
            return res.status(401).send('Invalid username or session ID');
        }
        });
  } catch (error) {
    console.error('Error parsing request body:', error);
    return res.status(400).send('Invalid request body');
  }

  

  // Create a session object (replace with your user data)
    req.session.user = {
        username,
        session_id,
    };
    authenticated = true;

  res.sendStatus(200); // Send a success response
});

// Proxy middleware for intercepting and adding cookies to outgoing requests after authentication

  app.use(createProxyMiddleware({
    target: 'https://dev_interview.qagoodx.co.za',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to:', proxyReq.path);
      // Add session cookie to outgoing request
      if (authenticated && req.session.user && req.session.user.session_id){
        proxyReq.setHeader('Cookie', `session_id=${req.session.user.session_id}`);
      } else {
        console.error('No session ID found');
      }
    },
  }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});


