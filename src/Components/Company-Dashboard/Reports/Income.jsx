import React, { useState, useEffect, useRef } from "react";
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

const Income = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [editVoucher, setEditVoucher] = useState(null);
  const [deleteVoucher, setDeleteVoucher] = useState(null);
  const [activeTab, setActiveTab] = useState("direct");
  const [filters, setFilters] = useState({
    accountName: "",
    receiptNo: "",
  });
  
  // State for table rows
  const [tableRows, setTableRows] = useState([
    { id: 1, account: "Sales Revenue", amount: "0.00" }
  ]);
  
  // State for received from selection
  const [receivedFrom, setReceivedFrom] = useState("");
  
  // State for narration
  const [narration, setNarration] = useState("");
  
  // State for showing narration
  const [showNarration, setShowNarration] = useState(false);
  
  // State for receipt numbers
  const [autoReceiptNo, setAutoReceiptNo] = useState("");
  const [manualReceiptNo, setManualReceiptNo] = useState("");
  
  // Reference for the modal
  const modalRef = useRef(null);
  
  // Generate auto receipt number
  const generateAutoReceiptNo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${year}${month}${day}-${random}`;
  };
  
  // Initialize auto receipt number
  useEffect(() => {
    setAutoReceiptNo(generateAutoReceiptNo());
  }, []);
  
  // Reset form when modal is hidden
  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      const handleHidden = () => {
        setAutoReceiptNo(generateAutoReceiptNo());
        setManualReceiptNo("");
        setTableRows([{ id: 1, account: "Sales Revenue", amount: "0.00" }]);
        setNarration("");
        setShowNarration(false);
      };
      
      modal.addEventListener('hidden.bs.modal', handleHidden);
      return () => {
        modal.removeEventListener('hidden.bs.modal', handleHidden);
      };
    }
  }, []);
  
  const parties = [
    { id: 1, name: "Customer A", type: ["Customer"] },
    { id: 2, name: "Customer B", type: ["Customer"] },
    { id: 3, name: "Customer C", type: ["Customer"] },
    { id: 4, name: "Customer D", type: ["Customer"] },
    { id: 5, name: "ABC Tech", type: ["Customer", "Vendor"] },
    { id: 6, name: "Global Supplies", type: ["Customer"] },
  ];
  const customerParties = parties.filter(p => p.type.includes("Customer"));
  
  // Income account options
  const accountOptions = [
    "Sales Revenue",
    "Service Income",
    "Interest Income",
    "Rent Income",
    "Commission Income",
    "Consulting Fees",
    "Licensing Fees",
    "Royalty Income",
    "Dividend Income",
    "Other Income",
    "Discount Received",
    "Reimbursement",
    "Grant Income",
    "Donation",
    "Refund",
    "Bad Debt Recovery",
    "Insurance Claim",
    "Capital Gain",
    "Foreign Exchange Gain"
  ];
  
  // Updated income vouchers with new structure
  const incomeVouchers = [
    {
      date: "3 Sep 2023",
      autoReceiptNo: "REC-20230903-123",
      manualReceiptNo: "INV-2023-001",
      depositedTo: "Bank Account",
      receivedFrom: "Customer A",
      items: [
        { account: "Sales Revenue", amount: "222.01" }
      ],
      narration: "Product sales payment",
      totalAmount: "222.01",
      status: "Received",
    },
    {
      date: "2 Dec 2023",
      autoReceiptNo: "REC-20231202-456",
      manualReceiptNo: "INV-2023-045",
      depositedTo: "Cash",
      receivedFrom: "Customer B",
      items: [
        { account: "Service Income", amount: "3182.56" }
      ],
      narration: "Consulting service payment",
      totalAmount: "3182.56",
      status: "Pending",
    },
    {
      date: "10 Nov 2023",
      autoReceiptNo: "REC-20231110-789",
      manualReceiptNo: "INV-2023-112",
      depositedTo: "Bank Account",
      receivedFrom: "ABC Tech",
      items: [
        { account: "Rent Income", amount: "4814.85" }
      ],
      narration: "Property rental income",
      totalAmount: "4814.85",
      status: "Received",
    },
    {
      date: "27 Nov 2023",
      autoReceiptNo: "REC-20231127-012",
      manualReceiptNo: "INV-2023-128",
      depositedTo: "Bank Account",
      receivedFrom: "Customer D",
      items: [
        { account: "Commission Income", amount: "4557.35" }
      ],
      narration: "Sales commission received",
      totalAmount: "4557.35",
      status: "Rejected",
    },
  ];
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "Received":
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
  
  // Handle Received From selection
  const handleReceivedFromChange = (e) => {
    const selectedAccount = e.target.value;
    setReceivedFrom(selectedAccount);
    
    if (selectedAccount) {
      const newRow = {
        id: tableRows.length + 1,
        account: selectedAccount,
        amount: "0.00"
      };
      setTableRows([...tableRows, newRow]);
      setReceivedFrom(""); // Reset the dropdown
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newVoucher = {
      date: form.voucherDate.value,
      autoReceiptNo: autoReceiptNo,
      manualReceiptNo: manualReceiptNo,
      depositedTo: form.depositedTo.value,
      receivedFrom: tableRows[0]?.account || "",
      items: tableRows,
      narration: narration,
      totalAmount: calculateTotal(),
    };
    alert("Income Voucher Created:\n" + JSON.stringify(newVoucher, null, 2));
    form.reset();
    setTableRows([{ id: 1, account: "Sales Revenue", amount: "0.00" }]);
    setNarration("");
    setAutoReceiptNo(generateAutoReceiptNo());
    setManualReceiptNo("");
  };
  
  const handleEdit = (voucher) => {
    setEditVoucher(voucher);
  };
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedVoucher = {
      ...editVoucher,
      date: form.voucherDate.value,
      autoReceiptNo: form.autoReceiptNo.value,
      manualReceiptNo: form.manualReceiptNo.value,
      depositedTo: form.depositedTo.value,
    };
    alert("Income Voucher Updated:\n" + JSON.stringify(updatedVoucher, null, 2));
    setEditVoucher(null);
  };
  
  const handleDelete = (voucher) => {
    setDeleteVoucher(voucher);
  };
  
  const confirmDelete = () => {
    setDeleteVoucher(null);
  };
  
  const filteredVouchers = incomeVouchers.filter((voucher) => {
    return (
      (!filters.accountName || voucher.receivedFrom.toLowerCase().includes(filters.accountName.toLowerCase())) &&
      (!filters.receiptNo || 
        voucher.autoReceiptNo.toLowerCase().includes(filters.receiptNo.toLowerCase()) ||
        voucher.manualReceiptNo.toLowerCase().includes(filters.receiptNo.toLowerCase()))
    );
  });
  
  return (
    <div className="bg-light p-4 mt-1 product-header">
      {/* Header */}
      <div className="d-flex justify-content-between gap-4 mb-4">
        <div>
          <h5 className="fw-bold mb-1">Income Voucher</h5>
          <p className="text-muted mb-0">Manage your income receipts</p>
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
            Create Income Voucher
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Receipt No</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Receipt No..."
              value={filters.receiptNo}
              onChange={(e) => setFilters({ ...filters, receiptNo: e.target.value })}
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
            <label className="form-label fw-semibold">Deposited To</label>
            <select
              className="form-select"
              value={filters.depositedTo}
              onChange={(e) => setFilters({ ...filters, depositedTo: e.target.value })}
            >
              <option value="">All</option>
              <option value="Cash">Cash</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="direct" title="All Income Vouchers">
          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>DATE</th>
                  <th>AUTO RECEIPT NO</th>
                  <th>MANUAL RECEIPT NO</th>
                  <th>DEPOSITED TO</th>
                  <th>RECEIVED FROM</th>
                  <th>ACCOUNTS</th>
                  <th>TOTAL AMOUNT</th>
                  <th>NARRATION</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.map((voucher, idx) => (
                  <tr key={idx}>
                    <td>{voucher.date}</td>
                    <td>{voucher.autoReceiptNo}</td>
                    <td>{voucher.manualReceiptNo}</td>
                    <td>{voucher.depositedTo}</td>
                    <td>{voucher.receivedFrom}</td>
                    <td>
                      {voucher.items.map((item, index) => (
                        <div key={index}>
                          {item.account}: {item.amount}
                        </div>
                      ))}
                    </td>
                    <td>{voucher.totalAmount}</td>
                    <td>{voucher.narration}</td>
                    <td><span className={getStatusBadge(voucher.status)}>{voucher.status}</span></td>
                    <td className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-sm text-info"
                        data-bs-toggle="modal"
                        data-bs-target="#voucherDetailModal"
                        onClick={() => setSelectedVoucher(voucher)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm text-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#editVoucherModal"
                        onClick={() => handleEdit(voucher)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteVoucherModal"
                        onClick={() => handleDelete(voucher)}
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
          Showing 1 to {incomeVouchers.length} of {incomeVouchers.length} results
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
      
      {/* ✅ Create Income Voucher Modal */}
      <div 
        ref={modalRef}
        className="modal fade" 
        id="createVoucherModal" 
        tabIndex="-1" 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Create Income Voucher</h5>
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
                      name="autoReceiptNo" 
                      value={autoReceiptNo}
                      readOnly 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Manual Receipt No</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="manualReceiptNo" 
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
                    <label className="form-label fw-semibold">Deposited To</label>
                    <select className="form-select" name="depositedTo" defaultValue="Cash">
                      <option value="Cash">Cash</option>
                      <option value="Bank Account">Bank Account</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Online Payment">Online Payment</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Received From</label>
                    <select 
                      className="form-select" 
                      value={receivedFrom}
                      onChange={handleReceivedFromChange}
                    >
                      <option value="">Select Customer</option>
                      {customerParties.map((party) => (
                        <option key={party.id} value={party.name}>{party.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Table for Account and Amount */}
                <div className="mb-3">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Income Account</th>
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
                      placeholder="Enter narration for this income voucher..."
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
              <h5 className="modal-title">Income Voucher Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setSelectedVoucher(null)}></button>
            </div>
            <div className="modal-body">
              {selectedVoucher && (
                <div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr><td><strong>Date</strong></td><td>{selectedVoucher.date}</td></tr>
                      <tr><td><strong>Auto Receipt No</strong></td><td>{selectedVoucher.autoReceiptNo}</td></tr>
                      <tr><td><strong>Manual Receipt No</strong></td><td>{selectedVoucher.manualReceiptNo}</td></tr>
                      <tr><td><strong>Deposited To</strong></td><td>{selectedVoucher.depositedTo}</td></tr>
                      <tr><td><strong>Received From</strong></td><td>{selectedVoucher.receivedFrom}</td></tr>
                      <tr><td><strong>Status</strong></td><td>{selectedVoucher.status}</td></tr>
                      <tr><td><strong>Total Amount</strong></td><td>{selectedVoucher.totalAmount}</td></tr>
                      <tr><td><strong>Narration</strong></td><td>{selectedVoucher.narration}</td></tr>
                    </tbody>
                  </table>
                  
                  <h6 className="mt-4 mb-3">Income Account Details</h6>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Income Account</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVoucher.items.map((item, index) => (
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
              <h5 className="modal-title">Edit Income Voucher</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setEditVoucher(null)}></button>
            </div>
            <div className="modal-body">
              {editVoucher && (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Auto Receipt No</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="autoReceiptNo" 
                      defaultValue={editVoucher.autoReceiptNo} 
                      readOnly 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Manual Receipt No</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="manualReceiptNo" 
                      defaultValue={editVoucher.manualReceiptNo} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Voucher Date</label>
                    <input type="date" className="form-control" name="voucherDate" defaultValue={editVoucher.date} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Deposited To</label>
                    <select className="form-select" name="depositedTo" defaultValue={editVoucher.depositedTo}>
                      <option value="Cash">Cash</option>
                      <option value="Bank Account">Bank Account</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Online Payment">Online Payment</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Received From</label>
                    <input
                      type="text"
                      className="form-control"
                      name="receivedFrom"
                      defaultValue={editVoucher.receivedFrom}
                      list="edit-customer-options"
                      required
                    />
                    <datalist id="edit-customer-options">
                      {customerParties.map((party) => (
                        <option key={party.id} value={party.name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Total Amount</label>
                    <input type="text" className="form-control" name="amount" defaultValue={editVoucher.totalAmount} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Narration</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      defaultValue={editVoucher.narration}
                      name="narration"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select className="form-select" name="status" defaultValue={editVoucher.status}>
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
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
              <h4 className="fw-bold mb-2">Delete Income Voucher</h4>
              <p className="mb-4" style={{ color: "#555" }}>
                Are you sure you want to delete this income voucher?
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
            <li>Create and manage income vouchers for various revenue sources.</li>
            <li>Each voucher has both auto-generated and manual receipt numbers for tracking.</li>
            <li>Helps maintain accurate financial records and income tracking.</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Income;