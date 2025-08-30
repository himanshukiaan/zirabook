// export default MangeStock;
import React, { useState } from 'react';
import { useTheme } from '../../../themeContext';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaPlus, FaInfoCircle } from 'react-icons/fa';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AddProductModal from './AddProductModal';
import { BiTransfer } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const InventoryItems = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [quantityRange, setQuantityRange] = useState("All");
  const [items, setItems] = useState([
    {
      id: 1, // Added ID for navigation
      itemName: "Sample Item",
      hsn: "1234",
      barcode: "ABC123",
      unit: "Numbers",
      description: "Sample inventory item description.",
      quantity: 10,
      date: "2020-04-01",
      cost: 100,
      value: 1000,
      minQty: 5,
      taxAccount: "5% GST",
      purchasePriceExclusive: 90,
      purchasePriceInclusive: 95,
      salePriceExclusive: 110,
      salePriceInclusive: 115,
      discount: 5,
      category: "default",
      itemCategory: "Furniture",
      itemType: 'Good',
      subcategory: "default",
      remarks: "Internal only",
      image: null,
      status: "In Stock",
      warehouse: "Main Warehouse",
    },
    {
      id: 2, // Added ID for navigation
      itemName: "Out of Stock Item",
      hsn: "5678",
      barcode: "XYZ567",
      unit: "Kg",
      description: "This item is currently out of stock.",
      quantity: 0,
      date: "2024-12-01",
      cost: 200,
      value: 0,
      minQty: 10,
      taxAccount: "12% GST",
      cess: 0,
      purchasePriceExclusive: 180,
      purchasePriceInclusive: 200,
      salePriceExclusive: 220,
      salePriceInclusive: 250,
      discount: 0,
      category: "Electronics",
      subcategory: "Accessories",
      remarks: "Awaiting new shipment",
      image: null,
      status: "Out of Stock",
      warehouse: "Backup Warehouse",
      itemCategory: "Electronics",
      itemType: 'Service',
    }
  ]);
  const [showUOMModal, setShowUOMModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([
    "Electronics",
    "Furniture",
    "Apparel",
    "Food",
    "Books",
    "Automotive",
    "Medical",
    "Software",
    "Stationery",
    "Other",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWarehouse, setSelectedWarehouse] = useState("All");

  const uniqueCategories = ["All", ...new Set(items.map(item => item.itemCategory))];
  const uniqueWarehouses = ["All", ...new Set(items.map(item => item.warehouse))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.itemCategory === selectedCategory;
    const matchesWarehouse = selectedWarehouse === "All" || item.warehouse === selectedWarehouse;
    // Quantity Range Filter Logic
    let matchesQuantity = true;
    const qty = item.quantity;
    switch (quantityRange) {
      case "Negative":
        matchesQuantity = qty < 0;
        break;
      case "0-10":
        matchesQuantity = qty >= 0 && qty <= 10;
        break;
      case "10-50":
        matchesQuantity = qty > 10 && qty <= 50;
        break;
      case "50-100":
        matchesQuantity = qty > 50 && qty <= 100;
        break;
      case "100+":
        matchesQuantity = qty > 100;
        break;
      case "Low Quantity":
        matchesQuantity = qty <= item.minQty; // 🔥 Key logic: quantity at or below minQty
        break;
      default:
        matchesQuantity = true;
    }
    return matchesSearch && matchesCategory && matchesWarehouse && matchesQuantity;
  });

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      setNewItem((prev) => ({ ...prev, itemCategory: trimmed }));
    }
    setNewCategory("");
    setShowAddCategoryModal(false);
  };

  const [newItem, setNewItem] = useState({
    itemName: "",
    hsn: "",
    barcode: "",
    unit: "Numbers",
    description: "",
    quantity: -3,
    date: "2020-04-01",
    cost: 0,
    value: 0,
    minQty: 50,
    taxAccount: "",
    cess: 0,
    purchasePriceExclusive: 0,
    purchasePriceInclusive: 0,
    salePriceExclusive: 0,
    salePriceInclusive: 0,
    discount: 0,
    category: "default",
    subcategory: "default",
    remarks: "",
    image: null,
    status: "In Stock",
    itemType: "Good", // New field for item type
    itemCategory: "", // New field for item category
    // unit: "",
    weightPerUnit: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setNewItem({ ...newItem, image: files[0] });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleAddItem = () => {
    // Generate a new ID for the item
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { ...newItem, id: newId }]);
    setShowAdd(false);
  };

  const handleUpdateItem = () => {
    const updated = items.map((i) => (i.id === selectedItem.id ? { ...newItem, id: selectedItem.id } : i));
    setItems(updated);
    setShowEdit(false);
  };

  const handleStatusChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].status = value;
    setItems(updatedItems);
  };

  const handleDeleteItem = () => {
    setItems(items.filter((i) => i.id !== selectedItem.id));
    setShowDelete(false);
  };

  const handleDownloadTemplate = () => {
    const headers = [[
      "itemName", "hsn", "barcode", "unit", "description", "quantity", "date", "cost", "value", "minQty",
      "taxAccount", "cess", "purchasePriceExclusive", "purchasePriceInclusive", "salePriceExclusive",
      "salePriceInclusive", "discount", "category", "subcategory", "remarks"
    ]];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "InventoryTemplate");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Inventory_Template.xlsx");
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "InventoryExport");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Inventory_Export.xlsx");
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
      // Add IDs to imported items
      const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
      const itemsWithIds = data.map((item, index) => ({
        ...item,
        id: newId + index
      }));
      setItems((prev) => [...prev, ...itemsWithIds]);
    };
    reader.readAsBinaryString(file);
  };

  // Function to handle product name click - navigate to details page
  const handleProductClick = (item, e) => {
    // Prevent event bubbling if it's a button click
    if (e && (e.target.closest('button') || e.target.closest('.btn'))) {
      return;
    }
    navigate(`/company/inventorydetails/${item.id}`, { state: { item } });
  };

  const handleSendAll = () => {
    // Send all items logic
    console.log("Sending all items:", items);
    alert("All items sent successfully!");
  };

  const handleSendItem = (item) => {
    // Send individual item logic
    console.log("Sending item:", item);
    alert(`Item "${item.itemName}" sent successfully!`);
  };

  return (
    <div className={`mt-4 p-2 ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <Row className="align-items-center mb-3 ">
        <Col md={4}>
          <h4 className="fw-bold mb-0 d-flex align-items-center gap-2 theme-text">
            <BiTransfer size={40} color="green" />
            <span>Inventory Product</span>
          </h4>
        </Col>
        <Col md={8} className="text-md-end d-flex flex-wrap gap-2 justify-content-md-end">
          <Button
            style={{
              backgroundColor: '#00c78c',
              border: 'none',
              color: '#fff',
              padding: '6px 16px',
            }}
            onClick={handleImportClick}
          >
            Import
          </Button>
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={(ref) => (window.importFileRef = ref)}
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <Button
            style={{
              backgroundColor: '#ff7e00',
              border: 'none',
              color: '#fff',
              padding: '6px 16px',
            }}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            style={{
              backgroundColor: '#f6c100',
              border: 'none',
              color: '#000',
              padding: '6px 16px',
            }}
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>

          <Button onClick={() => setShowAdd(true)} style={{
            backgroundColor: '#27b2b6',
            border: 'none',
            color: '#fff',
            padding: '6px 16px',
          }}>Add Product</Button>
          <Button
            style={{
              backgroundColor: '#17a2b8',
              border: 'none',
              color: '#fff',
              padding: '6px 16px',
              marginLeft: '8px',
            }}
            onClick={handleSendAll}
          >
            Send
          </Button>


          <AddProductModal showAdd={showAdd}
            showEdit={showEdit}
            newItem={newItem}
            categories={categories}
            newCategory={newCategory}
            showUOMModal={showUOMModal}
            showAddCategoryModal={showAddCategoryModal}
            setShowAdd={setShowAdd}
            setShowEdit={setShowEdit}
            setShowUOMModal={setShowUOMModal}
            setShowAddCategoryModal={setShowAddCategoryModal}
            setNewCategory={setNewCategory}
            handleChange={handleChange}
            handleAddItem={handleAddItem}
            handleUpdateItem={handleUpdateItem}
            handleAddCategory={handleAddCategory} />
        </Col>
      </Row>
      <Row className="mb-3 px-3 py-2 align-items-center g-2">
        <Col xs={12} sm={3}>
          <Form.Control
            type="text"
            placeholder="Search item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-pill"
          />
        </Col>
        <Col xs={12} sm={3}>
          <Form.Select
            className="rounded-pill"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {uniqueCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} sm={3}>
          <Form.Select
            className="rounded-pill"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {uniqueWarehouses.map((wh, idx) => (
              <option key={idx} value={wh}>{wh}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} sm={3}>
          <Form.Select
            className="rounded-pill"
            value={quantityRange}
            onChange={(e) => setQuantityRange(e.target.value)}
          >
            <option value="All">All Quantities</option>
            <option value="Negative">Negative Quantity</option>
            <option value="Low Quantity">Low Quantity</option>
            <option value="0-10">0 - 10</option>
            <option value="10-50">10 - 50</option>
            <option value="50-100">50 - 100</option>
            <option value="100+">100+</option>
          </Form.Select>
        </Col>
      </Row>
      <div className="card rounded-3 p-4 theme-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 theme-table">
            <thead className="table-light">
              <tr>
                <th>Product</th> {/* Changed from Name to Product */}
                <th>Category</th>
                <th>HSN</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>Amount</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item.id} // Use item.id as key instead of index
                  >
                    <td
                      style={{ color: "#007bff", fontWeight: "bold", position: "relative" }}
                      className="product-cell"
                      onClick={(e) => handleProductClick(item, e)}
                    >
                      <span className="product-name">{item.itemName}</span>
                    </td>
                    <td>{item.itemCategory}</td>
                    <td>{item.hsn}</td>
                    <td>{item.quantity}</td>
                    <td>{item.warehouse}</td>
                    <td>{item.cost}</td>
                    <td>{item.value}</td>
                    <td>
                      <span
                        className={`badge px-3 py-1 rounded-pill fw-semibold ${item.status === "In Stock"
                          ? "bg-success text-white"
                          : "bg-danger text-white"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="link"
                          className="text-info p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setShowView(true);
                          }}
                          title="Quick View"
                        >
                          <FaEye />
                        </Button>

                        <Button
                          variant="link"
                          className="text-warning p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setNewItem(item);
                            setShowEdit(true);
                          }}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setShowDelete(true);
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </Button>



                        <Button
                          variant="link"
                          className="text-primary p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/company/inventorydetails/${item.id}`, { state: { item } });
                          }}
                          title="View Details"
                        >
                          view details

                        </Button>

                        <Button
                          variant="link"
                          className="text-success p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendItem(item);   // ✅ this calls your send function
                          }}
                          title="Send Item"
                        >
                          Send
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))
              )
                : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No items found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        {/* Static Pagination UI */}
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <small className="text-muted ms-2">
            Showing 1 to {filteredItems.length} of {filteredItems.length} results
          </small>
          <nav>
            <ul className="pagination mb-0">
              <li className="page-item disabled">
                <button className="page-link">&laquo;</button>
              </li>
              <li className="page-item active">
                <button className="page-link">1</button>
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
      </div>
      {/* View Modal */}
      <Modal show={showView} onHide={() => setShowView(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <Row className="mb-3">
                <Col md={6}><strong>Item Name:</strong> {selectedItem.itemName}</Col>
                <Col md={6}><strong>HSN:</strong> {selectedItem.hsn}</Col>
                <Col md={6}><strong>Barcode:</strong> {selectedItem.barcode}</Col>
                <Col md={6}><strong>Unit:</strong> {selectedItem.unit}</Col>
                <Col md={12}><strong>Description:</strong> {selectedItem.description}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><strong>Quantity:</strong> {selectedItem.quantity}</Col>
                <Col md={6}><strong>Date:</strong> {selectedItem.date}</Col>
                <Col md={6}><strong>Cost:</strong> {selectedItem.cost}</Col>
                <Col md={6}><strong>Value:</strong> {selectedItem.value}</Col>
                <Col md={6}><strong>Min Order Qty:</strong> {selectedItem.minQty}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><strong>Tax Account:</strong> {selectedItem.taxAccount}</Col>
                <Col md={6}><strong>Cess:</strong> {selectedItem.cess}</Col>
                {/* <Col md={6}><strong>Purchase Price (Excl):</strong> {selectedItem.purchasePriceExclusive}</Col> */}
                <Col md={6}><strong>Purchase Price (Incl):</strong> {selectedItem.purchasePriceInclusive}</Col>
                {/* <Col md={6}><strong>Sale Price (Excl):</strong> {selectedItem.salePriceExclusive}</Col> */}
                <Col md={6}><strong>Sale Price (Incl):</strong> {selectedItem.salePriceInclusive}</Col>
                <Col md={6}><strong>Discount %:</strong> {selectedItem.discount}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><strong>Category:</strong> {selectedItem.category}</Col>
                <Col md={6}><strong>Subcategory:</strong> {selectedItem.subcategory}</Col>
                <Col md={12}><strong>Remarks:</strong> {selectedItem.remarks}</Col>
              </Row>
              {selectedItem.image && (
                <Row className="mb-3">
                  <Col md={12}><strong>Image Preview:</strong><br /><img src={URL.createObjectURL(selectedItem.image)} alt="item preview" style={{ maxHeight: '200px', marginTop: '10px' }} /></Col>
                </Row>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowView(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteItem}>Delete</Button>
        </Modal.Footer>
      </Modal>
      {/* Page Description */}
      <Card className="mb-4 p-3 shadow rounded-4 mt-2 theme-card">
        <Card.Body>
          {/* Heading */}
          <h5 className="fw-semibold border-bottom pb-2 mb-3" style={{ color: "var(--bs-primary)" }}>Page Info</h5>
          {/* Bullet Points */}
          <ul className="text-muted fs-6 mb-0" style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
            <li>
              An Inventory Product Management Interface displaying product details, status, and actions.
            </li>
            <li>
              Options to import/export data.
            </li>
            <li>
              Ability to manage and maintain records.
            </li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};
export default InventoryItems;