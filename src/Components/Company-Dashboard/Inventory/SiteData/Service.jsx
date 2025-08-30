import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const initialServices = [
  { id: 1, name: "Packing", sku: "9985", serviceDescription: "Packing Service", unit: "yard", tax: "18%", remarks: "N/A" }
];

const unitOptions = [
  "piece", "kg", "meter", "liter", "box", "day", "yard", "sq.ft", "cubic meter"
];

function Service() {
  const [services, setServices] = useState(initialServices);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ 
    id: null, 
    name: "", 
    sku: "", 
    serviceDescription: "", 
    unit: "piece", 
    tax: "", 
    remarks: "" 
  });
  const [editMode, setEditMode] = useState(false);
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleShow = () => {
    setForm({ 
      id: null, 
      name: "", 
      sku: "", 
      serviceDescription: "", 
      unit: "piece", 
      tax: "", 
      remarks: "" 
    });
    setEditMode(false);
    setShow(true);
  };

  const handleClose = () => setShow(false);
  const handleViewClose = () => setShowView(false);
  const handleDeleteConfirmClose = () => setShowDeleteConfirm(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    if (!form.name.trim()) return alert("Service Name Required");
    if (editMode) {
      setServices(services.map((s) => (s.id === form.id ? form : s)));
    } else {
      setServices([...services, { ...form, id: Date.now() }]);
    }
    handleClose();
  };

  const handleEdit = (service) => {
    setForm(service);
    setEditMode(true);
    setShow(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setServices(services.filter((s) => s.id !== deleteId));
    setShowDeleteConfirm(false);
  };

  const handleView = (data) => {
    setViewData(data);
    setShowView(true);
  };

  const customButtonStyle = {
    backgroundColor: '#53b2a5',
    borderColor: '#53b2a5',
    color: 'white'
  };

  const viewButtonStyle = {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: 'white'
  };

  const editButtonStyle = {
    backgroundColor: '#ffc107',
    borderColor: '#ffc107',
    color: 'black'
  };

  const deleteButtonStyle = {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
    color: 'white'
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Service Management</h2>
        <Button style={customButtonStyle} onClick={handleShow}>Add Service</Button>
      </div>
      
      <div className="table-responsive">
        <Table striped bordered hover className="shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Service Name</th>
              <th>Service Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td className="align-middle">{s.name}</td>
                <td className="align-middle">{s.serviceDescription}</td>
                <td className="text-center align-middle">
                  <Button 
                    size="sm" 
                    style={viewButtonStyle} 
                    onClick={() => handleView(s)} 
                    title="View"
                    className="me-1"
                  >
                    <FaEye />
                  </Button>
                  <Button 
                    size="sm" 
                    style={editButtonStyle} 
                    onClick={() => handleEdit(s)} 
                    title="Edit"
                    className="me-1"
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    size="sm" 
                    style={deleteButtonStyle} 
                    onClick={() => handleDeleteClick(s.id)} 
                    title="Delete"
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-3">No Services Added</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{editMode ? "Edit Service" : "Add Service"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control 
                name="name" 
                value={form.name} 
                onChange={handleInput} 
                required 
                className="shadow-sm"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>SKU</Form.Label>
              <Form.Control 
                name="sku" 
                value={form.sku} 
                onChange={handleInput} 
                className="shadow-sm"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Service Description</Form.Label>
              <Form.Control 
                as="textarea" 
                name="serviceDescription" 
                value={form.serviceDescription} 
                onChange={handleInput} 
                rows={3}
                className="shadow-sm"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Unit of Measure</Form.Label>
              <Form.Select 
                name="unit" 
                value={form.unit} 
                onChange={handleInput}
                className="shadow-sm"
              >
                {unitOptions.map((unit, index) => (
                  <option key={index} value={unit}>{unit}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Default Tax%</Form.Label>
              <Form.Control 
                name="tax" 
                value={form.tax} 
                onChange={handleInput} 
                className="shadow-sm"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control 
                name="remarks" 
                value={form.remarks} 
                onChange={handleInput} 
                className="shadow-sm"
              />
              <Form.Text className="text-muted">
                Remarks are for internal use only, it do not display anywhere.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button style={customButtonStyle} onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showView} onHide={handleViewClose} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Service Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewData && (
            <div className="p-2">
              <div className="mb-3">
                <h5 className="text-primary">{viewData.name}</h5>
                <p className="text-muted mb-1">SKU: {viewData.sku}</p>
              </div>
              
              <div className="mb-3">
                <h6>Service Description</h6>
                <p>{viewData.serviceDescription}</p>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6>Unit of Measure</h6>
                  <p>{viewData.unit}</p>
                </div>
                <div className="col-md-6">
                  <h6>Default Tax</h6>
                  <p>{viewData.tax}</p>
                </div>
              </div>
              
              <div>
                <h6>Remarks</h6>
                <p>{viewData.remarks}</p>
                <p className="text-muted small fst-italic">
                  Remarks are for internal use only, it do not display anywhere.
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleDeleteConfirmClose} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this service? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Service;