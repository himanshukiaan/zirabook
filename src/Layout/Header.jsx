import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import k1 from "../assets/kiaanlogo-.png";
import newlogo from "../assets/newlogozirakbookk.png"

import "./Header.css";
import ProfileModal from './ProfileModal'; // Correct path lagayein
const Header = ({ onToggleSidebar }) => {
  const [selectedLang, setSelectedLang] = useState("English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setShowLangDropdown(false);
    // Optional: Add language switch logic
  };

  return (
    <header className="py-3 px-3 header">
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        {/* Left Section */}
        <div className="d-flex align-items-center flex-grow-1 gap-3">
          <button
            className="btn d-lg-none"
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars text-white"></i>
          </button>

          {/* Logo */}
          <div className="d-none d-md-block">
            <img
              src={newlogo}
              alt="Logo"
              className="img-fluid sidebar-logo"
              style={{ maxHeight: "40px" }}
            />
          </div>
          {/* Search Input - Visible only on desktop */}
          {/* <input
  type="text"
  className="form-control d-none d-md-block"
  placeholder="Search..."
  style={{
    maxWidth: "300px",
    backgroundColor: "#ffffff",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    color: "#212529",
    padding: "6px 12px",
    fontSize: "14px",
  }}
/> */}


        </div>

        {/* Right Section */}
        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">

          {/* 🌐 Language Dropdown */}
          <div className="relative">
            <i
              className="fas fa-globe lang-dropdown-icon cursor-pointer"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            ></i>

            {showLangDropdown && (
              <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
                <li
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-black ${selectedLang === "English" ? "bg-yellow-300" : ""
                    }`}
                  onClick={() => handleLanguageSelect("English")}
                >
                  English
                </li>
                <li
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-black ${selectedLang === "Arabic" ? "bg-yellow-300" : ""
                    }`}
                  onClick={() => handleLanguageSelect("Arabic")}
                >
                  Arabic
                </li>
                <li
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-black ${selectedLang === "Pashto" ? "bg-yellow-300" : ""
                    }`}
                  onClick={() => handleLanguageSelect("Pashto")}
                >
                  Pashto
                </li>
              </ul>
            )}
          </div>


          {/* 🔔 Notifications */}
          <button className="btn position-relative">
            <i className="far fa-bell text-light"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle"></span>
          </button>

          {/* 👤 Profile Icon */}
          <div
            className="d-flex align-items-center me-3 ms-2"
            onClick={() => setShowProfileModal(true)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
              style={{ width: "35px", height: "35px" }}
            >
              P
            </div>
          </div>

          {/* Modal */}
          <ProfileModal
            show={showProfileModal}
            handleClose={() => setShowProfileModal(false)}
          />

          {/* 🔓 Logout */}
          <Link to="/">
            <button
              className="btn btn-outline"
              style={{ borderColor: "#53b2a5", color: "#53b2a5" }}
            >
              <i className="fas fa-sign-out-alt me-1"></i> Logout
            </button>

          </Link>


        </div>
      </div>
    </header>
  );
};

export default Header;
