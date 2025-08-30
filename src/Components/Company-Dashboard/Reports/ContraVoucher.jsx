import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Dropdown } from 'react-bootstrap';

const accountOptions = [
  "Cash In Hand",
  "Bank Account - Current",
  "Bank Account - Savings",
  "Petty Cash",
  "Undeposited Funds",
  "Accounts Receivable",
  "Accounts Payable",
  "Inventory",
  "Office Expenses",
  "Salary Payable"
];

const ContraVoucher = () => {
  const [autoVoucherNo, setAutoVoucherNo] = useState('');
  const [manualVoucherNo, setManualVoucherNo] = useState('');
  const [voucherDate, setVoucherDate] = useState('2025-08-23');
  const [accountFrom, setAccountFrom] = useState('Cash In Hand');
  const [accountTo, setAccountTo] = useState('Bank Account - Current');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [referenceDocument, setReferenceDocument] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const accountFromRef = useRef(null);
  const accountToRef = useRef(null);
  
  // Generate auto voucher number on component mount
  useEffect(() => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    setAutoVoucherNo(`CON-${timestamp}-${randomNum}`);
  }, []);
  
  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountFromRef.current && !accountFromRef.current.contains(event.target)) {
        document.getElementById('accountFromDropdown').classList.remove('show');
      }
      if (accountToRef.current && !accountToRef.current.contains(event.target)) {
        document.getElementById('accountToDropdown').classList.remove('show');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle dropdown visibility
  const toggleDropdown = (dropdownId) => {
    const dropdown = document.getElementById(dropdownId);
    dropdown.classList.toggle('show');
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    alert(`Contra Voucher Created Successfully!\n\nVoucher No: ${manualVoucherNo || autoVoucherNo}\nFrom: ${accountFrom}\nTo: ${accountTo}\nAmount: ${amount}`);
  };
  
  return (
    <div className='p-3' >
      <Container className='card p-4'>
        <h2 className="mb-4 text-center mt-2" style={{ color: '#2c3e50' }}>Contra Voucher</h2>
        
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Voucher No (Auto)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={autoVoucherNo} 
                  readOnly 
                  className="mb-2" 
                />
                <Form.Label>Voucher No (Manual)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={manualVoucherNo}
                  onChange={(e) => setManualVoucherNo(e.target.value)}
                  placeholder="Enter manual voucher no"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Voucher Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={voucherDate}
                  onChange={(e) => setVoucherDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group ref={accountFromRef}>
                <Form.Label>Account From</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    value={accountFrom}
                    onChange={(e) => setAccountFrom(e.target.value)}
                    onClick={() => toggleDropdown('accountFromDropdown')}
                    placeholder="Select account..."
                  />
                  <div 
                    id="accountFromDropdown" 
                    className="dropdown-menu position-absolute w-100"
                    style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {accountOptions.map((opt, idx) => (
                      <Dropdown.Item 
                        key={idx} 
                        onClick={() => {
                          setAccountFrom(opt);
                          document.getElementById('accountFromDropdown').classList.remove('show');
                        }}
                      >
                        {opt}
                      </Dropdown.Item>
                    ))}
                  </div>
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group ref={accountToRef}>
                <Form.Label>Account To</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    value={accountTo}
                    onChange={(e) => setAccountTo(e.target.value)}
                    onClick={() => toggleDropdown('accountToDropdown')}
                    placeholder="Select account..."
                  />
                  <div 
                    id="accountToDropdown" 
                    className="dropdown-menu position-absolute w-100"
                    style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {accountOptions.map((opt, idx) => (
                      <Dropdown.Item 
                        key={idx} 
                        onClick={() => {
                          setAccountTo(opt);
                          document.getElementById('accountToDropdown').classList.remove('show');
                        }}
                      >
                        {opt}
                      </Dropdown.Item>
                    ))}
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </Form.Group>
            </Col>
         
          </Row>
          
          {/* Document Upload */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Document</Form.Label>
                <Form.Control 
                  type="file" 
                  onChange={handleFileUpload}
                />
                {uploadedFile && (
                  <div className="mt-2">
                    <small>Selected file: {uploadedFile.name}</small>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>
                  Narration <span style={{ fontSize: '12px', color: '#888' }}>(Optional)</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={narration}
                  onChange={e => setNarration(e.target.value)}
                  placeholder="Enter details about the transaction..."
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col className="text-center">
              <Button  type="submit" size="sm">
                save
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default ContraVoucher;