import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import DonorSelect from "./DonorSelect";
import { toast } from "react-toastify";
import { decryptId } from "../../../utils/encyrption/Encyrption";
import { fetchDuplicateEditById, fetchDuplicateEditByIdUpdate } from "../../../api";

const DuplicateEdit = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [donorName, setDonorName] = useState("");
  const [donorNames, setDonorNames] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [donor, setDonor] = useState({
    indicomp_fts_id: "",
    indicomp_full_name: "",
    indicomp_type: "",
    indicomp_com_contact_name: "",
    indicomp_spouse_name: "",
    indicomp_mobile_phone: "",
    indicomp_email: "",
    indicomp_donor_type: "",
    indicomp_related_id: "",
  });

  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}/api/fetch-donors-duplicate-by-id/${decryptedId}`, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     })
  //     .then((res) => {
  //       setDonor(res.data.individualCompanies);
  //       setLoader(false);
  //     });
  // }, [decryptedId]);
 
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await fetchDuplicateEditById(id);
            setDonor(data.individualCompanies);
            setLoader(false);
          } catch (error) {
            toast.error("Failed to fetch edit duplicate details");
          }
        };
        
        fetchData();
      }, [id]);

  const onInputChange = (e) => {
    setDonor({
      ...donor,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "indicomp_fts_id") {
      setDonorName(e.target.value);
    }
  };

  const handleOpenDialog = () => setShowModal((prev) => !prev);

  const populateDonorName = (donorName, donorNames) => {
    setDonorName(donorName);
    setDonorNames(donorNames);
    setShowModal(false);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!donor?.indicomp_fts_id || !donorName) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const data = {
      indicomp_fts_id: donor.indicomp_fts_id,
      new_indicomp_fts_id: donorName,
      indicomp_status: "0",
    };

    setIsButtonDisabled(true);

    try {
      // const response = await axios.put(
      //   `${BASE_URL}/api/update-donors-duplicate/${decryptedId}`,
      //   data,
      //   {
      //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      //   }
      // );
const response = await fetchDuplicateEditByIdUpdate(id,data);



      if (response.data.code === 200) {
        toast.success(response.data.msg);
        navigate("/duplicate-list");
      } else {
        toast.error(response.data.msg);
        setIsButtonDisabled(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Network error occurred.");
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
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";

  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2    rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>DuplicateEdit</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/duplicate-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>

        <div className="p-2 mb-4  rounded-lg bg-[#D0F6F2]">
          <p className="text-sm">
            Duplicate Criteria: If Mobile Number is Same or Donor Name is Same.
            <br />
            (Note: All the below data is not 100% duplicate. It is all
            recommended data that may be duplicated. Please make the changes
            very carefully. We advise you to make a note before removing.)
          </p>
        </div>

        <div>
          {loader ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <div className="p-6 space-y-6 border-2 border-gray-300 rounded-lg">
              {/* Donor Info */}
              <h2 className="text-xl font-bold">Duplicate Donors</h2>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <span className="text-sm font-semibold">FTS ID:</span>{" "}
                  {donor.indicomp_fts_id}
                </p>
                <p>
                  <strong className="text-sm font-semibold">Donor Name:</strong>{" "}
                  {donor.indicomp_full_name}
                </p>
                <p>
                  <strong className="text-sm font-semibold">Type:</strong>{" "}
                  {donor.indicomp_type}
                </p>
                <p>
                  <strong className="text-sm font-semibold">Donor Type:</strong>{" "}
                  {donor.indicomp_donor_type}
                </p>
                <p>
                  <strong className="text-sm font-semibold">
                    Contact Name:
                  </strong>{" "}
                  {donor.indicomp_com_contact_name}
                </p>
                <p>
                  <strong className="text-sm font-semibold">Mobile:</strong>{" "}
                  {donor.indicomp_mobile_phone}
                </p>
                <p>
                  <strong className="text-sm font-semibold">Email:</strong>{" "}
                  {donor.indicomp_email}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit}>
                <div>
                  <FormLabel required>Donor Name</FormLabel>
                  <input
                    required
                    value={donorNames}
                    onChange={onInputChange}
                    onClick={() => setShowModal(true)}
                    className={inputClass}
                  />
                </div>
                <p className="text-sm text-red-600 mb-4">
                  Note: Please select the donor carefully. This action cannot be
                  undone.
                </p>
                <button
                  type="submit"
                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2 mb-2"
                  disabled={isButtonDisabled}
                >
                  Submit
                </button>
                <button
                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
                  onClick={() => {
                    navigate("/duplicate-list");
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} handler={handleOpenDialog}>
        <DialogBody>
          <div className="overflow-y-auto ">
            <DonorSelect
              populateDonorName={populateDonorName}
              setShowModal={setShowModal}
            />
          </div>{" "}
        </DialogBody>
      </Dialog>
    </Layout>
  );
};

export default DuplicateEdit;
