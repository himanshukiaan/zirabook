
import React, { useState } from 'react';
import { useTheme } from '../../../themeContext';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';


import { FaArrowLeft} from "react-icons/fa";
import MultiStepSalesForm from './MultiStepSalesForm';

const initialOrders = [];


const statusBadge = (status) => {
  const variant = status === 'Done' ? 'success' : status === 'Pending' ? 'secondary' : 'warning';
  return <Badge bg={variant}>{status}</Badge>;
};


const Invoice = () => {
  const { theme } = useTheme();
  const [statusFilter, setStatusFilter] = useState("");
  const [orders, setOrders] = useState(initialOrders);
  const [stepModal, setStepModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [invoiceNoFilter, setInvoiceNoFilter] = useState('');
  const handleCreateNewInvoice = (order = null) => {
    setSelectedOrder(order);
    setStepModal(true);
  };

  const handleCloseModal = () => {
    setStepModal(false);
    setSelectedOrder(null);
  };

  const handleFormSubmit = (formData, lastStep = 'quotation') => {
    const isEdit = selectedOrder?.id;
    const newOrderNo = orders.length ? orders[0].orderNo + 1 : 2045;
    const today = new Date().toISOString().split('T')[0];
    

    const newOrder = {
      id: isEdit ? selectedOrder.id : Date.now(),
      orderNo: isEdit ? selectedOrder.orderNo : newOrderNo,
      vendor: formData.quotation.customer || '',
      date: today,
      amount: `$ ${formData.payment?.amount || 0}`,
      quotation: formData.quotation,
      salesOrder: formData.salesOrder,
      deliveryChallan: formData.deliveryChallan,
      invoice: formData.invoice,
      payment: formData.payment,
      quotationStatus: formData.quotation?.quotationNo ? 'Done' : 'Pending',
      salesOrderStatus: formData.salesOrder?.orderNo ? 'Done' : 'Pending',
      deliveryChallanStatus: formData.deliveryChallan?.challanNo ? 'Done' : 'Pending', // ✅ Added
      invoiceStatus: formData.invoice?.invoiceNo ? 'Done' : 'Pending',
      paymentStatus: formData.payment?.amount ? 'Done' : 'Pending',
      draftStep: lastStep,
    };

    setOrders(prev =>
      isEdit
        ? prev.map(o => (o.id === selectedOrder.id ? newOrder : o))
        : [newOrder, ...prev]
    );

    handleCloseModal();
  };
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
  
    // Date Filter
    const dateMatch = (!from || orderDate >= from) && (!to || orderDate <= to);
  
    // Invoice No Filter (INV se start ho)
    const invoiceNoMatch = !invoiceNoFilter || 
      (order.invoice?.invoiceNo && order.invoice.invoiceNo.toLowerCase().startsWith(invoiceNoFilter.toLowerCase()));
       // Status Filter - Example: Filter by invoiceStatus
  const statusMatch = !statusFilter ||
    order.invoiceStatus === statusFilter ||
    order.paymentStatus === statusFilter ||
    order.quotationStatus === statusFilter;
  
    return dateMatch && invoiceNoMatch && statusMatch;
  });
  return (
    <div className={`p-4 ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
<div className="d-flex align-items-center gap-2 mb-4">
  <FaArrowLeft size={20} color="blue" />
  <h5 className="mb-0 theme-text">Sales Workflow</h5>
</div>

      <Button variant="primary" className="mb-3" onClick={() => handleCreateNewInvoice()} 
                    style={{ backgroundColor: "#53b2a5", border: "none", padding: "8px 16px" }}
        >
        + Create sales order
      </Button>

      {/* Top Filter Section */}
<div className="mb-2 p-3 rounded d-flex flex-wrap gap-3 align-items-end theme-card">
  <div>
    <label className="form-label text-secondary">From Date</label>
    <input
      type="date"
      className="form-control"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />
  </div>

  <div>
    <label className="form-label text-secondary">To Date</label>
    <input
      type="date"
      className="form-control"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </div>

  <div>
    <label className="form-label text-secondary">Invoice No. (INV...)</label>
    <input
      type="text"
      className="form-control"
      placeholder="e.g. INV-123"
      value={invoiceNoFilter}
      onChange={(e) => setInvoiceNoFilter(e.target.value)}
      style={{ minWidth: "150px" }}
    />
  </div>

   {/* New: Status Dropdown Filter */}
  <div>
    <label className="form-label text-secondary">Status</label>
    <Form.Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      style={{ minWidth: "130px" }}
    >
      <option value="">All</option>
      <option value="Done">Done</option>
      <option value="Pending">Pending</option>
      <option value="Cancle">Cancle</option>
    </Form.Select>
  </div>

  <Button
    variant="secondary"
    onClick={() => {
      setFromDate('');
      setToDate('');
      setInvoiceNoFilter('');
    }}
    style={{ height: "fit-content" }}
  >
    Clear
  </Button>
</div>
      <Table bordered hover responsive className="text-center align-middle theme-table">
      <thead className="table-light">
  <tr>
    <th>#</th>
    <th>Invoice No</th>
    <th>Customer</th>
    <th>Date</th>
    <th>Amount</th>
    <th>Quotation</th>
    <th>Sales Order</th>
    <th>Delivery Challan</th>  
    <th>Invoice</th>
    <th>Payment</th>

  </tr>
</thead>
       <tbody>
  {filteredOrders.map((order, idx) => (
    <tr key={order.id}>
      <td>{idx + 1}</td>
      <td>{order.invoice?.invoiceNo || '-'}</td>
      <td>{order.vendor}</td>
      <td>{order.date}</td>
      <td>{order.amount}</td>
      <td>{statusBadge(order.quotationStatus)}</td>
      <td>{statusBadge(order.salesOrderStatus)}</td>
      <td>{statusBadge(order.deliveryChallanStatus)}</td> {/* ✅ Added */}
      <td>{statusBadge(order.invoiceStatus)}</td>
      <td>{statusBadge(order.paymentStatus)}</td>
      <td>
        <Button
          size="sm" // ← "xl" valid nahi hai, use "sm", "lg"
          className="me-1 mb-1"
          variant="outline-primary"
          onClick={() => handleCreateNewInvoice(order)}
        >
          Continue
        </Button>
      </td>
    </tr>
  ))}
</tbody>
      </Table>

      <Modal show={stepModal} onHide={handleCloseModal} size="xl" centered className="theme-modal">
        <Modal.Header closeButton>
          <Modal.Title>{selectedOrder ? 'Continue Invoice' : 'Create Invoice'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  
      
              <MultiStepSalesForm          initialData={selectedOrder}
            initialStep={selectedOrder?.draftStep}
            onSubmit={handleFormSubmit}  />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Invoice;
