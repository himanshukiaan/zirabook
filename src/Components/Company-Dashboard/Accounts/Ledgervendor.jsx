import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import {
  FaCalendarAlt,
  FaSearch,
  FaFileExport,
  FaFilePdf,
} from "react-icons/fa";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Table,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Ledgervendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultVendor = {
    name: "Unknown Vendor",
    email: "N/A",
    phone: "N/A",
    address: "N/A",
    gst: "N/A",
    openingBalance: 0,
  };

  const passedVendor = location.state?.vendor;
  const vendor = passedVendor || defaultVendor;

  // State
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-04-30");
  const [balanceType, setBalanceType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [voucherTypeFilter, setVoucherTypeFilter] = useState("all");
  const [showNarration, setShowNarration] = useState(false);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [showCountTable, setShowCountTable] = useState(false);
  const [manualVoucherNo, setManualVoucherNo] = useState("");
  const [autoVoucherNo] = useState("VCH-" + Date.now());
  // Vendor-only Dummy Data
  // Vendor-only Dummy Data (with dynamic opening balance)
  const ledgerData = [
    // Opening Balance - Dynamic based on vendor.openingBalance
    {
      id: 1,
      date: "2025-04-01",
      particulars: "Opening Balance",
      narration: "Initial opening balance carried forward",
      voucherNo: "--",
      voucherType: "Opening",
      debit: 0,
      credit: parseFloat(vendor.openingBalance || 0),
      items: [],
    },

    // Purchase Invoice
    {
      id: 2,
      date: "2025-04-03",
      particulars: "Purchase Invoice INV501",
      narration: "Raw material purchased from Sharma Suppliers",
      voucherNo: "INV501",
      voucherType: "Invoice",
      debit: 0,
      credit: 12000,
      items: [
        {
          item: "SNB CH 58 LOT WHITE",
          quantity: "100.00 yds",
          rate: "0.400",
          discount: "0.000",
          tax: "0.000",
          taxAmt: "0.000",
          value: "40.00",
          description: "4 PCS",
        },
      ],
    },

    // Payment Made
    {
      id: 3,
      date: "2025-04-07",
      particulars: "Payment Made",
      narration: "Payment made for purchase",
      voucherNo: "PY001",
      voucherType: "Payment",
      debit: 10000,
      credit: 0,
      items: [],
    },

    // Purchase Return
    {
      id: 4,
      date: "2025-04-12",
      particulars: "Purchase Return",
      narration: "Returned damaged goods",
      voucherNo: "DN001",
      voucherType: "Return",
      debit: 2000,
      credit: 0,
      items: [
        {
          item: "SNB CH 58 LOT WHITE",
          quantity: "50.00 yds",
          rate: "0.400",
          discount: "0.000",
          tax: "0.000",
          taxAmt: "0.000",
          value: "20.00",
          description: "2 PCS",
        },
      ],
    },

    // Second Purchase Invoice
    {
      id: 5,
      date: "2025-04-15",
      particulars: "Purchase Invoice INV502",
      narration: "Second purchase of cotton fabric",
      voucherNo: "INV502",
      voucherType: "Invoice",
      debit: 0,
      credit: 8500,
      items: [
        {
          item: "COTTON BLUE 600GSM",
          quantity: "250.00 mtrs",
          rate: "0.300",
          discount: "0.000",
          tax: "0.000",
          taxAmt: "0.000",
          value: "75.00",
          description: "10 ROLLS",
        },
      ],
    },

    // Partial Payment
    {
      id: 6,
      date: "2025-04-18",
      particulars: "Payment Made",
      narration: "Partial payment for INV502",
      voucherNo: "PY002",
      voucherType: "Payment",
      debit: 5000,
      credit: 0,
      items: [],
    },
  ];

  // Filtered & Processed Data
  const processedData = useMemo(() => {
    let filtered = [...ledgerData];

    if (fromDate) filtered = filtered.filter((e) => e.date >= fromDate);
    if (toDate) filtered = filtered.filter((e) => e.date <= toDate);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((e) =>
        e.particulars.toLowerCase().includes(q) ||
        (e.narration && e.narration.toLowerCase().includes(q)) ||
        e.voucherNo.toLowerCase().includes(q) ||
        (e.items && e.items.some((i) => i.item.toLowerCase().includes(q)))
      );
    }

    if (balanceType !== "all") {
      filtered = filtered.filter((e) =>
        balanceType === "debit" ? e.debit > 0 : e.credit > 0
      );
    }

    if (voucherTypeFilter !== "all") {
      filtered = filtered.filter((e) => e.voucherType === voucherTypeFilter);
    }

    let runningBalance = 8000;
    return filtered.map((entry) => {
      runningBalance += (entry.credit || 0) - (entry.debit || 0);
      const isCredit = runningBalance >= 0;
      const balanceTypeLabel = isCredit ? "Cr" : "Dr";

      return {
        ...entry,
        balance: `${Math.abs(runningBalance).toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
        })} ${balanceTypeLabel}`,
        balanceValue: runningBalance,
        balanceType: balanceTypeLabel,
      };
    });
  }, [ledgerData, fromDate, toDate, balanceType, searchQuery, voucherTypeFilter]);

  // Totals
  const totals = useMemo(() => {
    return processedData.reduce(
      (acc, e) => {
        acc.totalDebit += e.debit || 0;
        acc.totalCredit += e.credit || 0;
        return acc;
      },
      { totalDebit: 0, totalCredit: 0 }
    );
  }, [processedData]);

  const currentBalance = processedData.length > 0
    ? processedData[processedData.length - 1].balanceValue
    : 0;

  const hasItems = useMemo(() => processedData.some((e) => e.items.length > 0), [processedData]);

  // Handlers
  const resetFilters = () => {
    setFromDate("2025-04-01");
    setToDate("2025-04-30");
    setBalanceType("all");
    setVoucherTypeFilter("all");
    setSearchQuery("");
  };

  const exportToExcel = () => alert("Export to Excel functionality");
  const exportToPDF = () => alert("Export to PDF functionality");

  return (
    <div className="container mt-4">

      {/* Top Bar: Back + Custom Styled Action Chips */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        {/* Back Button */}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="d-flex align-items-center px-3 py-1"
        >
          <span className="me-1">←</span> Back to Vendors
        </Button>

        {/* 1. View Vendor Details */}
        <Button
          size="sm"
          className="py-1 px-3"
          style={{
            backgroundColor: showVendorDetails ? "#53b2a5" : "#e9f7f5",
            color: showVendorDetails ? "white" : "#53b2a5",
            border: "1px solid #53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
          onClick={() => setShowVendorDetails(!showVendorDetails)}
        >
          {showVendorDetails ? "✅ Details" : "🔍 Vendor Details"}
        </Button>

        {/* 2. View Item Details */}
        <Button
          size="sm"
          className="py-1 px-3"
          disabled={!hasItems}
          style={{
            backgroundColor: !hasItems ? "#cccccc" : "#53b2a5",
            color: !hasItems ? "#666666" : "white",
            border: "1px solid #53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
          onClick={() => {
            const anyExpanded = processedData.some(
              (entry) => entry.items.length > 0 && expandedRows[entry.id]
            );

            const newExpandedRows = {};
            if (!anyExpanded) {
              processedData.forEach((entry) => {
                if (entry.items && entry.items.length > 0) {
                  newExpandedRows[entry.id] = true;
                }
              });
            }
            setExpandedRows(newExpandedRows);
          }}
        >
          📦 {expandedRows && Object.keys(expandedRows).length > 0 ? "Hide Items" : "Items Details"}
        </Button>

        {/* 3. Show Transaction Count */}
        <Button
          size="sm"
          className="py-1 px-3"
          style={{
            backgroundColor: showCountTable ? "#53b2a5" : "#e9f7f5",
            color: showCountTable ? "white" : "#53b2a5",
            border: "1px solid #53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
          onClick={() => setShowCountTable((prev) => !prev)}
        >
          📊 {showCountTable ? "Hide Count" : "Count of Transaction"}
        </Button>


        {/* 5. Send Button - Normal & Simple */}
        <Button
          size="sm"

          onClick={() => {
            alert(`Ledger for ${customer.name} will be sent.`);

          }}

          style={{
            backgroundColor: showVendorDetails ? "#53b2a5" : "#e9f7f5",
            color: showVendorDetails ? "white" : "#53b2a5",
            border: "1px solid #53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
        >
          Send
        </Button>

        {/* 4. Show/Hide Narration */}
        <Button
          size="sm"
          className="py-1 px-3"
          style={{
            backgroundColor: showNarration ? "#53b2a5" : "#e9f7f5",
            color: showNarration ? "white" : "#53b2a5",
            border: "1px solid #53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
          onClick={() => setShowNarration(!showNarration)}
        >
          {showNarration ? "❌ Hide Narration" : "📝 Narration"}
        </Button>


      </div>
      {/* Vendor Name */}

      <h4 className="mb-0 text-dark">Vendor Ledger - {vendor.name}</h4>
      {/* 🆕 Voucher No Section */}
      <Row className="mb-3 mt-2">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Manual Voucher No.</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter voucher no..."
              value={manualVoucherNo}
              onChange={(e) => setManualVoucherNo(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Auto Voucher No.</Form.Label>
            <Form.Control
              type="text"
              value={autoVoucherNo}
              readOnly
              style={{ backgroundColor: "#f9f9f9" }}
            />
          </Form.Group>
        </Col>
      </Row>




      {/* 👉 Vendor Details (Clean border, no color, no hover, no focus) */}
      {showVendorDetails && (
        <Card
          className="mt-3 mb-3"
          style={{
            borderRadius: '8px',
            border: '1px solid #dee2e6', // Light gray border (clean)
            backgroundColor: '#f8f9fa',  // bg-light
            boxShadow: 'none',
            transition: 'none'
          }}
        >
          <Card.Body className="p-3">
            <Row className="g-2">
              <Col md={4}><strong>Name:</strong> {vendor.name}</Col>
              <Col md={4}><strong>Email:</strong> {vendor.email}</Col>
              <Col md={4}><strong>Phone:</strong> {vendor.phone}</Col>
              <Col md={4}><strong>Address:</strong> {vendor.address}</Col>
              <Col md={4}><strong>GSTIN:</strong> {vendor.gst}</Col>
              <Col md={4}><strong>Opening Balance:</strong> ₹{vendor.openingBalance.toLocaleString('en-IN')}</Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header className="text-white d-flex justify-content-between align-items-center">
          <Badge bg="light" text="dark">
            {processedData.length} transaction(s)
          </Badge>
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="light"
              size="sm"
              className="d-flex align-items-center px-3 py-2 shadow-sm border"
              onClick={exportToExcel}
            >
              <FaFileExport className="me-2" />
              <span className="small fw-medium">Excel</span>
            </Button>

            <Button
              variant="light"
              size="sm"
              className="d-flex align-items-center px-3 py-2 shadow-sm border"
              onClick={exportToPDF}
            >
              <FaFilePdf className="me-2" />
              <span className="small fw-medium">PDF</span>
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Summary Cards */}
          <Row className="mb-4 g-3">
            <Col md={4}>
              <Card className="border-left-primary shadow h-100 py-2">
                <Card.Body>
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Payments (Dr)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totals.totalDebit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="btn-circle btn-sm btn-primary">Dr</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-left-success shadow h-100 py-2">
                <Card.Body>
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Total Purchases (Cr)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totals.totalCredit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="btn-circle btn-sm btn-success">Cr</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={`border-left-${currentBalance >= 0 ? 'info' : 'danger'} shadow h-100 py-2`}>
                <Card.Body>
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="text-xs font-weight-bold text-uppercase mb-1">
                        Outstanding Balance
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {Math.abs(currentBalance).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} {currentBalance >= 0 ? "Cr" : "Dr"}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className={`btn-circle btn-sm btn-${currentBalance >= 0 ? 'info' : 'danger'}`}>
                        {currentBalance >= 0 ? "Cr" : "Dr"}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters Toggle */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="me-2"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
            <Badge bg="warning" text="dark">Vendor Ledger</Badge>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <Card className="mb-4 bg-light">
              <Card.Body>
                <Row className="g-3">
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>From Date</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                        <Form.Control
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>To Date</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                        <Form.Control
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>Balance Type</Form.Label>
                      <Form.Select value={balanceType} onChange={(e) => setBalanceType(e.target.value)}>
                        <option value="all">All Transactions</option>
                        <option value="debit">Payments Only (Debit)</option>
                        <option value="credit">Purchases Only (Credit)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>Voucher Type</Form.Label>
                      <Form.Select value={voucherTypeFilter} onChange={(e) => setVoucherTypeFilter(e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="Invoice">Purchase</option>
                        <option value="Payment">Payment</option>
                        <option value="Return">Purchase Return</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3 mt-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Search</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by voucher, description, narration, or item..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}


          {/* Global CSS for uniform button height */}
          <style jsx>{`
  .uniform-btn {
    min-height: 38px !important;
    padding: 0.375rem 0.75rem !important;
    line-height: 1.5 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    border-color: transparent;
    transition: all 0.2s ease;
  }

  /* Fix for outline buttons */
  .btn-outline-info.uniform-btn {
    border-color: #17a2b8 !important;
    color: #17a2b8 !important;
  }

  .btn-outline-info.uniform-btn:hover {
    background-color: #17a2b8 !important;
    color: white !important;
  }

  /* Fix for disabled button */
  .uniform-btn:disabled {
    opacity: 0.65 !important;
    cursor: not-allowed !important;
    pointer-events: auto !important;
    background-color: #007bff !important;
    color: white !important;
    border-color: #007bff !important;
  }

  /* Responsive adjustment for small screens */
  @media (max-width: 575.98px) {
    .uniform-btn {
      min-height: 36px !important;
      padding: 0.3rem 0.6rem !important;
      font-size: 0.875rem !important;
    }
  }
`}</style>

          {/* Ledger Table */}
          <div className="table-responsive">
            <Table striped hover bordered className="shadow-sm  align-middle ">
              <thead className=" table-light border">
                <tr className="py-2">
                  <th className="py-2">Date</th>
                  <th className="py-2">Particulars</th>

                  <th>VCH NO</th>
                  <th>VCH TYPE</th>
                  <th className="text-end">Debit (Dr)</th>
                  <th className="text-end">Credit (Cr)</th>
                  <th className="text-end">Balance</th>
                  {showNarration && <th>Narration</th>}
                </tr>
              </thead>
              <tbody>
                {processedData.length > 0 ? (
                  processedData.map((entry) => (
                    <React.Fragment key={entry.id}>
                      {/* Main Ledger Row */}
                      <tr>
                        <td>{entry.date}</td>
                        <td>
                          <div
                            className="d-flex align-items-center cursor-pointer"
                            onClick={() => {
                              if (entry.items && entry.items.length > 0) {
                                setExpandedRows((prev) => ({
                                  ...prev,
                                  [entry.id]: !prev[entry.id],
                                }));
                              }
                            }}
                          >
                            <span className="me-2">
                              {entry.items && entry.items.length > 0 ? (
                                expandedRows[entry.id] ? "▼" : "▶"
                              ) : (
                                " "
                              )}
                            </span>
                            <span>{entry.particulars}</span>
                          </div>
                        </td>

                        <td>{entry.voucherNo}</td>
                        <td>
                          <Badge
                            bg={
                              entry.voucherType === "Invoice"
                                ? "primary"
                                : entry.voucherType === "Payment"
                                  ? "success"
                                  : entry.voucherType === "Return"
                                    ? "warning"
                                    : "secondary"
                            }
                          >
                            {entry.voucherType === "Invoice"
                              ? "Purchase"
                              : entry.voucherType === "Return"
                                ? "Return"
                                : entry.voucherType}
                          </Badge>
                        </td>
                        <td className="text-end">
                          {entry.debit
                            ? entry.debit.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })
                            : ""}
                        </td>
                        <td className="text-end">
                          {entry.credit
                            ? entry.credit.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })
                            : ""}
                        </td>
                        <td
                          className={`text-end ${entry.balanceType === "Cr" ? "text-success" : "text-danger"
                            }`}
                        >
                          {entry.balance}
                        </td>

                        {showNarration && (
                          <td className="text-muted small" style={{ maxWidth: "200px", whiteSpace: "normal" }}>
                            {entry.narration || "—"}
                          </td>
                        )}
                      </tr>

                      {/* Expandable Items Table */}
                      {entry.items && entry.items.length > 0 && expandedRows[entry.id] && (
                        <tr>
                          <td className="text-muted" style={{ fontSize: "0.8rem" }}>
                            •••
                          </td>
                          <td colSpan={showNarration ? 7 : 6} className="p-0">
                            <div className="bg-light border-top">
                              <Table striped hover className="mb-0" size="sm">
                                <thead className="table-light">
                                  <tr>
                                    <th>ITEM / MATERIAL</th>
                                    <th>QUANTITY</th>
                                    <th>RATE (₹)</th>
                                    <th>DISCOUNT</th>
                                    <th>TAX %</th>
                                    <th>TAX AMT (₹)</th>
                                    <th>VALUE (₹)</th>
                                    <th>DESCRIPTION</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.items.map((item, idx) => (
                                    <tr key={idx}>
                                      <td className="fw-bold">{item.item}</td>
                                      <td>{item.quantity}</td>
                                      <td>{parseFloat(item.rate).toFixed(3)}</td>
                                      <td>{item.discount}%</td>
                                      <td>{item.tax}%</td>
                                      <td>₹{parseFloat(item.taxAmt).toFixed(2)}</td>
                                      <td>₹{parseFloat(item.value).toFixed(2)}</td>
                                      <td className="text-muted">{item.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={showNarration ? 8 : 7} className="text-center py-4 text-muted">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <td colSpan={showNarration ? 4 : 3} className="text-end fw-bold">Total</td>
                  <td className="text-end fw-bold">{totals.totalDebit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  <td className="text-end fw-bold">{totals.totalCredit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  <td className="text-end fw-bold">
                    {Math.abs(currentBalance).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} {currentBalance >= 0 ? "Cr" : "Dr"}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Remove focus outline from buttons */}
      <style jsx>{`
        .no-focus-outline:focus {
          outline: none !important;
          box-shadow: none !important;
        }
          
      `}</style>


      {/* 👉 Transaction Count Table (Below Back Button Row) */}
      {showCountTable && (
        <Card className="mt-3 mb-3 ">
          <Card.Body>
            <h5 className="mb-3">Transaction Summary</h5>
            <div className="table-responsive">
              <Table striped hover bordered className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Transaction Type</th>
                    <th className="text-center">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Count voucher types
                    const voucherTypeCounts = {};
                    const typeMap = {
                      Invoice: "Purchase",
                      Payment: "Payment",
                      Return: "Purchase Return",
                      Opening: "Opening Balance",
                    };

                    processedData.forEach((entry) => {
                      const displayType = typeMap[entry.voucherType] || entry.voucherType;
                      voucherTypeCounts[displayType] = (voucherTypeCounts[displayType] || 0) + 1;
                    });

                    // All possible types
                    const allTypes = [
                      "Opening Balance",
                      "Purchase",
                      "Payment",
                      "Purchase Return",
                      "Receipt",
                      "Sales Return",
                      "Manufacturing",
                      "Stock Journal",
                      "Stock Adjustment",
                      "Banking",
                      "Journal"
                    ];

                    return allTypes.map((type) => {
                      const count = voucherTypeCounts[type] || 0;
                      return (
                        <tr key={type}>
                          <td className="py-2">

                            {type}

                          </td>
                          <td className="text-center fw-bold py-2 ">{count}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                <tfoot>
                  <tr className="bg-light fw-bold">
                    <td>Total Transactions</td>
                    <td className="text-center">{processedData.length}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

    </div>
  );
};

export default Ledgervendor;