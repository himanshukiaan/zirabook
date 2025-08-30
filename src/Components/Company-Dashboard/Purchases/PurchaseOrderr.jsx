import React, { useState, useMemo } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import MultiStepPurchaseForms from './MultiStepPurchaseForms';
import { FaArrowRight } from "react-icons/fa";

const initialOrders = [];

const statusBadge = (status) => {
  let variant;
  switch (status) {
    case 'Done':
      variant = 'success';
      break;
    case 'Pending':
      variant = 'secondary';
      break;
    case 'Cancelled':
      variant = 'danger';
      break;
    default:
      variant = 'warning';
  }
  return <Badge bg={variant}>{status}</Badge>;
};

const PurchaseOrderr = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [stepModal, setStepModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchOrderNo, setSearchOrderNo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const handleCreateNewPurchase = (order = null) => {
    setSelectedOrder(order);
    setStepModal(true);
  };

  const handleCloseModal = () => {
    setStepModal(false);
    setSelectedOrder(null);
  };

  const handleFormSubmit = (formData, lastStep = 'quotation') => {
    const isEdit = selectedOrder?.id;
    const newOrderNo = orders.length ? Math.max(...orders.map(o => o.orderNo)) + 1 : 2045;
    const today = new Date().toISOString().split('T')[0];

    const newOrder = {
      id: isEdit ? selectedOrder.id : Date.now(),
      orderNo: isEdit ? selectedOrder.orderNo : newOrderNo,
      vendor: formData.quotation.customer || '',
      date: today,
      amount: `$ ${formData.payment?.amount || 0}`,
      quotation: formData.quotation,
      purchaseOrder: formData.salesOrder,
      invoice: formData.invoice,
      payment: formData.payment,
      quotationStatus: formData.quotation?.quotationNo ? 'Done' : 'Pending',
      purchaseOrderStatus: formData.salesOrder?.orderNo ? 'Done' : 'Pending',
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

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filter by Order No
      const matchesOrderNo = !searchOrderNo || 
        order.orderNo?.toString().includes(searchOrderNo.trim());
  
      // Filter by Date Range
      const orderDate = new Date(order.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const afterFrom = !from || orderDate >= from;
      const beforeTo = !to || orderDate <= to;
  
      // Filter by Status
      const allStatuses = [
        order.quotationStatus,
        order.purchaseOrderStatus,
        order.invoiceStatus,
        order.paymentStatus,
      ];
  
      // अगर statusFilter खाली है, तो सभी ऑर्डर आएंगे
      const matchesStatus = !statusFilter || allStatuses.includes(statusFilter);
  
      return matchesOrderNo && afterFrom && beforeTo && matchesStatus;
    });
  }, [orders, searchOrderNo, fromDate, toDate, statusFilter]);

  return (
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaArrowRight size={20} color="red" />
        <h5 className="mb-0">Purchase Workflow</h5>
      </div>

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleCreateNewPurchase()}
        style={{ backgroundColor: "#53b2a5", border: "none", padding: "8px 16px" }}
      >
        + Create New Purchase
      </Button>

      {/* Filters */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Purchase No</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by No"
              value={searchOrderNo}
              onChange={(e) => setSearchOrderNo(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
  <Form.Group>
    <Form.Label>Status</Form.Label>
    <Form.Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">All Status</option>
      <option value="Pending">Pending</option>
      <option value="Done">Done</option>
      <option value="Cancelled">Cancelled</option>
    </Form.Select>
  </Form.Group>
</Col>
        <Col md={3} className="d-flex align-items-end">
          <Button
            variant="secondary"
            onClick={() => {
              setSearchOrderNo('');
              setFromDate('');
              setToDate('');
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>

      <Table bordered hover responsive className="text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Purchase No</th>
            <th>Vendor</th>
            <th>Voucher Type</th>
            <th>Voucher No</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Quotation</th>
            <th>Purchase Order</th>
            <th>Invoice</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, idx) => (
              <tr key={order.id}>
                <td>{idx + 1}</td>
                <td>{order.invoice?.invoiceNo || order.orderNo || '-'}</td>
                <td>{order.vendor}</td>
                <td>{order.payment?.voucherType || '-'}</td>
                <td>{order.payment?.voucherNo || '-'}</td>
                <td>{order.date}</td>
                <td>{order.amount}</td>
                <td>{statusBadge(order.quotationStatus)}</td>
                <td>{statusBadge(order.purchaseOrderStatus)}</td>
                <td>{statusBadge(order.invoiceStatus)}</td>
                <td>{statusBadge(order.paymentStatus)}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-1 mb-1"
                    variant="outline-primary"
                    onClick={() => handleCreateNewPurchase(order)}
                  >
                    Continue
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center text-muted">
                No orders found matching the filters.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={stepModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedOrder ? 'Continue Purchase' : 'Create Purchase'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MultiStepPurchaseForms
            initialData={selectedOrder}
            initialStep={selectedOrder?.draftStep}
            onSubmit={handleFormSubmit}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PurchaseOrderr;