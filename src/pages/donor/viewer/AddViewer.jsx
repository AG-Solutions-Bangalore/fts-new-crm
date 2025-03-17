import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input, Button, Select, Option } from "@material-tailwind/react";
import { IoPersonAdd } from "react-icons/io5";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { MenuItem, TextField } from "@mui/material";
import { IconArrowBack } from "@tabler/icons-react";
import { IconInfoCircle } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { VIEWVER_CREATE } from "../../../api";

const AddViewer = ({ onClose, fetchViewerData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewerChapterIds, setViewerChapterIds] = useState([]);
  const [chapterIds, setChapterIds] = useState("");
  const [chapter_id, setchapter_id] = useState("");
  const [user_position, setuser_position] = useState([]);

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample chapters data

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/fetch-chapters`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChapters(response.data?.chapters);
      } catch (error) {
        console.error("Error fetching Factory data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapterData();
    setLoading(false);
  }, []);
  const today = new Date().toISOString().split("T")[0];

  const handleClick = (e) => {
    var targetName = e.target.name;
    if (e.target.checked == true) {
      var temparray = viewerChapterIds;
      temparray.push(e.target.name);
      setViewerChapterIds(temparray);
    } else {
      var temparray = viewerChapterIds;
      temparray.splice(temparray.indexOf(targetName), 1);
      setViewerChapterIds(temparray);
    }

    var theChapterIds = "";
    for (var i = 0; i < viewerChapterIds.length; i++) {
      theChapterIds = theChapterIds + "," + viewerChapterIds[i];
    }
    setChapterIds(theChapterIds);
  };

  const onFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const onLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const onUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onContactChange = (e) => {
    if (e.target.name == "mobile_number") {
      if (validateOnlyDigits(e.target.value)) {
        setContact(e.target.value);
      }
    } else {
      setContact(e.target.value);
    }
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const onEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onuser_positionChange = (e) => {
    setuser_position(e.target.value);
  };

  const onuser_chapteridChange = (e) => {
    setchapter_id(e.target.value);
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill all required fields");
      return;
    }

    const data = {
      first_name: firstName,
      last_name: lastName,
      chapter_id: chapter_id,
      username: userName,
      mobile_number: contact,
      email: email,
      viewer_start_date: startDate,
      viewer_end_date: endDate,
      chapter_ids_comma_separated: chapterIds,
      user_position: user_position,
      password: password,
    };

    setIsButtonDisabled(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${VIEWVER_CREATE}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        fetchViewerData();
        onClose();

        // Reset form fields
        setFirstName("");
        setLastName("");
        setUserName("");
        setContact("");
        setEmail("");
        setStartDate("");
        setEndDate("");
        setPassword("");
        setViewerChapterIds([]);
        setChapterIds("");
        setchapter_id("");
        setuser_position("");
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error adding viewer:", error);
      toast.error(error.res?.data?.message || "Something went wrong");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
    <div className="bg-[#FFFFFF] p-2  w-[48rem] ">
      <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Add Viewer</span>
          </div>
          <IconArrowBack
            onClick={() => onClose()}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
      <hr />

      <form
        id="addIndiv"
        onSubmit={handleSubmit}
        className="w-full max-w-7xl  rounded-lg mx-auto p-6 space-y-8 "
      >
        {/* viwer details  */}
        <div>
          <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Viwer Details</span>
          </h2>
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel required>Full Name</FormLabel>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => onFirstNameChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>User Name (Login Name)</FormLabel>
              <input
                type="text"
                name="username"
                value={userName}
                onChange={(e) => onUserNameChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Mobile</FormLabel>
              <input
                type="tel"
                name="mobile_number"
                value={contact}
                onChange={(e) => onContactChange(e)}
                className={inputClass}
                maxLength={10}
                required
              />
            </div>

            <div>
              <FormLabel required>Email</FormLabel>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => onEmailChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Chapter</FormLabel>
              <select
                name="chapter_id"
                required
                value={chapter_id}
                onChange={(e) => onuser_chapteridChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select Chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.chapter_name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Please select your Chapter
              </p>
            </div>

            <div>
              <FormLabel required>Designation</FormLabel>
              <input
                type="text"
                name="user_position"
                value={user_position}
                onChange={(e) => onuser_positionChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Start Date</FormLabel>
              <input
                name="startDate"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e)}
                className={inputClass}
                required
                min={today}
              />
            </div>

            <div>
              <FormLabel required>End Date</FormLabel>
              <input
                name="endDate"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e)}
                className={inputClass}
                required
                min={today}
              />
            </div>

            <div>
              <FormLabel required>Enter Password</FormLabel>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e)}
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>
        {/* chapter accociated  */}
        <div>
          <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Chapters Associated</span>
          </h2>
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={handleClick}
                  name={chapter.id}
                  id={chapter.id}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <label htmlFor={`chapter-${chapter.id}`} className="text-sm">
                  {chapter.chapter_name}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* form actio  */}
        <div className="flex gap-4 justify-start">
          <button
            type="submit"
            className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? "Submitting..." : "Submit"}
          </button>

          <Link to="/viewer-list">
            <button
              color="red"
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-red-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddViewer;
