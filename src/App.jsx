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
import FullList from "./pages/Students/FullList/FullList";
import FullListView from "./pages/Students/FullList/FullListView";
import SchoolToAllot from "./pages/Students/SchoolToAllot/SchoolToAllot";
import DonorDetails from "./pages/Students/SchoolToAllot/DonorDetails";
import DonorEdit from "./pages/donor/fullList/DonorEdit";
import CreateReceipt from "./pages/donor/fullList/CreateReceipt";
import ViewerList from "./pages/donor/viewer/ViewerList";
import EditViewer from "./pages/donor/viewer/EditViewer";
import MemberList from "./pages/donor/member/MemberList";
import DuplicateList from "./pages/donor/duplicate/DuplicateList";
import ChaptersList from "./pages/master/chapters/ChaptersList";
import EditChapter from "./pages/master/chapters/EditChapter";
import EditDataSource from "./pages/master/chapters/EditDataSource";
import StatesList from "./pages/master/states/StatesList";
import ReceiptList from "./pages/receipts/ReceiptList";
import ReceiptEdit from "./pages/receipts/ReceiptEdit";
import ReceiptViewIndex from "./pages/receipts/receiptView/ReceiptViewIndex";
import DesignationList from "./pages/master/designation/DesignationList";
import ExpensiveTypeList from "./pages/master/expensivetype/ExpensiveTypeList";
import FAQList from "./pages/master/FAQ/FAQList";
import ViewChapter from "./pages/master/chapters/ViewChapter";
import AddSchool from "./pages/master/chapters/AddSchool";
import Chapter from "./pages/Chapter/Chapter";
import AddSchoolAdmin from "./pages/Chapter/AddSchoolAdmin";
import DataSource from "./pages/DataSource/DataSource";
import Faq from "./pages/others/Faq";
import Team from "./pages/others/team/Team";
import Notification from "./pages/others/notification/Notification";
import ManualGuideBook from "./pages/ManualGuideBook/ManualGuideBook";
import SchoolAllot from "./pages/Students/SchoolAllot/SchoolAllot";
import SchoolAllotEdit from "./pages/Students/SchoolAllot/SchoolAllotEdit";
import DuplicateEdit from "./pages/donor/duplicate/DuplicateEdit";
import SchoolAllotView from "./pages/Students/SchoolAllot/SchoolAllotView";
import SchoolAllotLetter from "./pages/Students/SchoolAllot/SchoolAllotLetter";
import RepeatDonors from "./pages/Students/RepeatDonors/RepeatDonors";
import AllotedList from "./pages/Students/RepeatDonors/AllotedList";
import RecepitSuper from "./pages/RecepitSuper/RecepitSuper";
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

        {/* //superRecepit */}
        <Route path="/recepit-sup" element={<RecepitSuper />} />

        {/* donor  */}
        <Route path="/donor-list" element={<DonorList />} />
        <Route path="/add-indivisual" element={<AddIndivisual />} />
        <Route path="/donor-edit/:id" element={<DonorEdit />} />
        <Route path="/create-receipts/:id" element={<CreateReceipt />} />
        <Route path="/viewer-list" element={<ViewerList />} />
        <Route path="/edit-viewer/:id" element={<EditViewer />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/duplicate-list" element={<DuplicateList />} />
        <Route path="/duplicate-edit/:id" element={<DuplicateEdit />} />
        {/* receipt  */}
        <Route path="/receipt-list" element={<ReceiptList />} />
        <Route path="/receipt-edit/:id" element={<ReceiptEdit />} />
        <Route path="/view-receipts/:id" element={<ReceiptViewIndex />} />
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
    </>
  );
};

export default App;
