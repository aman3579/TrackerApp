const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.xlsx');

app.use(cors());
app.use(bodyParser.json());

// Initialize Database
const initDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Tasks');
        xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Finance');
        xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Planner');
        xlsx.writeFile(wb, DB_FILE);
        console.log('Created new database.xlsx');
    }
};

initDB();

const readSheet = (sheetName) => {
    const wb = xlsx.readFile(DB_FILE);
    const sheet = wb.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
};

const writeSheet = (sheetName, data) => {
    const wb = xlsx.readFile(DB_FILE);
    const newSheet = xlsx.utils.json_to_sheet(data);
    wb.Sheets[sheetName] = newSheet;
    xlsx.writeFile(wb, DB_FILE);
};

// Tasks API
app.get('/api/tasks', (req, res) => {
    try {
        const tasks = readSheet('Tasks');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks', (req, res) => {
    try {
        writeSheet('Tasks', req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Finance API
app.get('/api/finance', (req, res) => {
    try {
        const transactions = readSheet('Finance');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/finance', (req, res) => {
    try {
        writeSheet('Finance', req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Planner API
app.get('/api/planner', (req, res) => {
    try {
        const blocks = readSheet('Planner');
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/planner', (req, res) => {
    try {
        writeSheet('Planner', req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
