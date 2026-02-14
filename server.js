const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const net = require('net');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Printer configuration
const PRINTER_IP = '192.168.18.50';
const PRINTER_PORT = 9100;

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Food Order Printer API',
    version: '1.0.0',
    endpoints: {
      'GET /api/food-items': 'Get list of available food items',
      'POST /api/print-order': 'Send order to printer (body: { items: [id1, id2, ...] })'
    },
    printerConfig: {
      ip: PRINTER_IP,
      port: PRINTER_PORT
    },
    frontend: 'The web UI is served separately on port 3000'
  });
});

// Food items list
const foodItems = [
  { id: 1, name: 'Hamburger', price: 5.99 },
  { id: 2, name: 'Cheeseburger', price: 6.99 },
  { id: 3, name: 'Hot Dog', price: 3.99 },
  { id: 4, name: 'Pizza Slice', price: 4.50 },
  { id: 5, name: 'Fried Chicken', price: 7.99 },
  { id: 6, name: 'Fish & Chips', price: 8.99 },
  { id: 7, name: 'Salad', price: 5.50 },
  { id: 8, name: 'Sandwich', price: 5.49 },
];

// Get all food items
app.get('/api/food-items', (req, res) => {
  res.json(foodItems);
});

// Send order to printer
app.post('/api/print-order', async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  try {
    const escposData = generateESCPOS(items);
    await sendToPrinter(escposData);
    res.json({ success: true, message: 'Order sent to printer' });
  } catch (error) {
    console.error('Printer error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate ESC/POS commands
function generateESCPOS(items) {
  let data = '\x1B\x40'; // Initialize printer
  data += '\x1B\x61\x01'; // Center alignment

  // Title
  data += '\x1B\x45\x01'; // Bold on
  data += '=== ORDER ===\n';
  data += '\x1B\x45\x00'; // Bold off
  data += '\n';

  // Add items
  data += '\x1B\x61\x00'; // Left alignment
  const selectedItems = items
    .map(itemId => foodItems.find(item => item.id === itemId))
    .filter(item => item !== undefined);

  selectedItems.forEach(item => {
    data += `${item.name}\n`;
  });

  data += '\n';
  data += '\x1B\x61\x01'; // Center alignment
  data += '=============\n';
  data += new Date().toLocaleString() + '\n';
  data += '\n\n';

  data += '\x1B\x69'; // Cut paper
  data += '\x1B\x40'; // Reset

  return Buffer.from(data, 'binary');
}

// Send data to printer via TCP
function sendToPrinter(data) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    socket.setTimeout(5000);

    socket.on('connect', () => {
      socket.write(data);
      socket.end();
    });

    socket.on('end', () => {
      resolve();
    });

    socket.on('error', (error) => {
      reject(new Error(`Printer connection failed: ${error.message}`));
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Printer connection timeout'));
    });

    socket.connect(PRINTER_PORT, PRINTER_IP);
  });
}

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Printer configured at ${PRINTER_IP}:${PRINTER_PORT}`);
});
