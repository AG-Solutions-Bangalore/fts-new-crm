import { Input, Button, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../../assets/receipt/sigin.jpg";
import Logo1 from "../../assets/receipt/fts_logo.png";
import { FaInstagram, FaPinterest, FaTwitter } from "react-icons/fa";
import { TiSocialLinkedin, TiSocialYoutubeCircular } from "react-icons/ti";
import { CgFacebook } from "react-icons/cg";
import { FormLabel } from "@mui/material";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const handleForgetPasswordClick = () => {
    navigate("/forget-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/api/login`, formData);

      if (res.status === 200) {
        const token = res.data.UserInfo?.token;

        localStorage.setItem("id", res.data.UserInfo.user.user_type_id);
        localStorage.setItem("name", res.data.UserInfo.user.first_name);
        localStorage.setItem("username", res.data.UserInfo.user.name);
        localStorage.setItem("chapter_id", res.data.UserInfo.user.chapter_id);
        localStorage.setItem(
          "user_type_id",
          res.data.UserInfo.user.user_type_id
        );

        if (token) {
          localStorage.setItem("token", token);
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

  const inputClass =
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";

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
        <div className="max-w-7xl w-full bg-white shadow-lg rounded-2xl overflow-hidden  m-4">
          <div className="flex flex-col lg:flex-row max-h-[682px]">
            {/* Left Side - Image */}
            <div className="lg:w-1/2 hidden lg:block">
              <img
                src={Logo}
                alt="Login"
                className="object-cover h-full w-full"
              />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-4 sm:px-0 md:px-16 flex flex-col mt-8 max-h-[682px]">
              <div className="flex items-center justify-center mb-8">
                <img src={Logo1} alt="Company Logo" className="w-32 h-32" />
              </div>
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
                    type="text"
                    name="email"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-center text-sm font-[400] cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                >
                  {loading ? "Checking..." : "Sign In"}
                </Button>
              </form>
              <div
                className="text-end mt-4"
                onClick={handleForgetPasswordClick}
              >
                <Link className="text-sm text-gray-700 hover:text-blue-600">
                  Forgot password?
                </Link>
              </div>
              <div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
