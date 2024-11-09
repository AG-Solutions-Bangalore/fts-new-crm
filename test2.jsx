import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Input, Button } from "@material-tailwind/react";
import InputMask from "react-input-mask";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import belongs_to from "../../utils/BelongTo";
import donor_type from "../../utils/DonorType";
import honorific from "../../utils/Honorific";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import PageTitle from "../../components/common/PageTitle";

const gender = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];

const corrpreffer = [
  {
    value: "Residence",
    label: "Residence",
  },
  {
    value: "Office",
    label: "Office",
  },
  {
    value: "Digital",
    label: "Digital",
  },
];
const AddIndivisual = () => {
  const [donor, setDonor] = useState({
    indicomp_full_name: "",
    title: "",
    indicomp_father_name: "",
    indicomp_mother_name: "",
    indicomp_gender: "",
    indicomp_spouse_name: "",
    indicomp_dob_annualday: "",
    indicomp_doa: "",
    indicomp_pan_no: "",
    indicomp_image_logo: "",
    indicomp_remarks: "",
    indicomp_promoter: "",
    indicomp_newpromoter: "",
    indicomp_belongs_to: "",
    indicomp_source: "",
    indicomp_donor_type: "",
    indicomp_type: "Individual",
    indicomp_mobile_phone: "",
    indicomp_mobile_whatsapp: "",
    indicomp_email: "",
    indicomp_website: "",
    indicomp_res_reg_address: "",
    indicomp_res_reg_area: "",
    indicomp_res_reg_ladmark: "",
    indicomp_res_reg_city: "",
    indicomp_res_reg_state: "",
    indicomp_res_reg_pin_code: "",
    indicomp_off_branch_address: "",
    indicomp_off_branch_area: "",
    indicomp_off_branch_ladmark: "",
    indicomp_off_branch_city: "",
    indicomp_off_branch_state: "",
    indicomp_off_branch_pin_code: "",
    indicomp_corr_preffer: "Residence",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "indicomp_mobile_phone") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "indicomp_mobile_whatsapp") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "indicomp_res_reg_pin_code") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "indicomp_off_branch_pin_code") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setDonor({
        ...donor,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onChangePanNumber = (e) => {
    setDonor({ ...donor, indicomp_pan_no: e.target.value });
  };

  const [states, setStates] = useState([]);
  const fetchStateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-states`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStates(response.data?.states);
    } catch (error) {
      console.error("Error fetching Life Time data", error);
    } finally {
      setLoading(false);
    }
  };
  const [datasource, setDatasource] = useState([]);
  const fetchDataSource = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-datasource`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDatasource(response.data?.datasource);
    } catch (error) {
      console.error("Error fetching Life Time data", error);
    } finally {
      setLoading(false);
    }
  };
  const [promoter, setPromoters] = useState([]);
  const fetchPromoter = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-promoter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPromoters(response.data?.promoter);
    } catch (error) {
      console.error("Error fetching Life Time data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStateData();
    fetchDataSource();
    fetchPromoter();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      indicomp_full_name: donor.indicomp_full_name,
      title: donor.title,
      indicomp_type: donor.indicomp_type,
      indicomp_father_name: donor.indicomp_father_name,
      indicomp_mother_name: donor.indicomp_mother_name,
      indicomp_gender: donor.indicomp_gender,
      indicomp_spouse_name: donor.indicomp_spouse_name,
      indicomp_dob_annualday: donor.indicomp_dob_annualday,
      indicomp_doa: donor.indicomp_doa,
      indicomp_pan_no: donor.indicomp_pan_no,
      indicomp_image_logo: donor.indicomp_image_logo,
      indicomp_remarks: donor.indicomp_remarks,
      indicomp_promoter: donor.indicomp_promoter,
      indicomp_newpromoter: donor.indicomp_newpromoter,
      indicomp_source: donor.indicomp_source,
      indicomp_mobile_phone: donor.indicomp_mobile_phone,
      indicomp_mobile_whatsapp: donor.indicomp_mobile_whatsapp,
      indicomp_email: donor.indicomp_email,
      indicomp_website: donor.indicomp_website,
      indicomp_res_reg_address: donor.indicomp_res_reg_address,
      indicomp_res_reg_area: donor.indicomp_res_reg_area,
      indicomp_res_reg_ladmark: donor.indicomp_res_reg_ladmark,
      indicomp_res_reg_city: donor.indicomp_res_reg_city,
      indicomp_res_reg_state: donor.indicomp_res_reg_state,
      indicomp_res_reg_pin_code: donor.indicomp_res_reg_pin_code,
      indicomp_off_branch_address: donor.indicomp_off_branch_address,
      indicomp_off_branch_area: donor.indicomp_off_branch_area,
      indicomp_off_branch_ladmark: donor.indicomp_off_branch_ladmark,
      indicomp_off_branch_city: donor.indicomp_off_branch_city,
      indicomp_off_branch_state: donor.indicomp_off_branch_state,
      indicomp_off_branch_pin_code: donor.indicomp_off_branch_pin_code,
      indicomp_corr_preffer: donor.indicomp_corr_preffer,
      indicomp_belongs_to: donor.indicomp_belongs_to,
      indicomp_donor_type: donor.indicomp_donor_type,
    };

    if (id) {
      data.donor_related_id = id;
    }

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);

      return;
    }

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/create-donor",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      console.log("edit1", res.data);
      toast.success("Data Inserted Sucessfully");
      navigate("/donor-list");
    });
  };

  return (
    <Layout>
      <div>
        <PageTitle
          title="Create Individual Donor"
          icon={FaArrowLeft}
          backLink="/donor-list"
        />{" "}
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full max-w-7xl mx-auto p-6 space-y-8"
        >
          {/* Personal Details Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Title <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Title"
                  name="title"
                  value={donor.title}
                  onChange={(e) => onInputChange(e)}
                  required
                >
                  {honorific.map((title) => (
                    <MenuItem key={title} value={title}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Input
                type="text"
                label="Full Name"
                required
                name="indicomp_full_name"
                value={donor.indicomp_full_name}
                onChange={(e) => onInputChange(e)}
              />
              <Input
                type="text"
                label="Father's Name"
                name="indicomp_father_name"
                value={donor.indicomp_father_name}
                onChange={(e) => onInputChange(e)}
              />
              <Input
                type="text"
                label="Mother's Name"
                name="indicomp_mother_name"
                value={donor.indicomp_mother_name}
                onChange={(e) => onInputChange(e)}
              />
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Gender <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Gender"
                  name="indicomp_gender"
                  value={donor.indicomp_gender}
                  onChange={(e) => onInputChange(e)}
                  required
                >
                  {gender.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Input
                type="text"
                label="Spouse Name"
                name="indicomp_spouse_name"
                value={donor.indicomp_spouse_name}
                onChange={(e) => onInputChange(e)}
              />
              <div className="relative">
                <Input
                  type="date"
                  label="Date of Birth"
                  name="indicomp_dob_annualday"
                  value={donor.indicomp_dob_annualday}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="relative">
                <Input
                  type="date"
                  label="Date of Anniversary"
                  name="indicomp_doa"
                  value={donor.indicomp_doa}
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              <div>
                <InputMask
                  mask="aaaaa 9999 a"
                  value={donor.indicomp_pan_no}
                  onChange={(e) => onChangePanNumber(e)}
                  formatChars={{
                    9: "[0-9]",
                    a: "[A-Z]",
                  }}
                >
                  {() => (
                    <Input type="text" label="PAN Number" name="panNumber" />
                  )}
                </InputMask>
              </div>
              <div className="relative">
                <Input
                  type="file"
                  label="Upload Image"
                  name="indicomp_image_logo"
                  value={donor.indicomp_image_logo}
                  onChange={(e) => onInputChange(e)}
                  disabled
                />
              </div>
              <Input
                type="text"
                label="Remarks"
                name="indicomp_remarks"
                value={donor.indicomp_remarks}
                onChange={(e) => onInputChange(e)}
              />
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Promoter <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Promoter"
                  name="indicomp_promoter"
                  value={donor.indicomp_promoter}
                  onChange={(e) => onInputChange(e)}
                  required
                >
                  {promoter.map((option) => (
                    <MenuItem
                      key={option.indicomp_promoter}
                      value={option.indicomp_promoter}
                    >
                      {option.indicomp_promoter}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {donor.indicomp_promoter === "Other" && (
                <Input
                  type="text"
                  label="Promoter"
                  name="indicomp_newpromoter"
                  value={donor.indicomp_newpromoter}
                  onChange={(e) => onInputChange(e)}
                />
              )}
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Belong To <span className="text-red-700"></span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Belong To"
                  name="indicomp_belongs_to"
                  value={donor.indicomp_belongs_to}
                  onChange={(e) => onInputChange(e)}
                >
                  {belongs_to.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Source <span className="text-red-700"></span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Source"
                  name="indicomp_source"
                  value={donor.indicomp_source}
                  onChange={(e) => onInputChange(e)}
                >
                  {datasource.map((option) => (
                    <MenuItem key={option.id} value={option.data_source_type}>
                      {option.data_source_type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Donor Type <span className="text-red-700"></span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Donor Type"
                  name="indicomp_donor_type"
                  value={donor.indicomp_donor_type}
                  onChange={(e) => onInputChange(e)}
                >
                  {donor_type.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Input
                type="text"
                label="Type"
                name="indicomp_type"
                disabled
                value={donor.indicomp_type}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>

          {/* Communication Details Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Communication Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input
                type="tel"
                label="Mobile Phone"
                name="indicomp_mobile_phone"
                value={donor.indicomp_mobile_phone}
                onChange={(e) => onInputChange(e)}
                maxLength={10}
                required
              />

              <Input
                type="tel"
                label="WhatsApp"
                name="indicomp_mobile_whatsapp"
                value={donor.indicomp_mobile_whatsapp}
                onChange={(e) => onInputChange(e)}
                maxLength={10}
              />

              <Input
                type="email"
                label="Email"
                name="indicomp_email"
                value={donor.indicomp_email}
                onChange={(e) => onInputChange(e)}
              />

              <Input
                type="text"
                label="Website"
                name="indicomp_website"
                value={donor.indicomp_website}
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </div>

          {/* Residence Address Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Residence Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                type="text"
                label="House & Street Number"
                name="indicomp_res_reg_address"
                value={donor.indicomp_res_reg_address}
                onChange={(e) => onInputChange(e)}
              />

              <Input
                type="text"
                label="Area"
                name="indicomp_res_reg_area"
                value={donor.indicomp_res_reg_area}
                onChange={(e) => onInputChange(e)}
              />

              <Input
                type="text"
                label="Landmark"
                name="indicomp_res_reg_ladmark"
                value={donor.indicomp_res_reg_ladmark}
                onChange={(e) => onInputChange(e)}
              />

              <Input
                type="text"
                label="City"
                name="indicomp_res_reg_city"
                value={donor.indicomp_res_reg_city}
                onChange={(e) => onInputChange(e)}
                required
              />

              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    State <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="State"
                  name="indicomp_res_reg_state"
                  value={donor.indicomp_res_reg_state}
                  onChange={(e) => onInputChange(e)}
                  required
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.state_name}>
                      {state.state_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Input
                type="text"
                label="Pincode"
                name="indicomp_res_reg_pin_code"
                value={donor.indicomp_res_reg_pin_code}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
                required
              />
            </div>
          </div>

          {/* Office Address Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Office Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                type="text"
                label="Office & Street Number"
                name="indicomp_off_branch_address"
                value={donor.indicomp_off_branch_address}
                onChange={(e) => onInputChange(e)}
              />

              <Input
                type="text"
                label="Area"
                name="indicomp_off_branch_area"
                value={donor.indicomp_off_branch_area}
                onChange={(e) => onInputChange(e)}
              />

              <Input
                type="text"
                label="Landmark"
                name="indicomp_off_branch_ladmark"
                value={donor.indicomp_off_branch_ladmark}
                onChange={(e) => onInputChange(e)}
              />

              <Input
                type="text"
                label="City"
                name="indicomp_off_branch_city"
                value={donor.indicomp_off_branch_city}
                onChange={(e) => onInputChange(e)}
              />

              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    State <span className="text-red-700"></span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="State"
                  name="indicomp_off_branch_state"
                  value={donor.indicomp_off_branch_state}
                  onChange={(e) => onInputChange(e)}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.state_name}>
                      {state.state_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Input
                type="text"
                label="Pincode"
                name="indicomp_off_branch_pin_code"
                value={donor.indicomp_off_branch_pin_code}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
              />

              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Correspondence Preference{" "}
                    <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Correspondence Preference"
                  name="indicomp_corr_preffer"
                  value={donor.indicomp_corr_preffer}
                  onChange={(e) => onInputChange(e)}
                  required
                >
                  {corrpreffer.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Submitting..." : "Submit"}
            </Button>
            <Button type="button" className="bg-green-500 hover:bg-green-700">
              Back
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddIndivisual;