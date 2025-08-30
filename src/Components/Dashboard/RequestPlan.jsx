import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelopeOpenText } from "react-icons/fa";
import "./RequestPlan.css";

const initialPlans = [
  { company: "Zerosoft Pvt Ltd", email: "amit@example.com", plan: "Gold", billing: "Yearly", date: "2025-06-29", status: "Pending" },
  { company: "Brightlabs Co.", email: "riya@example.com", plan: "Platinum", billing: "Monthly", date: "2025-06-30", status: "Approved" },
  { company: "NextGen Corp", email: "john@example.com", plan: "Basic", billing: "Monthly", date: "2025-07-01", status: "Rejected" },
  { company: "InnoTech Global", email: "fatima@example.com", plan: "Silver", billing: "Monthly", date: "2025-06-25", status: "Pending" },
  { company: "ThinkByte Solutions", email: "karan@example.com", plan: "Platinum", billing: "Yearly", date: "2025-06-28", status: "Approved" },
  { company: "AlphaEdge Ltd", email: "meera@example.com", plan: "Gold", billing: "Yearly", date: "2025-07-01", status: "Pending" },
  { company: "BlueOcean Inc", email: "vikram@example.com", plan: "Basic", billing: "Monthly", date: "2025-07-02", status: "Approved" },
  { company: "Digify India", email: "anjali@example.com", plan: "Platinum", billing: "Monthly", date: "2025-07-03", status: "Rejected" },
  { company: "Spark Solutions", email: "sahil@example.com", plan: "Silver", billing: "Monthly", date: "2025-07-04", status: "Pending" },
  { company: "Grow360", email: "divya@example.com", plan: "Basic", billing: "Yearly", date: "2025-07-05", status: "Pending" },
  { company: "Brightvision Ltd", email: "tanya@example.com", plan: "Platinum", billing: "Yearly", date: "2025-07-06", status: "Approved" },
  { company: "WebCraft", email: "raj@example.com", plan: "Gold", billing: "Monthly", date: "2025-07-06", status: "Rejected" },
  { company: "Softbridge Inc", email: "nidhi@example.com", plan: "Basic", billing: "Monthly", date: "2025-07-07", status: "Pending" },
  { company: "Zenithware", email: "manish@example.com", plan: "Platinum", billing: "Yearly", date: "2025-07-07", status: "Approved" },
  { company: "EvolveX", email: "alisha@example.com", plan: "Silver", billing: "Monthly", date: "2025-07-08", status: "Pending" }
];

const planMapping = {
  Basic: { display: "Basic", bgColor: "#b2dfdb" },
  Silver: { display: "Silver", bgColor: "#c0c0c0" },
  Gold: { display: "Gold", bgColor: "#ffd700" },
  Platinum: { display: "Platinum", bgColor: "#e5e4e2" }
};

const RequestPlan = () => {
  const [plans, setPlans] = useState(initialPlans);

  const handleAction = (index, newStatus) => {
    const updatedPlans = [...plans];
    updatedPlans[index].status = newStatus;
    setPlans(updatedPlans);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="badge bg-success px-2 px-sm-3 py-1 py-sm-2 rounded-pill">Approved</span>;
      case "Pending":
        return <span className="badge bg-warning text-dark px-2 px-sm-3 py-1 py-sm-2 rounded-pill">Pending</span>;
      case "Rejected":
        return <span className="badge bg-danger px-2 px-sm-3 py-1 py-sm-2 rounded-pill">Rejected</span>;
      default:
        return <span className="badge bg-secondary px-2 px-sm-3 py-1 py-sm-2 rounded-pill">{status}</span>;
    }
  };

  const renderActionButtons = (status, index) => {
    return (
      <div className="d-flex gap-1 gap-sm-2 justify-content-center flex-wrap">
        <button
          className="btn btn-outline-success btn-sm rounded-pill px-2 px-sm-3"
          disabled={status === "Approved"}
          onClick={() => handleAction(index, "Approved")}
        >
          Approve
        </button>
        <button
          className="btn btn-outline-danger btn-sm rounded-pill px-2 px-sm-3"
          disabled={status === "Rejected"}
          onClick={() => handleAction(index, "Rejected")}
        >
          Reject
        </button>
      </div>
    );
  };
  

  return (
    <div className="container-fluid p-3 p-md-4 bg-light">
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <FaEnvelopeOpenText size={24} className="text-primary me-2" />
          <h3 className="fw-bold m-0" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>
            Requested Plans
          </h3>
        </div>

        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="px-2 px-sm-3 py-3 d-none d-sm-table-cell">Company</th>
                  <th className="px-2 px-sm-3 py-3 d-none d-md-table-cell">Email</th>
                  <th className="px-2 px-sm-3 py-3">Plan</th>
                  <th className="px-2 px-sm-3 py-3 d-none d-lg-table-cell">Billing</th>
                  <th className="px-2 px-sm-3 py-3 d-none d-md-table-cell">Date</th>
                  <th className="px-2 px-sm-3 py-3">Status</th>
                  <th className="px-2 px-sm-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((user, idx) => (
                  <tr key={idx}>
                    <td className="px-2 px-sm-3 py-3 d-none d-sm-table-cell">
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                        {user.company}
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                        {user.email}
                      </span>
                    </td>
                    <td>
                      <span
                        className="px-2 px-sm-3 py-1 rounded-pill d-inline-block text-dark fw-semibold"
                        style={{
                          backgroundColor: planMapping[user.plan]?.bgColor || "#dee2e6",
                          minWidth: "70px",
                          fontSize: "0.85rem"
                        }}
                      >
                        {planMapping[user.plan]?.display || user.plan}
                      </span>
                    </td>
                    <td className="d-none d-lg-table-cell">{user.billing}</td>
                    <td className="d-none d-md-table-cell">{user.date}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>{renderActionButtons(user.status, idx)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-3 py-2 border-top">
            <div className="text-muted small mb-2 mb-sm-0">
              Showing 1 to {plans.length} of {plans.length} results
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <button className="page-link">«</button>
                </li>
                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>
                <li className="page-item">
                  <button className="page-link">2</button>
                </li>
                <li className="page-item">
                  <button className="page-link">3</button>
                </li>
                <li className="page-item">
                  <button className="page-link">»</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPlan;