# Food Order & Print Application

A web application for selecting food items and printing orders directly to a Star TM-M30iii thermal printer via WiFi.

## Features

- ✅ Modern React-based UI for food item selection
- ✅ Real-time order summary
- ✅ Direct WiFi printing to Star TM-M30iii printer (ESC/POS protocol)
- ✅ Simple, responsive design
- ✅ Fast and reliable

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Frontend)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Application - Food Selection UI               │   │
│  │  - Select food items                                 │   │
│  │  - View order summary                                │   │
│  │  - Send print request                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                    HTTP API
                         │
┌─────────────────────────────────────────────────────────────┐
│                   Node.js/Express Server                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - Handle API requests (/api/food-items)            │   │
│  │  - Generate ESC/POS commands                         │   │
│  │  - Send print job via TCP/IP                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                    TCP Socket
                    (Port 9100)
                         │
        ┌────────────────────────────────────┐
        │  Star TM-M30iii Thermal Printer   │
        │  IP: 192.168.18.50                │
        └────────────────────────────────────┘
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Star TM-M30iii printer connected to WiFi at `192.168.18.50`

## Installation

1. **Install server dependencies:**
   ```bash
   npm install
   ```

2. **Install client dependencies:**
   ```bash
   cd client && npm install && cd ..
   ```

## Running the Application

### Development Mode

Run both server and client concurrently:

```bash
npm run dev
```

This will:
- Start the Express server on `http://localhost:3001`
- Start the React development server on `http://localhost:3000`

### Production Mode

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm run server
   ```

Then open `http://localhost:3001` in your browser.

## Usage

1. Open the application in your web browser
2. Click on food items to select them (they'll be highlighted with a checkmark)
3. View your selection in the "Order Summary" on the right
4. Click the "🖨️ Print Order" button to send the order to the printer
5. The printer will print the selected items list
6. Click "Clear" to reset your selection

## Printer Configuration

The printer is configured for:
- **IP Address:** 192.168.18.50
- **Port:** 9100 (Standard ESC/POS port)
- **Protocol:** ESC/POS (Epson Standard Code for POS printers)

### If you need to change the printer configuration:

Edit [server.js](server.js) and update these lines:
```javascript
const PRINTER_IP = '192.168.18.50';  // Change IP address here
const PRINTER_PORT = 9100;            // Change port if needed
```

## Adding More Food Items

Edit [server.js](server.js) and modify the `foodItems` array:

```javascript
const foodItems = [
  { id: 1, name: 'Hamburger', price: 5.99 },
  { id: 2, name: 'Cheeseburger', price: 6.99 },
  // Add more items here...
];
```

## Troubleshooting

### Printer Not Responding

1. **Check network connection:**
   ```bash
   ping 192.168.18.50
   ```

2. **Verify printer is on and connected to WiFi**

3. **Check if port 9100 is accessible:**
   ```bash
   telnet 192.168.18.50 9100
   ```

4. **Check server logs** - The server will display connection errors in the console

### Application Not Loading

- Ensure Node.js and npm are installed
- Check that port 3000 and 3001 are not in use
- Clear browser cache and try again

### Build Issues

- Delete `node_modules` folders and `package-lock.json`
- Run `npm install` again

## Project Structure

```
test17/
├── server.js                 # Express server with printer integration
├── package.json              # Server dependencies
├── README.md                 # This file
│
└── client/
    ├── public/
    │   └── index.html        # HTML entry point
    ├── src/
    │   ├── App.js            # Main React component
    │   ├── App.css           # App styles
    │   ├── index.js          # React DOM entry
    │   └── index.css         # Global styles
    └── package.json          # Client dependencies
```

## API Endpoints

### GET /api/food-items
Returns list of all available food items.

**Response:**
```json
[
  { "id": 1, "name": "Hamburger", "price": 5.99 },
  { "id": 2, "name": "Cheeseburger", "price": 6.99 }
]
```

### POST /api/print-order
Sends a print job to the printer.

**Request:**
```json
{
  "items": [1, 2, 3]  // Array of food item IDs
}
```

**Success Response:**
```json
{ "success": true, "message": "Order sent to printer" }
```

**Error Response:**
```json
{ "error": "Error message" }
```

## ESC/POS Customization

The printer output is generated in `generateESCPOS()` function in [server.js](server.js). You can customize:
- Text formatting (bold, alignment, size)
- Logo/graphics
- Paper cutting behavior
- Receipt format

Common ESC/POS commands:
- `\x1B\x40` - Initialize printer
- `\x1B\x45\x01` - Bold on
- `\x1B\x45\x00` - Bold off
- `\x1B\x61\x00` - Left align
- `\x1B\x61\x01` - Center align
- `\x1B\x69` - Cut paper

## License

MIT
