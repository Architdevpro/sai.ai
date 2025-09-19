const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000; // or any port you like

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CONTACTS_FILE = path.join(__dirname, 'contact.json');

// Helper: Append a contact to contact.json
function appendContact(contact) {
    let contacts = [];
    if (fs.existsSync(CONTACTS_FILE)) {
        try {
            contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8'));
        } catch (e) {
            contacts = [];
        }
    }
    contacts.push(contact);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

// Endpoint to receive contact form data
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields required.' });
    }
    appendContact({ name, email, message, timestamp: new Date().toISOString() });
    res.json({ success: true });
});

// Serve static files (your HTML/CSS/JS)
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
