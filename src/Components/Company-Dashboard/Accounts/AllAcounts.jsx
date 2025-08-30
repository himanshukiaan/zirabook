import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import { FaUserPlus, FaUserFriends } from "react-icons/fa";
import { FaEye, FaEdit, FaTrash, FaFileInvoice } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
// Mock API object for demonstration
const api = {
  get: async (url) => {
    if (url === "/accounts/parents") {
      return Promise.resolve({
        data: [
          { _id: "1", name: "Assets" },
          { _id: "2", name: "Liabilities" },
          { _id: "3", name: "Equity" },
          { _id: "4", name: "Income" },
          { _id: "5", name: "Expenses" },
        ],
      });
    }
    return Promise.resolve({ data: [] });
  },
  post: async (url, data) => {
    console.log("Mock API POST to", url, "with data:", data);
    return Promise.resolve({ data: { _id: Date.now().toString(), ...data } });
  },
};

const accountData = [
  // Existing accounts (keep these below)
  {
    type: "Cash-in-hand",
    rows: [
      { name: "Main Cash Drawer", bal: "15000.00" },
      { name: "Petty Cash", bal: "2500.00" },
      { name: "Office Cash", bal: "3200.50" },
    ],
  },
  {
    type: "Bank A/Cs",
    rows: [
      { name: "HDFC Current Account", bal: "250000.00" },
      { name: "SBI Savings Account", bal: "180000.75" },
      { name: "ICICI Business Account", bal: "120500.25" },
    ],
  },

  {
    type: "Sundry Debtors",
    rows: [
      { name: "Suzhou Yaowang Textile Co LTD", bal: "0.00" },
      { name: "T and C Corporation / Mr Yoo", bal: "20520.896" },
      { name: "Vidish Exports / Shami Vejay", bal: "17751.835" },
      { name: "Zhejiang Shaoxing Longhong Textile Co LTD", bal: "0.00" },
    ],
  },
  {
    type: "Sundry Creditors",
    rows: [
      { name: "Zhejiang Textile Import & Export Co LTD", bal: "15000.00" },
      { name: "Guangzhou Fabric Suppliers", bal: "28500.75" },
      { name: "DyeChem Industries", bal: "9800.50" },
      { name: "Suzhou Packaging Solutions", bal: "0.00" },
    ],
  },
  {
    type: "Purchases A/C",
    rows: [
      { name: "Raw Material Purchase", bal: "450000.00" },
      { name: "Fabric Procurement", bal: "200000.00" },
      { name: "Dye & Chemicals", bal: "104685.014" },
    ],
  },

  {
    type: "Purchases Return",
    rows: [
      { name: "Return to Supplier A", bal: "5000.00" },
      { name: "Defective Goods Return", bal: "2000.00" },
      { name: "Overstock Return", bal: "1000.00" },
    ],
  },

  {
    type: "Sales A/C",
    rows: [
      { name: "Export Sales", bal: "200.000" },
      { name: "Domestic Sales", bal: "150.000" },
      { name: "Online Store Sales", bal: "20.000" },
    ],
  },

  {
    type: "Sales Return",
    rows: [
      { name: "Customer A Return", bal: "50.00" },
      { name: "Damaged Goods Return", bal: "30.00" },
      { name: "Wrong Item Return", bal: "10.00" },
    ],
  },

  {
    type: "Capital A/C",
    rows: [
      { name: "Owner's Capital", bal: "500000.00" },
      { name: "Partner's Contribution", bal: "200000.00" },
      { name: "Profit & Loss A/c", bal: "-17103.849" }, // Loss
    ],
  },

  {
    type: "Direct Expenses",
    rows: [
      { name: "Cartage", bal: "8000.00" },
      { name: "Freight Charge", bal: "20225.172" },
      { name: "Discount given", bal: "12000.00" },
    ],
  },

  {
    type: "Indirect Expenses",
    rows: [
      { name: "Rent paid", bal: "15000.00" },
      { name: "Advertisement expenses", bal: "8000.00" },
      { name: "Office Electricity", bal: "3500.00" },
    ],
  },

  // New account types
  {
    type: "Current Assets",
    rows: [
      { name: "Cash-in-hand", bal: "20700.50" },
      { name: "Accounts Receivable", bal: "38272.731" },
      { name: "Inventory", bal: "150000.00" },
    ],
  },

  {
    type: "Current Liabilities",
    rows: [
      { name: "Accounts Payable", bal: "45000.00" },
      { name: "Short-term Loan", bal: "25000.00" },
      { name: "Accrued Expenses", bal: "5000.00" },
    ],
  },

  {
    type: "Misc. Expenses",
    rows: [
      { name: "Miscellaneous Expense", bal: "1200.00" },
      { name: "Stationery & Supplies", bal: "800.00" },
      { name: "Courier Charges", bal: "600.00" },
    ],
  },

  {
    type: "Misc. Income",
    rows: [
      { name: "Interest Income", bal: "2500.00" },
      { name: "Late Fee Received", bal: "300.00" },
      { name: "Miscellaneous Income", bal: "450.00" },
    ],
  },

  {
    type: "Loans (Liability)",
    rows: [
      { name: "Long-term Loan", bal: "500000.00" },
      { name: "Bank Loan", bal: "300000.00" },
      { name: "Loan from Director", bal: "200000.00" },
    ],
  },

  {
    type: "Loans & Advances",
    rows: [
      { name: "Loan to Employee", bal: "25000.00" },
      { name: "Advance to Supplier", bal: "15000.00" },
      { name: "Loan & Advance", bal: "10000.00" },
    ],
  },

  {
    type: "Fixed Assets",
    rows: [
      { name: "Machinery", bal: "800000.00" },
      { name: "Office Furniture", bal: "75000.00" },
      { name: "Fixed Asset", bal: "25000.00" },
    ],
  },

  {
    type: "Investments",
    rows: [
      { name: "Mutual Funds", bal: "120000.00" },
      { name: "Fixed Deposit", bal: "200000.00" },
      { name: "Investment", bal: "80000.00" },
    ],
  },

  {
    type: "Bank OD A/C",
    rows: [
      { name: "HDFC Overdraft", bal: "50000.00" },
      { name: "SBI OD Account", bal: "30000.00" },
      { name: "Bank OD", bal: "20000.00" },
    ],
  },

  {
    type: "Deposits (Assets)",
    rows: [
      { name: "Security Deposit - Office", bal: "25000.00" },
      { name: "Refundable Deposit", bal: "15000.00" },
      { name: "Deposit", bal: "10000.00" },
    ],
  },

  {
    type: "Provisions",
    rows: [
      { name: "Provision for Tax", bal: "18000.00" },
      { name: "Provision for Doubtful Debts", bal: "5000.00" },
      { name: "Provision", bal: "2000.00" },
    ],
  },

  {
    type: "Reserves & Surplus",
    rows: [
      { name: "General Reserve", bal: "100000.00" },
      { name: "Retained Earnings", bal: "75000.00" },
      { name: "Reserve & Surplus", bal: "25000.00" },
    ],
  },
];

const AllAccounts = () => {
  // Get unique account types from accountData
  const navigate = useNavigate();
  const accountTypes = [...new Set(accountData.map((acc) => acc.type))];

  const allowedCustomerAccountNames = [
    "Cash in Hand",
    "Bank Account",
    "Accounts Receivable",
  ];
// Define parent-to-children mapping based on your images
const [parentToChildren, setParentToChildren] = useState({
  "Assets": ["Cash-in-hand", "Bank A/Cs", "Sundry Debtors", "Current Assets", "Fixed Assets", "Investments", "Bank OD A/C", "Deposits (Assets)"],
  "Liabilities": ["Sundry Creditors", "Current Liabilities", "Loans (Liability)", "Loans & Advances", "Provisions"],
  "Income": ["Purchases A/C", "Purchases Return", "Sales A/C", "Sales Return", "Misc. Income"],
  "Expenses": ["Capital A/C", "Direct Expenses", "Indirect Expenses", "Misc. Expenses"]
});
  // State declarations
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showMainAccountModal, setShowMainAccountModal] = useState(false);
  const [mainAccountName, setMainAccountName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [newParentName, setNewParentName] = useState(""); // ✅ Add this line
  const [vendorFormData, setVendorFormData] = useState({
    name: "",
    nameArabic: "",
    companyName: "",
    companyLocation: "",
    idCardImage: null,
    extraFile: null,
    accountType: "Sundry Creditors",
    accountName: "",
    balanceType: "Credit",
    accountBalance: "0.00",
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
  const [customerFormData, setCustomerFormData] = useState({
    gstin: "",
    gstEnabled: true,
    name: "",
    nameArabic: "",
    companyName: "",
    companyLocation: "",
    idCardImage: null,
    extraFile: null,
    accountType: "Sundry Debtors",
    accountName: "",
    balanceType: "Debit",
    accountBalance: "0.00",
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
    // gstin: "",
    gstType: "Registered",
    taxEnabled: true,
    taxNumber: "",
  });
  const [accountType, setAccountType] = useState("Sundry Creditors");
  const [isTaxEnabled, setIsTaxEnabled] = useState(true);
  const [taxNumber, setTaxNumber] = useState("TAX123456");
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [newAccountData, setNewAccountData] = useState({
    type: "",
    name: "",
    bankAccountNumber: "",
    bankIFSC: "",
    bankNameBranch: "",
    parentId: "",
    balance: "0.00",
    phone: "",
    email: "",
    isDefault: false,
  });
  const [parentAccounts, setParentAccounts] = useState([]);
  const [loadingParentAccounts, setLoadingParentAccounts] = useState(false);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [ledgerAccount, setLedgerAccount] = useState(null);

  useEffect(() => {
    const fetchParentAccounts = async () => {
      setLoadingParentAccounts(true);
      try {
        const response = await api.get("/accounts/parents");
        setParentAccounts(response.data);
      } catch (error) {
        console.error("Failed to fetch parent accounts:", error);
      } finally {
        setLoadingParentAccounts(false);
      }
    };

    fetchParentAccounts();
  }, []);

  // Handlers
  const handleSaveVendor = () => {
    console.log("Vendor Saved:", vendorFormData);
    setShowVendorModal(false);
  };
  const handleSaveCustomer = () => {
    console.log("Customer Saved:", customerFormData);
    setShowCustomerModal(false);
  };

  const handleViewAccount = (type, name) => {
    setSelectedAccount({ type, name });
    setShowView(true);
  };
  const handleEditAccount = (type, name) => {
    // Find the actual row to get the balance
    const accountGroup = accountData.find((acc) => acc.type === type);
    const row = accountGroup?.rows.find((r) => r.name === name);

    setSelectedAccount({
      type,
      name,
      balance: row ? parseFloat(row.bal) : 0,
    });
    setShowEdit(true);
  };
  const handleDeleteAccount = (type, name) => {
    setSelectedAccount({ type, name });
    setShowDelete(true);
  };
  const handleViewLedger = (type, name) => {
    navigate("/company/ledgerpageaccount", {
      state: { accountName: name, accountType: type },
    });
  };
  // Filter account data based on filterName
  const filteredAccountData = accountData.filter((accountGroup) => {
    const typeMatches = accountGroup.type
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const nameMatches = accountGroup.rows.some((row) =>
      row.name.trim().toLowerCase().includes(filterName.toLowerCase())
    );
    return typeMatches || nameMatches;
  });

  // Add this function to calculate total balance for each account type
  const calculateTotalBalance = (accountGroup) => {
    return accountGroup.rows
      .filter((row) => row.name.trim() !== "")
      .reduce((total, row) => {
        const bal = parseFloat(row.bal) || 0;
        return total + bal;
      }, 0);
  };
  const handleAddNewParent = () => {
    // Prevent empty names
    if (!newParentName.trim()) return;
  
    // Update the parentToChildren state
    setParentToChildren(prev => ({
      ...prev,
      [newParentName]: [] // Initialize with empty array of account types
    }));
  
    // Optionally, set the newly created parent as selected
    setNewAccountData(prev => ({
      ...prev,
      parentType: newParentName
    }));
  
    // Reset input and close modal
    setNewParentName("");
    setShowAddParentModal(false);
  };
  return (
    <Container fluid className="p-3">
      {/* Header Row */}

      {/* Header Row - Responsive & Safe on All Devices */}
      <Row className="align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <Col xs={12} md="auto">
          <h4
            className="fw-bold text-start mb-2 mb-md-0"
            style={{ marginTop: "1rem" }}
          >
            All Accounts
          </h4>
        </Col>
        <Col
          xs={12}
          md="auto"
          className="d-flex flex-wrap gap-2 justify-content-end"
        >
          <Button
            style={{
              backgroundColor: "#53b2a5",
              border: "none",
              padding: "8px 16px",
            }}
            className="d-flex align-items-center gap-2 text-white fw-semibold flex-shrink-0"
            onClick={() => setShowNewAccountModal(true)}
          >
            + Add New Account
          </Button>
          <Button
            style={{
              backgroundColor: "#53b2a5",
              border: "none",
              padding: "8px 16px",
            }}
            className="d-flex align-items-center gap-2 text-white fw-semibold flex-shrink-0"
            onClick={() => setShowVendorModal(true)}
          >
            <FaUserPlus size={18} />
            Add Vendor
          </Button>
          <Button
            style={{
              backgroundColor: "#53b2a5",
              border: "none",
              padding: "8px 16px",
            }}
            className="d-flex align-items-center gap-2 text-white fw-semibold flex-shrink-0"
            onClick={() => setShowCustomerModal(true)}
          >
            <FaUserFriends />
            Add Customer
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-3 mb-3 align-items-end">
        <Form.Group>
          <Form.Label>Filter by Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search account name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            style={{ minWidth: "200px" }}
          />
        </Form.Group>
        <Button
          variant="secondary"
          onClick={() => {
            setFilterName("");
          }}
          className="mt-auto"
        >
          Clear
        </Button>
      </div>

      {/* Table */}
      <div className="table-responsive" style={{ minWidth: "100%" }}>
        <Table bordered hover className="align-middle text-center mb-0">
          <thead
            className="table-light"
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <tr>
              <th>Account Type</th>
              <th>Account Name</th>
              <th>Account Balance</th>
              <th>Total Balance</th>
              <th>Actions</th> {/* New Header */}
            </tr>
          </thead>
          <tbody>
            {filteredAccountData.map((accountGroup) => {
              const totalBalance = calculateTotalBalance(accountGroup);
              return (
                <React.Fragment key={accountGroup.type}>
                  {/* Group Heading */}
                  <tr className="bg-light">
                    <td colSpan="5" className="text-start fw-bold">
                      {accountGroup.type}
                    </td>
                  </tr>
                  {/* Account Rows */}
                  {accountGroup.rows
                    .filter((row) => row.name.trim() !== "")
                    .map((row, index) => (
                      <tr key={`${accountGroup.type}-${index}`}>
                        <td className="text-start">{accountGroup.type}</td>
                        <td className="text-start">{row.name}</td>
                        <td>{parseFloat(row.bal).toFixed(2)}</td>
                        <td></td>
                        {/* Actions Column */}
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="View"
                              onClick={() =>
                                handleViewAccount(accountGroup.type, row.name)
                              }
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              title="Edit"
                              onClick={() =>
                                handleEditAccount(accountGroup.type, row.name)
                              }
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Delete"
                              onClick={() =>
                                handleDeleteAccount(accountGroup.type, row.name)
                              }
                            >
                              <FaTrash />
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              title="View Ledger"
                              onClick={() =>
                                handleViewLedger(accountGroup.type, row.name)
                              }
                            >
                              View Ledger
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {/* Total Balance Row */}
                  {totalBalance !== 0 && (
                    <tr className="bg-light font-weight-bold">
                      <td colSpan="3" className="text-end">
                        Total Balance
                      </td>
                      <td className="text-end">
                        {totalBalance >= 0
                          ? totalBalance.toFixed(2)
                          : `(${Math.abs(totalBalance).toFixed(2)})`}
                      </td>
                      <td></td> {/* Empty cell for Actions column */}
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
      {/* Vendor Modal */}
      <Modal
        show={showVendorModal}
        onHide={() => setShowVendorModal(false)}
        size="xl"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Add Vendor</Modal.Title>
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
                      setVendorFormData({
                        ...vendorFormData,
                        name: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        nameArabic: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        companyLocation: e.target.value,
                      })
                    }
                    placeholder="Add Location"
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
                      setVendorFormData({
                        ...vendorFormData,
                        idCardImage: e.target.files[0],
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        extraFile: e.target.files[0],
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              {/* Account Type Field - Non-editable */}
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
                      setVendorFormData({
                        ...vendorFormData,
                        accountName: e.target.value,
                      })
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
                        accountBalance: value || "0.00", // डिफ़ॉल्ट 0.00
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
                      setVendorFormData({
                        ...vendorFormData,
                        creationDate: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        bankAccountNumber: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        bankIFSC: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        bankName: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        country: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        state: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        pincode: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        address: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        stateCode: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        shippingAddress: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        phone: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        email: e.target.value,
                      })
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
                      setVendorFormData({
                        ...vendorFormData,
                        creditPeriod: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  {/* GSTIN Field (conditionally rendered) */}
                  {vendorFormData.gstEnabled && (
                    <div className="flex-grow-1 me-3">
                      <Form.Label>GSTIN</Form.Label>
                      <Form.Control
                        type="text"
                        value={vendorFormData.gstin}
                        onChange={(e) =>
                          setVendorFormData({
                            ...vendorFormData,
                            gstin: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  {/* On/Off Toggle */}
                  <div>
                    <Form.Label className="me-2">Enable GST</Form.Label>
                    <Form.Check
                      type="switch"
                      id="gstin-toggle"
                      checked={vendorFormData.gstEnabled}
                      onChange={(e) =>
                        setVendorFormData({
                          ...vendorFormData,
                          gstEnabled: e.target.checked,
                          gstin: e.target.checked ? vendorFormData.gstin : "", // disable hote hi clear
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
          <Button variant="secondary" onClick={() => setShowVendorModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#53b2a5", border: "none" }}
            onClick={handleSaveVendor}
          >
            Save Vendor
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Customer Modal */}
      <Modal
        show={showCustomerModal}
        onHide={() => setShowCustomerModal(false)}
        size="xl"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Name (English)</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.name}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Name (Arabic)</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.nameArabic}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        nameArabic: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.companyName}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
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
                    value={customerFormData.companyLocation}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        companyLocation: e.target.value,
                      })
                    }
                    placeholder="Add Location"
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
                      setCustomerFormData({
                        ...customerFormData,
                        idCardImage: e.target.files[0],
                      })
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
                      setCustomerFormData({
                        ...customerFormData,
                        extraFile: e.target.files[0],
                      })
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
                    value="Sundry Debtors"
                    readOnly
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
                    value="Debit"
                    readOnly
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
                    value={customerFormData.accountName}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        accountName: e.target.value,
                      })
                    }
                    placeholder="e.g., Customer A"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Account Balance</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={customerFormData.accountBalance}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomerFormData({
                        ...customerFormData,
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
                    value={customerFormData.creationDate}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        creationDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.bankAccountNumber}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        bankAccountNumber: e.target.value,
                      })
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
                    value={customerFormData.bankIFSC}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        bankIFSC: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank Name & Branch</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.bankName}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        bankName: e.target.value,
                      })
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
                    value={customerFormData.country}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        country: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.state}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        state: e.target.value,
                      })
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
                    value={customerFormData.pincode}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        pincode: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.address}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        address: e.target.value,
                      })
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
                    value={customerFormData.stateCode}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        stateCode: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerFormData.shippingAddress}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        shippingAddress: e.target.value,
                      })
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
                    value={customerFormData.phone}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        phone: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={customerFormData.email}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        email: e.target.value,
                      })
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
                    value={customerFormData.creditPeriod}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        creditPeriod: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  {/* GSTIN field only when enabled */}
                  {customerFormData.gstEnabled && (
                    <div className="flex-grow-1 me-3">
                      <Form.Label>GSTIN</Form.Label>
                      <Form.Control
                        type="text"
                        value={customerFormData.gstin}
                        onChange={(e) =>
                          setCustomerFormData({
                            ...customerFormData,
                            gstin: e.target.value,
                          })
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
                      checked={customerFormData.gstEnabled}
                      onChange={(e) =>
                        setCustomerFormData({
                          ...customerFormData,
                          gstEnabled: e.target.checked,
                          gstin: e.target.checked ? customerFormData.gstin : "", // optional: off karte hi clear
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
          <Button
            variant="secondary"
            onClick={() => setShowCustomerModal(false)}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#53b2a5", border: "none" }}
            onClick={handleSaveCustomer}
          >
            Save Customer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Account Modal */}
      <Modal
        show={showNewAccountModal}
        onHide={() => setShowNewAccountModal(false)}
        centered
        backdrop="static"
        size="xl"
        dialogClassName="w-100"
      >
        <div>
          <Modal.Header
            closeButton
            className="bg-light d-flex justify-content-between align-items-center "
          >
            <Modal.Title className="m-2">Add New Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>

                {/* Step 1: Select Parent Account */}
<Form.Group className="mb-3">
<div className="d-flex align-items-center justify-content-between mb-1">
  <Form.Label className="mb-0" style={{ whiteSpace: "nowrap" }}>
    Select Parent Account
  </Form.Label>
  <Button 
    size="sm" 
    onClick={() => setShowAddParentModal(true)} 
    style={{
      backgroundColor: "#53b2a5",
      border: "none",
      padding: "8px 16px",
    }}
  >
    + Add Parent
  </Button>
</div>
  <Form.Select
    value={newAccountData.parentType}
    onChange={(e) => {
      const parent = e.target.value;
      setNewAccountData({
        ...newAccountData,
        parentType: parent,
        type: "",
        name: ""
      });
    }}
  >
    <option value="">-- Select Parent --</option>
    {Object.keys(parentToChildren).map((parent) => (
      <option key={parent} value={parent}>
        {parent}
      </option>
    ))}
  </Form.Select>
</Form.Group>

              {/* Account Type Dropdown */}
              <Form.Group className="mb-3">
                <div className="text-end mb-2">
                  {/* 👇 Extra Button */}
        
                </div>
                <Form.Label>Account Type</Form.Label>

                <Form.Select
                  value={newAccountData.type}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setNewAccountData({
                      ...newAccountData,
                      type: selectedType,
                      name: "", // reset name when type changes
                    });
                  }}
                >
                  <option value="">Select Account Type</option>
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Account Name Input (changed from dropdown) */}
              <Form.Group className="mb-3">
                <Form.Label>Account Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newAccountData.name}
                  onChange={(e) =>
                    setNewAccountData({
                      ...newAccountData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter account name"
                />
              </Form.Group>

              {/* Conditional: Show Email & Phone only for Sundry Debtors or Sundry Creditors */}
              {newAccountData.type === "Sundry Debtors" ||
              newAccountData.type === "Sundry Creditors" ? (
                <>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          value={newAccountData.phone || ""}
                          onChange={(e) =>
                            setNewAccountData({
                              ...newAccountData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Enter phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={newAccountData.email || ""}
                          onChange={(e) =>
                            setNewAccountData({
                              ...newAccountData,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter email address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              ) : null}
              {/* Bank Toggle */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  label="Add Bank Details"
                  checked={showBankDetails}
                  onChange={() => setShowBankDetails(!showBankDetails)}
                />
              </Form.Group>

              {/* Bank Fields */}
              {showBankDetails && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={newAccountData.bankAccountNumber}
                      onChange={(e) =>
                        setNewAccountData({
                          ...newAccountData,
                          bankAccountNumber: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>IFSC Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={newAccountData.bankIFSC}
                      onChange={(e) =>
                        setNewAccountData({
                          ...newAccountData,
                          bankIFSC: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Bank Name & Branch</Form.Label>
                    <Form.Control
                      type="text"
                      value={newAccountData.bankNameBranch}
                      onChange={(e) =>
                        setNewAccountData({
                          ...newAccountData,
                          bankNameBranch: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowNewAccountModal(false)}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "#53b2a5",
                border: "none",
                padding: "8px 16px",
              }}
              onClick={async () => {
                try {
                  await api.post("/accounts", newAccountData);
                  setShowNewAccountModal(false);
                } catch (error) {
                  console.error("Failed to save new account:", error);
                }
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Add Parent Account Modal */}
<Modal
  show={showAddParentModal}
  onHide={() => {
    setShowAddParentModal(false);
    setNewParentName("");
  }}
  centered
  backdrop="static"
>
  <Modal.Header closeButton>
    <Modal.Title>Add Parent Account</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Control
      type="text"
      value={newParentName} // ✅ Now defined
      onChange={(e) => setNewParentName(e.target.value)} // ✅ Now defined
      placeholder="Enter new parent name"
    />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => {
      setShowAddParentModal(false);
      setNewParentName("");
    }}>
      Cancel
    </Button>
    <Button

      onClick={handleAddNewParent}
      disabled={!newParentName.trim()}
      style={{ backgroundColor: "#53b2a5", border: "none" }}
    >
      Add Parent
    </Button>
  </Modal.Footer>
</Modal>
    

      {/* View Account Modal */}
      <Modal show={showView} onHide={() => setShowView(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAccount && (
            <div>
              <p>
                <strong>Account Type:</strong> {selectedAccount.type}
              </p>
              <p>
                <strong>Account Name:</strong> {selectedAccount.name}
              </p>
              <p>
                <strong>Balance:</strong>{" "}
                {parseFloat(selectedAccount.balance || 0).toFixed(2)}
              </p>
              <p>
                <strong>Total Balance:</strong>{" "}
                {calculateTotalBalance(
                  accountData.find((acc) => acc.type === selectedAccount.type)
                )}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowView(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAccount && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Account Type</Form.Label>
                <Form.Select
                  value={selectedAccount.type || ""}
                  onChange={(e) =>
                    setSelectedAccount((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select account type
                  </option>
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Account Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAccount.name || ""}
                  onChange={(e) =>
                    setSelectedAccount((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Account Balance</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={selectedAccount.balance || 0}
                  onChange={(e) =>
                    setSelectedAccount((prev) => ({
                      ...prev,
                      balance: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#53b2a5", border: "none" }}
            onClick={() => {
              // Update the actual accountData (mock update)
              setAccountData((prev) =>
                prev.map((group) => {
                  if (group.type === selectedAccount.type) {
                    return {
                      ...group,
                      rows: group.rows.map((row) => {
                        if (row.name === selectedAccount.name) {
                          return {
                            ...row,
                            name: selectedAccount.name,
                            bal: selectedAccount.balance.toFixed(2),
                          };
                        }
                        return row;
                      }),
                    };
                  }
                  return group;
                })
              );

              console.log("Account updated:", selectedAccount);
              setShowEdit(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAccount && (
            <p>
              Are you sure you want to delete the account "
              {selectedAccount.name}" ({selectedAccount.type})? This action
              cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log("Account deleted:", selectedAccount);
              setShowDelete(false);
            }}
          >
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Page Description */}
      <Card className="mb-4 p-3 shadow rounded-4 mt-2">
        <Card.Body>
          <h5 className="fw-semibold border-bottom pb-2 mb-3 text-primary">
            Page Info
          </h5>
          <ul
            className="text-muted fs-6 mb-0"
            style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}
          >
            <li>Displays all financial accounts.</li>
            <li>Accounts are categorized by type.</li>
            <li>Helps in easy management and tracking.</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllAccounts;

// Helper function for Google Maps link (placeholder)
// function getGoogleMapsLink(companyName) {
//   return `https://maps.google.com/?q=${encodeURIComponent(companyName)}`;
// }
