import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const AddProductModal = ({




  showAdd,
  showEdit,
  newItem,
  categories,
  newCategory,
  showUOMModal,
  showAddCategoryModal,
  setShowAdd,
  setShowEdit,
  setShowUOMModal,
  setShowAddCategoryModal,
  setNewCategory,
  handleChange,
  handleAddItem,
  handleUpdateItem,
  handleAddCategory,
  formMode,
}) => {
  const isEditing = showEdit; 
  const isAdding = showAdd;
  const [newUOM, setNewUOM] = useState("");
  const [showAddUOMModal, setShowAddUOMModal] = useState(false);
  const [uoms, setUoms] = useState([
    "Piece",
    "Box",
    "KG",
    "Meter",
    "Litre",
    // add more as needed
  ]);
  const handleAddUOM = () => {
    if (newUOM.trim() && !uoms.includes(newUOM.trim())) {
      setUoms((prev) => [...prev, newUOM.trim()]);
    }
    setNewUOM("");
    setShowAddUOMModal(false);
  };
  React.useEffect(() => {
    if (formMode === "addStock" && !newItem.warehouse) {
      handleChange({
        target: { name: "warehouse", value: "Main Warehouse" },
      });
    }
  }, [formMode]);
  return (
    <>
      {/* Main Add/Edit Product Modal */}
      <Modal show={isAdding || isEditing} onHide={() => { setShowAdd(false); setShowEdit(false); }} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{isAdding ? "Add Product" : "Edit Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Item Name</Form.Label>
                  <Form.Control name="itemName" value={newItem.itemName} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>HSN</Form.Label>
                  <Form.Control name="hsn" value={newItem.hsn} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Barcode</Form.Label>
                  <Form.Control name="barcode" value={newItem.barcode} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
              <Form.Group>
                  <Form.Label>Item Image</Form.Label>
                  <Form.Control type="file" name="image" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
  <Col md={6}>
    <Form.Group>
      <Form.Label>Warehouse</Form.Label>

      {formMode === "addStock" ? (
        // Read-only fixed warehouse value when adding stock
        <Form.Control
          type="text"
          value={newItem.warehouse || "Main Warehouse"}
          readOnly
        />
      ) : (
        // Dropdown when adding a product
        <Form.Select
          name="warehouse"
          value={newItem.warehouse}
          onChange={handleChange}
        >
          <option value="">Select Warehouse</option>
          <option value="Main Warehouse">Main Warehouse</option>
          <option value="Backup Warehouse">Backup Warehouse</option>
          <option value="East Wing">East Wing</option>
          <option value="West Wing">West Wing</option>
        </Form.Select>
      )}
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group>
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label className="mb-0">Item Category</Form.Label>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowAddCategoryModal(true)}
          style={{
            backgroundColor: '#27b2b6',
            border: 'none',
            color: '#fff',
            padding: '6px 16px',
          }}
        >
          + Add New
        </Button>
      </div>
      <Form.Select
        name="itemCategory"
        value={newItem.itemCategory}
        onChange={handleChange}
        className="mt-2"
      >
        <option value="">Select Category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>
</Row>


            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Item Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={newItem.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Initial Quantity On Hand</Form.Label>
                  <Form.Control name="quantity" value={newItem.quantity} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Sku</Form.Label>
                  <Form.Control name="sku" value={newItem.sku} onChange={handleChange} />
                </Form.Group>
              </Col>
            
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Minimum Order Quantity</Form.Label>
                  <Form.Control name="minQty" value={newItem.minQty} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>As Of Date</Form.Label>
                  <Form.Control type="date" name="date" value={newItem.date} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Default Tax Account</Form.Label>
                  <Form.Control name="taxAccount" value={newItem.taxAccount} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Initial Cost/Unit</Form.Label>
                  <Form.Control name="cost" value={newItem.cost} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Default Sale Price (Exclusive)</Form.Label>
                  <Form.Control name="salePriceExclusive" value={newItem.salePriceExclusive} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Default Purchase Price (Inclusive)</Form.Label>
                  <Form.Control name="salePriceInclusive" value={newItem.salePriceInclusive} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Default Discount %</Form.Label>
                  <Form.Control name="discount" value={newItem.discount} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control name="remarks" value={newItem.remarks} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12} className="text-end">
                <Button
                  variant="outline-info"
                  onClick={() => setShowUOMModal(true)}
                  style={{
                    backgroundColor: '#27b2b6',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 16px',
                  }}
                >
                  View More Details
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAdd(false); setShowEdit(false); }}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: '#27b2b6', borderColor: '#27b2b6' }}
            onClick={isAdding ? handleAddItem : handleUpdateItem}
          >
            {isAdding ? "Add" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
{/* UOM Details Modal */}
<Modal show={showUOMModal} onHide={() => setShowUOMModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Unit Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* UOM with Add Button */}
      <Form.Group className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <Form.Label className="mb-0">Unit of Measurement (UOM)</Form.Label>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowAddUOMModal(true)}
            style={{
              backgroundColor: '#27b2b6',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              fontSize: '12px',
            }}
          >
            + Add New
          </Button>
        </div>
        <Form.Select
          name="unit"
          value={newItem.unit}
          onChange={handleChange}
          className="mt-2"
        >
          <option value="">Select Unit</option>
          {uoms.map((uom, idx) => (
            <option key={idx} value={uom}>
              {uom}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Weight per Unit</Form.Label>
        <Form.Control
          name="weightPerUnit"
          value={newItem.weightPerUnit}
          onChange={handleChange}
          placeholder="e.g. 0.5 KG"
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowUOMModal(false)}
      style={{
        backgroundColor: '#27b2b6',
        border: 'none',
        color: '#fff',
        padding: '6px 16px',
      }}
    >
      Close
    </Button>
  </Modal.Footer>
</Modal>
{/* Add UOM Modal */}
<Modal show={showAddUOMModal} onHide={() => setShowAddUOMModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add New UOM</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group>
      <Form.Label>Unit of Measurement</Form.Label>
      <Form.Control
        type="text"
        placeholder="e.g. Pack, Dozen, Roll"
        value={newUOM}
        onChange={(e) => setNewUOM(e.target.value)}
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddUOMModal(false)}>
      Cancel
    </Button>
    <Button
      style={{
        backgroundColor: '#27b2b6',
        border: 'none',
        color: '#fff',
        padding: '6px 16px',
      }}
      onClick={handleAddUOM}
    >
      Add
    </Button>
  </Modal.Footer>
</Modal>
      {/* Add Category Modal */}
      <Modal show={showAddCategoryModal} onHide={() => setShowAddCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCategoryModal(false)}>
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: '#27b2b6',
              border: 'none',
              color: '#fff',
              padding: '6px 16px',
            }}
            onClick={handleAddCategory}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddProductModal;