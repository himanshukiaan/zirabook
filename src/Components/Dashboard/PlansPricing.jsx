import React, { useState, useEffect } from "react";
import { BsListUl, BsPencilSquare, BsEye, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Button, Modal, Form, Card, Row, Col, Badge, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlansPricing.css";
import { BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";

// Available currencies
const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" }, // Added Indian Rupee
];

// Available modules with their default prices
const availableModules = [
  { id: "account", name: "Account", defaultPrice: 10 },
  { id: "inventory", name: "Inventory", defaultPrice: 5.00 },
  { id: "pos", name: "POS", defaultPrice: 10.00 },
  { id: "sales", name: "Sales", defaultPrice: 8.00 },
  { id: "purchase", name: "Purchase", defaultPrice: 8.00 },
  { id: "gst", name: "GST Report", defaultPrice: 12.00 },
  { id: "user", name: "User Management", defaultPrice: 15.00 }
];

const initialPlans = [
  {
    name: "Bronze",
    basePrice: 9.99,
    billing: "Monthly",
    status: "Active",
    subscribers: "1,243",
    descriptions: ["Basic access", "Community support", "Limited features"],
    selectedModules: [
      { id: "account", name: "Account", price: 0 } // Changed default price to 0
    ],
    invoiceLimit: 10,
    additionalInvoicePrice: 2.00,
    userLimit: 1,
    storageCapacity: 5, // Added storage capacity in GB
    currency: "USD" // Added currency
  },
  {
    name: "Silver",
    basePrice: 14.99,
    billing: "Monthly",
    status: "Active",
    subscribers: "857",
    descriptions: ["Priority email support", "Extended features", "Access to updates"],
    selectedModules: [
      { id: "account", name: "Account", price: 0 }, // Changed default price to 0
      { id: "inventory", name: "Inventory", price: 0 } // Changed default price to 0
    ],
    invoiceLimit: 50,
    additionalInvoicePrice: 1.50,
    userLimit: 3,
    storageCapacity: 20, // Added storage capacity in GB
    currency: "USD" // Added currency
  },
  {
    name: "Gold",
    basePrice: 24.99,
    billing: "Monthly",
    status: "Active",
    subscribers: "512",
    descriptions: ["All Silver features", "Advanced analytics", "Custom branding"],
    selectedModules: [
      { id: "account", name: "Account", price: 0 }, // Changed default price to 0
      { id: "inventory", name: "Inventory", price: 0 }, // Changed default price to 0
      { id: "pos", name: "POS", price: 0 }, // Changed default price to 0
      { id: "sales", name: "Sales", price: 0 } // Changed default price to 0
    ],
    invoiceLimit: 100,
    additionalInvoicePrice: 1.00,
    userLimit: 5,
    storageCapacity: 50, // Added storage capacity in GB
    currency: "USD" // Added currency
  },
  {
    name: "Platinum",
    basePrice: 49.99,
    billing: "Monthly",
    status: "Active",
    subscribers: "326",
    descriptions: ["All Gold features", "Dedicated account manager", "24/7 support"],
    selectedModules: [
      { id: "account", name: "Account", price: 0 }, // Changed default price to 0
      { id: "inventory", name: "Inventory", price: 0 }, // Changed default price to 0
      { id: "pos", name: "POS", price: 0 }, // Changed default price to 0
      { id: "sales", name: "Sales", price: 0 }, // Changed default price to 0
      { id: "purchase", name: "Purchase", price: 0 }, // Changed default price to 0
      { id: "gst", name: "GST Report", price: 0 }, // Changed default price to 0
      { id: "user", name: "User Management", price: 0 } // Changed default price to 0
    ],
    invoiceLimit: "unlimited",
    additionalInvoicePrice: 0.50,
    userLimit: "unlimited",
    storageCapacity: "unlimited", // Added storage capacity
    currency: "USD" // Added currency
  },
  {
    name: "Premium",
    basePrice: 999.00,
    billing: "Monthly",
    status: "Active",
    subscribers: "245",
    descriptions: ["All Platinum features", "Custom integrations", "24/7 dedicated support", "On-site training"],
    selectedModules: [
      { id: "account", name: "Account", price: 0 }, // Changed default price to 0
      { id: "inventory", name: "Inventory", price: 0 }, // Changed default price to 0
      { id: "pos", name: "POS", price: 0 }, // Changed default price to 0
      { id: "sales", name: "Sales", price: 0 }, // Changed default price to 0
      { id: "purchase", name: "Purchase", price: 0 }, // Changed default price to 0
      { id: "gst", name: "GST Report", price: 0 }, // Changed default price to 0
      { id: "user", name: "User Management", price: 0 } // Changed default price to 0
    ],
    invoiceLimit: "unlimited",
    additionalInvoicePrice: 0.00,
    userLimit: "unlimited",
    storageCapacity: "unlimited", // Added storage capacity
    currency: "INR" // Added Indian Rupee currency
  },
];

const badgeStyles = {
  Bronze: {
    backgroundImage: "linear-gradient(to right, #ad7c59, #cd7f32, #a97142)",
    color: "#fff",
    boxShadow: "0 0 6px rgba(173, 124, 89, 0.5)",
  },
  Silver: {
    backgroundImage: "linear-gradient(to right, #c0c0c0, #d8d8d8, #b0b0b0)",
    color: "#000",
    boxShadow: "0 0 6px rgba(192, 192, 192, 0.6)",
  },
  Gold: {
    backgroundImage: "linear-gradient(to right, #f5d76e, #ffd700, #e6be8a)",
    color: "#000",
    boxShadow: "0 0 6px rgba(255, 215, 0, 0.5)",
  },
  Platinum: {
    backgroundImage: "linear-gradient(to right, #e5e4e2, #f9f9fb, #cfd8dc)",
    color: "#000",
    boxShadow: "0 0 6px rgba(180, 200, 220, 0.5)",
  },
  Premium: {
    backgroundImage: "linear-gradient(to right, #FFD700, #FFA500, #FF8C00)",
    color: "#fff",
    boxShadow: "0 0 6px rgba(255, 140, 0, 0.5)",
  },
};

// Helper function to get currency symbol
const getCurrencySymbol = (currencyCode) => {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency ? currency.symbol : "$";
};

// Helper function to get currency name
const getCurrencyName = (currencyCode) => {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency ? currency.name : "US Dollar";
};

// Helper function to calculate total price based on selected modules and invoice limit
const calculateTotalPrice = (basePrice, selectedModules, currencyCode) => {
  let total = parseFloat(basePrice) || 0;
  selectedModules.forEach(module => {
    total += parseFloat(module.price) || 0;
  });
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${total.toFixed(2)}`;
};

// Helper function to format modules for display
const formatModulesForDisplay = (modules, currencyCode) => {
  if (!modules || modules.length === 0) {
    return <span className="text-muted">—</span>;
  }
  const symbol = getCurrencySymbol(currencyCode);
  const maxDisplay = 3;
  if (modules.length <= maxDisplay) {
    return (
      <div className="d-flex flex-wrap gap-1">
        {modules.map(module => (
          <Badge key={module.id} bg="secondary" className="me-1">
            {module.name} ({symbol}{parseFloat(module.price).toFixed(2)})
          </Badge>
        ))}
      </div>
    );
  }
  const displayedModules = modules.slice(0, 2);
  const remainingCount = modules.length - 2;
  return (
    <div className="d-flex flex-wrap gap-1">
      {displayedModules.map(module => (
        <Badge key={module.id} bg="secondary" className="me-1">
          {module.name} ({symbol}{parseFloat(module.price).toFixed(2)})
        </Badge>
      ))}
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-modules`}>
            {modules.slice(2).map(module => (
              <div key={module.id}>{module.name} ({symbol}{parseFloat(module.price).toFixed(2)})</div>
            ))}
          </Tooltip>
        }
      >
        <Badge bg="secondary" className="me-1">
          +{remainingCount} more
        </Badge>
      </OverlayTrigger>
    </div>
  );
};

// Helper function to format invoice limit for display
const formatInvoiceLimit = (limit) => {
  return limit === "unlimited" ? "Unlimited" : `${limit} invoices`;
};

// Helper function to format user limit for display
const formatUserLimit = (limit) => {
  return limit === "unlimited" ? "Unlimited" : `${limit} users`;
};

// Helper function to format storage capacity for display
const formatStorageCapacity = (capacity) => {
  return capacity === "unlimited" ? "Unlimited" : `${capacity} GB`;
};

// Custom User Limit Modal Component
const CustomUserLimitModal = ({ show, handleClose, handleSave, currentUserLimit }) => {
  const [customLimit, setCustomLimit] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);

  useEffect(() => {
    if (show) {
      if (currentUserLimit === "unlimited") {
        setIsUnlimited(true);
        setCustomLimit("");
      } else {
        setIsUnlimited(false);
        setCustomLimit(currentUserLimit.toString());
      }
    }
  }, [show, currentUserLimit]);

  const onSave = () => {
    if (isUnlimited) {
      handleSave("unlimited");
    } else {
      const value = parseInt(customLimit);
      if (!isNaN(value) && value > 0) {
        handleSave(value);
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid number greater than 0",
        });
        return;
      }
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header style={{ backgroundColor: "#53b2a5", color: "#fff" }}>
        <Modal.Title>Set Custom User Limit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check 
              type="radio" 
              id="unlimited-option" 
              label="Unlimited Users" 
              checked={isUnlimited}
              onChange={() => setIsUnlimited(true)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check 
              type="radio" 
              id="custom-number-option" 
              label="Custom Number of Users" 
              checked={!isUnlimited}
              onChange={() => setIsUnlimited(false)}
            />
            {!isUnlimited && (
              <Form.Control 
                type="number" 
                min="1" 
                value={customLimit} 
                onChange={(e) => setCustomLimit(e.target.value)} 
                className="mt-2"
                placeholder="Enter number of users"
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleClose}>Cancel</Button>
        <Button style={{ backgroundColor: "#53b2a5", borderColor: "#53b2a5" }} onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Custom Storage Capacity Modal Component
const CustomStorageCapacityModal = ({ show, handleClose, handleSave, currentStorageCapacity }) => {
  const [customCapacity, setCustomCapacity] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);

  useEffect(() => {
    if (show) {
      if (currentStorageCapacity === "unlimited") {
        setIsUnlimited(true);
        setCustomCapacity("");
      } else {
        setIsUnlimited(false);
        setCustomCapacity(currentStorageCapacity.toString());
      }
    }
  }, [show, currentStorageCapacity]);

  const onSave = () => {
    if (isUnlimited) {
      handleSave("unlimited");
    } else {
      const value = parseInt(customCapacity);
      if (!isNaN(value) && value > 0) {
        handleSave(value);
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid number greater than 0",
        });
        return;
      }
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header style={{ backgroundColor: "#53b2a5", color: "#fff" }}>
        <Modal.Title>Set Custom Storage Capacity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check 
              type="radio" 
              id="unlimited-storage-option" 
              label="Unlimited Storage" 
              checked={isUnlimited}
              onChange={() => setIsUnlimited(true)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check 
              type="radio" 
              id="custom-storage-option" 
              label="Custom Storage (in GB)" 
              checked={!isUnlimited}
              onChange={() => setIsUnlimited(false)}
            />
            {!isUnlimited && (
              <Form.Control 
                type="number" 
                min="1" 
                value={customCapacity} 
                onChange={(e) => setCustomCapacity(e.target.value)} 
                className="mt-2"
                placeholder="Enter storage capacity in GB"
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleClose}>Cancel</Button>
        <Button style={{ backgroundColor: "#53b2a5", borderColor: "#53b2a5" }} onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Custom Invoice Limit Modal Component
const CustomInvoiceLimitModal = ({ show, handleClose, handleSave, currentInvoiceLimit }) => {
  const [customLimit, setCustomLimit] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);

  useEffect(() => {
    if (show) {
      if (currentInvoiceLimit === "unlimited") {
        setIsUnlimited(true);
        setCustomLimit("");
      } else {
        setIsUnlimited(false);
        setCustomLimit(currentInvoiceLimit.toString());
      }
    }
  }, [show, currentInvoiceLimit]);

  const onSave = () => {
    if (isUnlimited) {
      handleSave("unlimited");
    } else {
      const value = parseInt(customLimit);
      if (!isNaN(value) && value > 0) {
        handleSave(value);
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter a valid number greater than 0",
        });
        return;
      }
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header style={{ backgroundColor: "#53b2a5", color: "#fff" }}>
        <Modal.Title>Set Custom Invoice Limit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check 
              type="radio" 
              id="unlimited-invoice-option" 
              label="Unlimited Invoices" 
              checked={isUnlimited}
              onChange={() => setIsUnlimited(true)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check 
              type="radio" 
              id="custom-invoice-option" 
              label="Custom Number of Invoices" 
              checked={!isUnlimited}
              onChange={() => setIsUnlimited(false)}
            />
            {!isUnlimited && (
              <Form.Control 
                type="number" 
                min="1" 
                value={customLimit} 
                onChange={(e) => setCustomLimit(e.target.value)} 
                className="mt-2"
                placeholder="Enter number of invoices"
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleClose}>Cancel</Button>
        <Button style={{ backgroundColor: "#53b2a5", borderColor: "#53b2a5" }} onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const EditPlanModal = ({ show, handleClose, plan, handleSave }) => {
  const [formData, setFormData] = useState({ 
    ...plan, 
    descriptions: plan?.descriptions || [""],
    selectedModules: plan?.selectedModules || [],
    invoiceLimit: plan?.invoiceLimit || 10,
    additionalInvoicePrice: plan?.additionalInvoicePrice || 2.00,
    userLimit: plan?.userLimit || 1,
    storageCapacity: plan?.storageCapacity || 5, // Added storage capacity
    currency: plan?.currency || "USD" // Added currency
  });
  
  const [showCustomUserLimitModal, setShowCustomUserLimitModal] = useState(false);
  const [showCustomStorageCapacityModal, setShowCustomStorageCapacityModal] = useState(false);
  const [showCustomInvoiceLimitModal, setShowCustomInvoiceLimitModal] = useState(false);
  
  useEffect(() => {
    if (plan) {
      setFormData({ 
        ...plan, 
        descriptions: plan.descriptions || [""],
        selectedModules: plan.selectedModules || [],
        invoiceLimit: plan.invoiceLimit || 10,
        additionalInvoicePrice: plan.additionalInvoicePrice || 2.00,
        userLimit: plan.userLimit || 1,
        storageCapacity: plan.storageCapacity || 5, // Added storage capacity
        currency: plan.currency || "USD" // Added currency
      });
    }
  }, [plan]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleInvoiceLimitChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      invoiceLimit: value === "unlimited" ? "unlimited" : parseInt(value)
    }));
  };
  
  const handleUserLimitChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      userLimit: value === "unlimited" ? "unlimited" : parseInt(value)
    }));
  };
  
  const handleStorageCapacityChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      storageCapacity: value === "unlimited" ? "unlimited" : parseInt(value)
    }));
  };
  
  const handleCustomUserLimitSave = (newLimit) => {
    setFormData(prev => ({ ...prev, userLimit: newLimit }));
    setShowCustomUserLimitModal(false);
  };
  
  const handleCustomStorageCapacitySave = (newCapacity) => {
    setFormData(prev => ({ ...prev, storageCapacity: newCapacity }));
    setShowCustomStorageCapacityModal(false);
  };
  
  const handleCustomInvoiceLimitSave = (newLimit) => {
    setFormData(prev => ({ ...prev, invoiceLimit: newLimit }));
    setShowCustomInvoiceLimitModal(false);
  };
  
  const handleModuleToggle = (module) => {
    setFormData(prev => {
      const isSelected = prev.selectedModules.some(m => m.id === module.id);
      
      if (isSelected) {
        // Remove module
        return {
          ...prev,
          selectedModules: prev.selectedModules.filter(m => m.id !== module.id)
        };
      } else {
        // Add module with default price of 0
        return {
          ...prev,
          selectedModules: [
            ...prev.selectedModules,
            { 
              id: module.id, 
              name: module.name, 
              price: 0 // Changed from module.defaultPrice to 0
            }
          ]
        };
      }
    });
  };
  
  const handleModulePriceChange = (moduleId, price) => {
    setFormData(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.map(module => 
        module.id === moduleId ? { ...module, price: parseFloat(price) || 0 } : module
      )
    }));
  };
  
  const onSave = () => {
    handleSave(formData);
  };
  
  const handleDescriptionChange = (index, value) => {
    const updated = [...formData.descriptions];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, descriptions: updated }));
  };
  
  const addDescriptionField = () => {
    setFormData((prev) => ({
      ...prev,
      descriptions: [...(prev.descriptions || []), ""],
    }));
  };
  
  // Calculate current total price
  const totalPrice = calculateTotalPrice(formData.basePrice, formData.selectedModules, formData.currency);
  
  // Get currency symbol
  const currencySymbol = getCurrencySymbol(formData.currency);
  
  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header style={{ backgroundColor: "#53b2a5", color: "#fff" }}>
          <Modal.Title>Edit Plan - {formData.name} ({formData.currency})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Name</Form.Label>
                  <Form.Control name="name" value={formData.name || ""} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price ({currencySymbol})</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="basePrice" 
                    value={formData.basePrice || ""} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select name="currency" value={formData.currency || ""} onChange={handleChange}>
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol}) - {currency.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Invoice Limit</Form.Label>
                  <InputGroup>
                    <Form.Select 
                      name="invoiceLimit" 
                      value={formData.invoiceLimit || ""} 
                      onChange={handleInvoiceLimitChange}
                    >
                      <option value="10">10 invoices</option>
                      <option value="50">50 invoices</option>
                      <option value="100">100 invoices</option>
                      <option value="500">500 invoices</option>
                      <option value="1000">1000 invoices</option>
                      <option value="unlimited">Unlimited</option>
                    </Form.Select>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowCustomInvoiceLimitModal(true)}
                    >
                      Custom
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Number of invoices included in the base price
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Additional Invoice Price ({currencySymbol})</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="additionalInvoicePrice" 
                    value={formData.additionalInvoicePrice || ""} 
                    onChange={handleChange} 
                    step="0.01"
                    disabled={formData.invoiceLimit === "unlimited"}
                  />
                  <Form.Text className="text-muted">
                    {formData.invoiceLimit === "unlimited" 
                      ? "Not applicable for unlimited plans" 
                      : "Price per invoice beyond the limit"}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>User Limit</Form.Label>
                  <InputGroup>
                    <Form.Select 
                      name="userLimit" 
                      value={formData.userLimit || ""} 
                      onChange={handleUserLimitChange}
                    >
                      <option value="1">1 user</option>
                      <option value="3">3 users</option>
                      <option value="5">5 users</option>
                      <option value="10">10 users</option>
                      <option value="20">20 users</option>
                      <option value="50">50 users</option>
                      <option value="unlimited">Unlimited</option>
                    </Form.Select>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowCustomUserLimitModal(true)}
                    >
                      Custom
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Maximum number of users allowed
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Storage Capacity</Form.Label>
                  <InputGroup>
                    <Form.Select 
                      name="storageCapacity" 
                      value={formData.storageCapacity || ""} 
                      onChange={handleStorageCapacityChange}
                    >
                      <option value="5">5 GB</option>
                      <option value="10">10 GB</option>
                      <option value="20">20 GB</option>
                      <option value="50">50 GB</option>
                      <option value="100">100 GB</option>
                      <option value="200">200 GB</option>
                      <option value="500">500 GB</option>
                      <option value="unlimited">Unlimited</option>
                    </Form.Select>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowCustomStorageCapacityModal(true)}
                    >
                      Custom
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Storage capacity included in the plan
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Billing Cycle</Form.Label>
                  <Form.Select name="billing" value={formData.billing || ""} onChange={handleChange}>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Modules</Form.Label>
              <Card className="mb-3">
                <Card.Body>
                  {availableModules.map(module => {
                    const isSelected = formData.selectedModules?.some(m => m.id === module.id);
                    const selectedModule = formData.selectedModules?.find(m => m.id === module.id);
                    
                    return (
                      <Row key={module.id} className="mb-3 align-items-center">
                        <Col md={6}>
                          <Form.Check 
                            type="checkbox"
                            id={`module-${module.id}`}
                            label={module.name}
                            checked={isSelected || false}
                            onChange={() => handleModuleToggle(module)}
                          />
                        </Col>
                        <Col md={6}>
                          {isSelected && (
                            <InputGroup>
                              <InputGroup.Text>{currencySymbol}</InputGroup.Text>
                              <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                                value={selectedModule.price || ""}
                                onChange={(e) => handleModulePriceChange(module.id, e.target.value)}
                              />
                            </InputGroup>
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                </Card.Body>
              </Card>
              <div className="alert alert-info">
                <strong>Total Price: {totalPrice}</strong> (Base Price + Selected Modules)
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descriptions</Form.Label>
              {formData.descriptions.map((desc, idx) => (
                <div key={idx} className="d-flex mb-2 gap-2 align-items-center">
                  <Form.Control
                    value={desc}
                    onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                    placeholder={`Description ${idx + 1}`}
                  />
                  {idx === formData.descriptions.length - 1 && (
                    <Button variant="outline-success" size="sm" onClick={addDescriptionField}>
                      +
                    </Button>
                  )}
                </div>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>Close</Button>
          <Button style={{ backgroundColor: "#53b2a5", borderColor: "#53b2a5" }} onClick={onSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      <CustomUserLimitModal 
        show={showCustomUserLimitModal}
        handleClose={() => setShowCustomUserLimitModal(false)}
        handleSave={handleCustomUserLimitSave}
        currentUserLimit={formData.userLimit}
      />
      
      <CustomStorageCapacityModal 
        show={showCustomStorageCapacityModal}
        handleClose={() => setShowCustomStorageCapacityModal(false)}
        handleSave={handleCustomStorageCapacitySave}
        currentStorageCapacity={formData.storageCapacity}
      />
      
      <CustomInvoiceLimitModal 
        show={showCustomInvoiceLimitModal}
        handleClose={() => setShowCustomInvoiceLimitModal(false)}
        handleSave={handleCustomInvoiceLimitSave}
        currentInvoiceLimit={formData.invoiceLimit}
      />
    </>
  );
};

const ViewPlanModal = ({ show, handleClose, plan }) => {
  if (!plan) return null;
  
  // Calculate total price
  const totalPrice = calculateTotalPrice(plan.basePrice, plan.selectedModules, plan.currency);
  
  // Get currency symbol
  const currencySymbol = getCurrencySymbol(plan.currency);
  
  // Get currency name
  const currencyName = getCurrencyName(plan.currency);
  
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header style={{ backgroundColor: "#53b2a5", color: "#fff" }}>
        <Modal.Title>View Plan - {plan.name} ({plan.currency})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <p><strong>Plan Name:</strong> {plan.name}</p>
            <p><strong>Base Price:</strong> {currencySymbol}{plan.basePrice}</p>
            <p><strong>Total Price:</strong> {totalPrice}</p>
            <p><strong>Currency:</strong> {plan.currency} ({currencySymbol}) - {currencyName}</p>
            <p><strong>Billing:</strong> {plan.billing}</p>
            <p><strong>Status:</strong> {plan.status}</p>
            <p><strong>Subscribers:</strong> {plan.subscribers}</p>
            <p><strong>Invoice Limit:</strong> {formatInvoiceLimit(plan.invoiceLimit)}</p>
            <p><strong>Additional Invoice Price:</strong> 
              {plan.invoiceLimit === "unlimited" 
                ? " Not applicable" 
                : `${currencySymbol}${plan.additionalInvoicePrice}/invoice`}
            </p>
            <p><strong>User Limit:</strong> {formatUserLimit(plan.userLimit)}</p>
            <p><strong>Storage Capacity:</strong> {formatStorageCapacity(plan.storageCapacity)}</p>
          </Col>
          <Col md={6}>
            <p><strong>Selected Modules:</strong></p>
            <ul>
              {plan.selectedModules && plan.selectedModules.length > 0 ? (
                plan.selectedModules.map(module => (
                  <li key={module.id}>
                    {module.name} (+{currencySymbol}{parseFloat(module.price).toFixed(2)})
                  </li>
                ))
              ) : (
                <li>No modules selected</li>
              )}
            </ul>
          </Col>
        </Row>
        
        {plan.descriptions && plan.descriptions.length > 0 && (
          <div>
            <strong>Descriptions:</strong>
            <ul>
              {plan.descriptions.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

const AddPlanModal = ({ show, handleClose, handleAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    basePrice: "",
    billing: "Monthly",
    status: "Active",
    subscribers: "0",
    descriptions: [""],
    selectedModules: [
      { id: "account", name: "Account", price: 0 } // Changed default price to 0
    ],
    invoiceLimit: 10,
    additionalInvoicePrice: 2.00,
    userLimit: 1,
    storageCapacity: 5, // Added storage capacity
    currency: "USD" // Added currency
  });
  
  const [showCustomUserLimitModal, setShowCustomUserLimitModal] = useState(false);
  const [showCustomStorageCapacityModal, setShowCustomStorageCapacityModal] = useState(false);
  const [showCustomInvoiceLimitModal, setShowCustomInvoiceLimitModal] = useState(false);
  
  const handleDescriptionChange = (index, value) => {
    const updated = [...formData.descriptions];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, descriptions: updated }));
  };
  
  const addDescriptionField = () => {
    setFormData((prev) => ({ ...prev, descriptions: [...prev.descriptions, ""] }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleInvoiceLimitChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      invoiceLimit: value === "unlimited" ? "unlimited" : parseInt(value)
    }));
  };
  
  const handleUserLimitChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      userLimit: value === "unlimited" ? "unlimited" : parseInt(value)
    }));
  };
  
  const handleStorageCapacityChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      storageCapacity: value === "unlimited" ? "unlimited" : parseInt(value)
    }));
  };
  
  const handleCustomUserLimitSave = (newLimit) => {
    setFormData(prev => ({ ...prev, userLimit: newLimit }));
    setShowCustomUserLimitModal(false);
  };
  
  const handleCustomStorageCapacitySave = (newCapacity) => {
    setFormData(prev => ({ ...prev, storageCapacity: newCapacity }));
    setShowCustomStorageCapacityModal(false);
  };
  
  const handleCustomInvoiceLimitSave = (newLimit) => {
    setFormData(prev => ({ ...prev, invoiceLimit: newLimit }));
    setShowCustomInvoiceLimitModal(false);
  };
  
  const handleModuleToggle = (module) => {
    setFormData(prev => {
      const isSelected = prev.selectedModules.some(m => m.id === module.id);
      
      if (isSelected) {
        // Remove module
        return {
          ...prev,
          selectedModules: prev.selectedModules.filter(m => m.id !== module.id)
        };
      } else {
        // Add module with default price of 0
        return {
          ...prev,
          selectedModules: [
            ...prev.selectedModules,
            { 
              id: module.id, 
              name: module.name, 
              price: 0 // Changed from module.defaultPrice to 0
            }
          ]
        };
      }
    });
  };
  
  const handleModulePriceChange = (moduleId, price) => {
    setFormData(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.map(module => 
        module.id === moduleId ? { ...module, price: parseFloat(price) || 0 } : module
      )
    }));
  };
  
  const onAdd = () => {
    handleAdd(formData);
    setFormData({ 
      name: "", 
      basePrice: "", 
      billing: "Monthly", 
      status: "Active", 
      subscribers: "0",
      descriptions: [""],
      selectedModules: [
        { id: "account", name: "Account", price: 0 } // Changed default price to 0
      ],
      invoiceLimit: 10,
      additionalInvoicePrice: 2.00,
      userLimit: 1,
      storageCapacity: 5, // Added storage capacity
      currency: "USD" // Added currency
    });
  };
  
  // Calculate current total price
  const totalPrice = calculateTotalPrice(
    parseFloat(formData.basePrice) || 0, 
    formData.selectedModules,
    formData.currency
  );
  
  // Get currency symbol
  const currencySymbol = getCurrencySymbol(formData.currency);
  
  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header style={{ backgroundColor: "#53b2a5", color: "#fff" }}>
          <Modal.Title>Add New Plan ({formData.currency})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Name</Form.Label>
                  <Form.Control name="name" value={formData.name} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price ({currencySymbol})</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="basePrice" 
                    value={formData.basePrice} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol}) - {currency.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Invoice Limit</Form.Label>
                  <InputGroup>
                    <Form.Select 
                      name="invoiceLimit" 
                      value={formData.invoiceLimit || ""} 
                      onChange={handleInvoiceLimitChange}
                    >
                      <option value="10">10 invoices</option>
                      <option value="50">50 invoices</option>
                      <option value="100">100 invoices</option>
                      <option value="500">500 invoices</option>
                      <option value="1000">1000 invoices</option>
                      <option value="unlimited">Unlimited</option>
                    </Form.Select>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowCustomInvoiceLimitModal(true)}
                    >
                      Custom
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Number of invoices included in the base price
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Additional Invoice Price ({currencySymbol})</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="additionalInvoicePrice" 
                    value={formData.additionalInvoicePrice || ""} 
                    onChange={handleChange} 
                    step="0.01"
                    disabled={formData.invoiceLimit === "unlimited"}
                  />
                  <Form.Text className="text-muted">
                    {formData.invoiceLimit === "unlimited" 
                      ? "Not applicable for unlimited plans" 
                      : "Price per invoice beyond the limit"}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>User Limit</Form.Label>
                  <InputGroup>
                    <Form.Select 
                      name="userLimit" 
                      value={formData.userLimit || ""} 
                      onChange={handleUserLimitChange}
                    >
                      <option value="1">1 user</option>
                      <option value="3">3 users</option>
                      <option value="5">5 users</option>
                      <option value="10">10 users</option>
                      <option value="20">20 users</option>
                      <option value="50">50 users</option>
                      <option value="unlimited">Unlimited</option>
                    </Form.Select>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowCustomUserLimitModal(true)}
                    >
                      Custom
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Maximum number of users allowed
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Storage Capacity</Form.Label>
                  <InputGroup>
                    <Form.Select 
                      name="storageCapacity" 
                      value={formData.storageCapacity || ""} 
                      onChange={handleStorageCapacityChange}
                    >
                      <option value="5">5 GB</option>
                      <option value="10">10 GB</option>
                      <option value="20">20 GB</option>
                      <option value="50">50 GB</option>
                      <option value="100">100 GB</option>
                      <option value="200">200 GB</option>
                      <option value="500">500 GB</option>
                      <option value="unlimited">Unlimited</option>
                    </Form.Select>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowCustomStorageCapacityModal(true)}
                    >
                      Custom
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Storage capacity included in the plan
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Billing Cycle</Form.Label>
                  <Form.Select name="billing" value={formData.billing} onChange={handleChange}>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Deprecated">InActive</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Modules</Form.Label>
              <Card className="mb-3">
                <Card.Body>
                  {availableModules.map(module => {
                    const isSelected = formData.selectedModules?.some(m => m.id === module.id);
                    const selectedModule = formData.selectedModules?.find(m => m.id === module.id);
                    
                    return (
                      <Row key={module.id} className="mb-3 align-items-center">
                        <Col md={6}>
                          <Form.Check 
                            type="checkbox"
                            id={`module-${module.id}`}
                            label={module.name}
                            checked={isSelected || false}
                            onChange={() => handleModuleToggle(module)}
                          />
                        </Col>
                        <Col md={6}>
                          {isSelected && (
                            <InputGroup>
                              <InputGroup.Text>{currencySymbol}</InputGroup.Text>
                              <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                                value={selectedModule.price || ""}
                                onChange={(e) => handleModulePriceChange(module.id, e.target.value)}
                              />
                            </InputGroup>
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                </Card.Body>
              </Card>
              <div className="alert alert-info">
                <strong>Total Price: {totalPrice}</strong> (Base Price + Selected Modules)
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descriptions</Form.Label>
              {formData.descriptions.map((desc, idx) => (
                <div key={idx} className="d-flex mb-2 gap-2 align-items-center">
                  <Form.Control
                    value={desc}
                    onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                    placeholder={`Description ${idx + 1}`}
                  />
                  {idx === formData.descriptions.length - 1 && (
                    <Button variant="outline-success" size="sm" onClick={addDescriptionField}>
                      +
                    </Button>
                  )}
                </div>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>Close</Button>
          <Button style={{ backgroundColor: "#53b2a5", borderColor: "#53b2a5" }} onClick={onAdd}>
            Add Plan
          </Button>
        </Modal.Footer>
      </Modal>
      
      <CustomUserLimitModal 
        show={showCustomUserLimitModal}
        handleClose={() => setShowCustomUserLimitModal(false)}
        handleSave={handleCustomUserLimitSave}
        currentUserLimit={formData.userLimit}
      />
      
      <CustomStorageCapacityModal 
        show={showCustomStorageCapacityModal}
        handleClose={() => setShowCustomStorageCapacityModal(false)}
        handleSave={handleCustomStorageCapacitySave}
        currentStorageCapacity={formData.storageCapacity}
      />
      
      <CustomInvoiceLimitModal 
        show={showCustomInvoiceLimitModal}
        handleClose={() => setShowCustomInvoiceLimitModal(false)}
        handleSave={handleCustomInvoiceLimitSave}
        currentInvoiceLimit={formData.invoiceLimit}
      />
    </>
  );
};

const PlanPricing = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlans = plans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  const handleEditClick = (plan, index) => {
    setSelectedPlan({ ...plan, index });
    setShowModal(true);
  };
  
  const handleDeleteClick = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This plan will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedPlans = [...plans];
        updatedPlans.splice(index, 1);
        setPlans(updatedPlans);
        Swal.fire("Deleted!", "The plan has been deleted.", "success");
      }
    });
  };
  
  const handleModalClose = () => setShowModal(false);
  
  const handleSaveChanges = (updatedPlan) => {
    const newPlans = [...plans];
    newPlans[updatedPlan.index] = {
      ...newPlans[updatedPlan.index],
      name: updatedPlan.name,
      basePrice: updatedPlan.basePrice,
      billing: updatedPlan.billing,
      selectedModules: updatedPlan.selectedModules,
      descriptions: updatedPlan.descriptions,
      invoiceLimit: updatedPlan.invoiceLimit,
      additionalInvoicePrice: updatedPlan.additionalInvoicePrice,
      userLimit: updatedPlan.userLimit,
      storageCapacity: updatedPlan.storageCapacity, // Added storage capacity
      currency: updatedPlan.currency // Added currency
    };
    setPlans(newPlans);
    setShowModal(false);
  };
  
  const handleViewClick = (plan) => {
    setViewPlan(plan);
    setViewModal(true);
  };
  
  const handleAddPlan = (newPlan) => {
    setPlans([newPlan, ...plans]);
    setShowAddModal(false);
    setCurrentPage(1); // Reset to first page when adding new plan
  };
  
  return (
    <div className="plans-page p-4">
      <div className="header-section mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold d-flex align-items-center gap-2">
            <span role="img" aria-label="coin">💰</span> Plans & Pricing
          </h4>
          <p className="text-muted">
            Manage your subscription plans, pricing options.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)} style={{ backgroundColor: "#53b2a5", borderColor: "#53b2a5" }}>
          + Add Plan
        </Button>
      </div>
  
      <div className="card">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">View All Plans</h6>
          <div className="table-responsive">
            <table className="table table-hover plans-table">
              <thead className="table-light">
                <tr>
                  <th>Plan Name</th>
                  <th>Currency</th>
                  <th>Base Price</th>
                  <th>Total Price</th>
                  <th>Invoice Limit</th>
                  <th>Additional Invoice Price</th>
                  <th>User Limit</th>
                  <th>Storage Capacity</th>
                  <th>Billing Cycle</th>
                  <th>Status</th>
                  <th>Modules</th>
                  <th>Subscribers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.map((plan, i) => {
                  // Calculate total price for this plan
                  const totalPrice = calculateTotalPrice(plan.basePrice, plan.selectedModules, plan.currency);
                  
                  return (
                    <tr key={i}>
                      <td>
                        <span
                          className="badge px-3 py-2 rounded-pill fw-semibold"
                          style={{
                            ...(badgeStyles[plan.name] || {
                              backgroundColor: "#b2dfdb",
                              color: "#000",
                            }),
                          }}
                        >
                          {plan.name}
                        </span>
                      </td>
                      <td>{plan.currency}</td>
                      <td>{getCurrencySymbol(plan.currency)}{plan.basePrice}</td>
                      <td><strong>{totalPrice}</strong></td>
                      <td>{formatInvoiceLimit(plan.invoiceLimit)}</td>
                      <td>
                        {plan.invoiceLimit === "unlimited" 
                          ? "Not applicable" 
                          : `${getCurrencySymbol(plan.currency)}${plan.additionalInvoicePrice}/invoice`}
                      </td>
                      <td>{formatUserLimit(plan.userLimit)}</td>
                      <td>{formatStorageCapacity(plan.storageCapacity)}</td>
                      <td>{plan.billing}</td>
                      <td>
                        <span className={`badge ${plan.status === "Deprecated" ? "bg-warning text-dark" : "bg-success"}`}>
                          {plan.status}
                        </span>
                      </td>
                      <td>
                        {formatModulesForDisplay(plan.selectedModules, plan.currency)}
                      </td>
                      <td>{plan.subscribers}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm text-warning p-0" 
                            onClick={() => handleEditClick(plan, indexOfFirstItem + i)}
                            title="Edit"
                          >
                            <BsPencilSquare size={18} />
                          </button>
                          <button
                            className="btn btn-sm text-info p-0"
                            onClick={() => handleViewClick(plan)}
                            title="View"
                          >
                            <BsEye size={18} />
                          </button>
                          <button
                            className="btn btn-sm text-danger p-0"
                            onClick={() => handleDeleteClick(indexOfFirstItem + i)}
                            title="Delete"
                          >
                            <BsTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center px-2 py-2">
            <div className="text-muted small">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, plans.length)} of {plans.length} results
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: "#f8f9fa",
                  color: "#6c757d",
                  borderColor: "#53b2a5",
                }}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <BsChevronLeft />
              </button>
              <div className="d-flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`btn btn-sm ${currentPage === page ? 'active' : ''}`}
                    style={{
                      backgroundColor: currentPage === page ? "#53b2a5" : "white",
                      color: currentPage === page ? "white" : "#53b2a5",
                      borderColor: "#53b2a5",
                    }}
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-sm rounded"
                style={{
                  backgroundColor: "#53b2a5",
                  color: "white",
                  borderColor: "#53b2a5",
                }}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <BsChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {selectedPlan && (
        <EditPlanModal
          show={showModal}
          handleClose={handleModalClose}
          plan={selectedPlan}
          handleSave={handleSaveChanges}
        />
      )}
      
      {viewPlan && (
        <ViewPlanModal
          show={viewModal}
          handleClose={() => setViewModal(false)}
          plan={viewPlan}
        />
      )}
      
      {showAddModal && (
        <AddPlanModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          handleAdd={handleAddPlan}
        />
      )}
    </div>
  );
};

export default PlanPricing;