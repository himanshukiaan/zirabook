import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Button,
  Form,
  Badge,
  Card,
} from "react-bootstrap";
import {
  FaFilePdf,
  FaFileExcel,
  FaPlusCircle,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
const Expense = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [activeTab, setActiveTab] = useState("direct");
  const [filters, setFilters] = useState({
    accountName: "",
    paymentNo: "",
  });
  // State for table rows
  const [tableRows, setTableRows] = useState([
    { id: 1, account: "Electricity bill", amount: "0.00" }
  ]);
  // State for paid to selection
  const [paidTo, setPaidTo] = useState("");
  // State for narration
  const [narration, setNarration] = useState("");
  // State for showing narration
  const [showNarration, setShowNarration] = useState(false);
  
  // New states for receipt numbers
  const [autoReceiptNo, setAutoReceiptNo] = useState("");
  const [manualReceiptNo, setManualReceiptNo] = useState("");
  const [nextSequence, setNextSequence] = useState(1);
  
  const parties = [
    { id: 1, name: "Vendor A", type: ["Vendor"] },
    { id: 2, name: "Vendor B", type: ["Vendor"] },
    { id: 3, name: "Vendor C", type: ["Vendor"] },
    { id: 4, name: "Vendor D", type: ["Vendor"] },
    { id: 5, name: "ABC Tech", type: ["Customer", "Vendor"] },
    { id: 6, name: "Global Supplies", type: ["Vendor"] },
  ];
  const vendorParties = parties.filter(p => p.type.includes("Vendor"));
  
  // Account options for the Account field
  const accountOptions = [
    "Electricity bill",
    "Rent",
    "Salaries",
    "Wages",
    "Fuel Expenses",
    "Travel Expenses",
    "Internet Charges",
    "Office Supplies",
    "Postage & Courier",
    "Water Bill",
    "Telephone Bill",
    "Maintenance",
    "Insurance",
    "Marketing Expenses",
    "Legal Fees",
    "Office Rent",
    "Transportation",
    "Printing & Stationery",
    "Bank Charges",
    "Repairs & Maintenance"
  ];
  
  // Updated expenses with new structure to match form fields
  const expenses = [
    {
      date: "3 Sep 2035",
      paymentNo: "PAY1",
      paidFrom: "Bank Transfer",
      paidTo: "Salaries",
      items: [
        { account: "Salaries", amount: "222.01" }
      ],
      narration: "Monthly salary payment",
      totalAmount: "222.01",
      status: "Paid",
      manualReceiptNo: "MRC-2023-001"
    },
    {
      date: "2 Dec 2031",
      paymentNo: "PAY2",
      paidFrom: "Credit Card",
      paidTo: "Electricity bill",
      items: [
        { account: "Electricity bill", amount: "3182.56" }
      ],
      narration: "Quarterly electricity payment",
      totalAmount: "3182.56",
      status: "Pending",
      manualReceiptNo: "MRC-2023-002"
    },
    {
      date: "10 Nov 2031",
      paymentNo: "PAY3",
      paidFrom: "PayPal",
      paidTo: "Rent",
      items: [
        { account: "Rent", amount: "4814.85" }
      ],
      narration: "Office rent payment",
      totalAmount: "4814.85",
      status: "Paid",
      manualReceiptNo: "MRC-2023-003"
    },
    {
      date: "27 Nov 2031",
      paymentNo: "PAY4",
      paidFrom: "Bank Transfer",
      paidTo: "Office Supplies",
      items: [
        { account: "Office Supplies", amount: "4557.35" }
      ],
      narration: "Stationery and supplies purchase",
      totalAmount: "4557.35",
      status: "Rejected",
      manualReceiptNo: ""
    },
  ];
  
  // Initialize auto receipt number
  useEffect(() => {
    const paymentNumbers = expenses.map(exp => exp.paymentNo);
    const numbers = paymentNumbers.map(p => parseInt(p.replace('PAY', ''))).filter(n => !isNaN(n));
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    setNextSequence(maxNumber + 1);
    setAutoReceiptNo(`PAY${maxNumber + 1}`);
  }, []);
  
  // Handle modal show event to update auto receipt number
  useEffect(() => {
    const modal = document.getElementById('createVoucherModal');
    if (modal) {
      const handleShow = () => {
        setAutoReceiptNo(`PAY${nextSequence}`);
      };
      
      modal.addEventListener('show.bs.modal', handleShow);
      
      return () => {
        modal.removeEventListener('show.bs.modal', handleShow);
      };
    }
  }, [nextSequence]);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return "badge bg-success";
      case "Pending":
        return "badge bg-warning text-dark";
      case "Rejected":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };
  
  // Calculate total amount
  const calculateTotal = () => {
    return tableRows.reduce((total, row) => {
      return total + parseFloat(row.amount || 0);
    }, 0).toFixed(2);
  };
  
  // Handle adding a new row to the table
  const handleAddRow = () => {
    const newRow = {
      id: tableRows.length + 1,
      account: "",
      amount: "0.00"
    };
    setTableRows([...tableRows, newRow]);
  };
  
  // Handle deleting a row from the table
  const handleDeleteRow = (id) => {
    setTableRows(tableRows.filter(row => row.id !== id));
  };
  
  // Handle input change in table rows
  const handleRowChange = (id, field, value) => {
    setTableRows(tableRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };
  
  // Handle Paid To selection
  const handlePaidToChange = (e) => {
    const selectedAccount = e.target.value;
    setPaidTo(selectedAccount);
    
    if (selectedAccount) {
      const newRow = {
        id: tableRows.length + 1,
        account: selectedAccount,
        amount: "0.00"
      };
      setTableRows([...tableRows, newRow]);
      setPaidTo(""); // Reset the dropdown
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newExpense = {
      date: form.voucherDate.value,
      paymentNo: autoReceiptNo,
      manualReceiptNo: manualReceiptNo,
      paidFrom: form.paidFrom.value,
      paidTo: tableRows[0]?.account || "",
      items: tableRows,
      narration: narration,
      totalAmount: calculateTotal(),
    };
    alert("Voucher Created:\n" + JSON.stringify(newExpense, null, 2));
    form.reset();
    setTableRows([{ id: 1, account: "Electricity bill", amount: "0.00" }]);
    setNarration("");
    setManualReceiptNo("");
    setNextSequence(nextSequence + 1);
  };
  
  const handleEdit = (expense) => {
    setEditExpense(expense);
  };
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedExpense = {
      ...editExpense,
      date: form.voucherDate.value,
      paymentNo: form.paymentNo.value,
      manualReceiptNo: form.manualReceiptNo.value,
      paidFrom: form.paidFrom.value,
    };
    alert("Voucher Updated:\n" + JSON.stringify(updatedExpense, null, 2));
    setEditExpense(null);
  };
  
  const handleDelete = (expense) => {
    setDeleteExpense(expense);
  };
  
  const confirmDelete = () => {
    setDeleteExpense(null);
  };
  
  const filteredExpenses = expenses.filter((exp) => {
    return (
      (!filters.accountName || exp.paidTo.toLowerCase().includes(filters.accountName.toLowerCase())) &&
      (!filters.paymentNo || exp.paymentNo.toLowerCase().includes(filters.paymentNo.toLowerCase()))
    );
  });
  
  return (
    <div className="bg-light p-4 mt-1 product-header">
      {/* Header */}
      <div className="d-flex justify-content-between gap-4 mb-4">
        <div>
          <h5 className="fw-bold mb-1">Expense Voucher</h5>
 
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button className="btn btn-light border text-danger">
            <FaFilePdf />
          </button>
          <button className="btn btn-light border text-success">
            <FaFileExcel />
          </button>
          <button
            className="btn text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: "#3daaaa" }}
            data-bs-toggle="modal"
            data-bs-target="#createVoucherModal"
          >
            <FaPlusCircle />
            Create Voucher
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Payment No</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Payment No..."
              value={filters.paymentNo}
              onChange={(e) => setFilters({ ...filters, paymentNo: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Account</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Account..."
              value={filters.accountName}
              onChange={(e) => setFilters({ ...filters, accountName: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Paid From</label>
            <select
              className="form-select"
              value={filters.paidFrom}
              onChange={(e) => setFilters({ ...filters, paidFrom: e.target.value })}
            >
              <option value="">All</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="direct" title="All Vouchers">
          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>DATE</th>
                  <th>PAYMENT NO</th>
                  <th>MANUAL RECEIPT NO</th>
                  <th>PAID FROM</th>
                  <th>PAID TO</th>
                  <th>ACCOUNTS</th>
                  <th>TOTAL AMOUNT</th>
                  <th>NARRATION</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp, idx) => (
                  <tr key={idx}>
                    <td>{exp.date}</td>
                    <td>{exp.paymentNo}</td>
                    <td>{exp.manualReceiptNo || "-"}</td>
                    <td>{exp.paidFrom}</td>
                    <td>{exp.paidTo}</td>
                    <td>
                      {exp.items.map((item, index) => (
                        <div key={index}>
                          {item.account}: {item.amount}
                        </div>
                      ))}
                    </td>
                    <td>{exp.totalAmount}</td>
                    <td>{exp.narration}</td>
                    <td><span className={getStatusBadge(exp.status)}>{exp.status}</span></td>
                    <td className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-sm text-info"
                        data-bs-toggle="modal"
                        data-bs-target="#voucherDetailModal"
                        onClick={() => setSelectedExpense(exp)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm text-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#editVoucherModal"
                        onClick={() => handleEdit(exp)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteVoucherModal"
                        onClick={() => handleDelete(exp)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tab>
      </Tabs>
      
      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 px-3">
        <span className="small text-muted">
          Showing 1 to {expenses.length} of {expenses.length} results
        </span>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className="page-item disabled">
              <button className="page-link">&laquo;</button>
            </li>
            <li className="page-item active">
              <button className="page-link" style={{ backgroundColor: '#3daaaa' }}>1</button>
            </li>
            <li className="page-item">
              <button className="page-link">2</button>
            </li>
            <li className="page-item">
              <button className="page-link">&raquo;</button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* ✅ Create Voucher Modal - Updated */}
      <div className="modal fade" id="createVoucherModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Create Voucher</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Auto Receipt No</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={autoReceiptNo} 
                      readOnly 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Manual Receipt No</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={manualReceiptNo}
                      onChange={(e) => setManualReceiptNo(e.target.value)}
                      placeholder="Enter manual receipt number"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Voucher Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      name="voucherDate" 
                      defaultValue={new Date().toISOString().split('T')[0]} 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Paid From</label>
                    <select className="form-select" name="paidFrom" defaultValue="Cash">
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Paid To</label>
                    <select 
                      className="form-select" 
                      value={paidTo}
                      onChange={handlePaidToChange}
                    >
                      <option value="">Select Account</option>
                      {accountOptions.map((account, idx) => (
                        <option key={idx} value={account}>{account}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Table for Account and Amount */}
                <div className="mb-3">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={row.account}
                              onChange={(e) => handleRowChange(row.id, 'account', e.target.value)}
                              list="account-options"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={row.amount}
                              onChange={(e) => handleRowChange(row.id, 'amount', e.target.value)}
                            />
                          </td>
                          <td>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteRow(row.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="2" className="text-end fw-bold">Total: {calculateTotal()}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <datalist id="account-options">
                    {accountOptions.map((account, idx) => (
                      <option key={idx} value={account} />
                    ))}
                  </datalist>
                </div>
                
                {/* Checkbox for narration */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showNarrationCheck"
                      checked={showNarration}
                      onChange={(e) => setShowNarration(e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="showNarrationCheck">
                      Add Narration
                    </label>
                  </div>
                </div>
                
                {/* Narration field - conditionally rendered */}
                {showNarration && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Narration</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      placeholder="Enter narration for this voucher..."
                    ></textarea>
                  </div>
                )}
                
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn" style={{ backgroundColor: "#3daaaa", color: "white" }}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ View Voucher Modal */}
      <div className="modal fade" id="voucherDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Voucher Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setSelectedExpense(null)}></button>
            </div>
            <div className="modal-body">
              {selectedExpense && (
                <div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr><td><strong>Date</strong></td><td>{selectedExpense.date}</td></tr>
                      <tr><td><strong>Auto Receipt No</strong></td><td>{selectedExpense.paymentNo}</td></tr>
                      <tr><td><strong>Manual Receipt No</strong></td><td>{selectedExpense.manualReceiptNo || "-"}</td></tr>
                      <tr><td><strong>Paid From</strong></td><td>{selectedExpense.paidFrom}</td></tr>
                      <tr><td><strong>Paid To</strong></td><td>{selectedExpense.paidTo}</td></tr>
                      <tr><td><strong>Status</strong></td><td>{selectedExpense.status}</td></tr>
                      <tr><td><strong>Total Amount</strong></td><td>{selectedExpense.totalAmount}</td></tr>
                      <tr><td><strong>Narration</strong></td><td>{selectedExpense.narration}</td></tr>
                    </tbody>
                  </table>
                  
                  <h6 className="mt-4 mb-3">Account Details</h6>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedExpense.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.account}</td>
                          <td>{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ Edit Voucher Modal */}
      <div className="modal fade" id="editVoucherModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Edit Voucher</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setEditExpense(null)}></button>
            </div>
            <div className="modal-body">
              {editExpense && (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Auto Receipt No</label>
                    <input type="text" className="form-control" name="paymentNo" defaultValue={editExpense.paymentNo} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Manual Receipt No</label>
                    <input type="text" className="form-control" name="manualReceiptNo" defaultValue={editExpense.manualReceiptNo || ''} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Voucher Date</label>
                    <input type="date" className="form-control" name="voucherDate" defaultValue={editExpense.date} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Paid From</label>
                    <select className="form-select" name="paidFrom" defaultValue={editExpense.paidFrom}>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Paid To</label>
                    <input
                      type="text"
                      className="form-control"
                      name="paidTo"
                      defaultValue={editExpense.paidTo}
                      list="edit-account-options"
                      required
                    />
                    <datalist id="edit-account-options">
                      {accountOptions.map((account, idx) => (
                        <option key={idx} value={account} />
                      ))}
                    </datalist>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Total Amount</label>
                    <input type="text" className="form-control" name="amount" defaultValue={editExpense.totalAmount} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Narration</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      defaultValue={editExpense.narration}
                      name="narration"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select className="form-select" name="status" defaultValue={editExpense.status}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-3 mt-4">
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" className="btn" style={{ backgroundColor: "#3daaaa", color: "white" }}>
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ Delete Modal */}
      <div className="modal fade" id="deleteVoucherModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0" style={{ borderRadius: 16 }}>
            <div className="modal-body text-center py-4">
              <div className="mx-auto mb-3" style={{ width: 70, height: 70, background: "#FFF5F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaTrash size={32} color="#F04438" />
              </div>
              <h4 className="fw-bold mb-2">Delete Voucher</h4>
              <p className="mb-4" style={{ color: "#555" }}>
                Are you sure you want to delete this voucher?
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-dark" data-bs-dismiss="modal">No, Cancel</button>
                <button
                  className="btn"
                  style={{ background: "#3daaaa", color: "#fff", fontWeight: 600 }}
                  data-bs-dismiss="modal"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Page Info */}
      <Card className="mb-4 p-3 shadow rounded-4 mt-2">
        <Card.Body>
          <h5 className="fw-semibold border-bottom pb-2 mb-3 text-primary">Page Info</h5>
          <ul className="text-muted fs-6 mb-0" style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
            <li>Create and manage payment vouchers for various expenses.</li>
            <li>Each voucher is linked to an account and payment method.</li>
            <li>Helps maintain accurate financial records and expense tracking.</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};
export default Expense;