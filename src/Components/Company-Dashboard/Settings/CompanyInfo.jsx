import React, { useState } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';
import { FaBuilding, FaImage, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const CompanyInfo = () => {
  // Now we have three modes: 'en', 'ar', 'both'
  const [printLanguage, setPrintLanguage] = useState('en');

  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    phoneNumber: '',
    fax: '',
    website: false,
    companyImages: false,
    companyIcon: null,
    favicon: null,
    companyLogo: null,
    companyDarkLogo: null,
    addressInfo: false,
    address: '',
    country: '',
    city: '',
    state: '',
    portalCode: '',
    currency: '',
    uploadImages: [false, false, false]
  });

  const [previewImages, setPreviewImages] = useState({
    companyIcon: null,
    favicon: null,
    companyLogo: null,
    companyDarkLogo: null
  });

  // Translations
  const translations = {
    en: {
      settings: "Settings",
      manageSettings: "Manage your settings on portal.",
      companySettings: "Company Settings",
      companyInformation: "Company Information",
      companyName: "Company Name *",
      companyEmail: "Company Email Address *",
      phoneNumber: "Phone Number *",
      companyImages: "Company Images",
      companyIcon: "Company Icon",
      favicon: "Favicon",
      companyLogo: "Company Logo",
      companyDarkLogo: "Company Dark Logo",
      chooseFile: "Choose File",
      uploadInstruction: "Upload {field} of your company",
      addressInformation: "Address Information",
      address: "Address *",
      country: "Country *",
      city: "City *",
      state: "State *",
      portalCode: "Portal Code *",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      select: "Select",
      pageDescription: "This page allows you to manage company settings including general info, upload logos/icons, and configure address details like country, city, and postal code."
    },
    ar: {
      settings: "الإعدادات",
      manageSettings: "إدارة إعداداتك على البوابة.",
      companySettings: "إعدادات الشركة",
      companyInformation: "معلومات الشركة",
      companyName: "اسم الشركة *",
      companyEmail: "البريد الإلكتروني للشركة *",
      phoneNumber: "رقم الهاتف *",
      companyImages: "صور الشركة",
      companyIcon: "أيقونة الشركة",
      favicon: "favicon",
      companyLogo: "شعار الشركة",
      companyDarkLogo: "شعار الشركة الداكن",
      chooseFile: "اختر ملف",
      uploadInstruction: "تحميل {field} لشركتك",
      addressInformation: "معلومات العنوان",
      address: "العنوان *",
      country: "البلد *",
      city: "المدينة *",
      state: "الولاية *",
      portalCode: "الرمز البريدي *",
      cancel: "إلغاء",
      saveChanges: "حفظ التغييرات",
      select: "اختر",
      pageDescription: "تسمح لك هذه الصفحة بإدارة إعدادات الشركة بما في ذلك المعلومات العامة وتحميل الشعارات/الأيقونات وتكوين تفاصيل العنوان مثل البلد والمدينة والرمز البريدي."
    }
  };
  const currencyOptions = [
    { value: '', label: printLanguage === 'both' ? <><div>{translations.en.select}</div><div>{translations.ar.select}</div></> : translations[printLanguage].select },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' },
    { value: 'JPY', label: 'JPY - Japanese Yen' }
  ];
  // Helper to get translation based on printLanguage
  const t = (key) => {
    if (printLanguage === 'both') {
      return (
        <>
          <div>{translations.en[key]}</div>
          <div>{translations.ar[key]}</div>
        </>
      );
    }
    return translations[printLanguage][key];
  };

  const countryOptions = [
    { value: '', label: printLanguage === 'both' ? <><div>{translations.en.select}</div><div>{translations.ar.select}</div></> : translations[printLanguage].select },
    { value: 'USA', label: 'USA' },
    { value: 'India', label: 'India' },
    { value: 'French', label: 'French' },
    { value: 'Australia', label: 'Australia' }
  ];

  const stateOptions = [
    { value: '', label: printLanguage === 'both' ? <><div>{translations.en.select}</div><div>{translations.ar.select}</div></> : translations[printLanguage].select },
    { value: 'Alaska', label: 'Alaska' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'Tasmania', label: 'Tasmania' }
  ];

  const cityOptions = [
    { value: '', label: printLanguage === 'both' ? <><div>{translations.en.select}</div><div>{translations.ar.select}</div></> : translations[printLanguage].select },
    { value: 'Anchorage', label: 'Anchorage' },
    { value: 'Tijuana', label: 'Tijuana' },
    { value: 'Hobart', label: 'Hobart' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImages(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadButtonStyle = {
    backgroundColor: '#002d4d',
    borderColor: '#002d4d',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const previewImageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    padding: '4px'
  };

  const langButtonStyle = (isActive) => ({
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid #002d4d',
    backgroundColor: isActive ? '#002d4d' : 'white',
    color: isActive ? 'white' : '#002d4d',
    marginRight: '8px',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '400'
  });

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        padding: '20px 0',
        direction: printLanguage === 'ar' ? 'rtl' : 'ltr',
        fontFamily: printLanguage === 'ar' ? '"Segoe UI", Tahoma, sans-serif' : 'system-ui'
      }}
    >
      <Container className="p-4" style={{ maxWidth: '100%' }}>
        {/* Language Toggle Buttons */}
        <div className="d-flex justify-content-end mb-3 flex-wrap gap-2">
          {/* English Button */}
          <Button
            style={langButtonStyle(printLanguage === 'en')}
            onClick={() => setPrintLanguage('en')}
            size="sm"
          >
            English
          </Button>

          {/* Arabic Button */}
          <Button
            style={langButtonStyle(printLanguage === 'ar')}
            onClick={() => setPrintLanguage('ar')}
            size="sm"
          >
            العربية
          </Button>

          {/* Both Button */}
          <Button
            style={langButtonStyle(printLanguage === 'both')}
            onClick={() => setPrintLanguage('both')}
            size="sm"
          >
            <div>English</div>
            <div>العربية</div>
          </Button>
        </div>

        {/* Page Title */}
        <h1 className="mb-3" style={{ fontSize: '24px', fontWeight: '600' }}>
          {t('settings')}
        </h1>
        <p className="mb-4 text-muted">{t('manageSettings')}</p>

        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="mb-4" style={{ fontSize: '20px', fontWeight: '600' }}>
            {t('companySettings')}
          </h2>

          {/* Company Information */}
          <Form.Group className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <FaBuilding className="me-2" style={{ color: '#002d4d' }} />
              <h5 style={{ marginBottom: 0 }}>{t('companyInformation')}</h5>
            </div>
            <Form.Control
              type="text"
              placeholder={t('companyName')}
              className="mb-3"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            <Form.Control
              type="email"
              placeholder={t('companyEmail')}
              className="mb-3"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
            />
            <Form.Control
              type="tel"
              placeholder={t('phoneNumber')}
              className="mb-3"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Form.Group>

          <hr className="my-4" />

          {/* Company Images */}
          <div className="d-flex align-items-center mb-3">
            <FaImage className="me-2" style={{ color: '#002d4d' }} />
            <h5 style={{ marginBottom: 0 }}>{t('companyImages')}</h5>
          </div>

          {["companyIcon", "favicon", "companyLogo", "companyDarkLogo"].map((field) => (
            <Form.Group className="mb-4" key={field}>
              <Form.Label className="fw-bold d-block mb-2">
                {t(field)}
              </Form.Label>
              <div className="d-flex align-items-center">
                <Button as="label" htmlFor={`${field}-upload`} style={uploadButtonStyle}>
                  {t('chooseFile')}
                  <Form.Control
                    type="file"
                    id={`${field}-upload`}
                    className="d-none"
                    name={field}
                    onChange={handleChange}
                    accept="image/*"
                  />
                </Button>
                {previewImages[field] && (
                  <Image
                    src={previewImages[field]}
                    alt={`${field} Preview`}
                    style={previewImageStyle}
                  />
                )}
              </div>
              <Form.Text className="text-muted">
                {typeof t('uploadInstruction') === 'object'
                  ? 'Upload your company logo/icon'
                  : t('uploadInstruction').replace('{field}', t(field).toString().toLowerCase())
                }
              </Form.Text>
            </Form.Group>
          ))}

          {/* Address Information */}
          <div className="d-flex align-items-center mb-3">
            <FaMapMarkerAlt className="me-2" style={{ color: '#002d4d' }} />
            <h5 style={{ marginBottom: 0 }}>{t('addressInformation')}</h5>
          </div>

          <Form.Group className="mb-4">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t('address')}
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Country and City */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <Form.Label className="fw-bold">{t('country')}</Form.Label>
              <Form.Select
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-6">
              <Form.Label className="fw-bold">{t('city')}</Form.Label>
              <Form.Select
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                {cityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          {/* State and Portal Code */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <Form.Label className="fw-bold">{t('state')}</Form.Label>
              <Form.Select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-6">
              <Form.Label className="fw-bold">{t('portalCode')}</Form.Label>
              <Form.Control
                type="text"
                name="portalCode"
                value={formData.portalCode}
                onChange={handleChange}
              />
            </div>
          </div>
{/* Currency */}
<div className="row mb-4">
  <div className="col-md-6">
    <Form.Label className="fw-bold">
      {printLanguage === 'both' ? (
        <>
          <div>Currency *</div>
          <div>العملة *</div>
        </>
      ) : printLanguage === 'ar' ? 'العملة *' : 'Currency *'}
    </Form.Label>
    <Form.Select
      name="currency"
      value={formData.currency}
      onChange={handleChange}
    >
      {currencyOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  </div>
</div>
          {/* Action Buttons */}
          <div className="d-flex justify-content-end mt-4">
            <Button variant="outline-secondary" className="me-3 px-4 py-2">
              {t('cancel')}
            </Button>
            <Button
              className="px-4 py-2"
              style={{
                borderRadius: '4px',
                backgroundColor: '#002d4d',
                borderColor: '#002d4d',
                border: 'none',
                color: '#fff'
              }}
            >
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      </Container>

      <p className="text-muted text-center mt-3">
        {typeof t('pageDescription') === 'object'
          ? 'Manage your company settings in both languages.'
          : t('pageDescription')}
      </p>
    </div>
  );
};

export default CompanyInfo;