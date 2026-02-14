# Quick Start Guide

## Setup Instructions

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Printer IP (if different)

Edit `server.js` and update the printer IP if needed:
```javascript
const PRINTER_IP = '192.168.18.50';  // Current IP - change if different
```

### 3. Run Development Server

```bash
npm run dev
```

This starts:
- **Backend Server:** http://localhost:3001
- **Frontend (React):** http://localhost:3000

### 4. Test the Application

1. Open http://localhost:3000 in your browser
2. Click on food items to select them
3. Click "🖨️ Print Order" to send to printer
4. Check your printer for the output

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 or 3001
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Printer Not Found
```bash
# Test network connectivity
ping 192.168.18.50

# Test port connectivity
telnet 192.168.18.50 9100
```

### Installation Issues
```bash
# Clear and reinstall
rm -rf node_modules client/node_modules package-lock.json
npm install
cd client && npm install && cd ..
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run dev server + React (concurrent) |
| `npm run server` | Run Express server only |
| `npm run client` | Run React dev server only |
| `npm run build` | Build React for production |

## File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Express server, printer API, ESC/POS generation |
| `client/src/App.js` | React UI component |
| `client/src/index.css` | Global styling |

## Next Steps

1. **Customize Food Items:** Edit the `foodItems` array in `server.js`
2. **Modify Printer Format:** Update the `generateESCPOS()` function in `server.js`
3. **Add Styling:** Override styles in `client/src/index.css`
4. **Deploy:** Build with `npm run build` and run `npm run server`
