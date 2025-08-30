// src/InventoryAdjustment.jsx
import React, { useState, useEffect, useRef } from 'react';

function InventoryAdjustment() {
  // Mock data for items and warehouses
  const items = [
    { id: 1, name: 'Laptop', unit: 'Piece' },
    { id: 2, name: 'Monitor', unit: 'Piece' },
    { id: 3, name: 'Keyboard', unit: 'Piece' },
    { id: 4, name: 'Mouse', unit: 'Piece' },
    { id: 5, name: 'USB Cable', unit: 'Meter' },
  ];
  const warehouses = [
    { id: 1, name: 'Main Warehouse' },
    { id: 2, name: 'Secondary Warehouse' },
    { id: 3, name: 'Remote Storage' },
  ];
  
  // State management
  const [adjustmentType, setAdjustmentType] = useState('Add Stock');
  const [rows, setRows] = useState([]);

  const [narration, setNarration] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [voucherDate, setVoucherDate] = useState('2025-03-18');
  const [itemSearch, setItemSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const itemDropdownRef = useRef(null);
  const [showNarration, setShowNarration] = useState(false);           // For column in table
const [showGlobalNarration, setShowGlobalNarration] = useState(false); // For global note
  // Filter items based on search
  useEffect(() => {
    if (itemSearch === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(itemSearch.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [itemSearch]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) {
        setShowItemDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[]);
  const handleRowNarrationChange = (id, value) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, narration: value } : row
    ));
  };
  const handleItemSelect = (item) => {
    const newRowId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    const newRow = {
      id: newRowId,
      item: item.id,
      itemName: item.name,
      warehouse: '',
      quantity: '0',
      rate: '',
      unit: item.unit,
      amount: 0,
      narration: ''  // ← Added narration per row
    };
    setRows([...rows, newRow]);
    setItemSearch('');
    setShowItemDropdown(false);
  };
  // Handle other field changes
  const handleFieldChange = (id, field, value) => {
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Calculate amount if quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          const quantity = parseFloat(updatedRow.quantity) || 0;
          const rate = parseFloat(updatedRow.rate) || 0;
          updatedRow.amount = quantity * rate;
        }
        
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };
  
  // Remove row
  const handleRemoveRow = (id) => {
    const updatedRows = rows.filter(row => row.id !== id);
    setRows(updatedRows);
  };
  
  // Calculate total amount whenever rows change
  useEffect(() => {
    const total = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    setTotalAmount(total);
  }, [rows]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Inventory adjustment saved successfully!');
  };
  
  return (
    <div className="container py-4">
                <h4 className="mb-3 ">Inventory Adjustment</h4>
      <div className="card ">
    
        <div className="card-body">
          <form onSubmit={handleSubmit}>
           <div className="row mb-3">
  <div className="col-md-12">
    <label className="form-label">Voucher Details</label>
    <div className="d-flex gap-3">
      {/* Auto Voucher No */}
      <div className="flex-fill">
        <input 
          type="text" 
          className="form-control" 
          value="MM1-ADJ1" 
          readOnly 
          placeholder="Auto Voucher No"
        />
      </div>

      {/* Manual Voucher No */}
      <div className="flex-fill">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Manual Voucher No"
        />
      </div>

      {/* Voucher Date */}
      <div className="flex-fill">
        <input 
          type="date" 
          className="form-control" 
          value={voucherDate}
          onChange={(e) => setVoucherDate(e.target.value)}
        />
      </div>
    </div>
  </div>
</div>

            
            <div className="mb-4">
              <label className="form-label">Adjustment Type</label>
              <div className="d-flex flex-wrap gap-3">
                {['Add Stock', 'Remove Stock', 'Adjust Value'].map(type => (
                  <div key={type} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="adjustmentType"
                      id={`type-${type.replace(/\s+/g, '-')}`}
                      checked={adjustmentType === type}
                      onChange={() => setAdjustmentType(type)}
                    />
                    <label 
                      className="form-check-label" 
                      htmlFor={`type-${type.replace(/\s+/g, '-')}`}
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Item Selection Section */}
            <div className="mb-4">
              <label className="form-label">Select Item</label>
              <div className="position-relative" ref={itemDropdownRef}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for an item..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  onFocus={() => setShowItemDropdown(true)}
                  onClick={() => setShowItemDropdown(true)}
                />
                {showItemDropdown && (
                  <ul className="dropdown-menu show w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <li key={item.id}>
                          <button 
                            className="dropdown-item" 
                            type="button"
                            onClick={() => handleItemSelect(item)}
                          >
                            {item.name} ({item.unit})
                          </button>
                        </li>
                      ))
                    ) : (
                      <li><span className="dropdown-item-text">No items found</span></li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="table-responsive mb-4">
            <table className="table table-bordered">
  <thead className="table-light">
    <tr>
      <th>Item</th>
      <th>Source Warehouse</th>
      <th>Quantity</th>
      <th>Rate</th>
      <th>Amount</th>
      <th>{showNarration && 'Narration'}</th>  {/* Header */}
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row) => (
      <tr key={row.id}>
        <td>
          <input 
            type="text" 
            className="form-control"
            value={row.itemName}
            readOnly
          />
        </td>
        <td>
          <select 
            className="form-select"
            value={row.warehouse}
            onChange={(e) => handleFieldChange(row.id, 'warehouse', e.target.value)}
          >
            <option value="">Select Warehouse</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.name}</option>
            ))}
          </select>
        </td>
        <td>
          <input 
            type="number" 
            className="form-control"
            value={row.quantity}
            onChange={(e) => handleFieldChange(row.id, 'quantity', e.target.value)}
            min="0"
          />
        </td>
        <td>
          <input 
            type="number" 
            className="form-control"
            value={row.rate}
            onChange={(e) => handleFieldChange(row.id, 'rate', e.target.value)}
            min="0"
            step="0.01"
          />
        </td>
        <td>
          <input 
            type="text" 
            className="form-control"
            value={row.amount.toFixed(2)}
            readOnly
          />
        </td>

        {/* Conditional Narration Input Per Row */}
        {showNarration && (
          <td>
            <textarea 
              className="form-control"
              rows="1"
              value={row.narration}
              onChange={(e) => handleRowNarrationChange(row.id, e.target.value)}
              placeholder="Enter narration..."
            />
          </td>
        )}

        <td className="text-center">
          <button 
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleRemoveRow(row.id)}
            title="Remove Item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
            
            <div className="row mb-4">
            <div className="col-md-6">
  <div className="d-flex gap-2 mb-3">
    <button
      type="button"
      className="btn btn-outline-secondary btn-sm"
      onClick={() => setShowNarration(prev => !prev)}
    >
      {showNarration ? '❌ Remove Narration Column' : '+ Add Narration Column'}
    </button>

    <button
      type="button"
      className="btn btn-outline-secondary btn-sm"
      onClick={() => setShowGlobalNarration(prev => !prev)}
    >
      {showGlobalNarration ? '❌ Remove Note' : '+ Add Note'}
    </button>
  </div>

  {/* Global Narration Textarea (Optional Note) */}
  {showGlobalNarration && (
    <div>
      <label className="form-label">Additional Note</label>
      <textarea
        className="form-control"
        rows="3"
        value={narration}
        onChange={(e) => setNarration(e.target.value)}
        placeholder="Enter a general note or reason for this adjustment..."
      />
    </div>
  )}
</div>
              
              <div className="col-md-6">
                <div className="d-flex flex-column h-100 justify-content-end">
                  <div className="mb-3">
                    <label className="form-label">Total Value</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={totalAmount.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn btn-success"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InventoryAdjustment;