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
} from "@material-tailwind/react";
import DonorSelect from "./DonorSelect";
import { toast } from "react-toastify";

const DuplicateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [donorName, setDonorName] = useState("");
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

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-donors-duplicate-by-id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setDonor(res.data.individualCompanies);
        setLoader(false);
      });
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

  const populateDonorName = (donorName) => {
    setDonorName(donorName);
    setShowModal(false);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      indicomp_fts_id: donor.indicomp_fts_id,
      new_indicomp_fts_id: donorName,
      indicomp_status: "0",
    };

    setIsButtonDisabled(true);
    axios
      .put(`${BASE_URL}/api/update-donors-duplicate/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        toast.success("Duplicate Updated Successfully");
        setIsButtonDisabled(false);
        navigate("/duplicate-list");
      });
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2    rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>DuplicateEdit{id}</span>
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
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
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Donor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="indicomp_fts_id"
                    className="w-full p-2 border rounded-lg "
                    value={donorName}
                    onChange={onInputChange}
                    onClick={() => setShowModal(true)}
                    required
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
        <DialogHeader> Add to Member</DialogHeader>
        <DialogBody>
          <DonorSelect populateDonorName={populateDonorName} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowModal(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default DuplicateEdit;
