import React, { useState } from "react";
import {
  BsThreeDotsVertical,
  BsCalendarEvent,
  BsClock,
  BsCalendarWeek,
  BsPeopleFill,
  BsPersonPlusFill,
  BsBuildings,
  BsPlusCircle,
  BsPencilSquare,
  BsTrash,
  BsShieldLock,
  BsGear,
  BsSlashCircle,
  BsEye,
  BsCloud
} from "react-icons/bs";

import "./Company.css";
import { useNavigate } from "react-router-dom";

const initialCompanies = [
  {
    name: "Workdo",
    email: "company@example.com",
    plan: "Platinum",
    planType: "Yearly",
    avatar: "https://i.ibb.co/2f7wxpv/image1.jpg",
    date: "2025-07-03",
    time: "10:30:44",
    expired: "Dec 18, 2025",
    counts: { users: 14 },
    users: [
      { id: 1, name: "John Doe", email: "john@workdo.com", status: "Active" },
      { id: 2, name: "Jane Smith", email: "jane@workdo.com", status: "Active" },
      { id: 3, name: "Robert Chen", email: "robert@workdo.com", status: "Active" },
      { id: 4, name: "Maria Garcia", email: "maria@workdo.com", status: "Active" },
      { id: 5, name: "David Kim", email: "david@workdo.com", status: "Active" },
      { id: 6, name: "Linda Park", email: "linda@workdo.com", status: "Inactive" },
      { id: 7, name: "James Wilson", email: "james@workdo.com", status: "Active" },
      { id: 8, name: "Aisha Khan", email: "aisha@workdo.com", status: "Active" },
      { id: 9, name: "Carlos Mendez", email: "carlos@workdo.com", status: "Active" },
      { id: 10, name: "Emma Watson", email: "emma@workdo.com", status: "Active" },
      { id: 11, name: "Michael Brown", email: "michael@workdo.com", status: "Active" },
      { id: 13, name: "Sophia Lee", email: "sophia@workdo.com", status: "Active" },
      { id: 14, name: "Ethan Hunt", email: "ethan@murray.com", status: "Active" },
      { id: 15, name: "Zoe Martin", email: "zoe@murray.com", status: "Active" }
    ],
    storage: "100 GB" // 👈 Added
  },
  {
    name: "Murray Group",
    email: "iromaguera@gmail.com",
    plan: "Silver",
    planType: "Monthly",
    avatar: "https://i.ibb.co/4nKXmCRz/image2.jpg",
    date: "2025-07-03",
    time: "05:04:53",
    expired: "Apr 10, 2025",
    counts: { users: 13 },
    users: [
      { id: 1, name: "Robert Murray", email: "robert@murray.com", status: "Active" },
      { id: 2, name: "Anna Taylor", email: "anna@murray.com", status: "Active" },
      { id: 3, name: "Paul Walker", email: "paul@murray.com", status: "Active" },
      { id: 4, name: "Lisa Wong", email: "lisa@murray.com", status: "Active" },
      { id: 5, name: "Tom Harris", email: "tom@murray.com", status: "Active" },
      { id: 6, name: "Nina Patel", email: "nina@murray.com", status: "Inactive" },
      { id: 7, name: "Kevin White", email: "kevin@murray.com", status: "Active" },
      { id: 8, name: "Grace Lin", email: "grace@murray.com", status: "Active" },
      { id: 9, name: "Daniel Fox", email: "daniel@murray.com", status: "Active" },
      { id: 10, name: "Olivia King", email: "olivia@murray.com", status: "Active" },
      { id: 11, name: "Amelia Harris", email: "amelia@larson.com", status: "Active" },
      { id: 12, name: "Lucas Martin", email: "lucas@larson.com", status: "Active" },
      { id: 13, name: "Mia Thompson", email: "mia@larson.com", status: "Active" }
    ],
    storage: "50 GB" // 👈 Added
  },
  {
    name: "Larson LLC",
    email: "fgoldner@gmail.com",
    plan: "Platinum",
    planType: "Yearly",
    avatar: "https://i.ibb.co/Pzr45DCB/image5.jpg",
    date: "2025-07-03",
    time: "05:04:53",
    expired: "Apr 10, 2025",
    counts: { users: 9 },
    users: [
      { id: 1, name: "Liam Johnson", email: "liam@larson.com", status: "Active" },
      { id: 2, name: "Emma Davis", email: "emma@larson.com", status: "Active" },
      { id: 3, name: "Noah Wilson", email: "noah@larson.com", status: "Active" },
      { id: 4, name: "Olivia Moore", email: "olivia@larson.com", status: "Active" },
      { id: 5, name: "William Taylor", email: "william@larson.com", status: "Active" },
      { id: 6, name: "Sophia Anderson", email: "sophia@larson.com", status: "Active" },
      { id: 7, name: "James Thomas", email: "james@larson.com", status: "Active" },
      { id: 8, name: "Charlotte Jackson", email: "charlotte@larson.com", status: "Active" },
      { id: 9, name: "Benjamin White", email: "benjamin@larson.com", status: "Active" }
    ],
    storage: "100 GB" // 👈 Added
  },
  {
    name: "Abhishek Dwivedi",
    email: "abhishek@company.com",
    plan: "Silver",
    planType: "Monthly",
    avatar: "https://i.ibb.co/rL3qL71/image4.jpg",
    date: "2025-07-03",
    time: "05:04:53",
    expired: "Apr 10, 2025",
    counts: { users: 12 },
    users: [
      { id: 1, name: "Abhishek Dwivedi", email: "abhishek@company.com", status: "Active" },
      { id: 2, name: "Rahul Sharma", email: "rahul@company.com", status: "Active" },
      { id: 3, name: "Priya Patel", email: "priya@company.com", status: "Active" },
      { id: 4, name: "Amit Singh", email: "amit@company.com", status: "Active" },
      { id: 5, name: "Sneha Reddy", email: "sneha@company.com", status: "Active" },
      { id: 6, name: "Vikas Gupta", email: "vikas@company.com", status: "Active" },
      { id: 7, name: "Anjali Nair", email: "anjali@company.com", status: "Inactive" },
      { id: 8, name: "Karan Mehta", email: "karan@company.com", status: "Active" },
      { id: 9, name: "Neha Joshi", email: "neha@company.com", status: "Active" },
      { id: 10, name: "Rohan Malhotra", email: "rohan@company.com", status: "Active" },
      { id: 11, name: "Pooja Verma", email: "pooja@company.com", status: "Active" },
      { id: 12, name: "Arjun Khanna", email: "arjun@company.com", status: "Active" }
    ],
    storage: "50 GB" // 👈 Added
  },
  {
    name: "Shiane Mcdowell",
    email: "xygux@mailinator.com",
    plan: "Gold",
    planType: "Yearly",
    avatar: "https://i.ibb.co/Pzr45DCB/image5.jpg",
    date: "2025-07-03",
    time: "05:04:53",
    expired: "Apr 10, 2025",
    counts: { users: 13 },
    users: [
      { id: 1, name: "Shiane Mcdowell", email: "shiane@mc.com", status: "Active" },
      { id: 2, name: "Chris Evans", email: "chris@mc.com", status: "Active" },
      { id: 3, name: "Emily Stone", email: "emily@mc.com", status: "Active" },
      { id: 4, name: "Mark Wahlberg", email: "mark@mc.com", status: "Active" },
      { id: 5, name: "Scarlett Johansson", email: "scarlett@mc.com", status: "Active" },
      { id: 6, name: "Tom Hardy", email: "tom@mc.com", status: "Active" },
      { id: 7, name: "Anne Hathaway", email: "anne@mc.com", status: "Active" },
      { id: 8, name: "Ryan Reynolds", email: "ryan@mc.com", status: "Active" },
      { id: 9, name: "Gal Gadot", email: "gal@mc.com", status: "Active" },
      { id: 10, name: "Dwayne Johnson", email: "dwayne@mc.com", status: "Active" },
      { id: 11, name: "Chris Hemsworth", email: "chris.h@mc.com", status: "Active" },
      { id: 12, name: "Zendaya", email: "zendaya@mc.com", status: "Active" },
      { id: 13, name: "Lucas Reed", email: "lucas@lawson.com", status: "Active" }
    ],
    storage: "75 GB" // 👈 Added
  },
  {
    name: "Kylie Lawson",
    email: "kylie@lawsoncorp.com",
    plan: "Bronze",
    planType: "Monthly",
    avatar: "https://i.ibb.co/9kcymv4q/image6.jpg",
    date: "2025-07-02",
    time: "08:20:10",
    expired: "May 30, 2025",
    counts: { users: 11 },
    users: [
      { id: 1, name: "Kylie Lawson", email: "kylie@lawsoncorp.com", status: "Active" },
      { id: 2, name: "Liam Carter", email: "liam@lawson.com", status: "Active" },
      { id: 3, name: "Emma Foster", email: "emma@lawson.com", status: "Active" },
      { id: 4, name: "Noah Bennett", email: "noah@lawson.com", status: "Active" },
      { id: 5, name: "Olivia Reed", email: "olivia@lawson.com", status: "Active" },
      { id: 6, name: "William Scott", email: "william@lawson.com", status: "Active" },
      { id: 7, name: "Sophia Price", email: "sophia@lawson.com", status: "Active" },
      { id: 8, name: "James Turner", email: "james@lawson.com", status: "Active" },
      { id: 9, name: "Charlotte Hill", email: "charlotte@lawson.com", status: "Active" },
      { id: 10, name: "Benjamin Cole", email: "benjamin@lawson.com", status: "Active" },
      { id: 11, name: "Amelia Fox", email: "amelia@lawson.com", status: "Active" }
    ],
    storage: "20 GB" // 👈 Added
  },
  {
    name: "Delta Corp",
    email: "info@deltacorp.com",
    plan: "Silver",
    planType: "Monthly",
    avatar: "https://i.ibb.co/Pzr45DCB/image5.jpg",
    date: "2025-07-01",
    time: "11:50:33",
    expired: "Jun 11, 2025",
    counts: { users: 12 },
    users: [
      { id: 1, name: "Michael Scott", email: "michael@delta.com", status: "Active" },
      { id: 2, name: "Dwight Schrute", email: "dwight@delta.com", status: "Active" },
      { id: 3, name: "Jim Halpert", email: "jim@delta.com", status: "Active" },
      { id: 4, name: "Pam Beesly", email: "pam@delta.com", status: "Active" },
      { id: 5, name: "Ryan Howard", email: "ryan@delta.com", status: "Inactive" },
      { id: 6, name: "Andy Bernard", email: "andy@delta.com", status: "Active" },
      { id: 7, name: "Stanley Hudson", email: "stanley@delta.com", status: "Active" },
      { id: 8, name: "Phyllis Vance", email: "phyllis@delta.com", status: "Active" },
      { id: 9, name: "Angela Martin", email: "angela@delta.com", status: "Active" },
      { id: 10, name: "Oscar Martinez", email: "oscar@delta.com", status: "Active" },
      { id: 11, name: "Kevin Malone", email: "kevin@delta.com", status: "Active" },
      { id: 12, name: "Creed Bratton", email: "creed@delta.com", status: "Active" }
    ],
    storage: "50 GB" // 👈 Added
  },
  {
    name: "Nova Enterprises",
    email: "contact@novaent.com",
    plan: "Gold",
    planType: "Yearly",
    avatar: "https://i.ibb.co/Pzr45DCB/image5.jpg",
    date: "2025-07-03",
    time: "09:10:00",
    expired: "May 25, 2025",
    counts: { users: 11 },
    users: [
      { id: 1, name: "Nova Smith", email: "nova@novaent.com", status: "Active" },
      { id: 2, name: "Alex Turner", email: "alex@novaent.com", status: "Active" },
      { id: 3, name: "Taylor Swift", email: "taylor@novaent.com", status: "Active" },
      { id: 4, name: "Jordan Lee", email: "jordan@novaent.com", status: "Active" },
      { id: 5, name: "Casey James", email: "casey@novaent.com", status: "Active" },
      { id: 6, name: "Morgan Reed", email: "morgan@novaent.com", status: "Active" },
      { id: 7, name: "Riley Fox", email: "riley@novaent.com", status: "Active" },
      { id: 8, name: "Avery Clark", email: "avery@novaent.com", status: "Active" },
      { id: 9, name: "Quinn Bell", email: "quinn@novaent.com", status: "Active" },
      { id: 10, name: "Jamie King", email: "jamie@novaent.com", status: "Active" },
      { id: 11, name: "Skyler Grey", email: "skyler@novaent.com", status: "Active" }
    ],
    storage: "75 GB" // 👈 Added
  }
];
const Company = () => {
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState(initialCompanies);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editCompany, setEditCompany] = useState({ name: "", email: "" });
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [resetIndex, setResetIndex] = useState(null);
  const [newPassword, setNewPassword] = useState("");

const [viewUserIndex, setViewUserIndex] = useState(null); 
  const [viewMode, setViewMode] = useState("card"); 

  const [filter, setFilter] = useState({
    plan: "",
    startDate: "",
    endDate: "",
  });
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset for:", companies[resetIndex].name, "=>", newPassword);
    setResetIndex(null);
    setNewPassword("");
    setConfirmPassword("");
  };
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- Add this line
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    date: "",
    expired: "",
    plan: "",
    planType: "", // "Monthly" or "Yearly"
    avatar: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const filteredCompanies = companies.filter((company) => {
    const matchPlan = filter.plan === "" || company.plan === filter.plan;
    const matchStart =
      filter.startDate === "" ||
      new Date(company.date) >= new Date(filter.startDate);
    const matchEnd =
      filter.endDate === "" ||
      new Date(company.expired) <= new Date(filter.endDate);
    return matchPlan && matchStart && matchEnd;
  });

  const navigate = useNavigate();

  const toggleMenu = (index) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };


  const handleEdit = (index) => {
    setEditCompany({ ...companies[index] });
    setEditIndex(index);
    setActiveMenuIndex(null);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setActiveMenuIndex(null);
  };

  const confirmDelete = () => {
    const updated = [...companies];
    updated.splice(deleteIndex, 1);
    setCompanies(updated);
    setDeleteIndex(null);
  };

  const saveChanges = () => {
    const updated = [...companies];
    updated[editIndex] = editCompany;
    setCompanies(updated);
    setEditIndex(null);
  };
  const badgeStyles = {
    Bronze: {
      backgroundImage: "linear-gradient(to right, #ad7c59, #cd7f32, #a97142)",
      color: "#fff",
      boxShadow: "0 0 8px rgba(173, 124, 89, 0.5)",
    },
    Silver: {
      backgroundImage: "linear-gradient(to right, #a9a9a9, #bdbdbd, #d3d3d3)", // Graphite to light silver
      color: "#000",
      boxShadow: "0 0 10px rgba(140, 140, 140, 0.5)",
      buttonColor: "#6e6e6e", // Metallic steel
    },

    Gold: {
      backgroundImage: "linear-gradient(to right, #f5d76e, #ffd700, #e6be8a)",
      color: "#000",
      boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
    },
    Platinum: {
      backgroundImage: "linear-gradient(to right, #cfe9f9, #e3f2fd, #f5f7fa)", // Frosted bluish white
      color: "#000",
      boxShadow: "0 0 10px rgba(120, 160, 200, 0.4)",
      buttonColor: "#4a6fa5", // Deep ice-blue
    },
  };

  return (
    <div
      className="container-fluid py-4 px-4 mt-4 mt-md-0"
      style={{
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      {/* Container with vertical spacing */}
      <div className="mb-4">
        {/* Heading + Add Company Button Row */}
        {/* Heading + Add Company Button Row */}
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          {/* Left: Heading */}
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold mb-0 d-flex align-items-center">
              <BsBuildings className="me-2 fs-4 text-warning" />
              Manage Companies
            </h4>
          </div>

          {/* Right: View Toggle Buttons + Add Company Button */}

          <div className="d-flex align-items-center gap-3">
            {/* 🔄 View Toggle Buttons */}
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm d-flex align-items-center gap-2 ${
                  viewMode === "card" ? "btn-dark" : "btn-outline-secondary"
                }`}
                onClick={() => setViewMode("card")}
                style={{
                  backgroundColor:
                    viewMode === "card" ? "#53b2a5" : "transparent",
                  color: viewMode === "card" ? "#fff" : "#53b2a5",
                  borderColor: "#53b2a5",
                  padding: "6px 12px",
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fas fa-border-all"></i>
              </button>

              <button
                className={`btn btn-sm d-flex align-items-center gap-2 ${
                  viewMode === "table" ? "btn-dark" : "btn-outline-secondary"
                }`}
                onClick={() => setViewMode("table")}
                style={{
                  backgroundColor:
                    viewMode === "table" ? "#53b2a5" : "transparent",
                  color: viewMode === "table" ? "#fff" : "#53b2a5",
                  borderColor: "#53b2a5",
                  padding: "6px 12px",
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fas fa-list-alt"></i>
              </button>
            </div>

            {/* ➕ Add Company Button */}
            <button
              className="btn btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "#53b2a5",
                borderColor: "#53b2a5",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "25px",
                fontWeight: "500",
                boxShadow: "0 4px 10px rgba(83, 178, 165, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <BsPlusCircle className="fs-6" />
              Add Company
            </button>
          </div>
        </div>

        {/* Filters Row - aligned to right end */}
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-3">
          {/* Date Filters Row */}
          <div className="d-flex align-items-center flex-wrap gap-3 justify-content-end">
            {/* Start Date */}
            <div
              className="d-flex align-items-center"
              style={{ minWidth: "220px" }}
            >
              <label
                className="form-label mb-0 fw-semibold small me-2"
                style={{ width: "80px", whiteSpace: "nowrap" }}
              >
                Start Date
              </label>
              <input type="date" className="form-control form-control-sm" />
            </div>

            {/* Expiry Date */}
            <div
              className="d-flex align-items-center"
              style={{ minWidth: "220px" }}
            >
              <label
                className="form-label mb-0 fw-semibold small me-2"
                style={{ width: "80px", whiteSpace: "nowrap" }}
              >
                Expiry Date
              </label>
              <input type="date" className="form-control form-control-sm" />
            </div>
          </div>

          {/* Plan Dropdown */}
          <div
            className="d-flex align-items-center"
            style={{ minWidth: "220px" }}
          >
            <label
              className="form-label mb-0 fw-semibold small me-2"
              style={{ width: "80px" }}
            >
              Plan
            </label>
            <select className="form-select form-select-sm">
              <option value="">All Plans</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="platinum">Platinum</option>
              <option value="bronze">Bronze</option>
              <option value="enterprises">Enterprises</option>
            </select>
          </div>
        </div>
      </div>

      {/* ✅ Conditional View Rendering */}
      {viewMode === "card" ? (
        <div className="row g-4">
          {filteredCompanies.map((company, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
          <div
  className="card shadow-sm rounded-4 p-3 border-0 card-hover position-relative"

  style={{ minHeight: "260px" }}
>
                {/* Header: Badge + Menu */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span
                    className="badge px-3 py-2 rounded-pill fw-semibold"
                    style={badgeStyles[company.plan]}
                  >
                    {company.plan}
                  </span>

                  <div className="dropdown-icon position-relative">
                    <BsThreeDotsVertical
                      className="text-muted"
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleMenu(index)}
                    />
{activeMenuIndex === index && (
  <div className="custom-dropdown shadow rounded-3 p-2" style={{ minWidth: "180px" }}>
    {/* ✏️ Edit */}
    <div
      className="dropdown-item d-flex align-items-center text-warning fw-semibold mb-2"
      onClick={() => handleEdit(index)}
      style={{
        cursor: "pointer",
        backgroundColor: "#fff",
        borderRadius: "6px",
        padding: "8px 10px",
      }}
    >
      <BsPencilSquare className="me-2" />
      Edit
    </div>

    {/* 🔐 Reset Password */}
    <div
      className="dropdown-item d-flex align-items-center text-primary fw-semibold mb-2"
      onClick={() => setResetIndex(index)}
      style={{
        cursor: "pointer",
        backgroundColor: "#fff",
        borderRadius: "6px",
        padding: "8px 10px",
        color: "#007bff",
      }}
    >
      <BsGear className="me-2" />
      Reset Password
    </div>

    {/* 🛡️ Login as Company */}
    <div
      className="dropdown-item d-flex align-items-center fw-semibold text-success mb-2"
      onClick={() => navigate("/")}
      style={{
        cursor: "pointer",
        backgroundColor: "#fff",
        borderRadius: "6px",
        padding: "8px 10px",
        color: "#338871",
      }}
    >
      <BsShieldLock className="me-2" />
      Login as Company
    </div>

    {/* ❌ Login Disable */}
    <div
      className="dropdown-item d-flex align-items-center text-danger fw-semibold"
      style={{
        cursor: "default",
        backgroundColor: "#fff",
        borderRadius: "6px",
        padding: "8px 10px",
      }}
    >
      <BsSlashCircle className="me-2" />
      Login Disable
    </div>
  </div>
)}

                  </div>
                </div>

                {/* Avatar & Info */}
                <div className="d-flex align-items-center gap-3 mb-2">
                  <img
                    src={company.avatar}
                    alt={company.name}
                    className="rounded-circle"
                    width="45"
                    height="45"
                  />
                  <div>
                    <h6 className="mb-0 fw-semibold">{company.name}</h6>
                    <small className="text-muted">{company.email}</small>
                  </div>
                </div>

                {/* Start & Expiry Dates in Separate Rows */}
                <div className="text-muted small mb-2 mt-3 px-1 ">
                  {/* Plan Type */}
                  <div className="d-flex align-items-center mt-1 mb-1">
                    <BsCalendarWeek className="me-3 text-info" />
                    <strong className="me-1">Type:</strong>{" "}
                    {company.planType || "N/A"}
                  </div>
                  <div className="mb-1 d-flex align-items-center">
                    <BsCalendarEvent className="me-3 text-primary" />
                    <strong className="me-1">Start:</strong> {company.date}
                  </div>
                  <div className="d-flex align-items-center">
                    <BsCalendarEvent className="me-3 text-danger" />
                    <strong className="me-1">End:</strong> {company.expired}
                  </div>
                </div>

            
                {/* Centered Small Buttons in Same Row */}
                <div className="d-flex justify-content-center gap-2 mt-2">
  <button
    className="btn btn-sm py-1 px-2 text-white"
    style={{
      backgroundColor: "#53b2a5",
      borderColor: "#53b2a5",
      fontSize: "0.75rem",
    }}
    onClick={() => navigate("/superadmin/planpricing")}
  >
    Upgrade
  </button>
  <button
    className="btn btn-outline-secondary btn-sm py-1 px-2 text-black"
    style={{ fontSize: "0.75rem" }}
    onClick={() => setViewUserIndex(index)}
  >
    <BsPeopleFill className="me-1" />
    {company.counts.users} Users
  </button>
  <button
    className="btn btn-outline-secondary btn-sm py-1 px-2 text-black"
    style={{ fontSize: "0.75rem" }}
  >
    <BsCloud className="me-1" />
    {company.storage || "N/A"}
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card mt-4 shadow-sm rounded-4">
          {/* Company Table View */}
          <div className="mt-3 mb-2 rounded-4">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="mb-0 fw-bold">Company Table View</h5>
            </div>
            <div className=" table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                <tr>
  <th>#</th>
  <th>Avatar</th>
  <th>Name</th>
  <th>Email</th>
  <th>Plan</th>
  <th>Plan Type</th>
  <th>Start Date</th>
  <th>Expiry Date</th>
  <th>Total Users</th>
  <th>Storage</th>  {/* 👈 Added */}
  <th>Actions</th>
</tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company, index) => (
                 <tr key={index}>
                 <td>{index + 1}</td>
                 <td>
                   <img src={company.avatar} alt={company.name} className="rounded-circle" width="40" height="40" />
                 </td>
                 <td>{company.name}</td>
                 <td>{company.email}</td>
                 <td>
                   <span className="badge px-3 py-2 rounded-pill fw-semibold" style={badgeStyles[company.plan]}>
                     {company.plan}
                   </span>
                 </td>
                 <td>
                   <span className="badge bg-info bg-opacity-10 text-info px-2 py-1 rounded-pill">
                     {company.planType || "N/A"}
                   </span>
                 </td>
                 <td>{company.date}</td>
                 <td>{company.expired}</td>
                 <td>{company.counts.users}</td>
                 <td>{company.storage || "N/A"}</td>  {/* 👈 Added */}
                 <td>
                   <div className="d-flex gap-2">
                     <button className="btn btn-sm btn-warning" onClick={() => handleEdit(index)} title="Edit Company">
                       <BsPencilSquare />
                     </button>
                     <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)} title="Delete Company">
                       <BsTrash />
                     </button>
                     <button className="btn btn-sm btn-success" onClick={() => navigate("/")} title="Login as Company">
                       <BsShieldLock />
                     </button>
                     <button className="btn btn-sm btn-info text-black" onClick={() => setViewUserIndex(index)} title="View Users">
                       <BsEye />
                     </button>
                   </div>
                 </td>
               </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 p-3 position-relative">
              {/* Close Button */}
              <button
                type="button"
                className="btn btn-sm btn-danger rounded-circle position-absolute"
                style={{
                  width: "35px",
                  height: "35px",
                  top: "10px",
                  right: "10px",
                  zIndex: 10,
                }}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="modal-header border-0 pt-3 pb-1">
                <h5 className="modal-title fw-bold">Create Company</h5>
              </div>
              {/* Logo Upload */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Company Logo</label>
                <div className="d-flex align-items-center gap-3">
                  {/* Logo Preview */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "10px",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #ddd",
                      overflow: "hidden",
                    }}
                  >
                    {newCompany.avatar ? (
                      <img
                        src={newCompany.avatar}
                        alt="Logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#aaa",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        No Logo
                      </div>
                    )}
                  </div>

                  {/* Upload & Clear Buttons */}
                  <div className="d-flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setNewCompany({
                              ...newCompany,
                              avatar: reader.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: "none" }}
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="btn btn-sm btn-outline-primary"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                    >
                      Choose Logo
                    </label>
                    {newCompany.avatar && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          setNewCompany({ ...newCompany, avatar: "" })
                        }
                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <small className="text-muted">Max 4MB, JPG/PNG preferred</small>
              </div>
              {/* Modal Body */}
              <div className="modal-body pt-1">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Company Name"
                      value={newCompany.name}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={newCompany.email}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, email: e.target.value })
                      }
                    />
                  </div>

                  {/* Start Date */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={newCompany.date}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, date: e.target.value })
                      }
                    />
                  </div>

                  {/* Expire Date */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Expire Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={newCompany.expired}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          expired: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Plan Dropdown */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Plan <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={newCompany.plan}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, plan: e.target.value })
                      }
                    >
                      <option value="">Select Plan</option>
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  {/* Plan Type */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Plan Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={newCompany.planType}
                      onChange={(e) => {
                        const type = e.target.value;
                        setNewCompany({ ...newCompany, planType: type });

                        // Auto-calculate dates
                        if (type) {
                          const startDate = new Date();
                          let endDate = new Date();

                          if (type === "Monthly") {
                            endDate.setMonth(startDate.getMonth() + 1);
                          } else if (type === "Yearly") {
                            endDate.setFullYear(startDate.getFullYear() + 1);
                          }

                          // Format to YYYY-MM-DD
                          const formatDate = (date) =>
                            date.toISOString().split("T")[0];

                          setNewCompany((prev) => ({
                            ...prev,
                            date: formatDate(startDate),
                            expired: formatDate(endDate),
                          }));
                        }
                      }}
                    >
                      <option value="">Select Type</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  {/* Password */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={newCompany.password}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm password"
                      value={newCompany.confirmPassword}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top-0 pt-3">
                <button
                  className="btn btn-dark px-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success px-4"
                  onClick={() => {
                    // Validation
                    if (
                      !newCompany.name ||
                      !newCompany.email ||
                      !newCompany.date ||
                      !newCompany.expired ||
                      !newCompany.plan
                    ) {
                      alert("Please fill all required fields.");
                      return;
                    }
                    if (newCompany.password !== newCompany.confirmPassword) {
                      alert("Passwords do not match!");
                      return;
                    }

                    // Create new company object
                    const companyToAdd = {
                      id: companies.length + 1,
                      name: newCompany.name,
                      email: newCompany.email,
                      plan: newCompany.plan,
                      avatar:
                        newCompany.avatar ||
                        "https://i.ibb.co/Pzr45DCB/image5.jpg", // fallback
                      date: newCompany.date,
                      time: "00:00:00", // default
                      expired: newCompany.expired,
                      counts: { users: 0 },
                      accountUrl: newCompany.accountUrl || "-",
                      phoneNumber: newCompany.phoneNumber || "-",
                      website: newCompany.website || "-",
                    };

                    // Add to list
                    setCompanies([...companies, companyToAdd]);
                    // Reset form
                    setNewCompany({
                      name: "",
                      email: "",
                      date: "",
                      expired: "",
                      plan: "",
                      avatar: "",
                      accountUrl: "",
                      phoneNumber: "",
                      website: "",
                      password: "",
                      confirmPassword: "",
                    });
                    // Close modal
                    setShowModal(false);
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editIndex !== null && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 p-4 position-relative">
              {/* Close Button */}
              <button
                type="button"
                className="btn btn-sm btn-danger rounded-circle position-absolute"
                style={{
                  width: "35px",
                  height: "35px",
                  top: "10px",
                  right: "10px",
                }}
                onClick={() => setEditIndex(null)}
              >
                ✕
              </button>

              {/* Header */}
              <div className="modal-header border-0 pt-3 pb-1">
                <h5 className="modal-title fw-bold">Edit Company</h5>
              </div>

              {/* Form Body */}
              <div className="modal-body pt-1">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCompany.name}
                      onChange={(e) =>
                        setEditCompany({ ...editCompany, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editCompany.email}
                      onChange={(e) =>
                        setEditCompany({
                          ...editCompany,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-top-0 pt-3">
                <button
                  className="btn btn-dark px-4"
                  onClick={() => setEditIndex(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning px-4 text-white"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteIndex !== null && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content rounded-4 p-4 text-center">
              <p className="fw-semibold fs-5 mb-4">
                Are you sure you want to delete this?
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-dark px-4"
                  onClick={() => setDeleteIndex(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{resetIndex !== null && (
  <div
    className="modal d-flex align-items-center justify-content-center"
    style={{
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 1050,
    }}
  >
    <div className="modal-dialog modal-md modal-dialog-centered">
      <div className="modal-content rounded-4 p-4 position-relative">
        {/* Close Button */}
        <button
          type="button"
          className="btn btn-sm btn-danger rounded-circle position-absolute"
          style={{
            width: "35px",
            height: "35px",
            top: "10px",
            right: "10px",
          }}
          onClick={() => setResetIndex(null)}
        >
          ✕
        </button>
        {/* Header */}
        <div className="modal-header border-0 pb-1 pt-3">
          <h5 className="modal-title fw-bold">Reset Password</h5>
        </div>
        {/* Body */}
        <div className="modal-body pt-0">
          <p className="mb-3">
            Reset password for <strong>{companies[resetIndex].name}</strong>
          </p>
          <div className="mb-3">
            <label className="form-label">New Password*</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password*</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword} // <-- New state
              onChange={(e) => setConfirmPassword(e.target.value)} // <-- New handler
            />
          </div>
        </div>
        {/* Footer */}
        <div className="modal-footer border-top-0 pt-3">
          <button
            className="btn btn-outline-secondary px-4"
            onClick={() => setResetIndex(null)}
          >
            Cancel
          </button>
          <button
            className="btn btn-success px-4"
            onClick={handleResetPassword}
            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{/* User Details Modal */}
{viewUserIndex !== null && (
  <div
    className="modal d-flex align-items-center justify-content-center"
    style={{
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 1050,
    }}
  >
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content rounded-4 p-4 position-relative">
        <button
          type="button"
          className="btn btn-sm btn-danger rounded-circle position-absolute"
          style={{
            width: "35px",
            height: "35px",
            top: "10px",
            right: "10px",
          }}
          onClick={() => setViewUserIndex(null)}
        >
          ✕
        </button>
        <div className="modal-header border-0 pb-1 pt-3">
          <h5 className="modal-title fw-bold">
            Users of {companies[viewUserIndex].name}
          </h5>
        </div>
        <div className="modal-body pt-0">
          {companies[viewUserIndex].users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
       
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {companies[viewUserIndex].users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                 
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="modal-footer border-top-0 pt-3">
          <button
            className="btn btn-secondary px-4"
            onClick={() => setViewUserIndex(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>

   

  );
};

export default Company;