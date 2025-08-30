import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaPlus, FaBook } from 'react-icons/fa';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const VendorsCreditors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "John Smith Vendor",
      email: "john@example.com",
      phone: "9876543210",
      payable: 24,
      address: "Indore, India"
    },
    {
      id: 2,
      name: "Emily Johnson Vendor",
      email: "emily@example.com",
      phone: "9876543211",
      payable: 820,
      address: "Bhopal, India"
    },
    {
      id: 3,
      name: "Amit Sharma Vendor",
      email: "amit@globex.com",
      phone: "9876543222",
      payable: 1300,
      address: "Pune, India"
    },
    {
      id: 4,
      name: "Sara Ali Vendor",
      email: "sara@cyberdyne.ai",
      phone: "9876543333",
      payable: 450,
      address: "Delhi, India"
    },
    {
      id: 5,
      name: "Rajesh Mehta Vendor",
      email: "rajesh@initech.com",
      phone: "9876543444",
      payable: 760,
      address: "Ahmedabad, India"
    },
    {
      id: 6,
      name: "Nina Kapoor Vendor",
      email: "nina@umbrella.org",
      phone: "9876543555",
      payable: 390,
      address: "Mumbai, India"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showView, setShowView] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentCustomer, setCurrentCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payable: 0
  });

  // ✅ Default values for vendor form
  const [vendorFormData, setVendorFormData] = useState({
    name: "",
    accountType: "Sundry Creditors",     // ✅ Default
    accountName: "",                     // ✅ Free text input
    balanceType: "Credit",               // ✅ Fixed, no change
    payable: "",
    currentBalance: "",
    creationDate: "",
    bankAccountNumber: "",
    bankIFSC: "",
    bankName: "",
    country: "",
    state: "",
    pincode: "",
    address: "",
    stateCode: "",
    shippingAddress: "",
    phone: "",
    email: "",
    creditPeriod: "",
    gstin: "",
    gstType: "Registered",
    gstEnabled: true,
    taxNumber: "",
  });

  const updateField = (field, value) => {
    setCurrentCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handleAddClick = () => {
    // Reset form with defaults
    setVendorFormData({
      name: "",
      accountType: "Sundry Creditors",
      accountName: "",
      balanceType: "Credit",
      payable: "",
      currentBalance: "",
      creationDate: "",
      bankAccountNumber: "",
      bankIFSC: "",
      bankName: "",
      country: "",
      state: "",
      pincode: "",
      address: "",
      stateCode: "",
      shippingAddress: "",
      phone: "",
      email: "",
      creditPeriod: "",
      gstin: "",
      gstType: "Registered",
      taxEnabled: true,
      taxNumber: "",
    });
    setSelectedVendor(null);
    setShowAddEditModal(true);
  };

  const handleEditClick = (vendor) => {
    setVendorFormData({
      name: vendor.name || "",
      accountType: vendor.accountType || "Sundry Creditors",
      accountName: vendor.accountName || "",
      balanceType: vendor.balanceType || "Credit",
      payable: vendor.payable || "",
      currentBalance: vendor.currentBalance || "",
      creationDate: vendor.creationDate || "",
      bankAccountNumber: vendor.bankAccountNumber || "",
      bankIFSC: vendor.bankIFSC || "",
      bankName: vendor.bankName || "",
      country: vendor.country || "",
      state: vendor.state || "",
      pincode: vendor.pincode || "",
      address: vendor.address || "",
      stateCode: vendor.stateCode || "",
      shippingAddress: vendor.shippingAddress || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      creditPeriod: vendor.creditPeriod || "",
      gstin: vendor.gstin || "",
      gstType: vendor.gstType || "Registered",
      taxEnabled: vendor.taxEnabled !== undefined ? vendor.taxEnabled : true,
      taxNumber: vendor.taxNumber || "",
    });
    setSelectedVendor(vendor);
    setShowAddEditModal(true);
  };

  const handleSave = () => {
    const updatedVendor = { ...currentCustomer, ...vendorFormData };

    if (selectedVendor) {
      // Update existing vendor
      const updated = vendors.map(v => v.id === selectedVendor.id ? updatedVendor : v);
      setVendors(updated);
    } else {
      // Add new vendor with unique ID
      setVendors([...vendors, { ...updatedVendor, id: Date.now() }]);
    }
    setShowAddEditModal(false);
    setSelectedVendor(null);
  };

  const handleDeleteVendor = () => {
    setVendors(vendors.filter(v => v.id !== selectedVendor.id));
    setShowDelete(false);
  };

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.phone.includes(searchTerm)
  );

  const handleDownloadTemplate = () => {
    const headers = [["name", "email", "phone", "payable", "address"]];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VendorsTemplate");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Vendor_Template.xlsx");
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(vendors);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Vendors_Export.xlsx");
  };

  const handleImportClick = () => {
    if (window.importFileRef) window.importFileRef.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet);
      const dataWithIds = data.map(item => ({
        ...item,
        id: Date.now() + Math.random()
      }));
      setVendors((prev) => [...prev, ...dataWithIds]);
    };
    reader.readAsBinaryString(file);
  };

  const handleViewLedger = (vendor) => {
    navigate(`/company/ledgervendor`, { state: { vendor } });
  };

  const accountTypes = [
    "Cash-in-hand",
    "Bank A/Cs",
    "Sundry Debtors",
    "Sundry Creditors",
    "Purchases A/C",
    "Purchases Return",
    "Sales A/C",
    "Sales Return",
    "Capital A/C",
    "Direct Expenses",
    "Indirect Expenses"
  ];

  

  return (
    <div className="mt-4 p-2">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={4}><h4 className="fw-bold mb-0">Manage Vendors</h4></Col>
        <Col xs={12} md={8}>
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            <Button variant="success" className="rounded-pill d-flex align-items-center" onClick={handleImportClick}>Import</Button>
            <input type="file" accept=".xlsx, .xls" ref={(ref) => (window.importFileRef = ref)} onChange={handleImport} style={{ display: "none" }} />
            <Button variant="primary" className="rounded-pill d-flex align-items-center" onClick={handleExport}>Export</Button>
            <Button variant="warning" className="rounded-pill d-flex align-items-center" onClick={handleDownloadTemplate}>Download</Button>
            <Button variant="success" className="rounded-pill d-flex align-items-center" style={{ backgroundColor: "#53b2a5", border: "none" }} onClick={handleAddClick}>
              <FaPlus /> Add Vendor
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mb-3 justify-content-start">
        <Col xs={12} md={6} lg={4}>
          <Form.Control type="text" placeholder="Search vendor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded-pill" />
        </Col>
      </Row>
      <div className="card bg-white rounded-3 p-4">
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle mb-0">
          <thead className="table-light border">
  <tr>
    <th>NO.</th>
    <th>Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Account Type</th>        {/* 👈 New */}
    <th>Account Name</th>        {/* 👈 New */}
    <th> Opening Balance</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {filteredVendors.length > 0 ? (
    filteredVendors.map((vendor, idx) => (
      <tr key={vendor.id}>
        <td>{idx + 1}</td>
        <td>{vendor.name}</td>
        <td>{vendor.email}</td>
        <td>{vendor.phone}</td>

        {/* New Columns */}
        <td>
          <span className="badge bg-info text-white">
            {vendor.accountType || "Sundry Creditors"}
          </span>
        </td>
        <td>{vendor.accountName || "Accounts Payable"}</td>

        <td>{vendor.payable}$</td>
        <td>
  <div 
    className="d-flex align-items-center gap-2" 
    style={{ minWidth: "220px", whiteSpace: "nowrap" }}
  >
    {/* View Button */}
    <Button
      variant="link"
      className="text-info p-1"
      size="sm"
      onClick={() => { setSelectedVendor(vendor); setShowView(true); }}
      title="View Details"
    >
      <FaEye size={16} />
    </Button>

    {/* Edit Button */}
    <Button
      variant="link"
      className="text-warning p-1"
      size="sm"
      onClick={() => handleEditClick(vendor)}
      title="Edit Vendor"
    >
      <FaEdit size={16} />
    </Button>

    {/* Delete Button */}
    <Button
      variant="link"
      className="text-danger p-1"
      size="sm"
      onClick={() => { setSelectedVendor(vendor); setShowDelete(true); }}
      title="Delete Vendor"
    >
      <FaTrash size={16} />
    </Button>

    {/* View Ledger Button */}
    <Button
  variant="none"
  className="p-0 text-primary text-decoration-none"
  onClick={() => {
    navigate(`/company/ledgervendor`, {
      state: {
        vendor: {
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          gst: vendor.gstin || vendor.taxNumber || "N/A",
          openingBalance: parseFloat(vendor.payable || 0),
        },
      },
    });
  }}
  title="View Ledger"
  style={{
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: "6px 10px",
    borderRadius: "4px",
    fontSize: "0.875rem",
    fontWeight: 500,
  }}
>
  View Ledger
</Button>
  </div>
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center text-muted">  {/* 👈 Changed from 6 to 8 */}
        No vendor found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <small className="text-muted ms-2">
            Showing 1 to {filteredVendors.length} of {filteredVendors.length} results
          </small>
          <nav>
            <ul className="pagination mb-0">
              <li className="page-item disabled"><button className="page-link">&laquo;</button></li>
              <li className="page-item active"><button className="page-link">1</button></li>
              <li className="page-item"><button className="page-link">2</button></li>
              <li className="page-item"><button className="page-link">&raquo;</button></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* View Modal */}
      <Modal show={showView} onHide={() => setShowView(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vendor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <>
              <div className="border rounded p-3 mb-4">
                <h6 className="fw-semibold mb-3">Basic Information</h6>
                <Row>
  <Col md={6}><p><strong>Name:</strong> {selectedVendor.name}</p></Col>
  <Col md={6}><p><strong>Phone:</strong> {selectedVendor.phone}</p></Col>
  <Col md={6}><p><strong>Email:</strong> {selectedVendor.email}</p></Col>
  <Col md={6}>
    <p>
      <strong>Account Type:</strong>{" "}
      {selectedVendor.accountType || "Sundry Creditors"}
    </p>
  </Col>
  <Col md={6}>
    <p>
      <strong>Account Name:</strong>{" "}
      {selectedVendor.accountName || "Accounts Payable"}
    </p>
  </Col>
  <Col md={6}><p><strong>Balance:</strong> {selectedVendor.payable}</p></Col>
  <Col md={6}><p><strong>Credit Period:</strong> {selectedVendor.creditPeriod || "N/A"}</p></Col>
  <Col md={6}><p><strong>Creation Date:</strong> {selectedVendor.creationDate || "N/A"}</p></Col>
</Row>
              </div>
              <div className="border rounded p-3 mb-4">
                <h6 className="fw-semibold mb-3">Billing Information</h6>
                <Row>
                  <Col md={6}><p><strong>Address:</strong> {selectedVendor.address}</p></Col>
                  <Col md={6}><p><strong>Country:</strong> {selectedVendor.country || "India"}</p></Col>
                  <Col md={6}><p><strong>State:</strong> {selectedVendor.state || "N/A"}</p></Col>
                  <Col md={6}><p><strong>Pincode:</strong> {selectedVendor.pincode || "N/A"}</p></Col>
                  <Col md={6}><p><strong>State Code:</strong> {selectedVendor.stateCode || "N/A"}</p></Col>
                </Row>
              </div>
              <div className="border rounded p-3 mb-4">
                <h6 className="fw-semibold mb-3">Shipping Information</h6>
                <Row>
                  <Col md={12}><p><strong>Shipping Address:</strong> {selectedVendor.shippingAddress || "N/A"}</p></Col>
                </Row>
              </div>
              {selectedVendor.bankAccountNumber && (
                <div className="border rounded p-3 mb-4">
                  <h6 className="fw-semibold mb-3">Bank Details</h6>
                  <Row>
                    <Col md={6}><p><strong>Account Number:</strong> {selectedVendor.bankAccountNumber}</p></Col>
                    <Col md={6}><p><strong>IFSC:</strong> {selectedVendor.bankIFSC}</p></Col>
                    <Col md={6}><p><strong>Bank Name & Branch:</strong> {selectedVendor.bankName}</p></Col>
                  </Row>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowView(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

 {/* Add/Edit Modal */}
<Modal
  show={showAddEditModal}
  onHide={() => setShowAddEditModal(false)}
  size="xl"
  centered
  backdrop="static"
>
  <Modal.Header closeButton className="bg-light">
    <Modal.Title>{selectedVendor ? "Edit Vendor" : "Add Vendor"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Name (English)</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.name}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, name: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Name (Arabic)</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.nameArabic}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, nameArabic: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.companyName}
              onChange={(e) => 
                setVendorFormData({
                  ...vendorFormData,
                  companyName: e.target.value,
                })
              }
              placeholder="Enter company name"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Company Google Location</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.companyLocation}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, companyLocation: e.target.value })
              }
              placeholder="Enter Google Maps Link"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>ID Card Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, idCardImage: e.target.files[0] })
              }
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Any File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, extraFile: e.target.files[0] })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Account Type</Form.Label>
            <Form.Control
              type="text"
              value="Sundry Creditors"
              disabled
              style={{ backgroundColor: "#fff" }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Balance Type</Form.Label>
            <Form.Control
              type="text"
              value="Credit"
              disabled
              style={{ backgroundColor: "#fff" }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Account Name</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.accountName}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, accountName: e.target.value })
              }
              placeholder="e.g., Vendor A"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Account Balance</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={vendorFormData.accountBalance}
              onChange={(e) => {
                const value = e.target.value;
                setVendorFormData({
                  ...vendorFormData,
                  accountBalance: value || "0.00",
                });
              }}
              placeholder="Enter account balance"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Creation Date</Form.Label>
            <Form.Control
              type="date"
              value={vendorFormData.creationDate}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, creationDate: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Bank Account Number</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.bankAccountNumber}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, bankAccountNumber: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Bank IFSC</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.bankIFSC}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, bankIFSC: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Bank Name & Branch</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.bankName}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, bankName: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.country}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, country: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.state}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, state: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.pincode}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, pincode: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.address}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, address: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>State Code</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.stateCode}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, stateCode: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.shippingAddress}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, shippingAddress: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={vendorFormData.phone}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, phone: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={vendorFormData.email}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, email: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Credit Period (days)</Form.Label>
            <Form.Control
              type="number"
              value={vendorFormData.creditPeriod}
              onChange={(e) =>
                setVendorFormData({ ...vendorFormData, creditPeriod: e.target.value })
              }
            />
          </Form.Group>
        </Col>

        <Col md={6}>
                       <Form.Group className="d-flex align-items-center">
                         {/* GSTIN field only when enabled */}
                         {vendorFormData.gstEnabled && (
                           <div className="flex-grow-1 me-3">
                             <Form.Label>GSTIN</Form.Label>
                             <Form.Control
                               type="text"
                               value={vendorFormData.gstin}
                               onChange={(e) =>
                                 setVendorFormData({ ...vendorFormData, gstin: e.target.value })
                               }
                             />
                           </div>
                         )}
       
                         {/* On/Off Toggle */}
                         <div>
                           <Form.Label className="me-2">Enable</Form.Label>
                           <Form.Check
                             type="switch"
                             id="gstin-toggle"
                             checked={vendorFormData.gstEnabled}
                             onChange={(e) =>
                               setVendorFormData({
                                 ...vendorFormData,
                                 gstEnabled: e.target.checked,
                                 gstin: e.target.checked ? vendorFormData.gstin : "", // optional: off karte hi clear
                               })
                             }
                           />
                         </div>
                       </Form.Group>
                     </Col>

      </Row>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddEditModal(false)}>
      Cancel
    </Button>
    <Button
      style={{ backgroundColor: "#53b2a5", border: "none" }}
      onClick={handleSave}
    >
      {selectedVendor ? "Update Vendor" : "Save Vendor"}
    </Button>
  </Modal.Footer>
</Modal>
      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this vendor?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteVendor}>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Page Description */}
      <Card className="mb-4 p-3 shadow rounded-4 mt-2">
        <Card.Body>
          <h5 className="fw-semibold border-bottom pb-2 mb-3 text-primary">Page Info</h5>
          <ul className="text-muted fs-6 mb-0" style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
            <li>Manage vendor details including contact and billing information.</li>
            <li>Track payable balances and credit periods.</li>
            <li>Perform CRUD operations: add, view, edit, and delete vendors.</li>
            <li>Import and export vendor data using Excel templates.</li>
            <li>Assign account types and view transaction ledger for each vendor.</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VendorsCreditors;