import React, { useState, useRef, useMemo } from 'react';
import { Table, Button, Badge, Form, Row, Col, InputGroup, Modal } from 'react-bootstrap';
import { FaEye, FaDownload, FaTrash, FaUpload, FaFile, FaCalendarAlt, FaSearch, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import { Card } from "react-bootstrap";

// Initial Data with referenceId
const initialReturns = [
  {
    id: 1,
    returnNo: 'SR-1001',
    invoiceNo: 'INV-2045',
    customer: 'Client A',
    date: '20-07-2025',
    items: 2,
    status: 'Processed',
    amount: 15000,
    returnType: 'Sales Return',
    reason: 'Defective Product',
    warehouse: 'Main Warehouse',
    referenceId: 'REF-1001',
    voucherNo: 'VR-1001'
  },
  {
    id: 2,
    returnNo: 'SR-1002',
    invoiceNo: 'INV-2046',
    customer: 'Client B',
    date: '21-07-2025',
    items: 1,
    status: 'Pending',
    amount: 8000,
    returnType: 'Credit Note',
    reason: 'Wrong Item',
    warehouse: 'North Branch',
    referenceId: 'REF-1002',
    voucherNo: 'VR-1002'
  },
  {
    id: 3,
    returnNo: 'SR-1003',
    invoiceNo: 'INV-2047',
    customer: 'Client C',
    date: '22-07-2025',
    items: 3,
    status: 'Approved',
    amount: 22000,
    returnType: 'Sales Return',
    reason: 'Quality Issue',
    warehouse: 'South Branch',
    referenceId: 'REF-1003',
    voucherNo: 'VR-1003'
  },
  {
    id: 4,
    returnNo: 'SR-1004',
    invoiceNo: 'INV-2048',
    customer: 'Client A',
    date: '23-07-2025',
    items: 1,
    status: 'Rejected',
    amount: 5000,
    returnType: 'Credit Note',
    reason: 'No Issue Found',
    warehouse: 'Main Warehouse',
    referenceId: 'REF-1004',
    voucherNo: 'VR-1004'
  },
  {
    id: 5,
    returnNo: 'SR-1005',
    invoiceNo: 'INV-2049',
    customer: 'Client D',
    date: '24-07-2025',
    items: 2,
    status: 'Processed',
    amount: 12000,
    returnType: 'Sales Return',
    reason: 'Damaged in Transit',
    warehouse: 'East Branch',
    referenceId: 'REF-1005',
    voucherNo: 'VR-1005'
  }
];

const warehouseOptions = [
  'Main Warehouse',
  'North Branch',
  'South Branch',
  'East Branch',
  'West Branch'
];

// Status & Type Badges
const getStatusBadge = (status) => {
  switch (status) {
    case 'Processed': return <Badge bg="success">Processed</Badge>;
    case 'Pending': return <Badge bg="warning" text="dark">Pending</Badge>;
    case 'Approved': return <Badge bg="info">Approved</Badge>;
    case 'Rejected': return <Badge bg="danger">Rejected</Badge>;
    default: return <Badge bg="secondary">{status}</Badge>;
  }
};

const getReturnTypeBadge = (returnType) => {
  if (returnType === 'Sales Return') return <Badge bg="primary">Sales Return</Badge>;
  if (returnType === 'Credit Note') return <Badge bg="secondary">Credit Note</Badge>;
  return <Badge bg="light" text="dark">{returnType}</Badge>;
};

const SalesReturn = () => {
  const [returns, setReturns] = useState(initialReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [returnTypeFilter, setReturnTypeFilter] = useState('All');
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const [customerFilter, setCustomerFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [voucherNo, setVoucherNo] = useState(''); // For manual input
  const [autoVoucherNo, setAutoVoucherNo] = useState('VR-1001'); // Auto-generated voucher number
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editReturn, setEditReturn] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newReturn, setNewReturn] = useState({
    returnNo: '',
    invoiceNo: '',
    customer: '',
    date: '',
    items: 1,
    status: 'Pending',
    amount: 0,
    returnType: 'Sales Return',
    reason: '',
    warehouse: warehouseOptions[0],
    referenceId: ''
  });

  // Derived Data
  const uniqueCustomers = [...new Set(returns.map(r => r.customer))];
  const uniqueReturnTypes = [...new Set(returns.map(r => r.returnType))];

  // Filtered Returns
  const filteredReturns = useMemo(() => {
    return returns.filter(item => {
      const matchesSearch = [
        item.returnNo,
        item.invoiceNo,
        item.customer,
        item.reason,
        item.warehouse
      ].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesType = returnTypeFilter === 'All' || item.returnType === returnTypeFilter;
      const matchesWarehouse = warehouseFilter === 'All' || item.warehouse === warehouseFilter;
      const matchesCustomer = !customerFilter || item.customer === customerFilter;

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const returnDate = new Date(item.date.split('-').reverse().join('-'));
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          matchesDate = returnDate >= fromDate;
        }
        if (dateTo && matchesDate) {
          const toDate = new Date(dateTo);
          matchesDate = returnDate <= toDate;
        }
      }

      let matchesAmount = true;
      if (amountMin) matchesAmount = item.amount >= parseFloat(amountMin);
      if (amountMax && matchesAmount) matchesAmount = item.amount <= parseFloat(amountMax);

      return matchesSearch && matchesStatus && matchesType && matchesWarehouse && matchesCustomer && matchesDate && matchesAmount;
    });
  }, [returns, searchTerm, statusFilter, returnTypeFilter, warehouseFilter, customerFilter, dateFrom, dateTo, amountMin, amountMax]);

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sales return?")) {
      setReturns(prev => prev.filter(r => r.id !== id));
    }
  };

  // Export All as CSV
  const handleExportAll = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Reference ID,Return No,Invoice No,Customer,Date,Items,Amount,Status,Return Type,Reason,Warehouse\n";

    returns.forEach(r => {
      csvContent += `"${r.referenceId}","${r.returnNo}","${r.invoiceNo}","${r.customer}","${r.date}",${r.items},${r.amount},"${r.status}","${r.returnType}","${r.reason}","${r.warehouse}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "All-Sales-Returns.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Single
  const handleDownload = (item) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Reference ID,Return No,Invoice No,Customer,Date,Items,Amount,Status,Return Type,Reason,Warehouse\n";
    csvContent += `"${item.referenceId}","${item.returnNo}","${item.invoiceNo}","${item.customer}","${item.date}",${item.items},${item.amount},"${item.status}","${item.returnType}","${item.reason}","${item.warehouse}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${item.returnNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setReturnTypeFilter('All');
    setWarehouseFilter('All');
    setCustomerFilter('');
    setDateFrom('');
    setDateTo('');
    setAmountMin('');
    setAmountMax('');
  };

  // Add New Return
  const handleAddClick = () => {
    const nextId = returns.length + 1;
    const autoRefId = `REF-${1000 + nextId}`;
    setNewReturn({
      returnNo: '',
      invoiceNo: '',
      customer: '',
      date: '',
      items: 1,
      status: 'Pending',
      amount: 0,
      returnType: 'Sales Return',
      reason: '',
      warehouse: warehouseOptions[0],
      referenceId: autoRefId
    });
    setShowAddModal(true);
  };

  const handleAddReturn = () => {
    if (!newReturn.returnNo || !newReturn.invoiceNo || !newReturn.customer || !newReturn.date) {
      alert("Please fill required fields: Return No, Invoice No, Customer, Date");
      return;
    }

    const newItem = {
      ...newReturn,
      id: Math.max(...returns.map(r => r.id), 0) + 1
    };

    setReturns(prev => [...prev, newItem]);
    setShowAddModal(false);
    setNewReturn({
      returnNo: '',
      invoiceNo: '',
      customer: '',
      date: '',
      items: 1,
      status: 'Pending',
      amount: 0,
      returnType: 'Sales Return',
      reason: '',
      warehouse: warehouseOptions[0],
      referenceId: ''
    });
  };

  // Edit Handlers
  const handleEditSave = () => {
    setReturns(prev => prev.map(r => r.id === editReturn.id ? editReturn : r));
    setShowEditModal(false);
  };

  return (
    <div className="p-4 my-4 px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div className="d-flex align-items-center gap-2 mb-4">
          <FaArrowRight size={20} color="red" />
          <h5 className="mb-0">Sales Return</h5>
          <p className="text-muted small mb-0">Customer Sends Back</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Button
            className="rounded-pill px-4 d-flex align-items-center"
            variant="success"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaUpload className="me-2 text-white" /> Import
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) alert(`Imported: ${file.name}`);
            }}
          />
          <Button
            className="rounded-pill px-4 d-flex align-items-center"
            style={{ backgroundColor: "#fd7e14", borderColor: "#fd7e14" }}
            onClick={handleExportAll}
          >
            <FaFile className="me-2" /> Export
          </Button>
          <Button
            className="rounded-pill px-4 d-flex align-items-center"
            style={{ backgroundColor: "#3daaaa", borderColor: "#3daaaa" }}
            onClick={handleAddClick}
          >
            New Return
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-light p-3 rounded mb-4">
        <Row className="g-3">
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
              <option value="">All Customers</option>
              {uniqueCustomers.map((customer, idx) => (
                <option key={idx} value={customer}>{customer}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Processed">Processed</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select value={returnTypeFilter} onChange={(e) => setReturnTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              {uniqueReturnTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
              <option value="All">All Warehouses</option>
              {warehouseOptions.map((warehouse, idx) => (
                <option key={idx} value={warehouse}>{warehouse}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <InputGroup>
              <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
              <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </InputGroup>
          </Col>
          <Col md={1}>
            <Button variant="outline-secondary" onClick={clearFilters} size="sm">Clear</Button>
          </Col>
        </Row>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-primary">
            <div className="card-body">
              <h6 className="card-title text-muted">Total Returns</h6>
              <h4 className="text-primary">{returns.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-success">
            <div className="card-body">
              <h6 className="card-title text-muted">Processed</h6>
              <h4 className="text-success">{returns.filter(r => r.status === 'Processed').length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-warning">
            <div className="card-body">
              <h6 className="card-title text-muted">Pending</h6>
              <h4 className="text-warning">{returns.filter(r => r.status === 'Pending').length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-danger">
            <div className="card-body">
              <h6 className="card-title text-muted">Total Value</h6>
              <h4 className="text-danger">₹ {returns.reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-IN')}</h4>
            </div>
          </div>
        </div>
      </div>
      {/* Voucher No Section */}
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <Row className="align-items-end g-3">
          {/* Manual / Auto Voucher No */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold"> Manual Voucher No</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter voucher no"
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                />

              </InputGroup>
            </Form.Group>
          </Col>

          {/* Auto-generated Display */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold"> Auto Voucher No</Form.Label>
              <Form.Control
                type="text"
                value={autoVoucherNo}
                readOnly
                className="bg-light"
              />
            </Form.Group>
          </Col>


        </Row>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table bordered hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th className="text-center">#</th>
              <th>Return No</th>
              <th>Reference ID</th>
              <th>Voucher No (Manual)</th>   {/* ✅ नया */}
              <th>Voucher No (Auto)</th>     {/* ✅ नया */}
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Warehouse</th>
              <th>Date</th>
              <th className="text-center">Items</th>
              <th>Amount (₹)</th>
              <th>Return Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
    <tbody>
  {filteredReturns.length > 0 ? (
    filteredReturns.map((item, idx) => (
      <tr key={item.id}>
        <td className="text-center">{idx + 1}</td>
        <td><strong>{item.returnNo}</strong></td>
        <td>{item.referenceId}</td>
        <td>{item.voucherNo || "-"}</td> {/* Manual */}
        <td>{autoVoucherNo}</td>         {/* Auto */}
        <td>{item.invoiceNo}</td>
        <td>{item.customer}</td>
        <td>{item.warehouse}</td>
        <td>{item.date}</td>
        <td className="text-center">{item.items}</td>
        <td className="fw-bold text-danger">
          ₹{item.amount.toLocaleString("en-IN")}
        </td>
        <td>{getReturnTypeBadge(item.returnType)}</td>
        <td className="small">{item.reason}</td>
        <td>{getStatusBadge(item.status)}</td>

        {/* ✅ Action Buttons (center aligned & neat) */}
        <td className="text-center">
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => {
                setSelectedReturn(item);
                setShowViewModal(true);
              }}
            >
              <FaEye size={14} />
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => {
                setEditReturn({ ...item });
                setShowEditModal(true);
              }}
            >
              <FaEdit size={14} />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              <FaTrash size={14} />
            </Button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="15" className="text-center py-4">
        No sales returns found
      </td>
    </tr>
  )}
</tbody>

        </Table>
      </div>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sales Return Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReturn && (
            <table className="table table-bordered">
              <tbody>
                <tr><td className="fw-bold">Reference ID</td><td>{selectedReturn.referenceId}</td></tr>
                <tr><td className="fw-bold">Voucher No (Manual)</td><td>{selectedReturn.voucherNo || '-'}</td></tr>
                <tr><td className="fw-bold">Voucher No (Auto)</td><td>{autoVoucherNo}</td></tr>
                <tr><td className="fw-bold">Return No</td><td>{selectedReturn.returnNo}</td></tr>
                <tr><td className="fw-bold">Invoice No</td><td>{selectedReturn.invoiceNo}</td></tr>
                <tr><td className="fw-bold">Customer</td><td>{selectedReturn.customer}</td></tr>
                <tr><td className="fw-bold">Warehouse</td><td>{selectedReturn.warehouse}</td></tr>
                <tr><td className="fw-bold">Date</td><td>{selectedReturn.date}</td></tr>
                <tr><td className="fw-bold">Items</td><td>{selectedReturn.items}</td></tr>
                <tr><td className="fw-bold">Amount</td><td>₹{selectedReturn.amount.toLocaleString('en-IN')}</td></tr>
                <tr><td className="fw-bold">Return Type</td><td>{selectedReturn.returnType}</td></tr>
                <tr><td className="fw-bold">Reason</td><td>{selectedReturn.reason}</td></tr>
                <tr><td className="fw-bold">Status</td><td>{getStatusBadge(selectedReturn.status)}</td></tr>
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Sales Return</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editReturn && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Reference ID</Form.Label>
                <Form.Control type="text" value={editReturn.referenceId} readOnly />
              </Form.Group>

              {/* Voucher No Section */}
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Manual Voucher No</Form.Label>
                    <Form.Control
                      type="text"
                      value={editReturn.voucherNo}
                      onChange={(e) => setEditReturn(prev => ({ ...prev, voucherNo: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Auto Voucher No</Form.Label>
                    <Form.Control type="text" value={autoVoucherNo} readOnly className="bg-light" />
                  </Form.Group>
                </Col>
              </Row>

              {/* बाकी fields */}
              <Form.Group className="mb-3">
                <Form.Label>Return No *</Form.Label>
                <Form.Control
                  type="text"
                  value={editReturn.returnNo}
                  onChange={(e) => setEditReturn(prev => ({ ...prev, returnNo: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Invoice No *</Form.Label>
                <Form.Control
                  type="text"
                  value={editReturn.invoiceNo}
                  onChange={(e) => setEditReturn(prev => ({ ...prev, invoiceNo: e.target.value }))}
                />
              </Form.Group>
              {/* ... बाकी unchanged fields */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSave} style={{ backgroundColor: '#3daaaa' }}>Save Changes</Button>
        </Modal.Footer>
      </Modal>


      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Sales Return</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Reference ID</Form.Label>
              <Form.Control type="text" value={newReturn.referenceId} readOnly placeholder="Auto-generated" />
            </Form.Group>

            {/* Voucher No Section */}
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Manual Voucher No</Form.Label>
                  <Form.Control
                    type="text"
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    placeholder="Enter voucher no"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Auto Voucher No</Form.Label>
                  <Form.Control type="text" value={autoVoucherNo} readOnly className="bg-light" />
                </Form.Group>
              </Col>
            </Row>

            {/* बाकी fields (Return No, Invoice No, Customer, etc) */}
            <Form.Group className="mb-3">
              <Form.Label>Return No *</Form.Label>
              <Form.Control
                type="text"
                value={newReturn.returnNo}
                onChange={(e) => setNewReturn(prev => ({ ...prev, returnNo: e.target.value }))}
                placeholder="e.g. SR-1006"
              />
            </Form.Group>
            {/* ... बाकी unchanged fields */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddReturn} style={{ backgroundColor: '#3daaaa' }}>Add Return</Button>
        </Modal.Footer>
      </Modal>


      {/* Info Card */}
      <Card className="mb-4 p-3 shadow rounded-4 mt-2">
        <Card.Body>
          <h5 className="fw-semibold border-bottom pb-2 mb-3 text-primary">Page Info</h5>
          <ul className="text-muted fs-6 mb-0" style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
            <li>Displays all customer return transactions where goods are sent back after sale.</li>
            <li>Shows details like return number, invoice number, customer, warehouse, date, items, and amount.</li>
            <li>Helps in managing return types like Sales Return or Credit Note.</li>
            <li>Tracks status of each return: Processed or Pending.</li>
            <li>Summarizes total returns, pending count, and total value at the top.</li>
            <li>Provides filters for customer, status, type, warehouse, and date to quickly find records.</li>
            <li>Includes Import, Export, and New Return options for data handling.</li>
            <li><strong>Reference ID</strong> is now auto-generated for every new return (e.g., REF-1001).</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesReturn;