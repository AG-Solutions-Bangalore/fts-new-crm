import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import DonorList from "./pages/donor/fullList/DonorList";
import AddIndivisual from "./pages/donor/fullList/AddIndivisual";
import PincodeChecker from "./pages/pincode/PincodeChecker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DowloadRecpit from "./pages/download/DownloadReceipts/DownloadReceipts";
import Donor from "./pages/download/Donor/Donor";
import DownloadSchool from "./pages/download/School/DownloadSchool";
import Downloadots from "./pages/download/DownloadPurchase/DownloadPurchase";
import DowloadAllRecepit from "./pages/download/DownloadAllRecepit/DownloadAllRecepit";
import DownloadTeam from "./pages/download/DownloadTeam/DownloadTeam";
import DonorSummary from "./pages/Reports/DonorSummary/DonorSummary";
import DonorSummaryView from "./pages/Reports/DonorSummary/DonorView";
import DonorGroupView from "./pages/Reports/DonorSummary/DonorGroupView";
import PromterSummary from "./pages/Reports/PromoterSummary/PromoterSummary";
import PromoterSummaryView from "./pages/Reports/PromoterSummary/PromoterSummaryView";
import RecepitSummary from "./pages/Reports/RecepitSummary/RecepitSummary";
import RecepitSummaryView from "./pages/Reports/RecepitSummary/RecepitSummaryView";
import DonationSummary from "./pages/Reports/DonationSummary/DonationSummary";
import DonationSummaryView from "./pages/Reports/DonationSummary/DonationSummaryView";
import SchoolSummary from "./pages/Reports/SchoolSummary.jsx/SchoolSummary";
import SchoolSumaryView from "./pages/Reports/SchoolSummary.jsx/SchoolSumaryView";
import RecepitDocument from "./pages/Reports/10DBDocument/RecepitDocument";
import ReceiptAllView from "./pages/Reports/10DBDocument/10BDView/RecepitAllView";
import NopanView from "./pages/Reports/10DBDocument/10BDView/NopanView";
import GroupView from "./pages/Reports/10DBDocument/10BDView/GroupView";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maintenance" element={<Maintenance />} />
        {/* donor  */}
        <Route path="/donor-list" element={<DonorList />} />
        <Route path="/add-indivisual" element={<AddIndivisual />} />
        <Route path="/pincode" element={<PincodeChecker />} />

        {/* school  */}
        <Route path="/profile" element={<Profile />} />

        {/* //DOWNLOAD */}

        <Route path="/download/receipts" element={<DowloadRecpit />} />
        <Route path="/download/donor" element={<Donor />} />
        <Route path="/download/school" element={<DownloadSchool />} />
        <Route path="/download/ots" element={<Downloadots />} />
        <Route path="/download/team" element={<DownloadTeam />} />
        <Route path="/download/allrecepit" element={<DowloadAllRecepit />} />

        {/* ///END DOWNLOAD */}
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />
        {/* Reports  */}
        <Route path="/report/donorsummary" element={<DonorSummary />} />
        <Route path="/report/donor-view" element={<DonorSummaryView />} />
        <Route path="/report/donorgroup-view" element={<DonorGroupView />} />
        <Route path="/report/promoter" element={<PromterSummary />} />
        <Route path="/report/promoter-view" element={<PromoterSummaryView />} />
        <Route path="/report/recepit" element={<RecepitSummary />} />
        <Route path="/recepit-summary-view" element={<RecepitSummaryView />} />
        <Route path="/report/donation" element={<DonationSummary />} />
        <Route path="/report-donation-view" element={<DonationSummaryView />} />
        <Route path="/report/school" element={<SchoolSummary />} />
        <Route path="/report/schoolview" element={<SchoolSumaryView />} />
        <Route path="/report/otg" element={<RecepitDocument />} />
        <Route path="/recepit-otg-view" element={<ReceiptAllView />} />
        <Route path="/recepit-nopan-view" element={<NopanView />} />
        <Route path="/recepit-group-view" element={<GroupView />} />
        {/*
        <Route path="/report/suspense" element={<SuspenseSummary />} />
        <Route path="/report/payment-view" element={<PaymentView />} />
       

     
 
        <Route path="/recepit-donation-view" element={<DonationSummarys />} />

        <Route path="/report/donation" element={<DonationSummary />} />
     
       
        <Route path="/report/payment" element={<PaymentSummary />} /> */}
        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
