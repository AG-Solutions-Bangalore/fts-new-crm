import { Input, Button, Typography } from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";
import BASE_URL from "../../base/BaseUrl";
import { useState } from "react";
import Logo2 from "../../assets/receipt/sigin.jpg";
import Logo1 from "../../assets/logos/fts_logo1.jpeg";
import { FaInstagram, FaPinterest, FaTwitter } from "react-icons/fa";
import { TiSocialLinkedin, TiSocialYoutubeCircular } from "react-icons/ti";
import { CgFacebook } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { FormLabel } from "@mui/material";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/send-password?username=${username}&email=${email}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("New Password Sent to your Email");
      } else {
        toast.error("Email not sent. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  return (
    <>
      <Toaster
        toastOptions={{
          success: { style: { background: "green" } },
          error: { style: { background: "red" } },
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
                src={Logo2}
                alt="Reset Password"
                className="object-cover h-full w-full"
              />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-4 sm:px-0 md:px-16 flex flex-col mt-8 max-h-[682px]">
              <div className="flex items-center justify-center mb-8">
                <img src={Logo1} alt="Company Logo" className=" h-32" />
              </div>
              <Typography
                variant="h4"
                className="text-center font-bold mb-6 text-blue-gray-800"
              >
                {/* Enter your email to reset your password. */}
                Enter to Reset Password
              </Typography>
              <form onSubmit={onResetPassword} className="space-y-6">
                <div>
                  <FormLabel required>Username</FormLabel>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <FormLabel required>Email</FormLabel>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex justify-center ">
                  <button
                    className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                    type="submit"
                  >
                    {" "}
                    Reset Password
                  </button>
                </div>
              </form>
              <div className="text-end mt-4" onClick={() => navigate("/")}>
                <Link className="text-sm text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
              </div>

              {/* <div>
                <h6 className="flex justify-center text-gray-600">
                  Follow with us
                </h6>
                <div className="grid grid-cols-6 text-black">
                  <CgFacebook className="text-black hover:bg-blue-700 cursor-pointer hover:text-white transition-colors duration-300 p-4 rounded-full w-14 h-14 flex items-center justify-center" />
                  <TiSocialYoutubeCircular className="text-black hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-300 p-4 rounded-full w-14 h-14 flex items-center justify-center" />
                  <FaTwitter className="text-black hover:bg-blue-500 hover:text-white cursor-pointer transition-colors duration-300 p-4 rounded-full w-14 h-14 flex items-center justify-center" />
                  <TiSocialLinkedin className="text-black hover:bg-blue-500 hover:text-white cursor-pointer transition-colors duration-300 p-4 rounded-full w-14 h-14 flex items-center justify-center" />
                  <FaInstagram className="text-black hover:bg-yellow-800 hover:text-white cursor-pointer transition-colors duration-300 p-4 rounded-full w-14 h-14 flex items-center justify-center" />
                  <FaPinterest className="text-black hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-300 p-4 rounded-full w-14 h-14 flex items-center justify-center" />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
