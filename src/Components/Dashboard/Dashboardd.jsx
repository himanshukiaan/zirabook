import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BsBuilding,
  BsPeople,
  BsCurrencyDollar,
  BsPersonPlus,
  BsCalendar2,
} from "react-icons/bs";
import "./Dashboardd.css"; // Keep your styles here

const monthlyData = [
  { name: "Jan", Growth: 1200, users: 6500, revenue: 250000 },
  { name: "Feb", Growth: 1500, users: 7200, revenue: 320000 },
  { name: "Mar", Growth: 1800, users: 8000, revenue: 400000 },
  { name: "Apr", Growth: 2100, users: 8500, revenue: 480000 },
  { name: "May", Growth: 2400, users: 9000, revenue: 550000 },
  { name: "Jun", Growth: 2800, users: 9500, revenue: 620000 },
  { name: "Jul", Growth: 3200, users: 10000, revenue: 700000 },
  { name: "Aug", Growth: 3500, users: 10500, revenue: 780000 },
  { name: "Sep", Growth: 3800, users: 11000, revenue: 850000 },
  { name: "Oct", Growth: 4200, users: 11500, revenue: 920000 },
  { name: "Nov", Growth: 4500, users: 12000, revenue: 1000000 },
  { name: "Dec", Growth: 5000, users: 12500, revenue: 1100000 },
];

const Dashboardd = () => {
  return (
    <div className="dashboard container-fluid py-4 px-3">
      {/* Cards Section */}
      <div className="row g-4 mb-4">
        {[
          {
            icon: <BsBuilding />,
            value: "5,000",
            label: "Total Company",
            growth: "+12.5%",
            bg: "success",
          },
          {
            icon: <BsPeople />,
            value: "12,50",
            label: "Total Request",
            growth: "+8.2%",
            bg: "success",
          },
          {
            icon: <BsCurrencyDollar />,
            value: "$1.1M",
            label: "Total Revenue",
            growth: "+15.3%",
            bg: "success",
          },
          {
            icon: <BsPersonPlus />,
            value: "145",
            label: "New Signups Company",
            growth: "Today",
            bg: "primary text-white",
          },
        ].map((card, index) => (
          <div className="col-12 col-sm-6 col-lg-3" key={index}>
            <div className="card h-100 shadow-sm stat-card">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div className="icon-box fs-4 text-dark">{card.icon}</div>
                <div
                  className={`badge bg-${card.bg} rounded-pill px-3 py-1 fw-semibold`}
                >
                  {card.growth}
                </div>
              </div>
              <div className="card-body pt-0">
                <h4 className="fw-bold mb-1">{card.value}</h4>
                <p className="text-muted mb-0">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        {/* Line Chart - Growth */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h6 className="m-0 fw-bold">Total Growth</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Growth"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart - Signup */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h6 className="m-0 fw-bold">Signup Company</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#53b2a5" name="Signup Company" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Area Chart - Revenue */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="m-0 fw-bold">Revenue Trends</h6>
              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                <BsCalendar2 /> 2025
              </button>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardd;
