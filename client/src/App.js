import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch('/api/food-items');
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      setMessage('Error loading food items: ' + error.message);
    }
  };

  const toggleItem = (itemId) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(itemId)) {
        return prevItems.filter((id) => id !== itemId);
      } else {
        return [...prevItems, itemId];
      }
    });
  };

  const sendToPrinter = async () => {
    if (selectedItems.length === 0) {
      setMessage('Please select at least one item');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/print-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: selectedItems }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✓ Order sent to printer successfully!');
        setSelectedItems([]);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (error) {
      setMessage('Error sending to printer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🍔 Food Order System</h1>
        <p>Select items and print your order</p>
      </header>

      <div className="container">
        <main className="main-content">
          <section className="food-items-section">
            <h2>Available Items</h2>
            <div className="food-grid">
              {foodItems.map((item) => (
                <div
                  key={item.id}
                  className={`food-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="food-card-content">
                    <h3>{item.name}</h3>
                    <p className="price">${item.price.toFixed(2)}</p>
                  </div>
                  {selectedItems.includes(item.id) && <div className="checkmark">✓</div>}
                </div>
              ))}
            </div>
          </section>

          <aside className="summary-section">
            <h2>Order Summary</h2>
            <div className="summary-content">
              {selectedItems.length === 0 ? (
                <p className="empty-message">No items selected</p>
              ) : (
                <>
                  <ul className="selected-items">
                    {selectedItems.map((itemId) => {
                      const item = foodItems.find((i) => i.id === itemId);
                      return (
                        <li key={itemId}>
                          {item?.name}
                          <button
                            className="remove-btn"
                            onClick={() => toggleItem(itemId)}
                          >
                            ✕
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="item-count">
                    <strong>Items: {selectedItems.length}</strong>
                  </div>
                </>
              )}
            </div>

            <div className="button-group">
              <button
                className="print-btn"
                onClick={sendToPrinter}
                disabled={loading || selectedItems.length === 0}
              >
                {loading ? 'Printing...' : '🖨️ Print Order'}
              </button>
              <button
                className="clear-btn"
                onClick={clearSelection}
                disabled={selectedItems.length === 0}
              >
                Clear
              </button>
            </div>

            {message && <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</div>}
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
