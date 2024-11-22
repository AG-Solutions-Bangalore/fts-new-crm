import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { FormLabel } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";
import { IconArrowBack } from "@tabler/icons-react";

const AddSchoolAdmin = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [viewerId, setID] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [viewerChapterIds, setViewerChapterIds] = useState([]);
  const [schoolIds, setSchoolIds] = useState("");
  const [chapters, setChapters] = useState([]);
  const [currentViewerChapterIds, setCurrentViewerChapterIds] = useState([]);

  const [states, setStates] = useState([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-chapters`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setChapters(res.data.chapters);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-viewer-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTheViewer(res.data.users);
      });
  }, []);

  const setTheViewer = (users) => {
    setID(users.id);
    setFirstName(users.first_name);
    setEmail(users.email);
    setContact(users.phone);
    setSchoolIds(users.user_school_ids);
    var res = users.user_school_ids.split(",");

    var tempChapterIds = [];

    for (var i = 0; i < res.length; i++) {
      tempChapterIds.push(res[i]);
    }

    setCurrentViewerChapterIds(tempChapterIds);
  };

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt); // Simplified validation

  const onContactChange = (e) => {
    if (e.target.name == "mobile_number") {
      if (validateOnlyDigits(e.target.value)) {
        setContact(e.target.value);
      }
    } else {
      setContact(e.target.value);
    }
  };

  const onFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

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

    var schoolIds = "";
    for (var i = 0; i < viewerChapterIds.length; i++) {
      schoolIds = schoolIds + "," + viewerChapterIds[i];
    }
    setSchoolIds(schoolIds);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-states`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStates(res.data?.states);
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      id: viewerId,
      chapter_ids_comma_separated: schoolIds,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/update-school`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Data Updated Sucessfully");
        navigate("/chapter");
      } else {
        toast.error("An unknown error occurred");
      }
    } catch (error) {
      console.error("Error updating Data:", error);
      toast.error("Error  updating Data");
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
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 cursor-not-allowed";
  return (
    <Layout>
      <div>
        <div>
          <div className="sticky top-0 p-2   border-b-2 border-green-500 rounded-t-lg  bg-[#E1F5FA] ">
            <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
              <div className="flex  items-center gap-2">
                <IconInfoCircle className="w-4 h-4" />
                <span> School</span>
              </div>
              <IconArrowBack
                onClick={() => navigate("/chapter")}
                className="cursor-pointer hover:text-red-600"
              />
            </h2>
          </div>
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="p-6  bg-white shadow-md rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <FormLabel required>Full Name</FormLabel>
                <input
                  name="first_name"
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e)}
                  disabled
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>Mobile</FormLabel>
                <input
                  name="mobile_number"
                  value={contact}
                  onChange={(e) => onContactChange(e)}
                  disabled
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
                  onChange={(e) => onEmailChange(e)}
                  disabled
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-start items-center gap-4">
              {chapters.map((chapter, key) => (
                <div
                  key={key}
                  className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                >
                  <input
                    type="checkbox"
                    defaultChecked={currentViewerChapterIds.includes(
                      chapter.id + ""
                    )}
                    onChange={handleClick}
                    name={chapter.id}
                    id={chapter.id}
                  />
                  <label htmlFor={chapter.id} className="ml-2 text-sm">
                    {chapter.chapter_name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-start py-4">
              <button
                type="submit"
                className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Submiting..." : "Submit"}
              </button>
              <button
                className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-red-400 hover:bg-red-900 p-2 rounded-lg shadow-md mr-2"
                onClick={() => navigate("/chapter")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddSchoolAdmin;
