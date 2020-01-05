const database = require('../db');
const server = require("./server.js")
// Database connection
database.connect();

// Start server
const PORT = process.env.ANIMES_PORT || 3001;
server.listen(PORT, () => console.info(`Server has started on port ${PORT}`));