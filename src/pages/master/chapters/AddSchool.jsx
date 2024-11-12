import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@material-tailwind/react";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import Fields from "../../../common/TextField/TextField";

const AddSchool = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [viewerId, setID] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  console.log(contact, email);
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

      if (response.data.code == 200) {
        toast.success("Data Updated Sucessfully");
        navigate("/chapters");
      } else {
        if (response.data.code == 401) {
          toast.error("Data Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Data Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Data:", error);
      toast.error("Error  updating Data");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/chapters">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            School
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group ">
                <Input
                  required
                  type="text"
                  label="Full Name"
                  autoComplete="Name"
                  name="first_name"
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e)}
                  disabled
                  labelProps={{
                    className: "!text-gray-500",
                  }}
                />
              </div>
              <div className="form-group ">
                <Input
                  required
                  type="text"
                  label="Mobile"
                  autoComplete="Name"
                  name="mobile_number"
                  value={contact}
                  onChange={(e) => onContactChange(e)}
                  disabled
                  labelProps={{
                    className: "!text-gray-500",
                  }}
                />
              </div>
              <div className="form-group ">
                <Input
                  required
                  label="Email"
                  type="email"
                  autoComplete="Name"
                  name="email"
                  value={email}
                  onChange={(e) => onEmailChange(e)}
                  disabled
                  labelProps={{
                    className: "!text-gray-500",
                  }}
                />
              </div>
            </div>
            <div className="flex">
              {chapters.map((chapter, key) => (
                <div style={{ flexDirection: "row", width: "20%" }}>
                  {currentViewerChapterIds.includes(chapter.id + "") ==
                    true && (
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      onChange={handleClick}
                      name={chapter.id}
                      id={chapter.id}
                    />
                  )}

                  {currentViewerChapterIds.includes(chapter.id + "") ==
                    false && (
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      onChange={handleClick}
                      name={chapter.id}
                      id={chapter.id}
                    />
                  )}

                  <label for={chapter.id} style={{ marginLeft: 5 }}>
                    {chapter.chapter_name}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 ">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Submiting..." : "Submit"}
              </button>
              <Link to="/chapters">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Back
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddSchool;
