const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000; // or any port you like

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your HTML/CSS/JS)
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
