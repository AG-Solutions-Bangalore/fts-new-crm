import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import defaulttodates from "../../../utils/DefaultToDates";
import defaultfromdate from "../../../utils/DefaultFromDate";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import MemberSelect from "./MemberSelect";
import { toast } from "react-toastify";
import CommitteeList from "./CommitteeList";

const Team = () => {
  const [committee, setCommittee] = useState({
    committee_type: "",
    designation: "",
    indicomp_fts_id: "",
    indicomp_full_name: "",
    receipt_from_date: defaultfromdate,
    receipt_to_date: defaulttodates,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loadingCommittees, setLoadingCommittees] = useState(true);
  const navigate = useNavigate();
  const commiteeOptions = [
    { value: "Executive Committee", label: "Executive Committee" },
    { value: "Mahila Samiti", label: "Mahila Samiti" },
    { value: "Ekal Yuva", label: "Ekal Yuva" },
    { value: "Functional Committee", label: "Functional Committee" },
  ];

  const onInputChange = (name, value) => {
    console.log(value);
    setCommittee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onInputChange1 = (e) => {
    const { name, value } = e.target;

    console.log(value);
    setCommittee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOpenDialog = () => setOpenDialog((prev) => !prev);

  const populateDonorName = (fts_id) => {
    setCommittee((prev) => ({
      ...prev,
      indicomp_full_name: fts_id,
    }));
    setOpenDialog(false);
  };

  // Fetch designation data
  const fetchDesignations = async () => {
    const theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${theLoginToken}`,
      },
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/fetch-designation`,
        requestOptions
      );
      const data = await response.json();
      setDesignationOptions(data.designation);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching designations:", error);
      toast.error("Error fetching designations");
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = {
      committee_type: committee.committee_type,
      designation: committee.designation,
      start_date: committee.receipt_from_date,
      end_date: committee.receipt_to_date,
      indicomp_fts_id: committee.indicomp_full_name,
    };

    try {
      await axios.post(`${BASE_URL}/api/create-committee`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Committee is Created Successfully");
      setCommittee({
        committee_type: "",
        designation: "",
        indicomp_fts_id: "",
        indicomp_full_name: "",
        receipt_from_date: defaultfromdate,
        receipt_to_date: defaulttodates,
      });
      //   fetchCommittees();
    } catch (error) {
      toast.error("Error creating committee");
      console.error(error);
    }finally{
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
    <Layout>
      <div className="  bg-[#FFFFFF] p-2    rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Committee Summary</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/donor-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />

        <form
          id="dowRecp"
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl  rounded-lg mx-auto p-6 space-y-8 "
        >
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel required>Committee Type</FormLabel>
              <select
                name="committee_type"
                value={committee.committee_type}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Company Type</option>
                {commiteeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Designation</FormLabel>
              <select
                name="designation"
                value={committee.designation}
                onChange={(e) => onInputChange1(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Designation</option>
                {designationOptions.map((option) => (
                  <option key={option.id} value={option.designation_type}>
                    {option.designation_type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Member's Name</FormLabel>
              <input
                type="text"
                name="indicomp_full_name"
                value={committee.indicomp_full_name}
                onClick={handleOpenDialog}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel>From Date</FormLabel>
              <input
                type="date"
                disabled
                name="receipt_from_date"
                value={committee.receipt_from_date}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel>To Date</FormLabel>
              <input
                type="date"
                name="receipt_to_date"
                disabled
                value={committee.receipt_to_date}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
            <FormLabel>Sumbit</FormLabel>
            <Button
            type="submit"
            color="blue"
            disabled={isButtonDisabled}
            className={inputClass}
          >
            {isButtonDisabled ? "Updating..." : "Update"}
          </Button>
            </div>
          </div>
          {/* <div className="flex gap-4 justify-start">
          <Button
            type="submit"
            color="blue"
            disabled={isButtonDisabled}
            className="px-6 py-2"
          >
            {isButtonDisabled ? "Updating..." : "Update"}
          </Button>
        </div> */}
         
        </form>
      </div>

     <div className="  bg-[#FFFFFF] p-2  mt-5   rounded-lg  ">
     <CommitteeList/>
     </div>

      <Dialog open={openDialog} handler={handleOpenDialog}>
        <DialogHeader> Add to Member</DialogHeader>
        <DialogBody>
          <MemberSelect populateDonorName={populateDonorName} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            //   onClick={() => closegroupModal()}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default Team;
