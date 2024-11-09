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
import PincodeChecker from "./pages/pincode/PincodeChecker";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DonorEdit from "./pages/donor/fullList/DonorEdit";
import CreateReceipt from "./pages/donor/fullList/CreateReceipt";
import ViewerList from "./pages/donor/viewer/ViewerList";
import EditViewer from "./pages/donor/viewer/EditViewer";
import MemberList from "./pages/donor/member/MemberList";
import DuplicateList from "./pages/donor/duplicate/DuplicateList";
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
        <Route path="/donor-edit/:id" element={<DonorEdit />} />
        <Route path="/create-receipts/:id" element={<CreateReceipt />} />
        <Route path="/viewer-list" element={<ViewerList />} />
        <Route path="/edit-viewer/:id" element={<EditViewer />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/duplicate-list" element={<DuplicateList />} />
        

        {/* school  */}
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />

        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
