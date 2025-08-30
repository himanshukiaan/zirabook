import React from "react";
import { useTheme } from "../../themeContext";
import "./CompanyDashboard.css";
import {
  Card,
  Row,
  Col,
  Table,
  Dropdown,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaUser,
  FaUserCheck,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { BsBagDashFill } from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CompanyDashboard = () => {
  const { theme } = useTheme();
  
  const summaryCards = [
    {
      label: "Total Purchase Due",
      amount: "$307,144",
      icon: <BsBagDashFill size={30} className="text-warning" />,
      color: "#fff3cd",
    },
    {
      label: "Total Sales Due",
      amount: "$4,385",
      icon: <FaFileInvoiceDollar size={30} className="text-success" />,
      color: "#d4edda",
    },
    {
      label: "Total Sale Amount",
      amount: "$385,656.50",
      icon: <FaFileInvoice size={30} className="text-info" />,
      color: "#cce5ff",
    },
    {
      label: "Total Expense",
      amount: "$40,000",
      icon: <FaFileInvoiceDollar size={30} className="text-danger" />,
      color: "#f8d7da",
    },
  ];

  const stats = [
    {
      label: "Customers",
      count: 100,
      bg: "#FFE8CC",
      icon: <FaUser size={28} className="text-warning" />,
    },
    {
      label: "Vendors",
      count: 110,
      bg: "#D0EBFF",
      icon: <FaUserCheck size={28} className="text-info" />,
    },
    {
      label: "Purchase Invoice",
      count: 150,
      bg: "#E3D7FF",
      icon: <FaFileInvoice size={28} className="text-primary" />,
    },
    {
      label: "Sales Invoice",
      count: 170,
      bg: "#D8F5E8",
      icon: <FaFileInvoiceDollar size={28} className="text-success" />,
    },
  ];

  const data = [
    { name: "Jan", Sales: 120, Purchase: 100 },
    { name: "Feb", Sales: 200, Purchase: 150 },
    { name: "Mar", Sales: 300, Purchase: 180 },
    { name: "Apr", Sales: 290, Purchase: 100 },
    { name: "May", Sales: 140, Purchase: 40 },
    { name: "Jun", Sales: 60, Purchase: 30 },
    { name: "Jul", Sales: 200, Purchase: 90 },
    { name: "Aug", Sales: 250, Purchase: 110 },
    { name: "Sep", Sales: 100, Purchase: 70 },
  ];

  return (
    <div className={`container-fluid mt-3 mt-sm-3 ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Company Name at Top */}
      <div className="mb-4">
        <h3 className="semi-bold text-left theme-text" style={{ color: "var(--bs-primary)" }}>ZirakBook Company</h3>
      </div>

      {/* Summary Cards */}
      <Row className="g-4">
        {summaryCards.map((card, i) => (
          <Col md={3} key={i}>
            <Card
              className="shadow-sm border-0 rounded-3 theme-card"
              style={{ backgroundColor: card.color }}
            >
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-semibold mb-1 theme-text">{card.amount}</h5>
                  <div className="text-muted small">{card.label}</div>
                </div>
                <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm">
                  {card.icon}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Stats Cards */}
      <Row className="my-4 g-4">
        {stats.map((stat, i) => (
          <Col md={3} key={i}>
            <Card
              className="shadow-sm border-0 p-3 rounded-3 theme-card"
              style={{ backgroundColor: stat.bg }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold mb-0 theme-text">{stat.count}</h4>
                  <div className="small">{stat.label}</div>
                </div>
                <div className="fs-3">{stat.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chart Section - Now Full Width */}
      <Row className="g-4 align-items-stretch">
        <Col md={12}>
          <Card className="h-100 border-0 shadow-sm rounded-4 p-4 theme-card">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h6 className="fw-semibold mb-0 theme-text">
                📊 Sales & Purchase Report
              </h6>
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  className="border rounded-3 shadow-sm"
                  size="sm"
                >
                  2025
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>2024</Dropdown.Item>
                  <Dropdown.Item>2025</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartTooltip />
                <Legend />
                <Bar dataKey="Sales" fill="var(--bs-primary)" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="Purchase"
                  fill="var(--bs-success)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyDashboard;