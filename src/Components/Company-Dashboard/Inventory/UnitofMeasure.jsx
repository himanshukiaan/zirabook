import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";

const UnitOfMeasure = () => {
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const dummyData = [
      { _id: "1", name: "Kilogram", abbreviation: "kg" },
      { _id: "2", name: "Gram", abbreviation: "g" },
      { _id: "3", name: "Liter", abbreviation: "L" },
      { _id: "4", name: "Milliliter", abbreviation: "ml" },
      { _id: "5", name: "Piece", abbreviation: "pc" },
      { _id: "6", name: "Meter", abbreviation: "m" },
      { _id: "7", name: "Centimeter", abbreviation: "cm" },
    ];
    setUnits(dummyData);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    setUnitName("");
    setAbbreviation("");
    setEditId(null);
  };

  const handleModalShow = (data = null) => {
    if (data) {
      setEditId(data._id);
      setUnitName(data.name);
      setAbbreviation(data.abbreviation);
    }
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newUnit = {
      _id: editId || Date.now().toString(),
      name: unitName,
      abbreviation: abbreviation,
    };

    if (editId) {
      setUnits(units.map((u) => (u._id === editId ? newUnit : u)));
    } else {
      setUnits([...units, newUnit]);
    }

    handleModalClose();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this unit?");
    if (confirmDelete) {
      setUnits(units.filter((u) => u._id !== id));
      alert("Unit deleted successfully.");
    }
  };

  const totalPages = Math.ceil(units.length / itemsPerPage);
  const currentItems = units.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      const formatted = data.map((item, index) => ({
        _id: Date.now().toString() + index,
        name: item["Unit Name"] || "",
        abbreviation: item["Abbreviation"] || "",
      }));
      setUnits(formatted);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const exportData = units.map(({ name, abbreviation }) => ({
      "Unit Name": name,
      Abbreviation: abbreviation,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Units");
    XLSX.writeFile(wb, "unit-of-measure.xlsx");
  };

  const handleDownloadTemplate = () => {
    const template = [{ "Unit Name": "", Abbreviation: "" }];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "uom-template.xlsx");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mx-md-5 mt-5 mx-3">
      <div className="shadow p-4">
        <div className="d-flex justify-content-between flex-wrap gap-2">
          <h4 className="fw-semibold">Manage Unit of Measure</h4>
          <div className="d-flex gap-2 flex-wrap">
            <Button
              className="rounded-pill text-white"
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
              onClick={() => document.getElementById("excelImport").click()}
            >
              <i className="fas fa-file-import me-2" /> Import
            </Button>

            <input
              type="file"
              id="excelImport"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleImport}
            />

            <Button
              className="rounded-pill text-white"
              style={{ backgroundColor: "#fd7e14", borderColor: "#fd7e14" }}
              onClick={handleExport}
            >
              <i className="fas fa-file-export me-2" /> Export
            </Button>

            <Button
              className="rounded-pill text-white"
              style={{ backgroundColor: "#ffc107", borderColor: "#ffc107" }}
              onClick={handleDownloadTemplate}
            >
              <i className="fas fa-download me-2" /> Download
            </Button>
            <Button
              className="set_btn text-white fw-semibold"
              style={{ backgroundColor: '#3daaaa', borderColor: '#3daaaa' }}
              onClick={() => handleModalShow()}
            >
              <i className="fa fa-plus me-2"></i> Create Unit
            </Button>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <Table bordered striped hover>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Unit Name</th>
                <th>Abbreviation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((u, index) => (
                  <tr key={u._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.abbreviation}</td>
                    <td>
                      <Button
                    
                        onClick={() => handleModalShow(u)}
                        variant="link" className="text-warning p-0 me-2"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                 variant="link" className="text-danger p-0 me-2"
                        onClick={() => handleDelete(u._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center">No units found</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2 px-2">
          <span className="small text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, units.length)} of {units.length} entries
          </span>
          <nav>
            <ul className="pagination pagination-sm mb-0 flex-wrap">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link rounded-start"
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                >
                  &laquo;
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    style={currentPage === index + 1 ? { backgroundColor: '#3daaaa', borderColor: '#3daaaa' } : {}}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link rounded-end"
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Unit" : "Create Unit"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label>Unit Name</Form.Label>
              <Form.Control
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Abbreviation</Form.Label>
              <Form.Control
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleModalClose}>Close</Button>
              <Button variant="primary" type="submit" className="ms-2" style={{ backgroundColor: '#3daaaa', borderColor: '#3daaaa' }}>
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UnitOfMeasure;
