import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFilter, FaCalendarAlt, FaSearch, FaUndo, FaFileExport, FaFilePdf } from "react-icons/fa";
import { Button, Card, Row, Col, Form, InputGroup, Table, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Ledgercustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCustomer = location.state?.customer;

  // ✅ Dummy default customer (fallback) — needed by both versions
  const defaultCustomer = {
    name: "Demo Customer",
    email: "demo@email.com",
    phone: "9999999999",
    address: "Indore, MP",
    gst: "22AAAAA0000A1Z5",
    openingBalance: 5000,
  };

  // Use passed customer or fallback
  const customer = passedCustomer || defaultCustomer;

  const [ledgerType, setLedgerType] = useState("customer");
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-04-30");
  const [balanceType, setBalanceType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [voucherTypeFilter, setVoucherTypeFilter] = useState("all");
  const [showNarration, setShowNarration] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false); // Toggle state

  const [expandedRows, setExpandedRows] = useState({});
  const [showCountTable, setShowCountTable] = useState(false);

  // 🆕 Voucher States (merged from 200+ lines file)
  const [manualVoucherNo, setManualVoucherNo] = useState("");
  const [autoVoucherNo] = useState("VCH-" + Date.now());

  // Dummy Data with Narration
  const ledgerData = [
    // Opening Balance - Dynamic based on customer.openingBalance
    {
      id: 1,
      date: "2025-04-01",
      particulars: "Opening Balance",
      narration: "Initial opening balance carried forward",
      voucherNo: "--",
      voucherType: "Opening",
      debit: customer.openingBalance > 0 ? customer.openingBalance : 0,
      credit: customer.openingBalance < 0 ? Math.abs(customer.openingBalance) : 0,
      items: [],
    },

    // Sales Invoice
    {
      id: 2,
      date: "2025-04-03",
      particulars: ledgerType === "customer" ? "Sales Invoice INV101" : "Purchase Invoice INV501",
      narration:
        ledgerType === "customer"
          ? "Goods sold on credit to Ravi Traders"
          : "Raw material purchased from Sharma Suppliers",
      voucherNo: "INV101",
      voucherType: "Invoice",
      debit: ledgerType === "customer" ? 10000 : 0,
      credit: ledgerType === "vendor" ? 12000 : 0,
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

    // Payment / Receipt
    {
      id: 3,
      date: "2025-04-07",
      particulars: "Payment / Receipt",
      narration:
        ledgerType === "customer"
          ? "Payment received against invoice INV101"
          : "Payment made for purchase",
      voucherNo: ledgerType === "customer" ? "RC001" : "PY001",
      voucherType: "Payment",
      debit: ledgerType === "vendor" ? 10000 : 0,
      credit: ledgerType === "customer" ? 5000 : 0,
      items: [],
    },

    // Return
    {
      id: 4,
      date: "2025-04-12",
      particulars: "Return",
      narration: "Returned damaged goods",
      voucherNo: ledgerType === "customer" ? "CN001" : "DN001",
      voucherType: "Return",
      debit: ledgerType === "vendor" ? 2000 : 0,
      credit: ledgerType === "customer" ? 1000 : 0,
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

    // Second Sales Invoice
    {
      id: 5,
      date: "2025-04-15",
      particulars: "Sales Invoice INV102",
      narration: "Second sale of cotton fabric",
      voucherNo: "INV102",
      voucherType: "Invoice",
      debit: 7500,
      credit: 0,
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
      particulars: "Payment Received",
      narration: "Partial payment received",
      voucherNo: "RC002",
      voucherType: "Payment",
      debit: 0,
      credit: 3000,
      items: [],
    },
  ];

  // Filter and process data
  const filteredData = useMemo(() => {
    let filtered = [...ledgerData];

    // (Filters placeholder: date/voucherType/search/balanceType — as per your 700+ file)

    let runningBalance = customer.openingBalance || 0;
    return filtered.map((e) => {
      runningBalance += (e.debit || 0) - (e.credit || 0);
      const balType = runningBalance >= 0 ? "Dr" : "Cr";
      return {
        ...e,
        balance: `${Math.abs(runningBalance).toLocaleString("en-IN", { style: "currency", currency: "INR" })} ${balType}`,
        balanceValue: runningBalance,
        balanceType: balType,
      };
    });
  }, [ledgerData, fromDate, toDate, balanceType, searchQuery, voucherTypeFilter, customer.openingBalance]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, e) => {
        acc.totalDebit += e.debit || 0;
        acc.totalCredit += e.credit || 0;
        return acc;
      },
      { totalDebit: 0, totalCredit: 0 }
    );
  }, [filteredData]);

  const currentBalance = useMemo(() => {
    return filteredData.length > 0 ? filteredData[filteredData.length - 1].balanceValue : 0;
  }, [filteredData]);

  const resetFilters = () => {
    setFromDate("2025-04-01");
    setToDate("2025-04-30");
    setBalanceType("all");
    setVoucherTypeFilter("all");
    setSearchQuery("");
  };

  const exportToExcel = () => alert("Export to Excel");
  const exportToPDF = () => alert("Export to PDF");

  const hasItems = filteredData.some((e) => e.items.length > 0);

  return (
    <div className="container mt-4">
      {/* 🔝 Top Bar: Back + Chip-Style Action Buttons */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        {/* Back Button */}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="d-flex align-items-center px-3 py-1"
        >
          <span className="me-1">←</span> Back to Customers
        </Button>

        {/* 1. View Customer Details */}
        <Button
          size="sm"
          className="py-1 px-3 border"
          style={{
            backgroundColor: showCustomerDetails ? "#53b2a5" : "#e9f7f5",
            color: showCustomerDetails ? "white" : "#53b2a5",
            borderColor: "#53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
          onClick={() => setShowCustomerDetails(!showCustomerDetails)}
        >
          {showCustomerDetails ? "✅ Details" : "🔍 Details"}
        </Button>

        {/* 2. View Item Details */}
        <Button
          size="sm"
          className="py-1 px-3 border"
          disabled={!hasItems}
          style={{
            backgroundColor:
              !hasItems ? "#cccccc" : expandedRows && Object.keys(expandedRows).length > 0 ? "#53b2a5" : "#e9f7f5",
            color: !hasItems ? "#666" : expandedRows && Object.keys(expandedRows).length > 0 ? "white" : "#53b2a5",
            borderColor: "#53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
          onClick={() => {
            const anyExpanded = Object.values(expandedRows).some(Boolean);
            if (anyExpanded) {
              setExpandedRows({});
            } else {
              const newExpanded = {};
              filteredData.forEach((e) => {
                if (e.items.length > 0) newExpanded[e.id] = true;
              });
              setExpandedRows(newExpanded);
            }
          }}
        >
          📦 {expandedRows && Object.keys(expandedRows).length > 0 ? "Hide Items" : "Items Details"}
        </Button>

        {/* 3. Show Transaction Count */}
        <Button
          variant="warning"
          size="sm"
          onClick={() => setShowCountTable((prev) => !prev)}
          style={{
            backgroundColor: showCustomerDetails ? "#53b2a5" : "#e9f7f5",
            color: showCustomerDetails ? "white" : "#53b2a5",
            borderColor: "#53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
        >
          {showCountTable ? "Hide Count" : "Count of Transaction"}
        </Button>

        {/* 5. Send Ledger Button */}
        <Button
          size="sm"
          className="py-1 px-3 border"
          style={{
            backgroundColor: showNarration ? "#53b2a5" : "#e9f7f5",
            color: showNarration ? "white" : "#53b2a5",
            borderColor: "#53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
        >
          📤 Send
        </Button>

        {/* 4. Show/Hide Narration */}
        <Button
          size="sm"
          className="py-1 px-3 border"
          style={{
            backgroundColor: showNarration ? "#53b2a5" : "#e9f7f5",
            color: showNarration ? "white" : "#53b2a5",
            borderColor: "#53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
          onClick={() => setShowNarration(!showNarration)}
        >
          {showNarration ? "❌ Hide" : "📝 Narration"}
        </Button>
      </div>

      {/* Customer Name */}
      <h4 className="mb-0 text-dark mb-2">
        {ledgerType === "customer" ? `Customer Ledger - ${customer.name}` : "Vendor Ledger - Sharma Suppliers"}
      </h4>

      {/* 🆕 Voucher No. Section (merged & placed right after the title) */}
      <Row className="mb-3">
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
            <Form.Control type="text" value={autoVoucherNo} readOnly style={{ backgroundColor: "#f9f9f9" }} />
          </Form.Group>
        </Col>
      </Row>

      {/* 👉 Customer Details (Clean border, no color, no hover, no focus) */}
      {showCustomerDetails && (
        <Card
          className="mt-3 mb-3"
          style={{
            backgroundColor: showNarration ? "#53b2a5" : "#e9f7f5",
            color: showNarration ? "white" : "#53b2a5",
            borderColor: "#53b2a5",
            fontWeight: 600,
            fontSize: "0.85rem",
            borderRadius: "20px",
          }}
        >
          <Card.Body className="p-3">
            <Row className="g-2">
              <Col md={4}>
                <strong>Name:</strong> {customer.name}
              </Col>
              <Col md={4}>
                <strong>Email:</strong> {customer.email}
              </Col>
              <Col md={4}>
                <strong>Phone:</strong> {customer.phone}
              </Col>
              <Col md={4}>
                <strong>Address:</strong> {customer.address}
              </Col>
              <Col md={4}>
                <strong>GSTIN:</strong> {customer.gst || "N/A"}
              </Col>
              <Col md={4}>
                <strong>Opening Balance:</strong> ₹{customer.openingBalance?.toLocaleString("en-IN") || "0"}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header className="text-white d-flex justify-content-between align-items-center">
          <Badge bg="light" text="dark" className="mt-2">
            {filteredData.length} transactions found
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
          <Row className="mb-4">
            <Col md={4}>
              <Card className="border-left-primary shadow h-100 py-2">
                <Card.Body>
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Debit</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totals.totalDebit.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
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
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Credit</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totals.totalCredit.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
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
              <Card className={`border-left-${currentBalance >= 0 ? "info" : "danger"} shadow h-100 py-2`}>
                <Card.Body>
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-uppercase mb-1">Current Balance</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {Math.abs(currentBalance).toLocaleString("en-IN", { style: "currency", currency: "INR" })}{" "}
                        {currentBalance >= 0 ? (ledgerType === "customer" ? "Dr" : "Cr") : (ledgerType === "customer" ? "Cr" : "Dr")}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className={`btn-circle btn-sm btn-${currentBalance >= 0 ? "info" : "danger"}`}>
                        {currentBalance >= 0 ? (ledgerType === "customer" ? "Dr" : "Cr") : (ledgerType === "customer" ? "Cr" : "Dr")}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="me-2"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="mb-4 bg-light">
              <Card.Body>
                <Row className="g-3">
                  <Col xs={12} sm={6} md={4}>
                    <Form.Group>
                      <Form.Label>From Date</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaCalendarAlt />
                        </InputGroup.Text>
                        <Form.Control
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={4}>
                    <Form.Group>
                      <Form.Label>To Date</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaCalendarAlt />
                        </InputGroup.Text>
                        <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={4}>
                    <Form.Group>
                      <Form.Label>Balance Type</Form.Label>
                      <Form.Select value={balanceType} onChange={(e) => setBalanceType(e.target.value)}>
                        <option value="all">All Transactions</option>
                        <option value="debit">Debit Only</option>
                        <option value="credit">Credit Only</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3 mt-2">
                  <Col xs={12} sm={6} md={6}>
                    <Form.Group>
                      <Form.Label>Voucher Type</Form.Label>
                      <Form.Select
                        value={voucherTypeFilter}
                        onChange={(e) => setVoucherTypeFilter(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="Invoice">Invoice</option>
                        <option value="Payment">Payment</option>
                        <option value="Return">Return</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={6}>
                    <Form.Group>
                      <Form.Label>Search</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by particulars, voucher no, or item..."
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

          {/* Ledger Table */}
          <div className="table-responsive">
            <Table striped hover>
              <thead className="table-light text-black">
                <tr>
                  <th>Date</th>
                  <th>Particulars</th>
                  <th>VCH NO</th>
                  <th>VCH TYPE</th>
                  <th className="text-end">Debit (Dr)</th>
                  <th className="text-end">Credit (Cr)</th>
                  <th className="text-end">Running Balance</th>
                  {showNarration && <th>Narration</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry) => (
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
                          style={{ minWidth: "120px" }}
                        >
                          <span className="me-2">
                            {entry.items && entry.items.length > 0 ? (expandedRows[entry.id] ? "▼" : "▶") : " "}
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
                            ? "Sales"
                            : entry.voucherType === "Payment"
                            ? "Receipt"
                            : entry.voucherType === "Return"
                            ? "Sales Return"
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
                      <td className={`text-end ${entry.balanceType === "Dr" ? "text-primary" : "text-success"}`}>
                        {entry.balance}
                      </td>

                      {/* Narration Column (Conditional) */}
                      {showNarration && (
                        <td className="text-muted small" style={{ maxWidth: "200px", whiteSpace: "normal" }}>
                          {entry.narration || "—"}
                        </td>
                      )}
                    </tr>

                    {/* Expandable Items Table (Only if items exist and row is expanded) */}
                    {entry.items && entry.items.length > 0 && expandedRows[entry.id] && (
                      <tr>
                        <td colSpan={showNarration ? 8 : 7} className="p-0" style={{ backgroundColor: "#f9f9f9" }}>
                          <div className="p-2 ps-4 bg-light border-top">
                            <Table size="sm" bordered className="mb-0 bg-white shadow-sm" style={{ fontSize: "0.85rem" }}>
                              <thead className="table-light">
                                <tr>
                                  <th>Item / Material</th>
                                  <th>Qty</th>
                                  <th>Rate (₹)</th>
                                  <th>Disc (%)</th>
                                  <th>Tax (%)</th>
                                  <th>Tax Amt (₹)</th>
                                  <th>Value (₹)</th>
                                  <th>Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entry.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="fw-bold">{item.item}</td>
                                    <td>{item.quantity}</td>
                                    <td>{parseFloat(item.rate).toFixed(3)}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.tax}</td>
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
                ))}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <td colSpan={showNarration ? "5" : "4"} className="text-end fw-bold">
                    Total
                  </td>
                  <td className="text-end fw-bold">
                    {totals.totalDebit.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </td>
                  <td className="text-end fw-bold">
                    {totals.totalCredit.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </td>
                  <td className="text-end fw-bold">
                    {Math.abs(currentBalance).toLocaleString("en-IN", { style: "currency", currency: "INR" })}{" "}
                    {currentBalance >= 0 ? (ledgerType === "customer" ? "Dr" : "Cr") : (ledgerType === "customer" ? "Cr" : "Dr")}
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

      {/* ✅ Transaction Count Table */}
      {showCountTable && (
        <Card className="mt-3 shadow-sm">
          <Card.B ody>
            <h5 className="mb-3 text-warning">📊 Transaction Type Summary</h5>
            <div className="table-responsive">
              <Table striped hover bordered size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Transaction Type</th>
                    <th className="text-center">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Step 1: Count each voucher type
                    const counts = {};
                    filteredData.forEach((item) => {
                      const type = item.voucherType;
                      counts[type] = (counts[type] || 0) + 1;
                    });

                    // Step 2: All possible types (for full list)
                    const allTypes = [
                      "Opening Balance",
                      "Sales",
                      "Receipt",
                      "Sales Return",
                      "Purchase",
                      "Payment",
                      "Manufacturing",
                      "Stock Journal",
                      "Stock Adjustment",
                      "Banking",
                      "Journal",
                    ];

                    // Mapping our internal codes to labels used above
                    const labelMap = {
                      Opening: "Opening Balance",
                      Invoice: "Sales",
                      Payment: "Receipt",
                      Return: "Sales Return",
                    };

                    return allTypes.map((label) => {
                      // invert mapping to add counts properly
                      const countForLabel =
                        (label === "Opening Balance" ? counts["Opening"] || 0 : 0) +
                        (label === "Sales" ? counts["Invoice"] || 0 : 0) +
                        (label === "Receipt" ? counts["Payment"] || 0 : 0) +
                        (label === "Sales Return" ? counts["Return"] || 0 : 0);
                      return (
                        <tr key={label}>
                          <td className="fw-bold">{label}</td>
                          <td className="text-center">{countForLabel || 0}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                <tfoot>
                  <tr className="bg-light fw-bold">
                    <td>Total Transactions</td>
                    <td className="text-center">{filteredData.length}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Card.B>
        </Card>
      )}
    </div>
  );
};

export default Ledgercustomer;
