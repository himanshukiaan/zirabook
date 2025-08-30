import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import MainLayout from "./Layout/MainLayout";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";


import Dashboardd from "./Components/Dashboard/Dashboardd";
import Company from "./Components/Dashboard/Company";

import PlansPricing from "./Components/Dashboard/PlansPricing";
import RequestPlan from "./Components/Dashboard/RequestPlan";
import Payments from "./Components/Dashboard/Payments";

import CompanyDashbaord from "./Components/Company-Dashboard/CompanyDashbaord";



import Inventorys from "./Components/Company-Dashboard/Inventory/Inventorys";
import UnitofMeasure from "./Components/Company-Dashboard/Inventory/UnitofMeasure";



import Invoice from "./Components/Company-Dashboard/Sales/Invoice";



import SalesDelivery from "./Components/Company-Dashboard/Sales/SalesDelivery";
import SalesReturn from "./Components/Company-Dashboard/Sales/SalesReturn";





import GSTReturns from "./Components/Company-Dashboard/GST/GSTReturns";
import TdsTcs from "./Components/Company-Dashboard/GST/TdsTcs";
import ITCReport from "./Components/Company-Dashboard/GST/ITCReport";
import EWayBill from "./Components/Company-Dashboard/GST/EWayBill";


import PurchaseReturn from "./Components/Company-Dashboard/Purchases/PurchaseReturn";
import DayBook from "./Components/Company-Dashboard/Reports/DayBook";
import Expense from "./Components/Company-Dashboard/Reports/Expense";
import JournalEntries from "./Components/Company-Dashboard/Reports/JournalEntries";
import Ledger from "./Components/Company-Dashboard/Reports/Ledger";
import TrialBalance from "./Components/Company-Dashboard/Reports/TrialBalance";
import Posreport from "./Components/Company-Dashboard/Reports/Posreport";

import CreateVoucher from "./Components/Company-Dashboard/Inventory/CreateVoucher";
import Taxreport from "./Components/Company-Dashboard/Reports/Taxreports";
import InventorySummary from "./Components/Company-Dashboard/Reports/InventorySummary";
import VatReport from "./Components/Company-Dashboard/Reports/VatReport"
import BalanceSheet from "./Components/Company-Dashboard/Reports/BalanceSheet";
import CashFlow from "./Components/Company-Dashboard/Reports/CashFlow";
import ProfitLoss from "./Components/Company-Dashboard/Reports/ProfitLoss";
import Users from "./Components/Company-Dashboard/UserManagement/Users";
import RolesPermissions from "./Components/Company-Dashboard/UserManagement/RolesPermissions";
import DeleteAccountRequest from "./Components/Company-Dashboard/UserManagement/DeleteAccountRequest";
import CompanyInfo from "./Components/Company-Dashboard/Settings/CompanyInfo";






import Salesreport from "./Components/Company-Dashboard/Reports/Salesreport";











import WareHouse from "./Components/Company-Dashboard/Inventory/SiteData/WareHouse";


import BrandPage from "./Components/Company-Dashboard/Inventory/SiteData/BrandPage";

import Productt from "./Components/Company-Dashboard/Inventory/Productt";

import DevicePage from "./Components/Company-Dashboard/Inventory/SiteData/DevicePage";

import StockTransfer from "./Components/Company-Dashboard/Inventory/SiteData/StockTransfer";
import PointOfSale from "./Components/Company-Dashboard/Inventory/Pos/PointOfSale";
import InvoiceSummary from "./Components/Company-Dashboard/Inventory/Pos/InvoiceSummary";
import ManageInvoices from "./Components/Company-Dashboard/Inventory/Pos/ManageInvoice";
import ViewInvoice from "./Components/Company-Dashboard/Inventory/Pos/ViewInvoice";
import EditInvoice from "./Components/Company-Dashboard/Inventory/Pos/EditInvoice";
import Profile from "./Layout/ProfileModal";
import PurchaseOrderView from "./Components/Company-Dashboard/Purchases/PurchaseOrderView";
import ViewInvoicee from "./Components/Company-Dashboard/Sales/ViewInvoicee";

import Categories from "./Components/Company-Dashboard/Inventory/SiteData/Categories";



import AllAcounts from "./Components/Company-Dashboard/Accounts/AllAcounts";
import Ledgercustomer from "./Components/Company-Dashboard/Accounts/Ledgercustomer";
import Ledgervendor from "./Components/Company-Dashboard/Accounts/Ledgervendor";
import CustomersDebtors from "./Components/Company-Dashboard/Accounts/CustomersDebtors";
import VendorsCreditors from "./Components/Company-Dashboard/Accounts/VendorsCreditors";
import PurchaseVoucher from "./Components/Company-Dashboard/Inventory/PurchaseVoucher";
import Transaction from "./Components/Company-Dashboard/Accounts/Transaction";
import SalesVoucher from "./Components/Company-Dashboard/Inventory/SalesVoucher";
import PurchaseVoucherView from "./Components/Company-Dashboard/Inventory/PurchaseVoucherView";
import SalesVoucherView from "./Components/Company-Dashboard/Inventory/SalesVoucherView";
import AddProduct from "./Components/Company-Dashboard/Inventory/Product/AddProduct";
import SettingModal from "./Components/SettingModal";
import PaymentEntry from "./Components/Company-Dashboard/Accounts/PaymentEntry";
import ReceiptEntry from "./Components/Company-Dashboard/Accounts/ReceiptEntry";
import WareHouseDetail from "./Components/Company-Dashboard/Inventory/SiteData/WareHouseDetail";

import DeliveryChallans from "./Components/Company-Dashboard/Sales/DeliveryChallans";
import PurchaseOrderr from "./Components/Company-Dashboard/Purchases/PurchaseOrderr";
import MultiStepPurchaseForms from "./Components/Company-Dashboard/Purchases/MultiStepPurchaseForms";
import AddProductModal from "./Components/Company-Dashboard/Inventory/AddProductModal";
import AssetDetails from "./Components/Company-Dashboard/Reports/AssetDetails";
import Liabilitydetails from "./Components/Company-Dashboard/Reports/Liabilitydetails";
import MultiStepSalesForm from "./Components/Company-Dashboard/Sales/MultiStepSalesForm";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import Income from "./Components/Company-Dashboard/Reports/Income";
import WithoutHeader from "./Layout/WithoutHeader";
import Purchasereport from "./Components/Company-Dashboard/Reports/Purchasereport";
import AddCustomerModal from "./Components/Company-Dashboard/Accounts/AddCustomerModal";
import AddVendorModal from "./Components/Company-Dashboard/Accounts/AddVendorModal";
import LedgerPageAccount from "./Components/Company-Dashboard/Accounts/LedgerPageAccount";
import Service from "./Components/Company-Dashboard/Inventory/SiteData/Service";
import CustomerItemDetailsView from "./Components/Company-Dashboard/Accounts/CustomerItemDetailsView";
import CustomerTransactionDetails from "./Components/Company-Dashboard/Accounts/CustomerTransactionDetails";
import VendorTransactionDetails from "./Components/Company-Dashboard/Accounts/VendorTransactionDetails";
import VendorItemDetailsView from "./Components/Company-Dashboard/Accounts/VendorItemDetailsView";
import InventoryDetails from "./Components/Company-Dashboard/Inventory/InventoryDetails";
import InventoryAdjustment from "./Components/Company-Dashboard/Inventory/InventoryAdjustment";
import PurchaseQuotationPage from "./Components/Company-Dashboard/Purchases/PurchaseQuotationPage";
import PurchaseOrderPage from "./Components/Company-Dashboard/Purchases/PurchaseOrderPage";
import GoodsReceiptPage from "./Components/Company-Dashboard/Purchases/GoodsReceiptPage";
import BillPage from "./Components/Company-Dashboard/Purchases/BillPage";
import PaymentPage from "./Components/Company-Dashboard/Purchases/PaymentPage";
import ContraVoucher from "./Components/Company-Dashboard/Reports/ContraVoucher";
import PaymnetSupplier from "./Components/Company-Dashboard/Reports/PaymnetSupplier";
import ReceivedCustomer from "./Components/Company-Dashboard/Reports/ReceivedCustomer";






function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes without sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settingmodal" element={<SettingModal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        {/* <Route path="/withoutheader" element={<WithoutHeader/>} /> */}

        {/* Admin Dashboard routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboardd />} />
          <Route path="/superadmin/company" element={<Company />} />
          <Route path="/superadmin/planpricing" element={<PlansPricing />} />
          <Route path="/superadmin/requestplan" element={<RequestPlan />} />
          <Route path="/superadmin/payments" element={<Payments />} />

        </Route>

        {/* Company Dashboard routes with MainLayout */}
        <Route element={<MainLayout />}>
          {/* Admin Dashboard */}
          <Route path="/company/dashboard" element={<CompanyDashbaord />} />

          {/* Accounts */}
          <Route path="/company/allacounts" element={<AllAcounts />} />
          <Route path="/company/ledgerpageaccount" element={<LedgerPageAccount/>} />
          <Route path="/company/ledgercustomer" element={<Ledgercustomer />} />
          <Route path="/company/customer-item-details" element={<CustomerItemDetailsView/>} />
          <Route path="/company/customer-transaction-details" element={<CustomerTransactionDetails/>} />
   
          <Route path="/company/customersdebtors" element={<CustomersDebtors />} />
          <Route path="/company/ledgervendor" element={<Ledgervendor />} />
          <Route path="/company/vendor-transaction-details" element={<VendorTransactionDetails/>} />
          <Route path="/company/vendor-item-details" element={<VendorItemDetailsView/>} />
          <Route path="/company/addcustomersmodal" element={<AddCustomerModal/>} />
          <Route path="/company/vendorscreditors" element={<VendorsCreditors />} />
          
          <Route path="/company/addvendorsmodal" element={<AddVendorModal/>} />

          <Route path="/company/receiptentry" element={<ReceiptEntry />} />
          <Route path="/company/paymententry" element={<PaymentEntry />} />

          <Route path="/company/transaction" element={<Transaction />} />


          {/* Inventory */}
          <Route path="/company/warehouse" element={<WareHouse />} />
          <Route path="/company/warehouse/:id" element={<WareHouseDetail />} />
          <Route path="/company/unitofmeasure" element={<UnitofMeasure />} />
          <Route path="/company/service" element={<Service/>} />
          <Route path="/company/inventorys" element={<Inventorys />} />
          <Route path="/company/inventorydetails/:id" element={<InventoryDetails/>} />
          
          <Route path="/company/addproduct" element={<AddProductModal />} />
          <Route path="/company/createvoucher" element={<CreateVoucher />} />
          <Route path="/company/stocktranfer" element={<StockTransfer />} />
          <Route path="/company/inventory-adjustment" element={<InventoryAdjustment/>} />
          <Route path="/company/salesvoucher" element={<SalesVoucher />} />
          <Route path="/company/purchasevoucher" element={<PurchaseVoucher />} />
          <Route path="/company/purchasevoucherview" element={<PurchaseVoucherView />} />
          <Route path="/company/salesvoucherview" element={<SalesVoucherView />} />

          {/* POS */}
          <Route path="/company/categories" element={<Categories />} />
          <Route path="/company/brands" element={<BrandPage />} />
          <Route path="/company/product" element={<Productt />} />
          <Route path="/company/createproduct" element={<AddProduct />} />
          <Route path="/company/update-product/:id" element={<AddProduct />} />
          <Route path="/company/device" element={<DevicePage />} />

          <Route path="/company/ponitofsale" element={<PointOfSale />} />
          <Route path="/company/invoice-summary" element={<InvoiceSummary />} />


          {/* Sales */}


          <Route path="/company/manageinvoice" element={<ManageInvoices />} />
          <Route path="/company/editinvoice" element={<EditInvoice />} />
          <Route path="/company/viewinvoice" element={<ViewInvoice />} />
          <Route path="/company/deliverychallans" element={<DeliveryChallans />} />


          {/* Sales */}
          <Route path="/company/invoice" element={<Invoice/>} />
          <Route path="/company/multistepsalesform" element={<MultiStepSalesForm/>} />
             <Route path="/company/viewinvoicee" element={<ViewInvoicee />} />
          <Route path="/company/salesdelivery" element={<SalesDelivery />} />
 
          <Route path="/company/salesreturn" element={<SalesReturn />} />




          {/* GST Filing */}

          <Route path="/company/gstreturns" element={<GSTReturns />} />
          <Route path="/company/tdstcs" element={<TdsTcs />} />
          <Route path="/company/itcreport" element={<ITCReport />} />
          <Route path="/company/ewaybill" element={<EWayBill />} />

          {/* Purchases */}



          {/* <Route path="/company/bill" element={<Bill />} /> */}
   
          <Route path="/company/purchasorderr" element={<PurchaseOrderr />} />
          <Route path="/company/multiforms" element={<MultiStepPurchaseForms />} />
          <Route path="/company/purchasequotationpage" element={<PurchaseQuotationPage/>} />
          <Route path="/company/purchaseorderpage" element={<PurchaseOrderPage/>} />
          <Route path="/company/paymentpage" element={<PaymentPage/>} />
          <Route path="/company/goodreceiptpage" element={<GoodsReceiptPage/>} />
          <Route path="/company/billpage" element={<BillPage/>} />
          <Route path="/company/purchasereturn" element={<PurchaseReturn />} />
          <Route path="/company/purchaseview" element={<PurchaseOrderView />} />
          {/* Finance & Accounts */}
          <Route path="/company/daybook" element={<DayBook />} />

          <Route path="/company/expense" element={<Expense />} />
          
          <Route path="/company/income" element={<Income/>} />
          <Route path="/company/contravoucher" element={<ContraVoucher/>} />
          <Route path="/company/paymnetsupplier" element={<PaymnetSupplier/>} />
          <Route path="/company/receivedcustomer" element={<ReceivedCustomer/>} />
          <Route path="/company/journalentries" element={<JournalEntries />} />
          <Route path="/company/ledger" element={<Ledger />} />
          <Route path="/company/trialbalance" element={<TrialBalance />} />

          {/* Clients / Vendors */}


          {/* Reports */}

          <Route path="/company/salesreport" element={<Salesreport />} />
          <Route path="/company/purchasereport" element={<Purchasereport/>} />
          <Route path="/company/posreport" element={<Posreport />} />
          <Route path="/company/taxreport" element={<Taxreport />} />
          <Route path="/company/inventorysummary" element={<InventorySummary />} />
          <Route path="/company/balancesheet" element={<BalanceSheet />} />
          <Route path="/company/balancesheet/asstedetails" element={<AssetDetails />} />
          <Route path="/company/balancesheet/liabilitydetails" element={<Liabilitydetails />} />
          <Route path="/company/cashflow" element={<CashFlow />} />
          <Route path="/company/profitloss" element={<ProfitLoss />} />
          <Route path="/company/vatreport" element={<VatReport />} />

          {/* User Management */}
          <Route path="/company/users" element={<Users />} />
          <Route
            path="/company/rolespermissions"
            element={<RolesPermissions />}
          />
          <Route
            path="/company/deleteaccountrequests"
            element={<DeleteAccountRequest />}
          />

          {/* Settings */}
          <Route path="/company/companyinfo" element={<CompanyInfo />} />


        </Route>















      </Routes>
    </Router>
  );
}


export default App;