import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { FormLabel } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";
import { IconArrowBack } from "@tabler/icons-react";
import { decryptId } from "../../utils/encyrption/Encyrption";

const AddSchoolAdmin = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const decryptedId = decryptId(id);

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
      .get(`${BASE_URL}/api/fetch-viewer-by-id/${decryptedId}`, {
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
    const targetName = e.target.name;
    setCurrentViewerChapterIds((prevState) => {
      const newChapterIds = new Set(prevState);
      if (e.target.checked) {
        newChapterIds.add(targetName);
      } else {
        newChapterIds.delete(targetName);
      }
      setSchoolIds([...newChapterIds].join(","));
      return [...newChapterIds];
    });
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
      const res = await axios.post(`${BASE_URL}/api/update-school`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.code === 200) {
        toast.success(res.data.msg);
        navigate("/chapter");
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
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
