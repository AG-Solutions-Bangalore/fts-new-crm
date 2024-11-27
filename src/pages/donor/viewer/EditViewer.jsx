import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { IoPersonAdd } from "react-icons/io5";
import { Button, Input } from "@material-tailwind/react";
import { MenuItem, TextField } from "@mui/material";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "react-toastify";
import SelectInput from "../../../components/common/SelectInput";
const status1 = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];
const EditViewer = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [viewerId, setID] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewerChapterIds, setViewerChapterIds] = useState([]);
  const [chapterIds, setChapterIds] = useState("");
  const [chapter_id, setchapter_id] = useState("");
  const [status, setStatus] = useState("");
  const [user_position, setuser_position] = useState([]);
  const [loader, setLoader] = useState(true);
  const [viewer, setViewer] = useState({});

  const [chapters, setChapters] = useState([]);
  const [currentViewerChapterIds, setCurrentViewerChapterIds] = useState([]);

  const handleClick = (e) => {
    const targetName = e.target.name;
    setCurrentViewerChapterIds((prevState) => {
      const newChapterIds = new Set(prevState);
      if (e.target.checked) {
        newChapterIds.add(targetName);
      } else {
        newChapterIds.delete(targetName);
      }
      setChapterIds([...newChapterIds].join(","));
      return [...newChapterIds];
    });
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
  const onStatusChange = (e) => {
    setStatus(e.target.value);
    console.log("debug", e.target.value);
  };

  const onuser_positionChange = (e) => {
    setuser_position(e.target.value);
  };

  const onuser_chapteridChange = (e) => {
    setchapter_id(e.target.value);
  };

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(BASE_URL + "/api/fetch-chapters", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setChapters(data.chapters);
      } catch (error) {
        toast.error("Failed to fetch chapters.");
      }
    };

    fetchChapters();
  }, []);

  useEffect(() => {
    const fetchViewer = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-viewer-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTheViewer(response.data.users);
        setLoader(false);
      } catch (error) {
        toast.error("Failed to fetch viewer details.");
      }
    };

    fetchViewer();
  }, [id]);

  const setTheViewer = (users) => {
    setID(users.id);
    setFirstName(users.first_name);
    setLastName(users.last_name);
    setUserName(users.name);
    setEmail(users.email);
    setContact(users.phone);
    setuser_position(users.user_position);
    setStartDate(users.viewer_start_date);
    setEndDate(users.viewer_end_date);
    setStatus(users.user_status);
    console.log("test", users.user_status);
    setChapterIds(users.viewer_chapter_ids);
    setchapter_id(users.chapter_id);

    var res = users.viewer_chapter_ids.split(",");
    console.log("res check", res);

    setCurrentViewerChapterIds(res);
    console.log("setchaptercurrent", res);
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      return;
    }
    const data = {
      id: viewerId,
      first_name: firstName,
      last_name: lastName,
      chapter_id: chapter_id,
      name: userName,
      mobile_number: contact,
      email: email,
      viewer_start_date: startDate,
      viewer_end_date: endDate,
      chapter_ids_comma_separated: chapterIds,
      user_position: user_position,
      user_status: status,
    };

    setIsButtonDisabled(true);
    const token = localStorage.getItem("token");

    const res = await axios.post(`${BASE_URL}/api/update-viewer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Viewer Edited Succesfully");
    navigate("/viewer-list");

    setIsButtonDisabled(false);
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
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2    rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Edit Viewer</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/viewer-list")}
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
          <div>
            <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
              <IconInfoCircle className="w-4 h-4" />
              <span>Viewer Details</span>
            </h2>

            <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                  value={chapter_id}
                  required
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
                />
              </div>

              <div className="form-group ">
                <SelectInput
                  label="Status"
                  options={status1.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  required
                  value={status}
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Select  Status"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
              <IconInfoCircle className="w-4 h-4" />
              <span>Chapters Associated</span>
            </h2>
            <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={chapter.id}
                    checked={currentViewerChapterIds.includes(
                      chapter.id.toString()
                    )}
                    onChange={handleClick}
                    className="form-checkbox h-4 w-4"
                  />
                  <span>{chapter.chapter_name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-start">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
            >
              {isButtonDisabled ? "Updating..." : "Update"}
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
    </Layout>
  );
};

export default EditViewer;
