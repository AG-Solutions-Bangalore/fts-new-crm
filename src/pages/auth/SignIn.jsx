import { Input, Button, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../../assets/receipt/sigin.jpg";
import Logo1 from "../../assets/logos/fts_logo1.jpeg";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp,fetchYearData } = useContext(ContextPanel);
  const navigate = useNavigate();
 
  const handleForgetPasswordClick = () => {
    navigate("/forget-password");
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/api/login`, formData);

      if (res.status === 200) {
        const token = res.data.UserInfo?.token;
        const ver_con = res.data?.version?.version_panel
        localStorage.setItem("token", token);
        localStorage.setItem("ver_con", ver_con);
        localStorage.setItem("id", res.data.UserInfo.user.user_type_id);
        localStorage.setItem("name", res.data.UserInfo.user.first_name);
        localStorage.setItem("username", res.data.UserInfo.user.name);
        localStorage.setItem("chapter_id", res.data.UserInfo.user.chapter_id);
        localStorage.setItem("viewer_chapter_ids", res.data.UserInfo.user.viewer_chapter_ids);
        localStorage.setItem(
          "user_type_id",
          res.data.UserInfo.user.user_type_id
        );
        localStorage.setItem("token-expire-time", res.data.UserInfo?.token_expires_at);
        if (token) {
          await fetchYearData()
       
          navigate("/home");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };

  const inputClass = "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <div className="min-h-screen bg-blue-400 flex items-center justify-center">
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl overflow-hidden m-4">
          <div className="flex flex-col lg:flex-row max-h-[582px]">
            {/* Left Side - Image */}
            <div className="lg:w-1/2 hidden lg:block">
              <img
                src={Logo}
                alt="Login"
                className="object-cover h-full w-full"
              />
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 p-4 sm:px-0 md:px-16 flex flex-col mt-8 max-h-[682px]">
              <div className="flex items-center justify-center mb-8">
                <img src={Logo1} alt="Company Logo" className="h-32" />
              </div>
              
          
              {isPanelUp.error == "Maintenance" && (

<div className="text-center py-8">
                   <Typography
                     variant="h4"
                     className="font-bold mb-4 text-blue-gray-800"
                   >
                     We'll Be Back Soon!
                   </Typography>
                   <Typography className="text-gray-600 mb-6">
                     Our website is currently undergoing maintenance.
                     <br />
                     We apologize for the inconvenience and appreciate your patience.
                   </Typography>
                   <div className="animate-pulse">
                     <svg
                       className="w-16 h-16 mx-auto text-blue-500"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg"
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         strokeWidth={2}
                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                       />
                     </svg>
                   </div>
                 </div>
              )}


{isPanelUp.success == "ok" && (      
        


                <>
                  <Typography
                    variant="h4"
                    className="text-center font-bold mb-6 text-blue-gray-800"
                  >
                    Sign into your account
                  </Typography>
                  <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                      <FormLabel required>Username</FormLabel>
                      <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <FormLabel required>Password</FormLabel>
                      <input
                        type="password"
                        name="email"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Checking..." : "Sign In"}
                      </button>
                    </div>
                  </form>
                  <div
                    className="text-end mt-4"
                    onClick={handleForgetPasswordClick}
                  >
                    <Link className="text-sm text-gray-700 hover:text-blue-600">
                      Forgot password?
                    </Link>
                  </div>
                </>
)}
         
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;