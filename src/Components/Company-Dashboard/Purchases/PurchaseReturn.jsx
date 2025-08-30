import React, { useState } from "react";
import { FaEdit, FaTrash, FaUndoAlt, FaTimes, FaEye } from "react-icons/fa";
import { BiEdit, BiSearch, BiX, BiPlus, BiTrash, BiShowAlt } from 'react-icons/bi';
import { Button, Form, Badge } from 'react-bootstrap';
import { FaArrowLeft } from "react-icons/fa";
import { Card } from "react-bootstrap";

const PurchaseReturn = () => {
    // Warehouse options
    const warehouseOptions = [
        'Main Warehouse',
        'North Branch',
        'South Branch',
        'East Branch',
        'West Branch'
    ];

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');
    const [warehouseFilter, setWarehouseFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Initial returns with referenceId and new voucher fields
    const [returns, setReturns] = useState([
        {
            id: 'PR-2025-001',
            invoice: 'PI-2025-001',
            vendor: 'Cocoa Suppliers Ltd',
            date: '2025-06-26',
            amount: 5000,
            status: 'Pending',
            reason: 'Damaged Items',
            description: 'Received damaged cocoa beans',
            warehouse: 'Main Warehouse',
            referenceId: 'REF-PR-1001',
            autoVoucherNo: 'VOU-PR-2025-001',
            manualVoucherNo: 'MAN-PR-001'
        },
        {
            id: 'PR-2025-002',
            invoice: 'PI-2025-002',
            vendor: 'Sugar Industries Inc',
            date: '2025-06-25',
            amount: 3200,
            status: 'Approved',
            reason: 'Wrong Items',
            description: 'Received brown sugar instead of white sugar',
            warehouse: 'North Branch',
            referenceId: 'REF-PR-1002',
            autoVoucherNo: 'VOU-PR-2025-002',
            manualVoucherNo: 'MAN-PR-002'
        },
        {
            id: 'PR-2025-003',
            invoice: 'PI-2025-003',
            vendor: 'Packaging Solutions',
            date: '2025-06-24',
            amount: 2500,
            status: 'Rejected',
            reason: 'Quality Issues',
            description: 'Packaging material not as per specifications',
            warehouse: 'South Branch',
            referenceId: 'REF-PR-1003',
            autoVoucherNo: 'VOU-PR-2025-003',
            manualVoucherNo: 'MAN-PR-003'
        },
        {
            id: 'PR-2025-004',
            invoice: 'PI-2025-004',
            vendor: 'Dairy Products Co',
            date: '2025-06-23',
            amount: 4800,
            status: 'Approved',
            reason: 'Excess Stock',
            description: 'Ordered 100 units but received 120 units',
            warehouse: 'East Branch',
            referenceId: 'REF-PR-1004',
            autoVoucherNo: 'VOU-PR-2025-004',
            manualVoucherNo: 'MAN-PR-004'
        }
    ]);

    // Form data with voucher numbers
    const [formData, setFormData] = useState({
        invoice: '',
        vendor: '',
        date: '',
        amount: '',
        reason: '',
        description: '',
        warehouse: warehouseOptions[0],
        referenceId: '',
        autoVoucherNo: '', // ← Auto-generated
        manualVoucherNo: '' // ← Manual input
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleViewClick = (returnData) => {
        setSelectedReturn(returnData);
    };

    const handleEditClick = (returnData) => {
        setSelectedReturn(null);
        setFormData({
            invoice: returnData.invoice,
            vendor: returnData.vendor,
            date: returnData.date,
            amount: returnData.amount,
            reason: returnData.reason,
            description: returnData.description,
            warehouse: returnData.warehouse,
            referenceId: returnData.referenceId,
            autoVoucherNo: returnData.autoVoucherNo,
            manualVoucherNo: returnData.manualVoucherNo
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setReturns(returns.filter(item => item.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const handleSubmit = () => {
        if (!formData.invoice || !formData.vendor || !formData.date || !formData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        if (isEditMode && selectedReturn) {
            // Update existing return
            const updatedReturns = returns.map(item =>
                item.id === selectedReturn.id ? {
                    ...item,
                    invoice: formData.invoice,
                    vendor: formData.vendor,
                    date: formData.date,
                    amount: parseInt(formData.amount),
                    reason: formData.reason,
                    description: formData.description,
                    warehouse: formData.warehouse,
                    autoVoucherNo: formData.autoVoucherNo,
                    manualVoucherNo: formData.manualVoucherNo
                } : item
            );
            setReturns(updatedReturns);
        } else {
            // Add new return
            const nextId = returns.length + 1;
            const autoRefId = `REF-PR-${1000 + nextId}`;
            const autoVoucherNo = `VOU-PR-2025-${String(nextId).padStart(3, '0')}`;
            const manualVoucherNo = formData.manualVoucherNo || `MAN-PR-${String(nextId).padStart(3, '0')}`;

            const newReturn = {
                id: `PR-2025-${String(returns.length + 1).padStart(3, '0')}`,
                invoice: formData.invoice,
                vendor: formData.vendor,
                date: formData.date,
                amount: parseInt(formData.amount),
                status: 'Pending',
                reason: formData.reason,
                description: formData.description,
                warehouse: formData.warehouse,
                referenceId: autoRefId,
                autoVoucherNo: autoVoucherNo,
                manualVoucherNo: manualVoucherNo
            };
            setReturns([...returns, newReturn]);
        }

        // Reset form
        setFormData({
            invoice: '',
            vendor: '',
            date: '',
            amount: '',
            reason: '',
            description: '',
            warehouse: warehouseOptions[0],
            referenceId: '',
            autoVoucherNo: '',
            manualVoucherNo: ''
        });
        setShowModal(false);
        setIsEditMode(false);
        setSelectedReturn(null);
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Pending': { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
            'Approved': { backgroundColor: '#d1e7dd', color: '#0a3622', border: '1px solid #a3cfbb' },
            'Rejected': { backgroundColor: '#f8d7da', color: '#58151c', border: '1px solid #f1aeb5' }
        };
        return styles[status] || { backgroundColor: '#e2e3e5', color: '#41464b', border: '1px solid #c4c8cc' };
    };

    const filteredReturns = returns.filter(item => {
        const matchesSearch = item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchesWarehouse = warehouseFilter === 'All' || item.warehouse === warehouseFilter;
        return matchesSearch && matchesStatus && matchesWarehouse;
    });

    return (
        <div className="mt-4 p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <h2 className="mb-0" style={{ fontWeight: 600, color: '#212529', fontSize: '28px' }}>
                        Purchase Returns
                    </h2>
                    <FaArrowLeft size={20} color="blue" />
                </div>
                <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
                    <Button
                        className="rounded-pill"
                        style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                    >
                        <i className="fas fa-file-import me-2" /> Import
                    </Button>
                    <Button
                        className="rounded-pill"
                        style={{ backgroundColor: "#fd7e14", borderColor: "#fd7e14" }}
                    >
                        <i className="fas fa-file-export me-2" /> Export
                    </Button>
                    <Button
                        className="rounded-pill"
                        style={{ backgroundColor: "#ffc107", borderColor: "#ffc107" }}
                    >
                        <i className="fas fa-download me-2" /> Download
                    </Button>
                    <button
                        className="btn text-white d-flex align-items-center rounded-pill px-3"
                        style={{ backgroundColor: '#3daaaa', border: '1px solid #3daaaa' }}
                        onClick={() => {
                            const nextId = returns.length + 1;
                            const autoRefId = `REF-PR-${1000 + nextId}`;
                            const autoVoucherNo = `VOU-PR-2025-${String(nextId).padStart(3, '0')}`;
                            setFormData({
                                invoice: '',
                                vendor: '',
                                date: '',
                                amount: '',
                                reason: '',
                                description: '',
                                warehouse: warehouseOptions[0],
                                referenceId: autoRefId,
                                autoVoucherNo: autoVoucherNo,
                                manualVoucherNo: ''
                            });
                            setIsEditMode(false);
                            setShowModal(true);
                        }}
                    >
                        <BiPlus size={18} className="me-2" />
                        New Return
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="row mb-4 g-3">
                <div className="col-lg-4 col-md-12">
                    <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                            <BiSearch size={18} style={{ color: '#6c757d' }} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search returns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: '1px solid #dee2e6', borderLeft: 'none' }}
                        />
                    </div>
                </div>
                <div className="col-lg-2 col-md-6">
                    <select
                        className="form-select custom-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">Status: All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div className="col-lg-2 col-md-6">
                    <select
                        className="form-select custom-select"
                        value={warehouseFilter}
                        onChange={(e) => setWarehouseFilter(e.target.value)}
                    >
                        <option value="All">Warehouse: All</option>
                        {warehouseOptions.map((warehouse, idx) => (
                            <option key={idx} value={warehouse}>{warehouse}</option>
                        ))}
                    </select>
                </div>
                <div className="col-lg-2 col-md-6">
                    <select
                        className="form-select custom-select"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="All">Date: All</option>
                        <option value="Today">Today</option>
                        <option value="Week">This Week</option>
                        <option value="Month">This Month</option>
                    </select>
                </div>
            </div>

            {/* Voucher Number Fields (New Section) */}
            <div className="row mb-4 g-3 px-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">Auto-Generated Voucher No</label>
                    <input
                        type="text"
                        className="form-control"
                        value={`VOU-PR-2025-${String(returns.length + 1).padStart(3, '0')}`}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa', fontWeight: '500' }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">Manual Voucher No</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter manual voucher number"
                        value={formData.manualVoucherNo}
                        onChange={(e) => setFormData(prev => ({ ...prev, manualVoucherNo: e.target.value }))}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle product-table mb-0">
                        <thead className="table-light text-white">
                            <tr>
                                <th className="py-3">REF ID</th>
                                <th className="py-3">AUTO VOUCHER</th> {/* New Column */}
                                <th className="py-3">MANUAL VOUCHER</th> {/* New Column */}
                                <th className="py-3">RETURN #</th>
                                <th className="py-3">INVOICE #</th>
                                <th className="py-3">VENDOR</th>
                                <th className="py-3">WAREHOUSE</th>
                                <th className="py-3">DATE</th>
                                <th className="py-3">AMOUNT</th>
                                <th className="py-3">STATUS</th>
                                <th className="py-3">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReturns.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: '500', color: '#0066cc', verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.referenceId}
                                    </td>
                                    <td style={{ fontWeight: '500', color: '#0066cc', verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.autoVoucherNo}
                                    </td>
                                    <td style={{ color: '#1c7ed6', fontWeight: '500', verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.manualVoucherNo || '—'}
                                    </td>
                                    <td style={{ fontWeight: '500', color: '#0066cc', verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.id}
                                    </td>
                                    <td style={{ color: '#6c757d', verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.invoice}
                                    </td>
                                    <td style={{ verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.vendor}
                                    </td>
                                    <td style={{ verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.warehouse}
                                    </td>
                                    <td style={{ color: '#6c757d', verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        {item.date}
                                    </td>
                                    <td style={{ fontWeight: '500', verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        ₹{item.amount.toLocaleString()}
                                    </td>
                                    <td style={{ verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        <span
                                            style={{
                                                ...getStatusBadge(item.status),
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                display: 'inline-block'
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td style={{ verticalAlign: 'middle', borderBottom: '1px solid #f8f9fa', padding: '16px 12px' }}>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button className="btn outline-info btn-sm py-1 px-1 text-info" onClick={() => handleViewClick(item)}>
                                                <FaEye size={16} />
                                            </button>
                                            <button className="btn outline-primary btn-sm text-warning py-1 px-1" onClick={() => handleEditClick(item)}>
                                                <FaEdit size={16} />
                                            </button>
                                            <button className="btn outline-primary btn-sm text-danger py-2 px-1" onClick={() => handleDeleteClick(item.id)}>
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 px-3 gap-2">
                    <span className="small text-muted">
                        Showing 1 to {filteredReturns.length} of {filteredReturns.length} entries
                    </span>
                    <nav>
                        <ul className="pagination pagination-sm mb-0 flex-wrap">
                            <li className="page-item disabled">
                                <button className="page-link rounded-start">&laquo;</button>
                            </li>
                            <li className="page-item active">
                                <button
                                    className="page-link"
                                    style={{ backgroundColor: '#3daaaa', borderColor: '#3daaaa' }}
                                >1</button>
                            </li>
                            <li className="page-item"><button className="page-link">2</button></li>
                            <li className="page-item">
                                <button className="page-link rounded-end">&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* View Modal */}
            {selectedReturn && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                >
                    <div className="modal-dialog modal-lg">
                        <div
                            className="modal-content"
                            style={{ borderRadius: '10px', border: 'none' }}
                        >
                            <div className="modal-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                                <h5 className="modal-title" style={{ fontWeight: '600', color: '#212529' }}>
                                    Purchase Return Details
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedReturn(null)}
                                />
                            </div>
                            <div className="modal-body" style={{ backgroundColor: '#fffefc' }}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <p><strong>Reference ID:</strong> {selectedReturn.referenceId}</p>
                                        <p><strong>Auto Voucher No:</strong> {selectedReturn.autoVoucherNo}</p>
                                        <p><strong>Manual Voucher No:</strong> {selectedReturn.manualVoucherNo || '—'}</p>
                                        <p><strong>Return ID:</strong> {selectedReturn.id}</p>
                                        <p><strong>Invoice:</strong> {selectedReturn.invoice}</p>
                                        <p><strong>Vendor:</strong> {selectedReturn.vendor}</p>
                                        <p><strong>Warehouse:</strong> {selectedReturn.warehouse}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <p><strong>Date:</strong> {selectedReturn.date}</p>
                                        <p><strong>Amount:</strong> ₹{selectedReturn.amount.toLocaleString()}</p>
                                        <p>
                                            <strong>Status:</strong>
                                            <span
                                                style={{
                                                    ...getStatusBadge(selectedReturn.status),
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block',
                                                    marginLeft: '8px'
                                                }}
                                            >
                                                {selectedReturn.status}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <p><strong>Reason:</strong> {selectedReturn.reason || 'N/A'}</p>
                                    </div>
                                    <div className="col-12">
                                        <p><strong>Description:</strong></p>
                                        <div style={{
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '4px',
                                            padding: '12px',
                                            minHeight: '80px'
                                        }}>
                                            {selectedReturn.description || 'No description provided'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setSelectedReturn(null)}
                                    style={{ backgroundColor: '#3daaaa', border: '1px solid #3daaaa' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ border: 'none', borderRadius: '8px' }}>
                            <div className="modal-header" style={{ borderBottom: 'none' }}>
                                <h5 className="modal-title" style={{ fontWeight: '600' }}>
                                    Confirm Deletion
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this purchase return? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer" style={{ borderTop: 'none' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{
                                        borderRadius: '4px',
                                        padding: '8px 16px'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                    style={{
                                        borderRadius: '4px',
                                        padding: '8px 16px'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                >
                    <div className="modal-dialog modal-lg">
                        <div
                            className="modal-content"
                            style={{ border: 'none', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                        >
                            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                                <h5 className="modal-title" style={{ fontWeight: '600', color: '#212529' }}>
                                    {isEditMode ? 'Edit Purchase Return' : 'Add New Return'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close d-flex align-items-center justify-content-center"
                                    onClick={() => {
                                        setShowModal(false);
                                        setIsEditMode(false);
                                        setFormData({
                                            invoice: '',
                                            vendor: '',
                                            date: '',
                                            amount: '',
                                            reason: '',
                                            description: '',
                                            warehouse: warehouseOptions[0],
                                            referenceId: '',
                                            autoVoucherNo: '',
                                            manualVoucherNo: ''
                                        });
                                    }}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        border: 'none',
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <BiX />
                                </button>
                            </div>
                            <div className="modal-body" style={{ paddingTop: '20px' }}>
                                <div className="row g-3">
                                    {/* Auto Voucher No */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Auto-Generated Voucher No
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.autoVoucherNo}
                                            readOnly
                                            placeholder="Auto-generated"
                                        />
                                    </div>
                                    {/* Manual Voucher No */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Manual Voucher No
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.manualVoucherNo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, manualVoucherNo: e.target.value }))}
                                            placeholder="Enter manual voucher number"
                                        />
                                    </div>
                                    {/* Reference ID */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Reference ID
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.referenceId}
                                            readOnly
                                            placeholder="Auto-generated"
                                        />
                                    </div>
                                    {/* Invoice Number */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Invoice Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="invoice"
                                            value={formData.invoice}
                                            onChange={handleInputChange}
                                            placeholder="Enter invoice number"
                                            required
                                        />
                                    </div>
                                    {/* Vendor Name */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Vendor Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="vendor"
                                            value={formData.vendor}
                                            onChange={handleInputChange}
                                            placeholder="Enter vendor name"
                                            required
                                        />
                                    </div>
                                    {/* Warehouse */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Warehouse <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            name="warehouse"
                                            value={formData.warehouse}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {warehouseOptions.map((warehouse, idx) => (
                                                <option key={idx} value={warehouse}>{warehouse}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Return Date */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Return Date <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/* Amount */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium text-dark">
                                            Amount <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">₹</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Return Reason */}
                                    <div className="col-6">
                                        <label className="form-label fw-medium text-dark">Return Reason</label>
                                        <select
                                            className="form-select"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select reason</option>
                                            <option value="Damaged Items">Damaged Items</option>
                                            <option value="Wrong Items">Wrong Items</option>
                                            <option value="Quality Issues">Quality Issues</option>
                                            <option value="Excess Stock">Excess Stock</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    {/* Description */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium text-dark">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Enter detailed description of the return..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderTop: 'none', paddingTop: '0' }}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setShowModal(false);
                                        setIsEditMode(false);
                                        setFormData({
                                            invoice: '',
                                            vendor: '',
                                            date: '',
                                            amount: '',
                                            reason: '',
                                            description: '',
                                            warehouse: warehouseOptions[0],
                                            referenceId: '',
                                            autoVoucherNo: '',
                                            manualVoucherNo: ''
                                        });
                                    }}
                                    style={{
                                        border: '1px solid #6c757d',
                                        color: '#6c757d',
                                        backgroundColor: 'white',
                                        borderRadius: '4px',
                                        padding: '8px 20px'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={handleSubmit}
                                    style={{ backgroundColor: '#3daaaa', border: '1px solid #3daaaa', color: '#fff' }}
                                >
                                    {isEditMode ? 'Update Return' : 'Create Return'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Card className="mb-4 p-3 shadow rounded-4 mt-2">
                <Card.Body>
                    <h5 className="fw-semibold border-bottom pb-2 mb-3 text-primary">Page Info</h5>
                    <ul className="text-muted fs-6 mb-0" style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
                        <li>Manage goods returned to vendors due to issues like damage, overstock, or wrong items.</li>
                        <li>Track return details including return number, invoice, vendor name, warehouse, and amount.</li>
                        <li>Supports credit note handling, status tracking, and real-time inventory adjustments.</li>
                        <li><strong>Reference ID</strong> is auto-generated for every new return (e.g., REF-PR-1001).</li>
                        <li><strong>Auto Voucher No</strong> (e.g., VOU-PR-2025-001) and <strong>Manual Voucher No</strong> can be used for accounting integration.</li>
                    </ul>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PurchaseReturn;