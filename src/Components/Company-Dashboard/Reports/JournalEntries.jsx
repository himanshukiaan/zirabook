import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function JournalEntries() {
  // State for form data
  const [voucherNo, setVoucherNo] = useState('VCH-001');
  const [manualVoucherNo, setManualVoucherNo] = useState('');
  const [voucherDate, setVoucherDate] = useState('2023-03-29');
  
  // State for journal entries
  const [entries, setEntries] = useState([]);
  
  // State for narration
  const [showNarration, setShowNarration] = useState(false);
  const [narration, setNarration] = useState('');
  
  // State for document upload
  const [document, setDocument] = useState(null);
  
  // Sample data for dropdowns
  const accountOptions = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Bank' },
    { id: 3, name: 'Sales' },
    { id: 4, name: 'Purchase' },
    { id: 5, name: 'Salary Expense' },
    { id: 6, name: 'Rent Expense' },
    { id: 7, name: 'Accounts Receivable' },
    { id: 8, name: 'Accounts Payable' }
  ];
  
  // Function to add a new entry when an account is selected
  const handleAccountSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    
    const account = accountOptions.find(opt => opt.id.toString() === selectedId);
    if (!account) return;
    
    const newEntry = {
      id: entries.length + 1,
      accountName: account.name,
      debitAmount: '',
      creditAmount: '',
       narrationText: ''
    };
    
    setEntries([...entries, newEntry]);
    // Reset the select dropdown
    e.target.value = '';
  };
  
  // Function to update entry field
  const updateEntryField = (id, field, value) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };
        
        if (field === 'debitAmount' && value) {
          updatedEntry.creditAmount = '';
        } else if (field === 'creditAmount' && value) {
          updatedEntry.debitAmount = '';
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };
  
  // Function to calculate total debit and credit
  const calculateTotals = () => {
    const totalDebit = entries.reduce((total, entry) => {
      return total + (parseFloat(entry.debitAmount) || 0);
    }, 0);
    
    const totalCredit = entries.reduce((total, entry) => {
      return total + (parseFloat(entry.creditAmount) || 0);
    }, 0);
    
    return {
      totalDebit: totalDebit.toFixed(2),
      totalCredit: totalCredit.toFixed(2)
    };
  };
  
  // Function to handle document upload
  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };
  
  // Function to remove an entry
  const removeEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  const totals = calculateTotals();
  
  return (
    <div className="container mt-4 requisition-form">
        <div className="card-header  text-dark">
          <h4 className="mb-2">Journal Entries</h4>
        </div>
      <div className="card">
      
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="voucherNo">Voucher No (Auto)</label>
                <input
                  type="text"
                  className="form-control"
                  id="voucherNo"
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="manualVoucherNo">Voucher No (Manual)</label>
                <input
                  type="text"
                  className="form-control"
                  id="manualVoucherNo"
                  placeholder="Enter manual voucher no"
                  value={manualVoucherNo}
                  onChange={(e) => setManualVoucherNo(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="voucherDate">Voucher Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="voucherDate"
                  value={voucherDate}
                  onChange={(e) => setVoucherDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="accountSelect">Select Account</label>
                <select
                  className="form-control"
                  id="accountSelect"
                  onChange={handleAccountSelect}
                >
                  <option value="">-- Select an Account --</option>
                  {accountOptions.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
  <table className="table table-bordered table-striped">
    <thead className="thead-light">
      <tr>
        <th>Account</th>
        <th>Debit Amount</th>
        <th>Credit Amount</th>
        {showNarration && <th>Narration</th>}
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {entries.length > 0 ? (
        entries.map((entry) => (
          <tr key={entry.id}>
            <td>
              <div>{entry.accountName}</div>
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                value={entry.debitAmount}
                onChange={(e) =>
                  updateEntryField(entry.id, 'debitAmount', e.target.value)
                }
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                value={entry.creditAmount}
                onChange={(e) =>
                  updateEntryField(entry.id, 'creditAmount', e.target.value)
                }
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </td>
            {showNarration && (
              <td>
                <textarea
                  className="form-control"
                  rows="1"
                  value={entry.narrationText || ''}
                  onChange={(e) =>
                    updateEntryField(entry.id, 'narrationText', e.target.value)
                  }
                  placeholder="Enter narration..."
                />
              </td>
            )}
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeEntry(entry.id)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={showNarration ? 5 : 4} className="text-center">
            No entries added yet. Select an account above to add it to the table.
          </td>
        </tr>
      )}
      <tr className="table-active">
        <td>
          <strong>Total</strong>
        </td>
        <td>
          <strong>₹{totals.totalDebit}</strong>
        </td>
        <td>
          <strong>₹{totals.totalCredit}</strong>
        </td>
        {showNarration && (
          <td>
            {/* Optional: Show total narration count or leave blank */}
          </td>
        )}
        <td></td>
      </tr>
    </tbody>
  </table>
</div>
          {showNarration && (
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="narration">Narration</label>
                  <textarea
                    className="form-control"
                    id="narration"
                    rows="3"
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    placeholder="Enter narration details..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="documentUpload">Upload Document</label>
                <input
                  type="file"
                  className="form-control-file"
                  id="documentUpload"
                  onChange={handleDocumentUpload}
                />
                {document && (
                  <div className="mt-2">
                    <span className="text-success">Selected file: {document.name}</span>
                  </div>
                )}
              </div>
            </div>
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
                  Add Narration
                </label>
              </div>
            </div>
            <div className="col-md-6 text-right">
              <button className="btn ">Submit Journal Entry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalEntries;