const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Enable JSON body parsing for API
app.use(express.json());

// Serve the main website from root
app.use(express.static(__dirname));

// API to get all fabrics
app.get('/api/admin/fabrics', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'fabrics.json');
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.status(500).json({ error: 'Failed to read fabrics' });
    }
});

// API to update a fabric
app.put('/api/admin/fabric/:id', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'fabrics.json');
    try {
        let fabrics = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const index = fabrics.findIndex(f => f.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Fabric not found' });
        }

        // Merge the existing fabric with the payload specifically the specs
        fabrics[index].specs = { ...fabrics[index].specs, ...req.body.specs };
        if (req.body.name) fabrics[index].name = req.body.name;
        if (req.body.description) fabrics[index].description = req.body.description;

        fs.writeFileSync(dataPath, JSON.stringify(fabrics, null, 2));

        // Rebuild site content
        exec('node generate_site_content.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error regenerating site: ${error.message}`);
                return res.status(500).json({ error: 'Failed to rebuild site' });
            }
            res.json({ success: true, fabric: fabrics[index] });
        });

    } catch (e) {
        res.status(500).json({ error: 'Failed to update fabric' });
    }
});

const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
    console.log('=========================================');
    console.log('      RK Knit Fab - Admin Panel         ');
    console.log('=========================================');
    console.log(`Local address: http://localhost:${PORT}/admin.html`);
    console.log(`Network address 1: http://192.168.1.4:${PORT}/admin.html`);
    console.log(`Network address 2: http://192.168.31.233:${PORT}/admin.html`);
    console.log('=========================================');
    console.log('Press Ctrl+C to stop the server.');
});
