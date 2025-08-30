import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Modal,
  Badge,
} from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf, FaEdit, FaTrash, FaPlus, FaFilter, FaTimes, FaKey } from "react-icons/fa"; // 1. Added FaKey icon

// 2. Added 'password' field to default users
const defaultUsers = [
  {
    id: 1,
    name: "Henry Bryant",
    phone: "+12498345785",
    email: "henry@example.com",
    role: "Admin",
    status: "Active",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    password: "password123" // New field
  },
  {
    id: 2,
    name: "Jenny Ellis",
    phone: "+13178964582",
    email: "jenny@example.com",
    role: "Manager",
    status: "Active",
    img: "",
    password: "securepass456" // New field
  },
  {
    id: 3,
    name: "Robert Johnson",
    phone: "+15551234567",
    email: "robert@example.com",
    role: "User",
    status: "Inactive",
    img: "",
    password: "userpass789" // New field
  },
  {
    id: 4,
    name: "Sarah Williams",
    phone: "+15559876543",
    email: "sarah@example.com",
    role: "User",
    status: "Active",
    img: "",
    password: "sarahpass321" // New field
  },
];

const statusBadge = (status) => (
  <Badge
    style={{
      background: status === "Active" ? "#27ae60" : "#e74c3c",
      color: "#fff",
      fontWeight: 500,
      fontSize: 15,
      borderRadius: 8,
      padding: "5px 18px",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "#fff",
        marginRight: 6,
      }}
    ></span>
    {status}
  </Badge>
);

// 3. Added password fields to the empty user template
const emptyUser = {
  id: null,
  name: "",
  phone: "",
  email: "",
  role: "",
  status: "Active",
  img: "",
  password: "", // New field
  confirmPassword: "" // New field for confirmation
};

const Users = () => {
  const [users, setUsers] = useState(defaultUsers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [form, setForm] = useState(emptyUser);
  const [previewImg, setPreviewImg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // 4. New states for the Reset Password Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // Filter states
  const [showFilters, setShowFilters] = useState(true);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  
  const uniqueRoles = ["All", ...new Set(users.map(user => user.role))];
  
  const filtered = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    
    const matchesName = filterName === "" || u.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesEmail = filterEmail === "" || u.email.toLowerCase().includes(filterEmail.toLowerCase());
    const matchesPhone = filterPhone === "" || u.phone.toLowerCase().includes(filterPhone.toLowerCase());
    const matchesStatus = filterStatus === "All" || u.status === filterStatus;
    const matchesRole = filterRole === "All" || u.role === filterRole;
    
    return matchesSearch && matchesName && matchesEmail && matchesPhone && matchesStatus && matchesRole;
  });
  
  const handleEdit = (user) => {
    // 5. When editing, include the password but clear the confirmation field
    setForm({
      ...user,
      confirmPassword: "" 
    });
    setPreviewImg(user.img || "");
    setModalType("edit");
    setShowModal(true);
  };
  
  const handleAdd = () => {
    setForm(emptyUser);
    setPreviewImg("");
    setModalType("add");
    setShowModal(true);
  };
  
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };
  
  // 6. Updated handleSave to check password confirmation
  const handleSave = () => {
    // Only check password confirmation when adding a new user
    if (modalType === "add" && form.password !== form.confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }
    
    const updatedUser = { 
      ...form, 
      img: previewImg,
      password: form.password 
    };
    
    if (modalType === "add") {
      setUsers((prev) => [...prev, { ...updatedUser, id: Date.now() }]);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === form.id ? updatedUser : u)));
    }
    setShowModal(false);
  };
  
  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text("Users", 14, 16);
    doc.autoTable({
      startY: 22,
      head: [["User Name", "Phone", "Email", "Role", "Status"]],
      body: filtered.map((u) => [
        u.name,
        u.phone,
        u.email,
        u.role,
        u.status,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [245, 246, 250], textColor: 60 },
    });
    doc.save("users.pdf");
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImg(imageUrl);
    }
  };
  
  const clearFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setFilterPhone("");
    setFilterStatus("All");
    setFilterRole("All");
  };
  
  // 7. New functions to handle the Reset Password logic
  const openResetModal = (user) => {
    setUserToReset(user);
    setNewPassword("");
    setConfirmNewPassword("");
    setShowResetModal(true);
  };
  
  const handleResetPassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert("New Password and Confirm Password do not match!");
      return;
    }
    
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    
    setUsers(prev => 
      prev.map(user => 
        user.id === userToReset.id 
          ? { ...user, password: newPassword } 
          : user
      )
    );
    
    setShowResetModal(false);
    alert(`Password for ${userToReset.name} has been reset successfully!`);
  };
  
  return (
    <div className="p-2">
      <Container fluid className="py-4">
        <h3 className="fw-bold">Users</h3>
        <p className="text-muted mb-4">Manage your users</p>
        
        <Row className="g-2 mb-3 align-items-center">
          <Col xs={12} md={6}>
            <Form.Control
              placeholder="Search by name, email, phone, or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-md-end justify-content-start gap-2">
            <Button
              className="d-flex align-items-center"
              style={{ backgroundColor: "#3daaaa", borderColor: "#3daaaa" }}
              onClick={handleAdd}
            >
              <FaPlus className="me-2" />
              Add User
            </Button>
          </Col>
        </Row>
        
        {/* Filters Section */}
        {showFilters && (
          <Card className="mb-4 border-secondary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Filter Users</h5>
                <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                  <FaTimes className="me-1" /> Clear All
                </Button>
              </div>
              
              <Row className="g-3">
                <Col xs={12} md={6} lg={3}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      placeholder="Filter by name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                
                <Col xs={12} md={6} lg={3}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      placeholder="Filter by email"
                      value={filterEmail}
                      onChange={(e) => setFilterEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                
                <Col xs={12} md={6} lg={3}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      placeholder="Filter by phone"
                      value={filterPhone}
                      onChange={(e) => setFilterPhone(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                
                <Col xs={12} md={6} lg={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col xs={12} md={6} lg={3}>
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      {uniqueRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
        
        <Card className="mb-4">
          <Card.Body style={{ padding: 0 }}>
            <div style={{ overflowX: "auto" }}>
              <Table responsive className="align-middle mb-0" style={{ background: "#fff", fontSize: 16 }}>
                <thead className="table-light text-white">
                  <tr>
                    <th className="py-3">#</th>
                    <th className="py-3">User Name</th>
                    <th className="py-3">Phone</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">Status</th>
                    {/* 8. Increased column width for more buttons */}
                    <th className="py-3" style={{ minWidth: 180 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <Form.Check type="checkbox" />
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              overflow: "hidden",
                              background: "#eee",
                            }}
                          >
                            {user.img ? (
                              <img
                                src={user.img}
                                alt={user.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span className="text-muted">No Img</span>
                            )}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{statusBadge(user.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(user)}>
                            <FaEdit />
                          </Button>
                          {/* 9. Added the Reset Password Button */}
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => openResetModal(user)}
                            title="Reset Password"
                          >
                            <FaKey />
                          </Button>
                          <Button variant="outline-secondary" size="sm" onClick={() => confirmDelete(user)}>
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
      
      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Add User" : "Edit User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Control
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            
            {/* 10. Added Password Fields - Only for Adding a User */}
            {modalType === "add" && (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                  />
                </Form.Group>
              </>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Image Preview</Form.Label>
              {previewImg ? (
                <div className="mb-2">
                  <img src={previewImg} alt="preview" style={{ height: 60, borderRadius: 6 }} />
                </div>
              ) : (
                <div className="text-muted small mb-2">No Image</div>
              )}
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              <Form.Text muted>Upload to replace image</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={
              !form.name || 
              !form.email || 
              !form.phone || 
              !form.role ||
              (modalType === "add" && (!form.password || !form.confirmPassword))
            }       
            style={{ backgroundColor: "#3daaaa", borderColor: "#3daaaa" }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* 11. New Reset Password Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Reset password for <strong>{userToReset?.name}</strong></p>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleResetPassword}
            disabled={!newPassword || !confirmNewPassword}
            style={{ backgroundColor: "#3daaaa", borderColor: "#3daaaa" }}
          >
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
      
      <p className="text-muted text-center mt-2">
        This page allows you to manage user records with add, edit, delete, search, filters, and PDF export functionality.
      </p>
    </div>
  );
};

export default Users;