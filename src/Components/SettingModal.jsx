import React, { useState } from "react";
import { Button, Offcanvas, Form } from "react-bootstrap";
import "./SettingModal.css";
import defaultsidebar from "../../src/assets/defaultsidebar.jpeg";
import minilayout from "../../src/assets/minilayout.jpeg";
import withoutheader from "../../src/assets/withoutheader.jpeg";
import ThemeSetting from "./SettingModal/ThemeSetting";

const SettingModal = ({ show, handleClose }) => {
  const [layout, setLayout] = useState("default");
  const [layoutWidth, setLayoutWidth] = useState("fluid");
  const [topbarColor, setTopbarColor] = useState("");
  const [sidebarColor, setSidebarColor] = useState("sidebar-bg-default"); // Now class name

  const layoutImages = [
    { id: "default", src: defaultsidebar, alt: "Default", name: "Default" },
    { id: "mini", src: minilayout, alt: "Mini", name: "Mini Layout" },
    { id: "no-header", src: withoutheader, alt: "No Header", name: "No-Header" },
  ];

  const topbarColors = ["#ffffff", "#000000", "#6c757d", "#0d6efd", "#6610f2", "#20c997", "#6366f1"];

  // Define color options with CSS class and display color
  const sidebarColorOptions = [
    { class: "sidebar-bg-default", color: "#343a40", name: "Dark" },
    { class: "sidebar-bg-light", color: "#f8f9fa", name: "Light" },
    { class: "sidebar-bg-purple", color: "#6f42c1", name: "Purple" },
    { class: "sidebar-bg-pink", color: "#d63384", name: "Pink" },
    { class: "sidebar-bg-green", color: "#198754", name: "Green" },
    { class: "sidebar-bg-blue", color: "#032d45", name: "Blue" },
  ];

  // Save selected sidebar class to localStorage and close
  const handleApply = () => {
    localStorage.setItem("sidebarColorClass", sidebarColor);
    // You can also dispatch to context or update state globally here
    handleClose();
  };

  // Reset all settings
  const handleReset = () => {
    setLayout("default");
    setLayoutWidth("fluid");
    setTopbarColor("");
    setSidebarColor("sidebar-bg-default");
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-bold">Theme Customizer</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <small className="text-muted">Choose your themes & layouts etc.</small>

        {/* Layouts */}
        <div className="mt-4">
          <h6 className="fw-semibold">Select Layouts</h6>
          <div className="d-flex gap-3 mt-2">
            {layoutImages.map((item) => (
              <img
                key={item.id}
                src={item.src}
                alt={item.alt}
                className={`layout-img rounded ${layout === item.id ? "border border-primary" : ""}`}
                onClick={() => setLayout(item.id)}
                style={{ cursor: "pointer", width: "80px" }}
              />
            ))}
          </div>
        </div>

        {/* Layout Width */}
        <div className="mt-4">
          <h6 className="fw-semibold">Layout Width</h6>
          <div className="d-flex gap-3 mt-2">
            <Button
              variant={layoutWidth === "fluid" ? "primary" : "outline-secondary"}
              size="sm"
              onClick={() => setLayoutWidth("fluid")}
            >
              Fluid Layout
            </Button>
            <Button
              variant={layoutWidth === "boxed" ? "primary" : "outline-secondary"}
              size="sm"
              onClick={() => setLayoutWidth("boxed")}
            >
              Boxed Layout
            </Button>
          </div>
        </div>

        {/* Top Bar Color */}
        <div className="mt-4">
          <h6 className="fw-semibold">Top Bar Color</h6>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {topbarColors.map((color) => (
              <div
                key={color}
                className={`color-box rounded ${topbarColor === color ? "border border-dark border-2" : ""}`}
                style={{ backgroundColor: color, width: "30px", height: "30px", cursor: "pointer" }}
                onClick={() => setTopbarColor(color)}
              ></div>
            ))}
          </div>
        </div>

        {/* Sidebar Color */}
        <div className="mt-4">
          <h6 className="fw-semibold">Sidebar Color</h6>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {sidebarColorOptions.map((option) => (
              <div
                key={option.class}
                className={`color-box rounded ${sidebarColor === option.class ? "border border-dark border-2" : ""}`}
                style={{ backgroundColor: option.color, width: "30px", height: "30px", cursor: "pointer" }}
                onClick={() => setSidebarColor(option.class)}
                title={option.name}
              ></div>
            ))}
          </div>
        </div>

        {/* Theme Mode */}
        <div className="mt-4">
          <ThemeSetting />
        </div>

        {/* Footer Actions */}
        <div className="mt-4 d-flex justify-content-between align-items-center">
          <Button variant="outline-secondary" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SettingModal;