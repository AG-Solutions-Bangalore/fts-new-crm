import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisableRightClick from "./components/disableRightClick/DisableRightClick";
import SessionTimeoutTracker from "./components/sessionTimeout/SessionTimeoutTracker";
import BASE_URL from "./base/BaseUrl";
import axios from "axios";

import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ForgetPassword from "./pages/auth/ForgetPassword";
import LoadingBar from './components/loadingBar/LoadingBar';
import ReceiptSuperView from './pages/RecepitSuper/ReceiptSuperView';
import ScrollToTop from './components/ScrollToTop';






// import Profile from "./pages/profile/Profile";
// import ChangePassword from "./pages/profile/ChangePassword";
// import DonorList from "./pages/donor/fullList/DonorList";
// import AddIndivisual from "./pages/donor/fullList/AddIndivisual";
// import DowloadRecpit from "./pages/download/DownloadReceipts/DownloadReceipts";
// import Donor from "./pages/download/Donor/Donor";
// import DownloadSchool from "./pages/download/School/DownloadSchool";
// import Downloadots from "./pages/download/DownloadPurchase/DownloadPurchase";
// import DowloadAllRecepit from "./pages/download/DownloadAllRecepit/DownloadAllRecepit";
// import DownloadTeam from "./pages/download/DownloadTeam/DownloadTeam";
// import DonorSummary from "./pages/Reports/DonorSummary/DonorSummary";
// import DonorSummaryView from "./pages/Reports/DonorSummary/DonorView";
// import DonorGroupView from "./pages/Reports/DonorSummary/DonorGroupView";
// import PromterSummary from "./pages/Reports/PromoterSummary/PromoterSummary";
// import PromoterSummaryView from "./pages/Reports/PromoterSummary/PromoterSummaryView";
// import RecepitSummary from "./pages/Reports/RecepitSummary/RecepitSummary";
// import RecepitSummaryView from "./pages/Reports/RecepitSummary/RecepitSummaryView";
// import DonationSummary from "./pages/Reports/DonationSummary/DonationSummary";
// import DonationSummaryView from "./pages/Reports/DonationSummary/DonationSummaryView";
// import SchoolSummary from "./pages/Reports/SchoolSummary.jsx/SchoolSummary";
// import SchoolSumaryView from "./pages/Reports/SchoolSummary.jsx/SchoolSumaryView";
// import RecepitDocument from "./pages/Reports/10DBDocument/RecepitDocument";
// import ReceiptAllView from "./pages/Reports/10DBDocument/10BDView/RecepitAllView";
// import NopanView from "./pages/Reports/10DBDocument/10BDView/NopanView";
// import GroupView from "./pages/Reports/10DBDocument/10BDView/GroupView";
// import FullList from "./pages/Students/FullList/FullList";
// import FullListView from "./pages/Students/FullList/FullListView";
// import SchoolToAllot from "./pages/Students/SchoolToAllot/SchoolToAllot";
// import DonorDetails from "./pages/Students/SchoolToAllot/DonorDetails";
// import DonorEdit from "./pages/donor/fullList/DonorEdit";
// import CreateReceipt from "./pages/donor/fullList/CreateReceipt";
// import ViewerList from "./pages/donor/viewer/ViewerList";
// import EditViewer from "./pages/donor/viewer/EditViewer";
// import MemberList from "./pages/donor/member/MemberList";
// import DuplicateList from "./pages/donor/duplicate/DuplicateList";
// import ChaptersList from "./pages/master/chapters/ChaptersList";
// import EditChapter from "./pages/master/chapters/EditChapter";
// import EditDataSource from "./pages/master/chapters/EditDataSource";
// import StatesList from "./pages/master/states/StatesList";
// import ReceiptList from "./pages/receipts/ReceiptList";
// import ReceiptEdit from "./pages/receipts/ReceiptEdit";
// import ReceiptViewIndex from "./pages/receipts/receiptView/ReceiptViewIndex";
// import DesignationList from "./pages/master/designation/DesignationList";
// import ExpensiveTypeList from "./pages/master/expensivetype/ExpensiveTypeList";
// import FAQList from "./pages/master/FAQ/FAQList";
// import ViewChapter from "./pages/master/chapters/ViewChapter";
// import AddSchool from "./pages/master/chapters/AddSchool";
// import Chapter from "./pages/Chapter/Chapter";
// import AddSchoolAdmin from "./pages/Chapter/AddSchoolAdmin";
// import DataSource from "./pages/DataSource/DataSource";
// import Faq from "./pages/others/Faq";
// import Team from "./pages/others/team/Team";
// import Notification from "./pages/others/notification/Notification";
// import ManualGuideBook from "./pages/ManualGuideBook/ManualGuideBook";
// import SchoolAllot from "./pages/Students/SchoolAllot/SchoolAllot";
// import SchoolAllotEdit from "./pages/Students/SchoolAllot/SchoolAllotEdit";
// import DuplicateEdit from "./pages/donor/duplicate/DuplicateEdit";
// import SchoolAllotView from "./pages/Students/SchoolAllot/SchoolAllotView";
// import SchoolAllotLetter from "./pages/Students/SchoolAllot/SchoolAllotLetter";
// import RepeatDonors from "./pages/Students/RepeatDonors/RepeatDonors";
// import AllotedList from "./pages/Students/RepeatDonors/AllotedList";
// import RecepitSuper from "./pages/RecepitSuper/RecepitSuper";
// import ReceiptOldList from "./pages/receipts/ReceiptOldList";
// import ReceiptOldViewIndex from "./pages/receipts/receiptOldView/ReceiptOldViewIndex";
// import ReceiptOldEdit from "./pages/receipts/ReceiptOldEdit";
// import SuspenseSummary from "./pages/Reports/SuspenseSummary/SuspenseSummary";
// import SuspenseList from "./pages/receipts/suspense/SuspenseList";
// import ChangePromoter from "./pages/donor/changePromoter/ChangePromoter";
// import SuperReceiptDonor from "./pages/superReceiptDonor/SuperReceiptDonor";
// import MemberDashboard from './pages/donor/member/MemberDashboard';



// Lazy-loaded components
const DonorList = lazy(() => import("./pages/donor/fullList/DonorList"));
const AddIndivisual = lazy(() => import("./pages/donor/fullList/AddIndivisual"));
const DowloadRecpit = lazy(() => import("./pages/download/DownloadReceipts/DownloadReceipts"));
const Donor = lazy(() => import("./pages/download/Donor/Donor"));
const DownloadSchool = lazy(() => import("./pages/download/School/DownloadSchool"));
const Downloadots = lazy(() => import("./pages/download/DownloadPurchase/DownloadPurchase"));
const DowloadAllRecepit = lazy(() => import("./pages/download/DownloadAllRecepit/DownloadAllRecepit"));
const DownloadTeam = lazy(() => import("./pages/download/DownloadTeam/DownloadTeam"));
const DonorSummary = lazy(() => import("./pages/Reports/DonorSummary/DonorSummary"));
const DonorSummaryView = lazy(() => import("./pages/Reports/DonorSummary/DonorView"));
const DonorGroupView = lazy(() => import("./pages/Reports/DonorSummary/DonorGroupView"));
const PromterSummary = lazy(() => import("./pages/Reports/PromoterSummary/PromoterSummary"));
const PromoterSummaryView = lazy(() => import("./pages/Reports/PromoterSummary/PromoterSummaryView"));
const RecepitSummary = lazy(() => import("./pages/Reports/RecepitSummary/RecepitSummary"));
const RecepitSummaryView = lazy(() => import("./pages/Reports/RecepitSummary/RecepitSummaryView"));
const DonationSummary = lazy(() => import("./pages/Reports/DonationSummary/DonationSummary"));
const DonationSummaryView = lazy(() => import("./pages/Reports/DonationSummary/DonationSummaryView"));
const SchoolSummary = lazy(() => import("./pages/Reports/SchoolSummary.jsx/SchoolSummary"));
const SchoolSumaryView = lazy(() => import("./pages/Reports/SchoolSummary.jsx/SchoolSumaryView"));
const RecepitDocument = lazy(() => import("./pages/Reports/10DBDocument/RecepitDocument"));
const ReceiptAllView = lazy(() => import("./pages/Reports/10DBDocument/10BDView/RecepitAllView"));
const NopanView = lazy(() => import("./pages/Reports/10DBDocument/10BDView/NopanView"));
const GroupView = lazy(() => import("./pages/Reports/10DBDocument/10BDView/GroupView"));
const FullList = lazy(() => import("./pages/Students/FullList/FullList"));
const FullListView = lazy(() => import("./pages/Students/FullList/FullListView"));
const SchoolToAllot = lazy(() => import("./pages/Students/SchoolToAllot/SchoolToAllot"));
const DonorDetails = lazy(() => import("./pages/Students/SchoolToAllot/DonorDetails"));
const DonorEdit = lazy(() => import("./pages/donor/fullList/DonorEdit"));
const CreateReceipt = lazy(() => import("./pages/donor/fullList/CreateReceipt"));
const ViewerList = lazy(() => import("./pages/donor/viewer/ViewerList"));
const EditViewer = lazy(() => import("./pages/donor/viewer/EditViewer"));
const MemberList = lazy(() => import("./pages/donor/member/MemberList"));
const MemberDashboard = lazy(() => import("./pages/donor/member/MemberDashboard"));
const DuplicateList = lazy(() => import("./pages/donor/duplicate/DuplicateList"));
const ChaptersList = lazy(() => import("./pages/master/chapters/ChaptersList"));
const EditChapter = lazy(() => import("./pages/master/chapters/EditChapter"));
const EditDataSource = lazy(() => import("./pages/master/chapters/EditDataSource"));
const StatesList = lazy(() => import("./pages/master/states/StatesList"));
const ReceiptList = lazy(() => import("./pages/receipts/ReceiptList"));
const ReceiptEdit = lazy(() => import("./pages/receipts/ReceiptEdit"));
const ReceiptViewIndex = lazy(() => import("./pages/receipts/receiptView/ReceiptViewIndex"));
const DesignationList = lazy(() => import("./pages/master/designation/DesignationList"));
const ExpensiveTypeList = lazy(() => import("./pages/master/expensivetype/ExpensiveTypeList"));
const FAQList = lazy(() => import("./pages/master/FAQ/FAQList"));
const ViewChapter = lazy(() => import("./pages/master/chapters/ViewChapter"));
const AddSchool = lazy(() => import("./pages/master/chapters/AddSchool"));
const Chapter = lazy(() => import("./pages/Chapter/Chapter"));
const AddSchoolAdmin = lazy(() => import("./pages/Chapter/AddSchoolAdmin"));
const DataSource = lazy(() => import("./pages/DataSource/DataSource"));
const Faq = lazy(() => import("./pages/others/Faq"));
const Team = lazy(() => import("./pages/others/team/Team"));
const Notification = lazy(() => import("./pages/others/notification/Notification"));
const ManualGuideBook = lazy(() => import("./pages/ManualGuideBook/ManualGuideBook"));
const SchoolAllot = lazy(() => import("./pages/Students/SchoolAllot/SchoolAllot"));
const SchoolAllotEdit = lazy(() => import("./pages/Students/SchoolAllot/SchoolAllotEdit"));
const DuplicateEdit = lazy(() => import("./pages/donor/duplicate/DuplicateEdit"));
const SchoolAllotView = lazy(() => import("./pages/Students/SchoolAllot/SchoolAllotView"));
const SchoolAllotLetter = lazy(() => import("./pages/Students/SchoolAllot/SchoolAllotLetter"));
const RepeatDonors = lazy(() => import("./pages/Students/RepeatDonors/RepeatDonors"));
const AllotedList = lazy(() => import("./pages/Students/RepeatDonors/AllotedList"));
const RecepitSuper = lazy(() => import("./pages/RecepitSuper/RecepitSuper"));
const ReceiptOldList = lazy(() => import("./pages/receipts/ReceiptOldList"));
const ReceiptOldViewIndex = lazy(() => import("./pages/receipts/receiptOldView/ReceiptOldViewIndex"));
const ReceiptOldEdit = lazy(() => import("./pages/receipts/ReceiptOldEdit"));
const SuspenseSummary = lazy(() => import("./pages/Reports/SuspenseSummary/SuspenseSummary"));
const SuspenseList = lazy(() => import("./pages/receipts/suspense/SuspenseList"));
const ChangePromoter = lazy(() => import("./pages/donor/changePromoter/ChangePromoter"));
const SuperReceiptDonor = lazy(() => import("./pages/superReceiptDonor/SuperReceiptDonor"));

const MultiReceiptDownload = lazy(() => import("./pages/RecepitSuper/MultiReceiptDownload"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const ChangePassword = lazy(() => import("./pages/profile/ChangePassword"));

const App = () => {
  const navigate = useNavigate();
  const time = localStorage.getItem("token-expire-time");
 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <ToastContainer />
      {/* <DisableRightClick/>     */}
      <SessionTimeoutTracker expiryTime={time} onLogout={handleLogout} />
      <Suspense fallback={<LoadingBar />}>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maintenance" element={<Maintenance />} />
      


       
      
        {/* //superRecepit */}
        <Route path="/recepit-sup" element={<RecepitSuper />} />
        <Route path="/change-receipt-donor" element={<SuperReceiptDonor />} />
        <Route path="/multi-receipt-download" element={<MultiReceiptDownload />} />

        {/* donor  */}
        <Route path="/donor-list" element={<DonorList />} />
        <Route path="/add-indivisual" element={<AddIndivisual />} />
        <Route path="/donor-edit/:id" element={<DonorEdit />} />
        <Route path="/create-receipts/:id" element={<CreateReceipt />} />
        <Route path="/viewer-list" element={<ViewerList />} />
        <Route path="/edit-viewer/:id" element={<EditViewer />} />
        <Route path="/member-dashbord" element={<MemberDashboard />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/duplicate-list" element={<DuplicateList />} />
        <Route path="/duplicate-edit/:id" element={<DuplicateEdit />} />
        <Route path="/donor-create/:id" element={<CreateReceipt />} />
        <Route path="/change-promoter" element={<ChangePromoter />} />

        {/* receipt  */}
        <Route path="/receipt-list" element={<ReceiptList />} />
        <Route path="/suspense-list" element={<SuspenseList />} />
        <Route path="/receipt-old-list" element={<ReceiptOldList />} />
        <Route path="/receipt-edit/:id" element={<ReceiptEdit />} />


        <Route path="/receipt-old-edit/:id" element={<ReceiptOldEdit />} />

        <Route path="/view-receipts/:id" element={<ReceiptViewIndex />} />

        <Route path="/view-old-receipts/:id" element={<ReceiptOldViewIndex />} />

        {/* /supper receipt view  */}

        <Route path="/view-receipts-super/:id" element={<ReceiptSuperView />} />


        {/* // end  */}
        {/* school  */}
        <Route path="/profile" element={<Profile />} />
        {/* //Master */}
        <Route path="/master/chapters" element={<ChaptersList />} />
        <Route path="/view-chapter/:id" element={<ViewChapter />} />
        <Route path="/view-school/:id" element={<AddSchool />} />
        <Route path="/edit-chapter/:id" element={<EditChapter />} />
        <Route path="/edit-datasource/:id" element={<EditDataSource />} />
        <Route path="/master/states" element={<StatesList />} />
        <Route path="/master/designation" element={<DesignationList />} />
        <Route path="/master/expensive-type" element={<ExpensiveTypeList />} />
        <Route path="/master/faqList" element={<FAQList />} />
        {/* //chapter */}
        <Route path="/chapter" element={<Chapter />} />
        <Route path="/chapter/view-shool/:id" element={<AddSchoolAdmin />} />
        {/* //manualguide book */}
        <Route path="/manualguide-book" element={<ManualGuideBook />} />

        {/* //DataSource */}
        <Route path="/datasource" element={<DataSource />} />

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
          element={<ChangePassword />}
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
        <Route path="/report/suspense" element={<SuspenseSummary />} />


        {/* <Route path="/report/payment" element={<PaymentSummary />} />
        <Route path="/report/payment-view" element={<PaymentView />} /> */}



        <Route path="/recepit-group-view" element={<GroupView />} />
        {/* //SUDENTS */}
        <Route path="/students-full-list" element={<FullList />} />
        <Route path="/students-full-list-view/:id" element={<FullListView />} />
        <Route path="/students-to-allot" element={<SchoolToAllot />} />
        <Route path="/students-addschoolalot" element={<DonorDetails />} />

        <Route path="/students-schoolallot" element={<SchoolAllot />} />
        <Route path="/students-allotedit/:id" element={<SchoolAllotEdit />} />

        {/* others  */}
        <Route path="/faq" element={<Faq />} />
        <Route path="/team" element={<Team />} />
        <Route path="/notification" element={<Notification />} />

        {/* <Route path="/students-report-donor" element={<RepeatDonors />} /> */}

        <Route path="/students-schoolallot" element={<SchoolAllot />} />
        <Route path="/students-allotedit" element={<SchoolAllotEdit />} />
        <Route path="/students-allotview" element={<SchoolAllotView />} />
        <Route path="/students-allotletter" element={<SchoolAllotLetter />} />
        <Route path="/students-report-donor" element={<RepeatDonors />} />
        <Route path="/repeat-donor-allot/:id" element={<AllotedList />} />
      </Routes>
      </Suspense>   
    </>
  );
};

export default App;
