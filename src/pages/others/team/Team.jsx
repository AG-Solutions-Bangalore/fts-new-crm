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
import moment from "moment/moment";
import { OTHER_TEAM_COMMITTEE_DROPDOWN, OTHER_TEAM_CREATE, OTHER_TEAM_DESIGNATION_DROPDOWN } from "../../../api";

const Team = () => {
  const [committee, setCommittee] = useState({
    committee_type: "",
    designation: "",
    indicomp_fts_id: "",
    indicomp_full_name: "",
    receipt_from_date: "",
    receipt_to_date: "",
    indicomp_full_name_dummy: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const commiteeOptions = [
    { value: "Executive Committee", label: "Executive Committee" },
    { value: "Mahila Samiti", label: "Mahila Samiti" },
    { value: "Ekal Yuva", label: "Ekal Yuva" },
    { value: "Functional Committee", label: "Functional Committee" },
  ];
  const userType = localStorage.getItem("user_type_id");

  const onInputChange = (name, value) => {
    setCommittee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onInputChange1 = (e) => {
    const { name, value } = e.target;

    setCommittee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOpenDialog = () => setOpenDialog((prev) => !prev);

  const populateDonorName = (fts_id, inname) => {
    setCommittee((prev) => ({
      ...prev,
      indicomp_full_name: fts_id,
      indicomp_full_name_dummy: inname,
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
        `${OTHER_TEAM_DESIGNATION_DROPDOWN}`,
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
  const [committes, setCommittes] = useState({});

  const fetchCommiteDate = async () => {
    const theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${theLoginToken}`,
      },
    };

    try {
      const response = await fetch(
        `${OTHER_TEAM_COMMITTEE_DROPDOWN}`,
        requestOptions
      );
      const data = await response.json();
      setCommittes(data.committeDate);
    } catch (error) {
      console.error("Error fetching designations:", error);
      toast.error("Error fetching designations");
    }
  };
  useEffect(() => {
    fetchDesignations();
    fetchCommiteDate();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = {
      committee_type: committee.committee_type,
      designation: committee.designation,
      start_date: committes.committee_from,
      end_date: committes.committee_to,
      indicomp_fts_id: committee.indicomp_full_name,
      indicomp_full_name_dummy: committee.indicomp_full_name_dummy,
    };

    try {
      const res = await axios.post(`${OTHER_TEAM_CREATE}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        setCommittee({
          committee_type: "",
          designation: "",
          indicomp_fts_id: "",
          indicomp_full_name: "",
          receipt_from_date: "",
          receipt_to_date: "",
          indicomp_full_name_dummy: "",
        });
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    } catch (error) {
      toast.error("Error creating committee");
      console.error(error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-xs font-semibold text-black mb-1 ">
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
      {userType === "3" || userType === "4" ? (
        ""
      ) : (
        <div className="  bg-[#FFFFFF] p-2    rounded-lg  ">
          <div className="sticky top-0 p-4 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
            <h2 className="text-black text-lg flex flex-col md:flex-row justify-between items-center">
              {/* Header Section */}
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <IconInfoCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Add Committee Member</span>
              </div>

              {/* Date Inputs Section */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex flex-col text-sm">
                  <FormLabel className="text-gray-600 text-sm mb-1">
                    Start Date
                  </FormLabel>
                  <input
                    type="date"
                    name="receipt_from_date"
                    disabled
                    required
                    value={committes.committee_from}
                    onChange={(e) =>
                      onInputChange(e.target.name, e.target.value)
                    }
                    className="text-xs"
                  />
                </div>
                <div className="flex flex-col text-sm">
                  <FormLabel className="text-gray-600 text-sm mb-1">
                    End Date
                  </FormLabel>
                  <input
                    type="date"
                    name="receipt_to_date"
                    disabled
                    required
                    value={committes.committee_to}
                    className="text-xs"
                  />
                </div>
              </div>
            </h2>
          </div>

          <hr />

          <form
            id="dowRecp"
            autoComplete="off"
            onSubmit={onSubmit}
            className="w-full max-w-7xl  rounded-lg mx-auto p-6 space-y-8 "
          >
            <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <FormLabel required>Committee Type</FormLabel>
                <select
                  name="committee_type"
                  value={committee.committee_type}
                  onChange={(e) => onInputChange(e.target.name, e.target.value)}
                  required
                  className={inputClassSelect}
                >
                  <option value="">Select Committee Type</option>
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
                  name="indicomp_full_name_dummy"
                  value={committee.indicomp_full_name_dummy}
                  onClick={handleOpenDialog}
                  onChange={(e) => onInputChange(e.target.name, e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                >
                  {isButtonDisabled ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="   p-2  mt-5   rounded-lg  ">
        <CommitteeList />
      </div>

      <Dialog open={openDialog} handler={handleOpenDialog}>
        <DialogBody>
          <MemberSelect
            populateDonorName={populateDonorName}
            setOpenDialog={setOpenDialog}
          />
        </DialogBody>
      </Dialog>
    </Layout>
  );
};

export default Team;
