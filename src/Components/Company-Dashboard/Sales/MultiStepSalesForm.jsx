import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Tab, Form, Button, Table, Row, Col, Modal, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import "./MultiStepSalesForm.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faEye, faEdit, faPlus, faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import AddProductModal from '../Inventory/AddProductModal';

const MultiStepSalesForm = ({ onSubmit, initialData, initialStep }) => {
  const [key, setKey] = useState(initialStep || 'quotation');
  const tabsWithItems = ['quotation', 'salesOrder', 'deliveryChallan', 'invoice'];
  const navigate = useNavigate();
  const formRef = useRef();
  const pdfRef = useRef();
  
  // --- Form Data State ---
  const [formData, setFormData] = useState(() => ({
    quotation: {
      companyName: "",
      referenceId: '',
      manualRefNo: "", // Optional manual ref
      companyAddress: "",
      companyEmail: "",
      companyPhone: "",
      quotationNo: "", // Auto-generated Quotation No
      quotationDate: "",
      validDate: "",
      billToName: "",
      billToAddress: "",
      billToEmail: "",
      billToPhone: "",
      items: [{ name: '', description: '', qty: '', rate: '', tax: 0, discount: 0, sellingPrice: 0, uom: 'PCS' }],
      terms: '',
      signature: '',
      photo: '',
      files: [],
      footerNote: "Thank you!"
    },
    salesOrder: {
      referenceId: '',
      salesOrderNo: '', // Auto-generated SO No
      manualOrderRef: "", // Manual SO Ref
      manualQuotationRef: "",
      manualRefNo: '',    
      orderDate: '',
      customerName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhone: '',
      customerNo: '',
      companyName: '',
      companyAddress: '',
      companyEmail: '',
      companyPhone: '',
      billToName: "",
      billToAddress: "",
      billToEmail: "",
      billToPhone: "",
      shipToName: '',
      shipToAddress: '',
      shipToEmail: '',
      shipToPhone: '',
      items: [{ name: '', qty: '', rate: '', tax: 0, discount: 0 }],
      terms: '',
      signature: '',
      photo: '',
      files: [],
      footerNote: "Thank you!",
      // 👉 Quotation No (Auto + Manual)
      quotationNo: "", // Auto-generated QUO No
      // manualQuotationRef: "" // Manual QUO Ref
    },
    deliveryChallan: {
      referenceId: '',
      challanNo: '', // Auto-generated DC No
      manualRefNo: "", // Manual DC Ref
      challanDate: '',
      vehicleNo: '',
      driverName: '',
      driverPhone: '',
      salesOrderNo: '', // Auto-generated SO No
      manualSalesOrderRef: "", // Manual SO Ref
      companyName: '',
      companyAddress: '',
      companyEmail: '',
      companyPhone: '',
      billToName: "",
      billToAddress: "",
      billToEmail: "",
      billToPhone: "",
      shipToName: '',
      shipToAddress: '',
      shipToEmail: '',
      shipToPhone: '',
      items: [{ name: '', qty: '', deliveredQty: '', rate: '', tax: 0, discount: 0 }],
      terms: '',
      signature: '',
      photo: '',
      files: [],
      footerNote: "Thank you!"
    },
    invoice: {
      referenceId: '',
      invoiceNo: '', // Auto-generated INV No
      manualRefNo: "", // Manual INV Ref
      invoiceDate: '',
      dueDate: '',
      challanNo: '', // Auto-generated DC No
      manualChallanRef: "", // Manual DC Ref
      manualChallanNo: "",  
      manualInvoiceNo: "", 
      companyName: '',
      companyAddress: '',
      companyEmail: '',
      companyPhone: '',
      customerName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhone: '',
      shipToName: '',
      shipToAddress: '',
      shipToEmail: '',
      shipToPhone: '',
      items: [{ description: '', rate: '', qty: '', tax: '', discount: '', amount: '' }],
      paymentStatus: '',
      paymentMethod: '',
      note: '',
      terms: '',
      signature: '',
      photo: '',
      files: [],
      footerNote: "Thank you!"
    },
    payment: {
      referenceId: '',
      paymentNo: '', // Auto-generated PAY No
      manualRefNo: "", // Manual PAY Ref
      paymentDate: '',
      amount: '',
      paymentMethod: '',
      paymentStatus: '',
      note: '',
      invoiceNo: '', // Auto-generated INV No
      manualInvoiceRef: "", // Manual INV Ref
      customerName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhone: '',
      companyName: '',
      companyAddress: '',
      companyEmail: '',
      companyPhone: '',
      signature: '',
      photo: '',
      files: [],
      footerNote: "Thank you!"
    }
  }));
  
  // Available items for search
  const [availableItems, setAvailableItems] = useState([
    { id: 1, name: "Laptop", category: "Electronics", price: 50000, tax: 18, hsn: "8471", uom: "PCS" },
    { id: 2, name: "Office Chair", category: "Furniture", price: 5000, tax: 12, hsn: "9401", uom: "PCS" },
    { id: 3, name: "T-Shirt", category: "Apparel", price: 500, tax: 5, hsn: "6109", uom: "PCS" },
    { id: 4, name: "Coffee Table", category: "Furniture", price: 8000, tax: 12, hsn: "9403", uom: "PCS" },
    { id: 5, name: "Smartphone", category: "Electronics", price: 20000, tax: 18, hsn: "8517", uom: "PCS" },
    { id: 6, name: "Notebook", category: "Stationery", price: 100, tax: 5, hsn: "4820", uom: "PCS" },
    { id: 7, name: "Water Bottle", category: "Other", price: 200, tax: 5, hsn: "3924", uom: "PCS" },
    { id: 8, name: "Desk Lamp", category: "Furniture", price: 1500, tax: 12, hsn: "9405", uom: "PCS" },
  ]);
  const [showUOMModal, setShowUOMModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([
    "Electronics",
    "Furniture",
    "Apparel",
    "Food",
    "Books",
    "Automotive",
    "Medical",
    "Software",
    "Stationery",
    "Other",
  ]);
  // Search state for each row
  const [rowSearchTerms, setRowSearchTerms] = useState({});
  const [showRowSearch, setShowRowSearch] = useState({});
  useEffect(() => {
    // Quotation
    if (!formData.quotation.referenceId) {
      handleChange("quotation", "referenceId", generateReferenceId("quotation"));
    }
    if (!formData.quotation.quotationNo) {
      handleChange("quotation", "quotationNo", generateReferenceId("quotation"));
    }
  
    // Sales Order
    if (!formData.salesOrder.referenceId) {
      handleChange("salesOrder", "referenceId", generateReferenceId("salesOrder"));
    }
    if (!formData.salesOrder.salesOrderNo) {
      handleChange("salesOrder", "salesOrderNo", generateReferenceId("salesOrder"));
    }
    if (!formData.salesOrder.quotationNo) {
      handleChange("salesOrder", "quotationNo", generateReferenceId("quotation"));
    }
  
    // Delivery Challan
    if (!formData.deliveryChallan.referenceId) {
      handleChange("deliveryChallan", "referenceId", generateReferenceId("deliveryChallan"));
    }
    if (!formData.deliveryChallan.challanNo) {
      handleChange("deliveryChallan", "challanNo", generateReferenceId("deliveryChallan"));
    }
    if (!formData.deliveryChallan.salesOrderNo) {
      handleChange("deliveryChallan", "salesOrderNo", generateReferenceId("salesOrder"));
    }
  
    // Invoice
    if (!formData.invoice.referenceId) {
      handleChange("invoice", "referenceId", generateReferenceId("invoice"));
    }
    if (!formData.invoice.invoiceNo) {
      handleChange("invoice", "invoiceNo", generateReferenceId("invoice"));
    }
    if (!formData.invoice.challanNo) {
      handleChange("invoice", "challanNo", generateReferenceId("deliveryChallan"));
    }
  
    // Payment
    if (!formData.payment.referenceId) {
      handleChange("payment", "referenceId", generateReferenceId("payment"));
    }
    if (!formData.payment.paymentNo) {
      handleChange("payment", "paymentNo", generateReferenceId("payment"));
    }
    if (!formData.payment.invoiceNo) {
      handleChange("payment", "invoiceNo", generateReferenceId("invoice"));
    }
  }, [
    // Dependencies
    formData.quotation.referenceId,
    formData.quotation.quotationNo,
  
    formData.salesOrder.referenceId,
    formData.salesOrder.salesOrderNo,
    formData.salesOrder.quotationNo,
  
    formData.deliveryChallan.referenceId,
    formData.deliveryChallan.challanNo,
    formData.deliveryChallan.salesOrderNo,
  
    formData.invoice.referenceId,
    formData.invoice.invoiceNo,
    formData.invoice.challanNo,
  
    formData.payment.referenceId,
    formData.payment.paymentNo,
    formData.payment.invoiceNo,
  ]);
  
  
  
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) {
      alert("Product name and category are required!");
      return;
    }
    const itemToAdd = {
      name: newItem.name,
      qty: 1,
      rate: newItem.sellingPrice,
      tax: newItem.tax,
      discount: 0,
      hsn: newItem.hsn,
      uom: newItem.uom
    };
    
    const tab = key;
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        items: [...prev[tab].items, itemToAdd]
      }
    }));
    
    setNewItem({
      name: '',
      category: '',
      hsn: '',
      tax: 0,
      sellingPrice: 0,
      uom: 'PCS'
    });
    setShowAdd(false);
  };
  
  const handleUpdateItem = () => {
    console.log("Update item:", newItem);
    setShowEdit(false);
  };
  
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
      setNewItem(prev => ({ ...prev, category: newCategory }));
      setNewCategory('');
    }
    setShowAddCategoryModal(false);
  };
  
  const [savedRecords, setSavedRecords] = useState([]);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    hsn: '',
    tax: 0,
    sellingPrice: 0,
    uom: 'PCS'
  });
  
  const generateReferenceId = (tabKey) => {
    const prefixes = {
      quotation: "QUO",
      salesOrder: "SO",
      deliveryChallan: "DC",
      invoice: "INV",
      payment: "PAY"
    };
    const prefix = prefixes[tabKey] || "REF";
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${rand}`;
  };
  
  useEffect(() => {
    // ============= QUOTATION =============
    if (!formData.quotation.referenceId) {
      handleChange("quotation", "referenceId", generateReferenceId("quotation"));
    }
  
    if (!formData.quotation.quotationNo) {
      if (formData.quotation.manualQuotationRef) {
        handleChange("quotation", "quotationNo", formData.quotation.manualQuotationRef);
      } else {
        handleChange("quotation", "quotationNo", generateReferenceId("quotation"));
      }
    }
  
    // If manual is updated, sync it
    if (
      formData.quotation.manualQuotationRef &&
      formData.quotation.manualQuotationRef !== formData.quotation.quotationNo
    ) {
      handleChange("quotation", "quotationNo", formData.quotation.manualQuotationRef);
    }
  
    // ============= SALES ORDER =============
    if (!formData.salesOrder.referenceId) {
      handleChange("salesOrder", "referenceId", generateReferenceId("salesOrder"));
    }
  
    if (!formData.salesOrder.salesOrderNo) {
      if (formData.salesOrder.manualOrderRef) {
        handleChange("salesOrder", "salesOrderNo", formData.salesOrder.manualOrderRef);
      } else {
        handleChange("salesOrder", "salesOrderNo", generateReferenceId("salesOrder"));
      }
    }
  
    if (
      formData.salesOrder.manualOrderRef &&
      formData.salesOrder.manualOrderRef !== formData.salesOrder.salesOrderNo
    ) {
      handleChange("salesOrder", "salesOrderNo", formData.salesOrder.manualOrderRef);
    }
  
    // Auto-fill quotationNo from Quotation
    if (!formData.salesOrder.quotationNo && formData.quotation.quotationNo) {
      handleChange("salesOrder", "quotationNo", formData.quotation.quotationNo);
    }
  
    // ============= DELIVERY CHALLAN =============
    if (!formData.deliveryChallan.referenceId) {
      handleChange("deliveryChallan", "referenceId", generateReferenceId("deliveryChallan"));
    }
  
    if (!formData.deliveryChallan.challanNo) {
      if (formData.deliveryChallan.manualRefNo) {
        handleChange("deliveryChallan", "challanNo", formData.deliveryChallan.manualRefNo);
      } else {
        handleChange("deliveryChallan", "challanNo", generateReferenceId("deliveryChallan"));
      }
    }
  
    if (
      formData.deliveryChallan.manualRefNo &&
      formData.deliveryChallan.manualRefNo !== formData.deliveryChallan.challanNo
    ) {
      handleChange("deliveryChallan", "challanNo", formData.deliveryChallan.manualRefNo);
    }
  
    // Auto-fill salesOrderNo
    if (!formData.deliveryChallan.salesOrderNo && formData.salesOrder.salesOrderNo) {
      handleChange("deliveryChallan", "salesOrderNo", formData.salesOrder.salesOrderNo);
    }
  
    // ============= INVOICE =============
    if (!formData.invoice.referenceId) {
      handleChange("invoice", "referenceId", generateReferenceId("invoice"));
    }
  
    if (!formData.invoice.invoiceNo) {
      if (formData.invoice.manualRefNo) {
        handleChange("invoice", "invoiceNo", formData.invoice.manualRefNo);
      } else {
        handleChange("invoice", "invoiceNo", generateReferenceId("invoice"));
      }
    }
  
    if (
      formData.invoice.manualRefNo &&
      formData.invoice.manualRefNo !== formData.invoice.invoiceNo
    ) {
      handleChange("invoice", "invoiceNo", formData.invoice.manualRefNo);
    }
  
    // Auto-fill challanNo
    if (!formData.invoice.challanNo && formData.deliveryChallan.challanNo) {
      handleChange("invoice", "challanNo", formData.deliveryChallan.challanNo);
    }
  
    // ============= PAYMENT =============
    if (!formData.payment.referenceId) {
      handleChange("payment", "referenceId", generateReferenceId("payment"));
    }
  
    if (!formData.payment.paymentNo) {
      if (formData.payment.manualRefNo) {
        handleChange("payment", "paymentNo", formData.payment.manualRefNo);
      } else {
        handleChange("payment", "paymentNo", generateReferenceId("payment"));
      }
    }
  
    if (
      formData.payment.manualRefNo &&
      formData.payment.manualRefNo !== formData.payment.paymentNo
    ) {
      handleChange("payment", "paymentNo", formData.payment.manualRefNo);
    }
  
    // Auto-fill invoiceNo
    if (!formData.payment.invoiceNo && formData.invoice.invoiceNo) {
      handleChange("payment", "invoiceNo", formData.invoice.invoiceNo);
    }
    // Use manualInvoiceNo if provided
if (
  formData.invoice.manualInvoiceNo &&
  formData.invoice.manualInvoiceNo !== formData.invoice.invoiceNo
) {
  handleChange("invoice", "invoiceNo", formData.invoice.manualInvoiceNo);
}
// In useEffect
if (!formData.salesOrder.quotationNo && formData.quotation.quotationNo) {
  handleChange("salesOrder", "quotationNo", formData.quotation.quotationNo);
}

// Optional: if manualQuotationRef is filled, use that instead
if (
  formData.salesOrder.manualQuotationRef &&
  formData.salesOrder.manualQuotationRef !== formData.salesOrder.quotationNo
) {
  handleChange("salesOrder", "quotationNo", formData.salesOrder.manualQuotationRef);
}
// Use manualChallanNo if provided
if (
  formData.invoice.manualChallanNo &&
  formData.invoice.manualChallanNo !== formData.invoice.challanNo
) {
  handleChange("invoice", "challanNo", formData.invoice.manualChallanNo);
}
  
  }, [
    // Dependencies: Track all auto/manual fields
    formData.quotation.referenceId,
    formData.quotation.quotationNo,
    formData.quotation.manualQuotationRef,
  
    formData.salesOrder.referenceId,
    formData.salesOrder.salesOrderNo,
    formData.salesOrder.manualOrderRef,
    formData.salesOrder.quotationNo,
  
    formData.deliveryChallan.referenceId,
    formData.deliveryChallan.challanNo,
    formData.deliveryChallan.manualRefNo,
    formData.deliveryChallan.salesOrderNo,
  
    formData.invoice.referenceId,
    formData.invoice.invoiceNo,
    formData.invoice.manualRefNo,
    formData.invoice.challanNo,
  
    formData.payment.referenceId,
    formData.payment.paymentNo,
    formData.payment.manualRefNo,
    formData.payment.invoiceNo,
    formData.invoice.manualInvoiceNo,
    formData.invoice.manualChallanNo,
    formData.invoice.invoiceNo,
    formData.invoice.challanNo,
  ]);
  
  // --- Handlers ---
  const handleChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value },
    }));
  };
  
  const handleItemChange = (tab, index, field, value) => {
    const updatedItems = [...formData[tab].items];
    updatedItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], items: updatedItems },
    }));
  };
  
  const handleProductChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };
  
  const addItem = (tab) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        items: [
          ...prev[tab].items,
          { name: '', qty: '', rate: '', tax: 0, discount: 0 }
        ],
      },
    }));
  };
  
  const removeItem = (tab, index) => {
    const updatedItems = [...formData[tab].items];
    updatedItems.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], items: updatedItems },
    }));
  };
  
  const handleRowSearchChange = (tab, index, value) => {
    setRowSearchTerms(prev => ({
      ...prev,
      [`${tab}-${index}`]: value
    }));
  };
  
  const handleSelectSearchedItem = (tab, index, item) => {
    const updatedItems = [...formData[tab].items];
    updatedItems[index] = {
      ...updatedItems[index],
      name: item.name,
      rate: item.price,
      tax: item.tax,
      hsn: item.hsn,
      uom: item.uom
    };
    
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], items: updatedItems }
    }));
    
    // Hide search for this row
    setShowRowSearch(prev => ({
      ...prev,
      [`${tab}-${index}`]: false
    }));
    
    // Clear search term
    setRowSearchTerms(prev => ({
      ...prev,
      [`${tab}-${index}`]: ''
    }));
  };
  
  const toggleRowSearch = (tab, index) => {
    const rowKey = `${tab}-${index}`;
    setShowRowSearch(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey]
    }));
  };
  
  const calculateTotalAmount = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const rate = parseFloat(item.rate) || 0;
      const qty = parseInt(item.qty) || 0;
      return total + (rate * qty);
    }, 0);
  };
  
  const calculateTotalWithTaxAndDiscount = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const rate = parseFloat(item.rate) || 0;
      const qty = parseInt(item.qty) || 0;
      const tax = parseFloat(item.tax) || 0;
      const discount = parseFloat(item.discount) || 0;
      const subtotal = rate * qty;
      const taxAmount = (subtotal * tax) / 100;
      return total + subtotal + taxAmount - discount;
    }, 0);
  };
  
  // --- Top Buttons ---
  const handlePrint = (lang) => {
    const printContent = pdfRef.current;
    if (!printContent) {
      alert("No content to print!");
      return;
    }
  
    // Mock Arabic translation
    const getArabicText = (text) => {
      const translations = {
        'PURCHASE QUOTATION': 'عرض شراء',
        'PURCHASE ORDER': 'طلب شراء',
        'GOODS RECEIPT NOTE': 'مذكرة استلام البضاعة',
        'PURCHASE BILL': 'فاتورة شراء',
        'PAYMENT RECEIPT': 'إيصال الدفع',
        'Company Name': 'اسم الشركة',
        'Vendor': 'المورد',
        'Quotation No.': 'رقم العرض',
        'Order No.': 'رقم الطلب',
        'Receipt No.': 'رقم الإيصال',
        'Bill No.': 'رقم الفاتورة',
        'Payment No.': 'رقم الدفعة',
        'Date': 'التاريخ',
        'Item Name': 'اسم الصنف',
        'Qty': 'الكمية',
        'Rate': 'السعر',
        'Amount': 'المبلغ',
        'Total': 'الإجمالي',
        'Attachments': 'المرفقات',
        'Signature': 'التوقيع',
        'Photo': 'الصورة',
        'Files': 'الملفات',
        'Terms & Conditions': 'الشروط والأحكام',
        'Thank you for your business!': 'شكرًا لتعاملكم معنا!',
        'Driver Details': 'تفاصيل السائق',
        'Vehicle No.': 'رقم المركبة',
        'Delivery Date': 'تاريخ التسليم',
        'Due Date': 'تاريخ الاستحقاق',
        'Payment Method': 'طريقة الدفع',
      };
      return translations[text] || text;
    };
  
    // Clone the content for modification
    const clone = printContent.cloneNode(true);
    const elements = clone.querySelectorAll('*');
  
    if (lang === 'arabic' || lang === 'both') {
      clone.style.direction = 'rtl';
      clone.style.fontFamily = "'Segoe UI', Tahoma, sans-serif";
      elements.forEach(el => {
        el.style.textAlign = 'right';
      });
    }
  
    // Bilingual mode: add Arabic below English
    if (lang === 'both') {
      elements.forEach(el => {
        const text = el.innerText.trim();
        if (text && !el.querySelector('img') && !el.querySelector('input')) {
          const arabic = getArabicText(text);
          if (arabic !== text) {
            const arSpan = document.createElement('div');
            arSpan.innerText = arabic;
            arSpan.style.color = '#0066cc';
            arSpan.style.marginTop = '4px';
            arSpan.style.fontSize = '0.9em';
            el.appendChild(arSpan);
          }
        }
      });
    } else if (lang === 'arabic') {
      elements.forEach(el => {
        const text = el.innerText.trim();
        const arabic = getArabicText(text);
        if (arabic !== text) {
          el.innerText = arabic;
        }
      });
    }
  
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; margin: 20px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #000; padding: 8px; text-align: left; }
      .text-end { text-align: right; }
      .fw-bold { font-weight: bold; }
      hr { border: 2px solid #28a745; margin: 10px 0; }
      h2, h4, h5 { color: #28a745; }
      .attachment-img { max-width: 150px; max-height: 100px; object-fit: contain; margin: 5px 0; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(clone.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
    };
  };
  
  const handleSend = () => {
    window.location.href = `mailto:?subject=Sales Quotation&body=Please find the quotation details attached.`;
  };
  
  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `${key}-${formData[key].quotationNo || formData[key].invoiceNo || 'document'}.pdf`,
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        html2canvas: { scale: 3 },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .save();
  };
  
  useEffect(() => {
    const saved = localStorage.getItem('purchaseFormRecords');
    if (saved) setSavedRecords(JSON.parse(saved));
  }, []);
  
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(formData.quotation.items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotation');
    XLSX.writeFile(workbook, `quotation-${formData.quotation.quotationNo || 'draft'}.xlsx`);
  };
  
  // --- Navigation Buttons ---
  const handleSkip = () => {
    setKey(prev => {
      if (prev === 'quotation') return 'salesOrder';
      if (prev === 'salesOrder') return 'deliveryChallan';
      if (prev === 'deliveryChallan') return 'invoice';
      if (prev === 'invoice') return 'payment';
      return 'quotation';
    });
  };
  
  const handleSaveDraft = () => onSubmit(formData, key);
  
  const handleSaveNext = () => {
    handleSaveDraft();
  
    setKey(prev => {
      if (prev === 'quotation') {
        setFormData(prevData => ({
          ...prevData,
          salesOrder: {
            ...prevData.salesOrder,
            quotationNo: prevData.quotation.quotationNo,
            orderDate: prevData.quotation.quotationDate,
            customerName: prevData.quotation.billToName,
            customerAddress: prevData.quotation.billToAddress,
            customerEmail: prevData.quotation.billToEmail,
            customerPhone: prevData.quotation.billToPhone,
            companyName: prevData.quotation.companyName,
            companyAddress: prevData.quotation.companyAddress,
            companyEmail: prevData.quotation.companyEmail,
            companyPhone: prevData.quotation.companyPhone,
            items: prevData.quotation.items.map(item => ({
              name: item.name,
              qty: item.qty,
              rate: item.rate,

            })),
          },
        }));
        return 'salesOrder';
      }
  
      if (prev === 'salesOrder') {
        setFormData(prevData => ({
          ...prevData,
          deliveryChallan: {
            ...prevData.deliveryChallan,
            salesOrderNo: prevData.salesOrder.orderNo,
            challanDate: new Date().toISOString().split('T')[0],
            companyName: prevData.salesOrder.companyName,
            companyAddress: prevData.salesOrder.companyAddress,
            companyEmail: prevData.salesOrder.companyEmail,
            companyPhone: prevData.salesOrder.companyPhone,
            billToName: prevData.salesOrder.customerName,
            billToAddress: prevData.salesOrder.customerAddress,
            billToEmail: prevData.salesOrder.customerEmail,
            billToPhone: prevData.salesOrder.customerPhone,
            shipToName: prevData.salesOrder.shipToCompanyName,
            shipToAddress: prevData.salesOrder.shipToAddress,
            shipToEmail: prevData.salesOrder.shipToEmail,
            shipToPhone: prevData.salesOrder.shipToPhone,
            items: prevData.salesOrder.items.map(item => ({
              name: item.name,
              qty: item.qty,
              deliveredQty: item.qty,
              rate: item.rate,
            })),
          },
        }));
        return 'deliveryChallan';
      }
  
      if (prev === 'deliveryChallan') {
        setFormData(prevData => ({
          ...prevData,
          invoice: {
            ...prevData.invoice,
            orderNo: prevData.salesOrder.orderNo,
            invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            customerName: prevData.deliveryChallan.billToName,
            customerAddress: prevData.deliveryChallan.billToAddress,
            customerEmail: prevData.deliveryChallan.billToEmail,
            customerPhone: prevData.deliveryChallan.billToPhone,
            companyName: prevData.deliveryChallan.companyName,
            companyAddress: prevData.deliveryChallan.companyAddress,
            companyEmail: prevData.deliveryChallan.companyEmail,
            companyPhone: prevData.deliveryChallan.companyPhone,
            items: prevData.deliveryChallan.items.map(item => ({
              description: item.name,
              qty: item.deliveredQty,
              rate: item.rate,
              tax: 0,
              discount: 0,
              amount: item.rate * item.deliveredQty,
            })),
          },
        }));
        return 'invoice';
      }
  
      if (prev === 'invoice') {
        setFormData(prevData => ({
          ...prevData,
          payment: {
            ...prevData.payment,
            invoiceNo: prevData.invoice.invoiceNo,
            paymentDate: new Date().toISOString().split('T')[0],
            totalAmount: calculateTotalAmount(prevData.invoice.items).toFixed(2),
            amount: '',
            customerName: prevData.invoice.customerName,
            customerAddress: prevData.invoice.customerAddress,
            customerEmail: prevData.invoice.customerEmail,
            customerPhone: prevData.invoice.customerPhone,
            companyName: prevData.invoice.companyName,
            companyAddress: prevData.invoice.companyAddress,
            companyEmail: prevData.invoice.companyEmail,
            companyPhone: prevData.invoice.companyPhone,
          },
        }));
        return 'payment';
      }
  
      return 'quotation';
    });
  };
  
  const handleNext = () => {
    setKey(prev => {
      if (prev === 'quotation') return 'salesOrder';
      if (prev === 'salesOrder') return 'deliveryChallan';
      if (prev === 'deliveryChallan') return 'invoice';
      if (prev === 'invoice') return 'payment';
      return 'quotation';
    });
  };
  
  const handleFinalSubmit = () => {
    const newRecord = {
      id: currentRecordId || Date.now(),
      data: formData,
      createdAt: new Date().toLocaleString(),
    };
  
    if (currentRecordId) {
      setSavedRecords(prev => {
        const updated = prev.map(r => r.id === currentRecordId ? newRecord : r);
        localStorage.setItem('purchaseFormRecords', JSON.stringify(updated));
        return updated;
      });
    } else {
      const updatedRecords = [...savedRecords, newRecord];
      setSavedRecords(updatedRecords);
      localStorage.setItem('purchaseFormRecords', JSON.stringify(updatedRecords));
    }
  
    setCurrentRecordId(null);
    alert("Form submitted!");
  };
  
  const handleEditRecord = (id) => {
    const record = savedRecords.find(r => r.id === id);
    if (record) {
      setFormData(record.data);
      setCurrentRecordId(id);
  
      if (record.data.payment?.invoiceNo) {
        setKey('payment');
      } else if (record.data.invoice?.invoiceNo) {
        setKey('invoice');
      } else if (record.data.deliveryChallan?.challanNo) {
        setKey('deliveryChallan');
      } else if (record.data.salesOrder?.orderNo) {
        setKey('salesOrder');
      } else {
        setKey('quotation');
      }
    }
  };
  
  const handleDeleteRecord = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      if (currentRecordId === id) {
        setCurrentRecordId(null);
      }
    }
  };
  
  // File handlers
  const handleSignatureChange = (tab, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(tab, 'signature', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePhotoChange = (tab, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(tab, 'photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFileChange = (tab, e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: reader.result
        });
        
        if (newFiles.length === files.length) {
          handleChange(tab, 'files', [...formData[tab].files, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeFile = (tab, index) => {
    const updatedFiles = [...formData[tab].files];
    updatedFiles.splice(index, 1);
    handleChange(tab, 'files', updatedFiles);
  };
  
  const renderItemsTable = (tab) => {
    const items = formData[tab]?.items || [];
  
    const handleItemChange = (index, field, value) => {
      const updatedItems = [...items];
      updatedItems[index][field] = value;
      setFormData(prev => ({
        ...prev,
        [tab]: { ...prev[tab], items: updatedItems }
      }));
    };
  
    const addItem = () => {
      setFormData(prev => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          items: [...items, { name: '', qty: '', rate: '', tax: 0, discount: 0 }]
        }
      }));
    };
  
    const removeItem = (idx) => {
      const updatedItems = items.filter((_, index) => index !== idx);
      setFormData(prev => ({
        ...prev,
        [tab]: { ...prev[tab], items: updatedItems }
      }));
    };
  
    // Filter items based on search term for each row
    const getFilteredItems = (index) => {
      const searchTerm = rowSearchTerms[`${tab}-${index}`] || '';
      if (!searchTerm) return [];
      
      return availableItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };
  
    return (
      <div>
        <div className="d-flex justify-content-between mb-2">
          <div>
            <Button
              size="sm"
              onClick={addItem}
              style={{ backgroundColor: "#53b2a5", border: "none", padding: "6px 12px", fontWeight: "500", marginRight: "5px" }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Row
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAdd(true)}
              style={{ backgroundColor: "#53b2a5", border: "none", padding: "6px 12px", fontWeight: "500" }}
            >
              + Add Product
            </Button>
          </div>
        </div>
        
        <AddProductModal
          showAdd={showAdd}
          showEdit={showEdit}
          newItem={newItem}
          categories={categories}
          newCategory={newCategory}
          showUOMModal={showUOMModal}
          showAddCategoryModal={showAddCategoryModal}
          setShowAdd={setShowAdd}
          setShowEdit={setShowEdit}
          setShowUOMModal={setShowUOMModal}
          setShowAddCategoryModal={setShowAddCategoryModal}
          setNewCategory={setNewCategory}
          handleChange={handleProductChange}
          handleAddItem={handleAddItem}
          handleUpdateItem={handleUpdateItem}
          handleAddCategory={handleAddCategory}
        />
        
        <Table bordered hover size="sm" className="dark-bordered-table">
          <thead className="bg-light">
            <tr>
              <th>Item Name</th>
              <th>Qty</th>
              {tab === 'deliveryChallan' && <th>Delivered Qty</th>}
              <th>Rate</th>
              <th>Tax %</th>
              <th>Discount</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const qty = tab === 'deliveryChallan' ? (parseInt(item.deliveredQty) || 0) : (parseInt(item.qty) || 0);
              const amount = (parseFloat(item.rate) || 0) * qty;
              const rowKey = `${tab}-${idx}`;
              const filteredItems = getFilteredItems(idx);
              const isSearchVisible = showRowSearch[rowKey];
              
              return (
                <tr key={idx}>
                  <td style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Form.Control
                        type="text"
                        size="sm"
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        placeholder="Item Name"
                        style={{ marginRight: '5px' }}
                      />
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => toggleRowSearch(tab, idx)}
                        title="Search Items"
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </Button>
                    </div>
                    {isSearchVisible && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                        <InputGroup size="sm">
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faSearch} />
                          </InputGroup.Text>
                          <FormControl
                            placeholder="Search items..."
                            value={rowSearchTerms[rowKey] || ''}
                            onChange={(e) => handleRowSearchChange(tab, idx, e.target.value)}
                            autoFocus
                          />
                        </InputGroup>
                        {filteredItems.length > 0 ? (
                          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredItems.map(filteredItem => (
                              <div 
                                key={filteredItem.id}
                                style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onClick={() => handleSelectSearchedItem(tab, idx, filteredItem)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <div><strong>{filteredItem.name}</strong></div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                  {filteredItem.category} - ${filteredItem.price.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: '8px', textAlign: 'center', color: '#666' }}>
                            No items found
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      size="sm"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      placeholder="Qty"
                    />
                  </td>
                  {tab === 'deliveryChallan' && (
                    <td>
                      <Form.Control
                        type="number"
                        size="sm"
                        value={item.deliveredQty}
                        onChange={(e) => handleItemChange(idx, 'deliveredQty', e.target.value)}
                        placeholder="Delivered Qty"
                      />
                    </td>
                  )}
                  <td>
                    <Form.Control
                      type="number"
                      step="0.01"
                      size="sm"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                      placeholder="Rate"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      step="0.01"
                      size="sm"
                      value={item.tax}
                      onChange={(e) => handleItemChange(idx, 'tax', e.target.value)}
                      placeholder="Tax %"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      step="0.01"
                      size="sm"
                      value={item.discount}
                      onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                      placeholder="Discount"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      step="0.01"
                      size="sm"
                      value={amount.toFixed(2)}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}
                    />
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeItem(idx)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  };
  
  const renderPDFView = () => {
    const currentTab = formData[key];
    const hasItems = tabsWithItems.includes(key) && Array.isArray(currentTab.items);
  
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: 'white' }}>
        {/* Header: Logo + Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div
            style={{
              border: '2px dashed #28a745',
              padding: '10px',
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {currentTab.logo ? (
              <img src={currentTab.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100px' }} />
            ) : (
              'Logo'
            )}
          </div>
          <div style={{ textAlign: 'center', color: '#28a745' }}>
            <h2>
              {key === 'purchaseQuotation' && 'PURCHASE QUOTATION'}
              {key === 'purchaseOrder' && 'PURCHASE ORDER'}
              {key === 'goodsReceipt' && 'GOODS RECEIPT NOTE'}
              {key === 'bill' && 'PURCHASE BILL'}
              {key === 'payment' && 'PAYMENT RECEIPT'}
            </h2>
          </div>
        </div>
        <hr style={{ border: '2px solid #28a745', margin: '15px 0' }} />
  
        {/* Company Info */}
        <div style={{ marginBottom: '15px' }}>
          <h4>{currentTab.companyName}</h4>
          <p>{currentTab.companyAddress}</p>
          <p>Email: {currentTab.companyEmail} | Phone: {currentTab.companyPhone}</p>
        </div>
  
        {/* Vendor Info */}
        {currentTab.vendorName && (
          <div style={{ marginBottom: '15px' }}>
            <h5>VENDOR</h5>
            <p>{currentTab.vendorName}</p>
            <p>{currentTab.vendorAddress}</p>
            <p>Email: {currentTab.vendorEmail} | Phone: {currentTab.vendorPhone}</p>
          </div>
        )}
  
        {/* Ship To */}
        {currentTab.shipToName && (
          <div style={{ marginBottom: '15px' }}>
            <h5>SHIP TO</h5>
            <p>{currentTab.shipToName}</p>
            <p>{currentTab.shipToAddress}</p>
            <p>Email: {currentTab.shipToEmail} | Phone: {currentTab.shipToPhone}</p>
          </div>
        )}
  
        {/* Driver & Vehicle (Goods Receipt) */}
        {key === 'goodsReceipt' && (
          <div style={{ marginBottom: '15px' }}>
            <h5>DRIVER DETAILS</h5>
            <p>{currentTab.driverName} | {currentTab.driverPhone}</p>
            <p><strong>Vehicle No.:</strong> {currentTab.vehicleNo}</p>
          </div>
        )}
  
        {/* Document Numbers */}
        <div style={{ marginBottom: '15px' }}>
          <strong>Ref ID:</strong> {currentTab.referenceId} |
          {key === 'purchaseQuotation' && <><strong>Quotation No.:</strong> {currentTab.quotationNo} | </>}
          {key === 'purchaseOrder' && <><strong>Order No.:</strong> {currentTab.orderNo} | </>}
          {key === 'goodsReceipt' && <><strong>Receipt No.:</strong> {currentTab.receiptNo} | </>}
          {key === 'bill' && <><strong>Bill No.:</strong> {currentTab.billNo} | </>}
          {key === 'payment' && <><strong>Payment No.:</strong> {currentTab.paymentNo} | </>}
          <strong>Date:</strong> {currentTab[`${key}Date`] || currentTab.date || new Date().toISOString().split('T')[0]}
          {key === 'purchaseQuotation' && currentTab.validDate && <> | <strong>Valid Till:</strong> {currentTab.validDate}</>}
          {key === 'bill' && currentTab.dueDate && <> | <strong>Due Date:</strong> {currentTab.dueDate}</>}
        </div>
  
        {/* Items Table */}
        {hasItems && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Item Name</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Qty</th>
                {key === 'goodsReceipt' && <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Received Qty</th>}
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Rate</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Tax %</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Discount</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentTab.items.map((item, idx) => {
                const qty = key === 'goodsReceipt' ? (parseInt(item.receivedQty) || 0) : (parseInt(item.qty) || 0);
                const rate = parseFloat(item.rate) || 0;
                const tax = parseFloat(item.tax) || 0;
                const discount = parseFloat(item.discount) || 0;
                const subtotal = rate * qty;
                const taxAmount = (subtotal * tax) / 100;
                const amount = subtotal + taxAmount - discount;
                return (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.name}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.qty}</td>
                    {key === 'goodsReceipt' && <td style={{ border: '1px solid #000', padding: '8px' }}>{item.receivedQty}</td>}
                    <td style={{ border: '1px solid #000', padding: '8px' }}>${rate.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{tax}%</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>${discount.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>${amount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={key === 'goodsReceipt' ? 6 : 5} style={{ textAlign: 'right', fontWeight: 'bold', border: '1px solid #000', padding: '8px' }}>
                  Total:
                </td>
                <td style={{ fontWeight: 'bold', border: '1px solid #000', padding: '8px' }}>
                  ${calculateTotalWithTaxAndDiscount(currentTab.items).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
  
        {/* Payment Details (Payment Tab) */}
        {key === 'payment' && (
          <div style={{ marginBottom: '15px' }}>
            <h5>PAYMENT DETAILS</h5>
            <p><strong>Amount Paid:</strong> ${parseFloat(currentTab.amount || 0).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {currentTab.paymentMethod}</p>
            <p><strong>Status:</strong> {currentTab.paymentStatus}</p>
          </div>
        )}
  
        {/* Bank Details */}
        {currentTab.bankName && (
          <div style={{ marginBottom: '15px' }}>
            <h5>BANK DETAILS</h5>
            <p><strong>Bank Name:</strong> {currentTab.bankName}</p>
            <p><strong>Account No.:</strong> {currentTab.accountNo}</p>
            <p><strong>Account Holder:</strong> {currentTab.accountHolder}</p>
            <p><strong>IFSC:</strong> {currentTab.ifsc}</p>
          </div>
        )}
  
        {/* Terms & Conditions */}
        {currentTab.terms && (
          <div style={{ marginBottom: '15px' }}>
            <h5>TERMS & CONDITIONS</h5>
            <p>{currentTab.terms}</p>
          </div>
        )}
  
        {/* Attachments */}
        <div style={{ marginBottom: '15px' }}>
          {currentTab.signature && (
            <div style={{ marginBottom: '10px' }}>
              <strong>SIGNATURE</strong>
              <br />
              <img src={currentTab.signature} alt="Signature" style={{ maxWidth: '150px', maxHeight: '80px', marginTop: '5px' }} />
            </div>
          )}
          {currentTab.photo && (
            <div style={{ marginBottom: '10px' }}>
              <strong>PHOTO</strong>
              <br />
              <img src={currentTab.photo} alt="Photo" style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover', marginTop: '5px' }} />
            </div>
          )}
          {currentTab.files && currentTab.files.length > 0 && (
            <div>
              <strong>FILES</strong>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '5px' }}>
                {currentTab.files.map((file, i) => (
                  <li key={i}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
  
        {/* Footer Note */}
        <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '30px', fontSize: '1.1em' }}>
          {currentTab.footerNote || "Thank you for your business!"}
        </p>
      </div>
    );
  };
  
  // Render attachment fields for all tabs
  const renderAttachmentFields = (tab) => {
    return (
      <div className="mt-4 mb-4">
        <h5>Attachments</h5>
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Signature</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleSignatureChange(tab, e)} 
              />
              {formData[tab].signature && (
                <div className="mt-2">
                  <img 
                    src={formData[tab].signature} 
                    alt="Signature" 
                    style={{ width: '100px', height: '50px', objectFit: 'contain' }} 
                  />
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Photo</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={(e) => handlePhotoChange(tab, e)} 
              />
              {formData[tab].photo && (
                <div className="mt-2">
                  <img 
                    src={formData[tab].photo} 
                    alt="Photo" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  />
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Attach Files</Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                onChange={(e) => handleFileChange(tab, e)} 
              />
              {formData[tab].files && formData[tab].files.length > 0 && (
                <div className="mt-2">
                  <ul className="list-unstyled">
                    {formData[tab].files.map((file, index) => (
                      <li key={index} className="d-flex justify-content-between align-items-center">
                        <span>{file.name}</span>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => removeFile(tab, index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
      </div>
    );
  };
  
  return (
    <>  
    <div className="container-fluid mt-4 px-2" ref={formRef}>
      <h4 className="text-center mb-4">Sales Process</h4>
      
      {/* Top Action Buttons */}
    {/* Top Action Buttons */}
<div className="d-flex flex-wrap justify-content-center gap-2 gap-sm-3 mb-4">
  
  {/* Print English */}
  <Button
    variant="warning"
    onClick={() => handlePrint('english')}
    className="flex-fill flex-sm-grow-0"
    style={{ minWidth: "130px", fontSize: "0.95rem", padding: "6px 10px" }}
  >
    Print (English)
  </Button>

  {/* Print Arabic */}
  <Button
    variant="warning"
    onClick={() => handlePrint('arabic')}
    className="flex-fill flex-sm-grow-0"
    style={{ minWidth: "130px", fontSize: "0.95rem", padding: "6px 10px", backgroundColor: '#d39e00', borderColor: '#c49200' }}
  >
    طباعة (العربية)
  </Button>

  {/* Print Both */}
  <Button
    variant="warning"
    onClick={() => handlePrint('both')}
    className="flex-fill flex-sm-grow-0"
    style={{ minWidth: "150px", fontSize: "0.95rem", padding: "6px 10px", backgroundColor: '#c87f0a', borderColor: '#b87409' }}
  >
    Print Both (EN + AR)
  </Button>

  {/* Send Button */}
  <Button
    variant="info"
    onClick={handleSend}
    className="flex-fill flex-sm-grow-0"
    style={{ color: 'white', minWidth: "110px", fontSize: "0.95rem", padding: "6px 10px" }}
  >
    Send
  </Button>

  {/* Download PDF */}
  <Button
    variant="success"
    onClick={handleDownloadPDF}
    className="flex-fill flex-sm-grow-0"
    style={{ minWidth: "130px", fontSize: "0.95rem", padding: "6px 10px" }}
  >
    Download PDF
  </Button>

  {/* View Bills */}
  <Button
    variant="primary"
    onClick={() => navigate('/company/viewinvoicee')}
    className="flex-fill flex-sm-grow-0"
    style={{ minWidth: "130px", fontSize: "0.95rem", padding: "6px 10px" }}
  >
    View Bills
  </Button>
</div>
      
      <Tabs activeKey={key} onSelect={setKey} className="mb-4" fill>
        {/* ============= QUOTATION TAB ============= */}
        <Tab eventKey="quotation" title="Quotation">
          <Form>
            {/* Header: Logo + Company Info + Title */}
            <Row className="mb-4 mt-3">
              <Col md={3} className="d-flex align-items-center justify-content-center">
                <div
                  className="border rounded d-flex flex-column align-items-center justify-content-center"
                  style={{ height: "120px", width: "100%", borderStyle: "dashed", cursor: "pointer" }}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <FontAwesomeIcon icon={faUpload} size="2x" className="text-muted" />
                  <small>Upload Logo</small>
                  <input id="logo-upload" type="file" accept="image/*" hidden />
                </div>
              </Col>
        
              <Col md={6}>
                <div className="d-flex flex-column gap-1">
                  <Form.Control
                    type="text"
                    value={formData.quotation.companyName}
                    onChange={(e) => handleChange("quotation", "companyName", e.target.value)}
                    placeholder="Enter Your Company Name......."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.quotation.companyAddress}
                    onChange={(e) => handleChange("quotation", "companyAddress", e.target.value)}
                    placeholder="Company Address, City, State, Pincode......."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="email"
                    value={formData.quotation.companyEmail}
                    onChange={(e) => handleChange("quotation", "companyEmail", e.target.value)}
                    placeholder="Company Email......."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.quotation.companyPhone}
                    onChange={(e) => handleChange("quotation", "companyPhone", e.target.value)}
                    placeholder="Phone No........"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </div>
              </Col>
              <Col md={3} className="d-flex flex-column align-items-end justify-content-center">
                <h2 className="text-success mb-0">QUOTATION</h2>
                <hr
                  style={{
                    width: "80%",
                    borderColor: "#28a745",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                />
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px", 
                backgroundColor: "#28a745", 
                border: "none", 
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Quotation & Customer Info */}
            <Row className="mb-4 d-flex justify-content-between">
              <Col md={8}>
                <h5>Quotation To</h5>
                <Form.Group className="mb-2">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Control
                      type="text"
                      value={formData.quotation.billToName}
                      onChange={(e) => handleChange("quotation", "billToName", e.target.value)}
                      placeholder=" Enter Customer Name....."
                      className="form-control-no-border"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", marginRight: '5px' }}
                    />
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => navigate('/Company/CustomersDebtors')}
                      title="Add Customer"
                    >
                       Add Customer
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    value={formData.quotation.billToAddress}
                    onChange={(e) => handleChange("quotation", "billToAddress", e.target.value)}
                    placeholder="Customer Address"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="email"
                    value={formData.quotation.billToEmail}
                    onChange={(e) => handleChange("quotation", "billToEmail", e.target.value)}
                    placeholder="Email"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    value={formData.quotation.billToPhone}
                    onChange={(e) => handleChange("quotation", "billToPhone", e.target.value)}
                    placeholder="Phone"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex flex-column align-items-start">
  <div className="d-flex flex-column gap-2" style={{ maxWidth: "400px", width: "100%" }}>

    {/* System Reference No (Auto) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Ref No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.quotation.referenceId}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Customer Ref (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Customer Ref (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.quotation.customerReference || ""}
          onChange={(e) => handleChange("quotation", "customerReference", e.target.value)}
          placeholder="e.g. CUST-REF-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Quotation No (Auto) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Quotation No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.quotation.quotationNo}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Quotation Ref (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual QUO No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.quotation.manualQuotationRef || ""}
          onChange={(e) => handleChange("quotation", "manualQuotationRef", e.target.value)}
          placeholder="e.g. QUO-CUST-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

{/* ============= QUOTATION DATE ============= */}
<Row className="align-items-center g-2 mb-2">
  <Col md="auto" className="p-0">
    <Form.Label
         className="mb-0 flex-shrink-0 me-2"
         style={{
           fontSize: "0.9rem",
           color: "#6c757d",
           whiteSpace: "nowrap"
         }}
    >
      Quotation Date
    </Form.Label>
  </Col>
  <Col className="p-0">
    <Form.Control
      type="date"
      value={formData.quotation.quotationDate}
      onChange={(e) => handleChange("quotation", "quotationDate", e.target.value)}
      style={{
        border: "1px solid #495057",
        fontSize: "1rem"
      }}
    />
  </Col>
</Row>

{/* ============= VALID TILL ============= */}
<Row className="align-items-center g-2 mb-2">
  <Col md="auto" className="p-0">
    <Form.Label
       className="mb-0 flex-shrink-0 me-2"
       style={{
         fontSize: "0.9rem",
         color: "#6c757d",
         whiteSpace: "nowrap"
       }}
    >
      Valid Till
    </Form.Label>
  </Col>
  <Col className="p-0">
    <Form.Control
      type="date"
      value={formData.quotation.validDate}
      onChange={(e) => handleChange("quotation", "validDate", e.target.value)}
      style={{
        border: "1px solid #495057",
        fontSize: "1rem"
      }}
    />
  </Col>
</Row>
  </div>
</Col>
            </Row>
            
            {/* Items Table */}
            <Row className="mb-4">
              <Col>
                {renderItemsTable("quotation")}
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px", 
                backgroundColor: "#28a745",
                border: "none", 
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Totals - Moved to left side */}
            {tabsWithItems.includes(key) && (
              <Row className="mb-4 mt-2">
                <Col md={4}>
                  <Table bordered size="sm" className="dark-bordered-table">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Sub Total:</td>
                        <td>
                          ${formData[key].items.reduce((sum, item) => 
                            sum + (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Tax:</td>
                        <td>
                          ${formData[key].items.reduce((sum, item) => {
                            const subtotal = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
                            return sum + (subtotal * (parseFloat(item.tax) || 0)) / 100;
                          }, 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Discount:</td>
                        <td>
                          ${formData[key].items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Total:</td>
                        <td className="fw-bold">
                          ${calculateTotalWithTaxAndDiscount(formData[key].items).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}
            
            <hr
              style={{
                width: "100%",
                height: "4px", 
                backgroundColor: "#28a745", 
                border: "none", 
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Bank & Notes */}
            <Row className="mb-4">
              <h5>Bank Details</h5>
              <Col
                md={6}
                className="p-2 rounded"
                style={{ border: "1px solid #343a40" }}
              >
                {['bankName', 'accountNo', 'accountHolder', 'ifsc'].map(field => (
                  <Form.Group key={field} className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder={{
                        bankName: 'Bank Name',
                        accountNo: 'Account No.',
                        accountHolder: 'Account Holder',
                        ifsc: 'IFSC Code',
                      }[field]}
                      value={formData.quotation[field] || ""}
                      onChange={(e) => handleChange("quotation", field, e.target.value)}
                      className="form-control-no-border"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                    />
                  </Form.Group>
                ))}
              </Col>
              <Col md={6}>
                <h5>Notes</h5>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter any additional notes"
                  value={formData.quotation.notes || ""}
                  onChange={(e) => handleChange("quotation", "notes", e.target.value)}
                  style={{ border: "1px solid #343a40" }}
                />
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px", 
                backgroundColor: "#28a745", 
                border: "none", 
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Terms & Footer */}
            <Row className="mb-4">
              <Col>
                <Form.Group>
                  <Form.Label>Terms & Conditions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.quotation.terms}
                    onChange={(e) => handleChange("quotation", "terms", e.target.value)}
                    placeholder="e.g. Payment within 15 days"
                    style={{ border: "1px solid #343a40" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {/* Attachment Fields */}
            {renderAttachmentFields("quotation")}
            
            <Row className="text-center mb-4">
              <Col>
                <p><strong>Thank you for your business!</strong></p>
                <p className="text-muted">www.yourcompany.com</p>
              </Col>
            </Row>
            
            {/* Navigation */}
            <div className="d-flex justify-content-between mt-5">
              <Button variant="secondary" onClick={handleSkip}>Skip</Button>
              <Button variant="warning" onClick={handleSaveDraft}>Save Draft</Button>
              <Button variant="primary" onClick={handleSaveNext}>Save & Next</Button>
              <Button variant="success" onClick={handleNext}>Next</Button>
            </div>
          </Form>
        </Tab>
        
        {/* ============= SALES ORDER TAB ============= */}
        <Tab eventKey="salesOrder" title="Sales Order">
          <Form>
            {/* Header: Logo + Company Info + Title */}
            <Row className="mb-4 d-flex justify-content-between">
              <Col md={3} className="d-flex align-items-center justify-content-center">
                <div
                  className="border rounded d-flex flex-column align-items-center justify-content-center"
                  style={{ height: "120px", width: "100%", borderStyle: "dashed", cursor: "pointer" }}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <FontAwesomeIcon icon={faUpload} size="2x" className="text-muted" />
                  <small>Upload Logo</small>
                  <input id="logo-upload" type="file" accept="image/*" hidden />
                </div>
              </Col>
  
              <Col md={3} className="d-flex flex-column align-items-end justify-content-center">
                <h2 className="text-success mb-0">SALES ORDER FORM</h2>
                <hr
                  style={{
                    width: "80%",
                    borderColor: "#28a745",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                />
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            <Row className="mb-4 mt-3">
              <Col md={6}>
                <div className="d-flex flex-column align-items-end justify-content-center gap-1">
                  <Form.Control
                    type="text"
                    value={formData.salesOrder.companyName}
                    onChange={(e) => handleChange("salesOrder", "companyName", e.target.value)}
                    placeholder="Your Company Name"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.salesOrder.companyAddress}
                    onChange={(e) => handleChange("salesOrder", "companyAddress", e.target.value)}
                    placeholder="Company Address, City, State, Pincode"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="email"
                    value={formData.salesOrder.companyEmail}
                    onChange={(e) => handleChange("salesOrder", "companyEmail", e.target.value)}
                    placeholder="Company Email"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.salesOrder.companyPhone}
                    onChange={(e) => handleChange("salesOrder", "companyPhone", e.target.value)}
                    placeholder="Phone No."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </div>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
  <div className="d-flex flex-column gap-2 text-end" style={{ maxWidth: "400px", width: "100%" }}>
    
    {/* Order Date */}
    <Form.Group>
      <Form.Control
        type="date"
        value={formData.salesOrder.orderDate}
        onChange={(e) => handleChange('salesOrder', 'orderDate', e.target.value)}
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>

{/* System Ref No (Auto) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap",
        flexShrink: 0,
        marginRight: "8px"
      }}
    >
      Ref No.
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.salesOrder.referenceId}
      readOnly
      className="form-control-no-border text-end"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0",
        fontWeight: "500",
        backgroundColor: "#f8f9fa",
        color: "#495057",
        cursor: "not-allowed",
        textAlign: "right",
        flexGrow: 1
      }}
    />
  </div>
</Form.Group>

{/* Manual Ref No (Optional) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0 flex-shrink-0 me-2"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap"
      }}
    >
      Manual Ref No (Optional)
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.salesOrder.manualRefNo || ""}
      onChange={(e) => handleChange("salesOrder", "manualRefNo", e.target.value)}
      placeholder="e.g. SO-INT-2025"
      className="form-control-no-border text-end flex-grow-1"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0.375rem 0.75rem",
        textAlign: "right"
      }}
    />
  </div>
</Form.Group>
    {/* Manual Order Ref (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual SO Ref (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.salesOrder.manualOrderRef || ""}
          onChange={(e) => handleChange("salesOrder", "manualOrderRef", e.target.value)}
          placeholder="e.g. SO-CUST-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Sales Order No (Auto or Manual) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          SO No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.salesOrder.salesOrderNo}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

{/* Quotation No (Auto from Quotation) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap",
        flexShrink: 0,
        marginRight: "8px"
      }}
    >
      Quotation No
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.salesOrder.quotationNo}
      readOnly
      className="form-control-no-border text-end"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0",
        fontWeight: "500",
        backgroundColor: "#f8f9fa",
        color: "#495057",
        cursor: "not-allowed",
        textAlign: "right",
        flexGrow: 1
      }}
    />
  </div>
</Form.Group>

{/* Manual Quotation Ref (Optional) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0 flex-shrink-0 me-2"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap"
      }}
    >
      Manual Quotation No (Optional)
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.salesOrder.manualQuotationRef || ""}
      onChange={(e) => handleChange("salesOrder", "manualQuotationRef", e.target.value)}
      placeholder="e.g. CUST-QTN-001"
      className="form-control-no-border text-end flex-grow-1"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0.375rem 0.75rem",
        textAlign: "right"
      }}
    />
  </div>
</Form.Group>

    {/* Customer No */}
    <Form.Group>
      <Form.Control
        type="text"
        value={formData.salesOrder.customerNo}
        onChange={(e) => handleChange('salesOrder', 'customerNo', e.target.value)}
        placeholder="Customer No."
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>
  </div>
</Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Bill To and Ship To Sections */}
            <Row className="mb-4 d-flex justify-content-between">
              <Col md={6} className="d-flex flex-column align-items-start">
                <h5>BILL TO</h5>
                <Form.Group className="mb-2 w-100">
                  <Form.Label>ATN: Name / Dept</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.salesOrder.billToAttn}
                    onChange={(e) => handleChange("salesOrder", "billToAttn", e.target.value)}
                    placeholder="Attention Name / Department"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Control
                      type="text"
                      value={formData.salesOrder.billToCompanyName}
                      onChange={(e) => handleChange("salesOrder", "billToCompanyName", e.target.value)}
                      placeholder="Company Name"
                      className="form-control-no-border"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", marginRight: '5px' }}
                    />
                  
                  </div>
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="text"
                    value={formData.salesOrder.billToAddress}
                    onChange={(e) => handleChange("salesOrder", "billToAddress", e.target.value)}
                    placeholder="Company Address"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="text"
                    value={formData.salesOrder.billToPhone}
                    onChange={(e) => handleChange("salesOrder", "billToPhone", e.target.value)}
                    placeholder="Phone"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="email"
                    value={formData.salesOrder.billToEmail}
                    onChange={(e) => handleChange("salesOrder", "billToEmail", e.target.value)}
                    placeholder="Email"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
                <h5>SHIP TO</h5>
                <div className="w-100 text-end" style={{ maxWidth: "400px" }}>
                  <Form.Group className="mb-2">
                    <Form.Label>ATN: Name / Dept</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.salesOrder.shipToAttn}
                      onChange={(e) => handleChange("salesOrder", "shipToAttn", e.target.value)}
                      placeholder="Attention Name / Department"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.salesOrder.shipToCompanyName}
                      onChange={(e) => handleChange("salesOrder", "shipToCompanyName", e.target.value)}
                      placeholder="Company Name"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.salesOrder.shipToAddress}
                      onChange={(e) => handleChange("salesOrder", "shipToAddress", e.target.value)}
                      placeholder="Company Address"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.salesOrder.shipToPhone}
                      onChange={(e) => handleChange("salesOrder", "shipToPhone", e.target.value)}
                      placeholder="Phone"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="email"
                      value={formData.salesOrder.shipToEmail}
                      onChange={(e) => handleChange("salesOrder", "shipToEmail", e.target.value)}
                      placeholder="Email"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Items Table */}
            <div className="mt-4">{renderItemsTable('salesOrder')}</div>
            
            {/* Totals - Moved to left side */}
            <Row className="mb-4 mt-2">
              <Col md={4}>
                <Table bordered size="sm" className="dark-bordered-table">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Sub Total:</td>
                      <td>${calculateTotalAmount(formData.salesOrder.items).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Total:</td>
                      <td className="fw-bold">
                        ${calculateTotalAmount(formData.salesOrder.items).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            
            {/* Terms & Conditions */}
            <Form.Group className="mt-4">
              <Form.Label>Terms & Conditions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.salesOrder.terms}
                onChange={(e) => handleChange('salesOrder', 'terms', e.target.value)}
                style={{ border: "1px solid #343a40" }} 
              />
            </Form.Group>
            
            {/* Attachment Fields */}
            {renderAttachmentFields("salesOrder")}
            
            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={handleSkip}>Skip</Button>
              <Button variant="warning" onClick={handleSaveDraft}>Save Draft</Button>
              <Button variant="primary" onClick={handleSaveNext}>Save & Next</Button>
              <Button variant="success" onClick={handleNext}>Next</Button>
            </div>
          </Form>
        </Tab>
        
        {/* ============= DELIVERY CHALLAN TAB ============= */}
        <Tab eventKey="deliveryChallan" title="Delivery Challan">
          <Form>
            {/* Header: Logo + Company Info + Title */}
            <Row className="mb-4 d-flex justify-content-between">
              <Col md={3} className="d-flex align-items-center justify-content-center">
                <div
                  className="border rounded d-flex flex-column align-items-center justify-content-center"
                  style={{ height: "120px", width: "100%", borderStyle: "dashed", cursor: "pointer" }}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <FontAwesomeIcon icon={faUpload} size="2x" className="text-muted" />
                  <small>Upload Logo</small>
                  <input id="logo-upload" type="file" accept="image/*" hidden />
                </div>
              </Col>
  
              <Col md={3} className="d-flex flex-column align-items-end justify-content-center">
                <h2 className="text-success mb-0">DELIVERY CHALLAN</h2>
                <hr
                  style={{
                    width: "80%",
                    borderColor: "#28a745",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                />
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            <Row className="mb-4 mt-3">
              <Col md={6}>
                <div className="d-flex flex-column align-items-end justify-content-center gap-1">
                  <Form.Control
                    type="text"
                    value={formData.deliveryChallan.companyName}
                    onChange={(e) => handleChange("deliveryChallan", "companyName", e.target.value)}
                    placeholder="Your Company Name"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.deliveryChallan.companyAddress}
                    onChange={(e) => handleChange("deliveryChallan", "companyAddress", e.target.value)}
                    placeholder="Company Address, City, State, Pincode"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="email"
                    value={formData.deliveryChallan.companyEmail}
                    onChange={(e) => handleChange("deliveryChallan", "companyEmail", e.target.value)}
                    placeholder="Company Email"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.deliveryChallan.companyPhone}
                    onChange={(e) => handleChange("deliveryChallan", "companyPhone", e.target.value)}
                    placeholder="Phone No."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </div>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
  <div className="d-flex flex-column gap-2 text-end" style={{ maxWidth: "400px", width: "100%" }}>
    
    {/* Challan Date */}
    <Form.Group>
      <Form.Control
        type="date"
        value={formData.deliveryChallan.challanDate}
        onChange={(e) => handleChange('deliveryChallan', 'challanDate', e.target.value)}
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>

    {/* System Reference No (Auto) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Ref No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.deliveryChallan.referenceId}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Reference No (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual Ref No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.deliveryChallan.manualRefNo || ""}
          onChange={(e) => handleChange("deliveryChallan", "manualRefNo", e.target.value)}
          placeholder="e.g. DC-REF-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Challan No (Auto or Manual) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Challan No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.deliveryChallan.challanNo}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Challan No (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual DC No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.deliveryChallan.manualChallanNo || ""}
          onChange={(e) => handleChange("deliveryChallan", "manualChallanNo", e.target.value)}
          placeholder="e.g. DC-CUST-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Sales Order No (Auto) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          SO No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.deliveryChallan.salesOrderNo}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Sales Order No (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual SO No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.deliveryChallan.manualSalesOrderRef || ""}
          onChange={(e) => handleChange("deliveryChallan", "manualSalesOrderRef", e.target.value)}
          placeholder="e.g. SO-CUST-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Vehicle No */}
    <Form.Group>
      <Form.Control
        type="text"
        value={formData.deliveryChallan.vehicleNo}
        onChange={(e) => handleChange('deliveryChallan', 'vehicleNo', e.target.value)}
        placeholder="Vehicle No."
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>
  </div>
</Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Bill To and Ship To Sections */}
            <Row className="mb-4 d-flex justify-content-between">
              <Col md={6} className="d-flex flex-column align-items-start">
                <h5>BILL TO</h5>
                <Form.Group className="mb-2 w-100">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Control
                      type="text"
                      value={formData.deliveryChallan.billToName}
                      onChange={(e) => handleChange("deliveryChallan", "billToName", e.target.value)}
                      placeholder="Attention Name / Department"
                      className="form-control-no-border"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", marginRight: '5px' }}
                    />
                  
                  </div>
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="text"
                    value={formData.deliveryChallan.billToAddress}
                    onChange={(e) => handleChange("deliveryChallan", "billToAddress", e.target.value)}
                    placeholder="Company Address"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="text"
                    value={formData.deliveryChallan.billToPhone}
                    onChange={(e) => handleChange("deliveryChallan", "billToPhone", e.target.value)}
                    placeholder="Phone"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="email"
                    value={formData.deliveryChallan.billToEmail}
                    onChange={(e) => handleChange("deliveryChallan", "billToEmail", e.target.value)}
                    placeholder="Email"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
                <h5>SHIP TO</h5>
                <div className="w-100 text-end" style={{ maxWidth: "400px" }}>
                  <Form.Group className="mb-2">
                    <Form.Label>ATN: Name / Dept</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.deliveryChallan.shipToName}
                      onChange={(e) => handleChange("deliveryChallan", "shipToName", e.target.value)}
                      placeholder="Attention Name / Department"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.deliveryChallan.shipToAddress}
                      onChange={(e) => handleChange("deliveryChallan", "shipToAddress", e.target.value)}
                      placeholder="Company Address"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.deliveryChallan.shipToPhone}
                      onChange={(e) => handleChange("deliveryChallan", "shipToPhone", e.target.value)}
                      placeholder="Phone"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="email"
                      value={formData.deliveryChallan.shipToEmail}
                      onChange={(e) => handleChange("deliveryChallan", "shipToEmail", e.target.value)}
                      placeholder="Email"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Driver Details */}
            <Row className="mb-4">
              <Col md={6}>
                <h5>Driver Details</h5>
                <Form.Group className="mb-2">
                  <Form.Label>Driver Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.deliveryChallan.driverName}
                    onChange={(e) => handleChange("deliveryChallan", "driverName", e.target.value)}
                    placeholder="Driver Name"
                    style={{ border: "1px solid #343a40" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Driver Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.deliveryChallan.driverPhone}
                    onChange={(e) => handleChange("deliveryChallan", "driverPhone", e.target.value)}
                    placeholder="Driver Phone"
                    style={{ border: "1px solid #343a40" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {/* Items Table */}
            <div className="mt-4">{renderItemsTable('deliveryChallan')}</div>
            
            {/* Totals - Moved to left side */}
            <Row className="mb-4 mt-2">
              <Col md={4}>
                <Table bordered size="sm" className="dark-bordered-table">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Sub Total:</td>
                      <td>${calculateTotalAmount(formData.deliveryChallan.items).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Total:</td>
                      <td className="fw-bold">
                        ${calculateTotalAmount(formData.deliveryChallan.items).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            
            {/* Terms & Conditions */}
            <Form.Group className="mt-4">
              <Form.Label>Terms & Conditions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.deliveryChallan.terms}
                onChange={(e) => handleChange('deliveryChallan', 'terms', e.target.value)}
                style={{ border: "1px solid #343a40" }} 
              />
            </Form.Group>
            
            {/* Attachment Fields */}
            {renderAttachmentFields("deliveryChallan")}
            
            {/* Thank You Section */}
            <Row className="text-center mt-5 mb-4 pt-3 border-top">
              <Col>
                <p><strong>Thank you for your business!</strong></p>
                <p className="text-muted">www.yourcompany.com</p>
              </Col>
            </Row>
            
            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={handleSkip}>Skip</Button>
              <Button variant="warning" onClick={handleSaveDraft}>Save Draft</Button>
              <Button variant="primary" onClick={handleSaveNext}>Save & Next</Button>
              <Button variant="success" onClick={handleNext}>Next</Button>
            </div>
          </Form>
        </Tab>
        
        {/* ============= INVOICE TAB ============= */}
        <Tab eventKey="invoice" title="Invoice">
          <Form>
            {/* Header: Logo + Company Info + Title */}
            <Row className="mb-4 d-flex justify-content-between align-items-center">
              <Col md={3} className="d-flex align-items-center justify-content-center">
                <div
                  className="border rounded d-flex flex-column align-items-center justify-content-center"
                  style={{ height: "120px", width: "100%", borderStyle: "dashed", cursor: "pointer" }}
                  onClick={() => document.getElementById('logo-upload-invoice')?.click()}
                >
                  <FontAwesomeIcon icon={faUpload} size="2x" className="text-muted" />
                  <small>Upload Logo</small>
                  <input id="logo-upload-invoice" type="file" accept="image/*" hidden />
                </div>
              </Col>
              <Col md={3} className="d-flex flex-column align-items-end justify-content-center">
                <h2 className="text-success mb-0">INVOICE</h2>
                <hr
                  style={{
                    width: "80%",
                    borderColor: "#28a745",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                />
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            <Row className="mb-4 mt-3">
              <Col md={6}>
                <div className="d-flex flex-column gap-1">
                  <Form.Control
                    type="text"
                    value={formData.invoice.companyName}
                    onChange={(e) => handleChange("invoice", "companyName", e.target.value)}
                    placeholder="Your Company Name"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.invoice.companyAddress}
                    onChange={(e) => handleChange("invoice", "companyAddress", e.target.value)}
                    placeholder="Company Address, City, State, Pincode"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="email"
                    value={formData.invoice.companyEmail}
                    onChange={(e) => handleChange("invoice", "companyEmail", e.target.value)}
                    placeholder="Company Email"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.invoice.companyPhone}
                    onChange={(e) => handleChange("invoice", "companyPhone", e.target.value)}
                    placeholder="Phone No."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </div>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
  <div className="d-flex flex-column gap-2 text-end" style={{ maxWidth: "400px", width: "100%" }}>
    
    {/* Invoice Date */}
    <Form.Group>
      <Form.Label className="mb-0" style={{ fontSize: "0.9rem", color: "#6c757d" }}>
        Invoice Date
      </Form.Label>
      <Form.Control
        type="date"
        value={formData.invoice.invoiceDate}
        onChange={(e) => handleChange("invoice", "invoiceDate", e.target.value)}
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>

    {/* System Ref No */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Ref No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.invoice.referenceId}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Ref No (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual Ref No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.invoice.manualRefNo || ""}
          onChange={(e) => handleChange("invoice", "manualRefNo", e.target.value)}
          placeholder="e.g. INV-CUST-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

   {/* Invoice No (Auto or Manual) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap",
        flexShrink: 0,
        marginRight: "8px"
      }}
    >
      Invoice No.
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.invoice.invoiceNo}
      readOnly
      className="form-control-no-border text-end"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0",
        fontWeight: "500",
        backgroundColor: "#f8f9fa",
        color: "#495057",
        cursor: "not-allowed",
        textAlign: "right",
        flexGrow: 1
      }}
    />
  </div>
</Form.Group>

{/* Manual Invoice No (Optional) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0 flex-shrink-0 me-2"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap"
      }}
    >
      Manual Invoice No (Optional)
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.invoice.manualInvoiceNo || ""}
      onChange={(e) => handleChange("invoice", "manualInvoiceNo", e.target.value)}
      placeholder="e.g. INV-CUST-001"
      className="form-control-no-border text-end flex-grow-1"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0.375rem 0.75rem",
        textAlign: "right"
      }}
    />
  </div>
</Form.Group>
 {/* Challan No (Auto from DC) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap",
        flexShrink: 0,
        marginRight: "8px"
      }}
    >
      Challan No.
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.invoice.challanNo}
      readOnly
      className="form-control-no-border text-end"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0",
        fontWeight: "500",
        backgroundColor: "#f8f9fa",
        color: "#495057",
        cursor: "not-allowed",
        textAlign: "right",
        flexGrow: 1
      }}
    />
  </div>
</Form.Group>

{/* Manual Challan No (Optional) */}
<Form.Group className="mb-0">
  <div className="d-flex justify-content-between align-items-center">
    <Form.Label
      className="mb-0 flex-shrink-0 me-2"
      style={{
        fontSize: "0.9rem",
        color: "#6c757d",
        whiteSpace: "nowrap"
      }}
    >
      Manual Challan No (Optional)
    </Form.Label>
    <Form.Control
      type="text"
      value={formData.invoice.manualChallanNo || ""}
      onChange={(e) => handleChange("invoice", "manualChallanNo", e.target.value)}
      placeholder="e.g. DC-CUST-001"
      className="form-control-no-border text-end flex-grow-1"
      style={{
        fontSize: "1rem",
        lineHeight: "1.5",
        minHeight: "auto",
        padding: "0.375rem 0.75rem",
        textAlign: "right"
      }}
    />
  </div>
</Form.Group>
    {/* Due Date */}
    <Form.Group>
      <Form.Label className="mb-0" style={{ fontSize: "0.9rem", color: "#6c757d" }}>
        Due Date
      </Form.Label>
      <Form.Control
        type="date"
        value={formData.invoice.dueDate}
        onChange={(e) => handleChange("invoice", "dueDate", e.target.value)}
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>
  </div>
</Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Bill To & Customer Info */}
            <Row className="mb-4 d-flex justify-content-between">
              <Col md={6} className="d-flex flex-column align-items-start">
                <h5>BILL TO</h5>
                <Form.Group className="mb-2 w-100">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Control
                      type="text"
                      value={formData.invoice.customerName}
                      onChange={(e) => handleChange("invoice", "customerName", e.target.value)}
                      placeholder="Customer Name"
                      className="form-control-no-border"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", marginRight: '5px' }}
                    />
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => navigate('/Company/CustomersDebtors')}
                      title="Add Customer"
                    >
                      Add Customer
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.invoice.customerAddress}
                    onChange={(e) => handleChange("invoice", "customerAddress", e.target.value)}
                    placeholder="Customer Address"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="email"
                    value={formData.invoice.customerEmail}
                    onChange={(e) => handleChange("invoice", "customerEmail", e.target.value)}
                    placeholder="Email"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="text"
                    value={formData.invoice.customerPhone}
                    onChange={(e) => handleChange("invoice", "customerPhone", e.target.value)}
                    placeholder="Phone"
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
                <h5>SHIP TO</h5>
                <div className="w-100 text-end" style={{ maxWidth: "400px" }}>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.invoice.shipToName || ""}
                      onChange={(e) => handleChange("invoice", "shipToName", e.target.value)}
                      placeholder="Name"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.invoice.shipToAddress || ""}
                      onChange={(e) => handleChange("invoice", "shipToAddress", e.target.value)}
                      placeholder="Address"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="email"
                      value={formData.invoice.shipToEmail || ""}
                      onChange={(e) => handleChange("invoice", "shipToEmail", e.target.value)}
                      placeholder="Email"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      value={formData.invoice.shipToPhone || ""}
                      onChange={(e) => handleChange("invoice", "shipToPhone", e.target.value)}
                      placeholder="Phone"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            {/* Items Table */}
            <div className="mt-4">{renderItemsTable('invoice')}</div>
            
            {/* Totals - Moved to left side */}
            <Row className="mb-4 mt-2">
              <Col md={4}>
                <Table bordered size="sm" className="dark-bordered-table">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Sub Total:</td>
                      <td>${calculateTotalAmount(formData.invoice.items).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Total Due:</td>
                      <td className="fw-bold">${calculateTotalAmount(formData.invoice.items).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            
            {/* Terms & Conditions */}
            <Form.Group className="mt-4">
              <Form.Label>Terms & Conditions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.invoice.terms}
                onChange={(e) => handleChange("invoice", "terms", e.target.value)}
                placeholder="e.g. Payment within 15 days. Late fees may apply."
                style={{ border: "1px solid #343a40" }} 
              />
            </Form.Group>
            
            {/* Attachment Fields */}
            {renderAttachmentFields("invoice")}
            
            {/* Footer Note */}
            <Row className="text-center mt-5 mb-4 pt-3">
              <Col>
                <Form.Control
                  type="text"
                  value={formData.invoice.footerNote}
                  onChange={(e) => handleChange("invoice", "footerNote", e.target.value)}
                  className="text-center mb-2 fw-bold"
                  placeholder=" Thank you for your business!"
                />
              </Col>
            </Row>
            
            {/* Navigation */}
            <div className="d-flex justify-content-between mt-4 border-top pt-3">
              <Button variant="secondary" onClick={handleSkip}>Skip</Button>
              <Button variant="warning" onClick={handleSaveDraft}>Save Draft</Button>
              <Button variant="primary" onClick={handleSaveNext}>Save & Next</Button>
              <Button variant="success" onClick={handleNext}>Next</Button>
            </div>
          </Form>
        </Tab>
        
        <Tab eventKey="payment" title="Payment">
          <Form>
            {/* Header: Logo + Title */}
            <Row className="mb-4 d-flex justify-content-between align-items-center">
              <Col md={3} className="d-flex align-items-center justify-content-center">
                <div
                  className="border rounded d-flex flex-column align-items-center justify-content-center"
                  style={{ height: "120px", width: "100%", borderStyle: "dashed", cursor: "pointer" }}
                  onClick={() => document.getElementById('logo-upload-payment')?.click()}
                >
                  <FontAwesomeIcon icon={faUpload} size="2x" className="text-muted" />
                  <small>Upload Logo</small>
                  <input id="logo-upload-payment" type="file" accept="image/*" hidden />
                </div>
              </Col>
              <Col md={3} className="d-flex flex-column align-items-end justify-content-center">
                <h2 className="text-success mb-0">PAYMENT RECEIPT</h2>
                <hr
                  style={{
                    width: "80%",
                    borderColor: "#28a745",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                />
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            <Row className="mb-4 mt-3">
              <Col md={6}>
                <div className="d-flex flex-column gap-1">
                  <Form.Control
                    type="text"
                    value={formData.payment.companyName}
                    onChange={(e) => handleChange("payment", "companyName", e.target.value)}
                    placeholder=" Enter Your Company Name. . . . ."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.payment.companyAddress}
                    onChange={(e) => handleChange("payment", "companyAddress", e.target.value)}
                    placeholder="Company Address, City, State, Pincode  . . . "
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="email"
                    value={formData.payment.companyEmail}
                    onChange={(e) => handleChange("payment", "companyEmail", e.target.value)}
                    placeholder="Company Email. . . ."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                  <Form.Control
                    type="text"
                    value={formData.payment.companyPhone}
                    onChange={(e) => handleChange("payment", "companyPhone", e.target.value)}
                    placeholder="Phone No....."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </div>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
  <div className="d-flex flex-column gap-2 text-end" style={{ maxWidth: "400px", width: "100%" }}>
    
    {/* Payment Date */}
    <Form.Group>
      <Form.Control
        type="date"
        value={formData.payment.paymentDate}
        onChange={(e) => handleChange("payment", "paymentDate", e.target.value)}
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>

    {/* System Reference No (Auto) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Ref No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.payment.referenceId}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Ref No (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual Ref No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.payment.manualRefNo || ""}
          onChange={(e) => handleChange("payment", "manualRefNo", e.target.value)}
          placeholder="e.g. PAY-REF-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Payment No (Auto) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Payment No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.payment.paymentNo}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Payment No (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual Payment No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.payment.manualPaymentNo || ""}
          onChange={(e) => handleChange("payment", "manualPaymentNo", e.target.value)}
          placeholder="e.g. PAY-CUST-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Invoice No (Auto) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "8px"
          }}
        >
          Invoice No.
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.payment.invoiceNo}
          readOnly
          className="form-control-no-border text-end"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0",
            fontWeight: "500",
            backgroundColor: "#f8f9fa",
            color: "#495057",
            cursor: "not-allowed",
            textAlign: "right",
            flexGrow: 1
          }}
        />
      </div>
    </Form.Group>

    {/* Manual Invoice No (Optional) */}
    <Form.Group className="mb-0">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label
          className="mb-0 flex-shrink-0 me-2"
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
            whiteSpace: "nowrap"
          }}
        >
          Manual Invoice No (Optional)
        </Form.Label>
        <Form.Control
          type="text"
          value={formData.payment.manualInvoiceRef || ""}
          onChange={(e) => handleChange("payment", "manualInvoiceRef", e.target.value)}
          placeholder="e.g. INV-CUST-001"
          className="form-control-no-border text-end flex-grow-1"
          style={{
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "auto",
            padding: "0.375rem 0.75rem",
            textAlign: "right"
          }}
        />
      </div>
    </Form.Group>

    {/* Payment Method */}
    <Form.Group>
      <Form.Control
        type="text"
        value={formData.payment.paymentMethod}
        onChange={(e) => handleChange("payment", "paymentMethod", e.target.value)}
        placeholder="Payment Method"
        className="form-control-no-border text-end"
        style={{
          fontSize: "1rem",
          lineHeight: "1.5",
          minHeight: "auto",
          padding: "0",
          textAlign: "right"
        }}
      />
    </Form.Group>
  </div>
</Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            <Row className="mb-4 d-flex justify-content-between">
              <Col md={6} className="d-flex flex-column align-items-start">
                <h5>RECEIVED FROM</h5>
                <Form.Control
  type="text"
  value={formData.payment.customerName || ""}
  onChange={(e) => handleChange("payment", "customerName", e.target.value)}
  placeholder="Enter Customer Name. . . . . ."
  className="form-control-no-border"
  style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
/>
                <Form.Group className="mb-1 w-100">
                  <Form.Control
                    rows={2}
                    value={formData.payment.customerAddress || ""}
                    onChange={(e) => handleChange("payment", "customerAddress", e.target.value)}
                    placeholder="Customer Address. . . .  ."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="email"
                    value={formData.payment.customerEmail || ""}
                    onChange={(e) => handleChange("payment", "customerEmail", e.target.value)}
                    placeholder="Email. . . . . "
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
                <Form.Group className="mb-2 w-100">
                  <Form.Control
                    type="text"
                    value={formData.payment.customerPhone || ""}
                    onChange={(e) => handleChange("payment", "customerPhone", e.target.value)}
                    placeholder="Phone. . . . . . ."
                    className="form-control-no-border"
                    style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-end">
                <h5>PAYMENT DETAILS</h5>
                <div className="w-100 text-end" style={{ maxWidth: "400px" }}>
                  <Form.Group className="mb-2">
                    <Form.Label>Amount Received</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={formData.payment.amount}
                      onChange={(e) => handleChange("payment", "amount", e.target.value)}
                      placeholder="Amount"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={(
                        parseFloat(formData.payment.totalAmount) ||
                        calculateTotalAmount(formData.invoice.items)
                      ).toFixed(2)}
                      readOnly
                      className="form-control-no-border text-end"
                      style={{ textAlign: "right" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.payment.paymentStatus}
                      onChange={(e) => handleChange("payment", "paymentStatus", e.target.value)}
                      placeholder="Payment Status"
                      className="form-control-no-border text-end"
                      style={{ fontSize: "1rem", lineHeight: "1.5", minHeight: "auto", padding: "0", textAlign: "right" }}
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>
            
            <hr
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#28a745",
                border: "none",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            />
            
            <Row className="mb-4 mt-2">
              <Col md={4}>
                <Table bordered size="sm" className="dark-bordered-table">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Total Invoice:</td>
                      <td>
                        ${(
                          parseFloat(formData.payment.totalAmount) ||
                          calculateTotalAmount(formData.invoice.items)
                        ).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="fw-bold">
                      <td>Amount Received:</td>
                      <td>${(parseFloat(formData.payment.amount) || 0).toFixed(2)}</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <td className="fw-bold">Balance:</td>
                      <td className="fw-bold text-danger">
                        ${(
                          (parseFloat(formData.payment.totalAmount) ||
                            calculateTotalAmount(formData.invoice.items)) -
                          (parseFloat(formData.payment.amount) || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            
            <Form.Group className="mt-4">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.payment.note}
                onChange={(e) => handleChange("payment", "note", e.target.value)}
                placeholder="e.g. Payment received via UPI / Cash"
                style={{ border: "1px solid #343a40" }} 
              />
            </Form.Group>
            
            {/* Attachment Fields */}
            {renderAttachmentFields("payment")}
            
            <Row className="text-center mt-5 mb-4 pt-3 border-top">
              <Col>
                <Form.Control
                  type="text"
                  value={formData.payment.footerNote}
                  onChange={(e) => handleChange("payment", "footerNote", e.target.value)}
                  className="text-center mb-2 fw-bold"
                  placeholder="Thank you for your payment!"
                />
              </Col>
            </Row>
            
            <div className="d-flex justify-content-between mt-4 border-top pt-3">
              <Button variant="secondary" onClick={handleSkip}>Skip</Button>
              <Button variant="warning" onClick={handleSaveDraft}>Save Draft</Button>
              <Button variant="primary" onClick={handleFinalSubmit}>Submit</Button>
            </div>
          </Form>
        </Tab>



      </Tabs>
      
      {/* Hidden PDF View - Only for PDF generation and printing */}
      <div style={{
        visibility: 'hidden',
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '210mm',
        padding: '15mm',
        boxSizing: 'border-box',
      }}>
        <div id="pdf-view" ref={pdfRef}>
          {renderPDFView()}
        </div>
      </div>
    </div>
    </>
  );
};

export default MultiStepSalesForm;