import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function StockTransfer() {
  const [voucherNo, setVoucherNo] = useState('');
  const [manualVoucherNo, setManualVoucherNo] = useState('');
  const [voucherDate, setVoucherDate] = useState('2023-03-29');

  const [destinationWarehouse, setDestinationWarehouse] = useState('');
  const [showWarehouseList, setShowWarehouseList] = useState(false);

  const [itemSearch, setItemSearch] = useState('');
  const [showItemList, setShowItemList] = useState(false);

  const [items, setItems] = useState([]);

  // ✅ Add narration toggle
  const [showNarration, setShowNarration] = useState(false);

  // Auto voucher generate
  useEffect(() => {
    const prefix = "VCH";
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomNum = Math.floor(100 + Math.random() * 900);
    const autoVoucherNo = `${prefix}-${date}-${randomNum}`;
    setVoucherNo(autoVoucherNo);
  }, []);

  const itemOptions = [
    { id: 1, number: '4749 - 56 - CTT T1', description: 'KLEIN 6 IN. UTILITY KNIFE' },
    { id: 2, number: '4821 - 32 - DRT T2', description: 'STANLEY TAPE MEASURE 25FT' },
    { id: 3, number: '4933 - 78 - HMR T3', description: 'DEWALT DRILL 18V CORDLESS' },
    { id: 4, number: '5045 - 91 - SCR T4', description: 'MAGLITE FLASHLIGHT 3D CELL' },
    { id: 5, number: '5157 - 24 - PLR T5', description: 'CHANNELLOCK PLIERS 9IN' }
  ];

  const warehouseOptions = [
    { id: 1, name: 'Main Warehouse' },
    { id: 2, name: 'Indore' },
    { id: 3, name: 'Mumbai' },
    { id: 4, name: 'Delhi' },
    { id: 5, name: 'Pune' }
  ];

  const handleItemSelect = (item) => {
    if (!item) return;
    const newItem = {
      id: items.length + 1,
      itemNumber: item.number,
      description: item.description,
      sourceWarehouse: '',
      quantity: '1.00',
      rate: '0.00',
      amount: '0.00',
      narration: ''  // ✅ narration field add
    };
    setItems([...items, newItem]);
    setItemSearch('');
    setShowItemList(false);
  };

  const updateItemField = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          const qty = parseFloat(updatedItem.quantity) || 0;
          const rate = parseFloat(updatedItem.rate) || 0;
          updatedItem.amount = (qty * rate).toFixed(2);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.amount) || 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="container mt-4 requisition-form">
      <div className="card">
        <div className="card-header text-dark">
          <h4 className="mb-0">Stock Transfer</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="row">
              {/* Voucher fields */}
              <div className="col-md-4">
                <div className="form-group">
                  <label>System Voucher No</label>
                  <input type="text" className="form-control" value={voucherNo} readOnly />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Manual Voucher No</label>
                  <input
                    type="text"
                    className="form-control"
                    value={manualVoucherNo}
                    onChange={(e) => setManualVoucherNo(e.target.value)}
                    placeholder="Enter custom voucher no"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Voucher Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={voucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Destination Warehouse */}
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Destination Warehouse</label>
                  <input
                    type="text"
                    className="form-control"
                    value={destinationWarehouse}
                    onChange={(e) => {
                      setDestinationWarehouse(e.target.value);
                      setShowWarehouseList(true);
                    }}
                    onFocus={() => setShowWarehouseList(true)}
                    placeholder="Type or select warehouse"
                  />
                  {showWarehouseList && (
                    <ul className="list-group position-absolute w-50">
                      {warehouseOptions
                        .filter(w => w.name.toLowerCase().includes(destinationWarehouse.toLowerCase()))
                        .map(w => (
                          <li
                            key={w.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setDestinationWarehouse(w.name);
                              setShowWarehouseList(false);
                            }}
                          >
                            {w.name}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Select Item */}
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Select Item</label>
                  <input
                    type="text"
                    className="form-control"
                    value={itemSearch}
                    onChange={(e) => {
                      setItemSearch(e.target.value);
                      setShowItemList(true);
                    }}
                    onFocus={() => setShowItemList(true)}
                    placeholder="Type or select item"
                  />
                  {showItemList && (
                    <ul className="list-group position-absolute w-75">
                      {itemOptions
                        .filter(i =>
                          (i.number + " " + i.description).toLowerCase().includes(itemSearch.toLowerCase())
                        )
                        .map(i => (
                          <li
                            key={i.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleItemSelect(i)}
                          >
                            {i.number} - {i.description}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ Table with Narration Column */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="thead-light">
                  <tr>
                    <th>Item</th>
                    <th>Source Warehouse</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    {showNarration && <th>Narration</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div>{item.itemNumber}</div>
                          <small className="text-muted">{item.description}</small>
                        </td>
                        <td>
                          <select
                            className="form-control"
                            value={item.sourceWarehouse}
                            onChange={(e) => updateItemField(item.id, 'sourceWarehouse', e.target.value)}
                          >
                            <option value="">-- Select Warehouse --</option>
                            {warehouseOptions.map(warehouse => (
                              <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={item.quantity}
                            onChange={(e) => updateItemField(item.id, 'quantity', e.target.value)}
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={item.rate}
                            onChange={(e) => updateItemField(item.id, 'rate', e.target.value)}
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td>{item.amount}</td>
                        {showNarration && (
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={item.narration}
                              onChange={(e) => updateItemField(item.id, 'narration', e.target.value)}
                              placeholder="Enter narration"
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={showNarration ? "6" : "5"} className="text-center">
                        No items added yet. Select an item above to add it to the table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row mt-4">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="showNarrationCheck"
                    checked={showNarration}
                    onChange={(e) => setShowNarration(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="showNarrationCheck">
                    Add Narration Column
                  </label>
                </div>
              </div>
              <div className="col-md-6 text-right">
                <div className="d-flex align-items-center justify-content-end">
                  <span className="mr-3"><strong>Total Amount: </strong></span>
                  <span className="h5"><strong>₹{calculateTotalAmount()}</strong></span>
                  <button className="btn btn-success ml-4">Submit Transfer</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StockTransfer;
