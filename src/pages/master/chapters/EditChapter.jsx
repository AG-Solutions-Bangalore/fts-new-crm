import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import SelectInput from "../../../components/common/SelectInput";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";

const committee_type = [
  {
    value: "President",
    label: "President",
  },
  {
    value: "Secretary",
    label: "Secretary",
  },
  {
    value: "Treasurer",
    label: "Treasurer",
  },
  {
    value: "Joint Org Secretary",
    label: "Joint Org Secretary",
  },
];

const EditChapter = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [states, setStates] = useState([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [chapter, setChapter] = useState({
    chapter_name: "",
    chapter_code: "",
    chapter_address: "",
    chapter_city: "",
    chapter_pin: "",
    chapter_state: "",
    chapter_phone: "",
    chapter_whatsapp: "",
    chapter_email: "",
    chapter_website: "",
    chapter_date_of_incorporation: "",
    chapter_region_code: "",
    auth_sign: "",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    const digitFields = ["chapter_pin", "chapter_phone", "chapter_whatsapp"];

    if (digitFields.includes(name)) {
      if (validateOnlyDigits(value)) {
        setChapter((prevChapter) => ({
          ...prevChapter,
          [name]: value,
        }));
      }
    } else {
      setChapter((prevChapter) => ({
        ...prevChapter,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-chapter-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setChapter(res.data?.chapter);
      });
  }, [id]);

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
      chapter_name: chapter.chapter_name,
      chapter_code: chapter.chapter_code,
      chapter_address: chapter.chapter_address,
      chapter_city: chapter.chapter_city,
      chapter_pin: chapter.chapter_pin,
      chapter_state: chapter.chapter_state,
      chapter_phone: chapter.chapter_phone,
      chapter_whatsapp: chapter.chapter_whatsapp,
      chapter_email: chapter.chapter_email,
      chapter_website: chapter.chapter_website,
      chapter_date_of_incorporation: chapter.chapter_date_of_incorporation,
      chapter_region_code: chapter.chapter_region_code,
      auth_sign: chapter.auth_sign,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/update-chapter/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Chapter is Updated Successfully");
        navigate("/master/chapters");
      } else {
        toast.error("Failed to update chapter");
      }
    } catch (error) {
      console.error("Error updating Chapter:", error);
      toast.error("Error  updating Brand");
    } finally {
      setIsButtonDisabled(false);
    }
  };
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <Layout>
      <div>
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span> Update Chapter</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/master/chapters")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <FormLabel required>Chapter Name</FormLabel>
                <input
                  name="chapter_name"
                  value={chapter.chapter_name}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>Address</FormLabel>
                <input
                  name="chapter_name"
                  value={chapter.chapter_address}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>City</FormLabel>
                <input
                  name="chapter_city"
                  value={chapter.chapter_city}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>Pin</FormLabel>
                <input
                  name="chapter_pin"
                  value={chapter.chapter_pin}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                  type="tel"
                  maxLength={6}
                />
              </div>

              <div>
                <SelectInput
                  label="State"
                  name="chapter_state"
                  value={chapter.chapter_state}
                  options={states.map((item) => ({
                    value: item.state_name,
                    label: item.state_name,
                  }))}
                  onChange={onInputChange}
                  
                  placeholder="Select State"
                />
              </div>

              <div>
                <FormLabel required>Phone</FormLabel>
                <input
                  name="chapter_phone"
                  value={chapter.chapter_phone}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                  type="tel"
                  maxLength={10}
                />
              </div>
              <div>
                <FormLabel>Whatsapp</FormLabel>
                <input
                  name="chapter_whatsapp"
                  value={chapter.chapter_whatsapp}
                  onChange={onInputChange}
                  className={inputClass}
                  type="tel"
                  maxLength={10}
                />
              </div>
              <div>
                <FormLabel required>Email</FormLabel>
                <input
                  name="chapter_email"
                  value={chapter.chapter_email}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                  type="email"
                />
              </div>
              <div>
                <FormLabel>Website</FormLabel>
                <input
                  name="chapter_website"
                  value={chapter.chapter_website}
                  onChange={onInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <FormLabel>Incorporation Date</FormLabel>
                <input
                  name="chapter_date_of_incorporation"
                  value={chapter.chapter_date_of_incorporation}
                  onChange={onInputChange}
                  className={inputClass}
                  type="date"
                />
              </div>
              <div>
                <FormLabel>Region Code</FormLabel>
                <input
                  name="chapter_region_code"
                  value={chapter.chapter_region_code}
                  onChange={onInputChange}
                  className={inputClass}
                  type="text"
                />
              </div>

              <div>
                <SelectInput
                  label="Comm. Member for Sign"
                  name="auth_sign"
                  value={chapter.auth_sign}
                  options={committee_type}
                  onChange={onInputChange}
                  placeholder="Select State"
                  required
                />
                <p className="text-[10px] p-1 mx-2 ">Committe Member</p>
              </div>
            </div>

            <div className="flex justify-start ">
              <button
                type="submit"
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updating..." : "Update"}
              </button>
              <Link to="/master/chapters">
                <button className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-red-600 hover:bg-red-700 p-2 rounded-lg shadow-md ml-4">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditChapter;
