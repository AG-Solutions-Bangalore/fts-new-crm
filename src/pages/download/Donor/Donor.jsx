import Layout from "../../../layout/Layout";
import { useState } from "react";
import SelectInput from "../../../components/common/SelectInput";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";

function Donor() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const DonorTypes = [
    {
      value: "Member",
      label: "Member",
    },
    {
      value: "Donor",
      label: "Donor",
    },
    {
      value: "Member+Donor",
      label: "Member+Donor",
    },
    {
      value: "None",
      label: "None",
    },
  ];

  const DonorType = [
    {
      value: "Member",
      label: "Member",
    },
    {
      value: "Donor",
      label: "Donor",
    },
    {
      value: "Member+Donor",
      label: "Member+Donor",
    },
    {
      value: "None",
      label: "PSU",
    },
    {
      value: "Trust",
      label: "Trust",
    },
    {
      value: "Society",
      label: "Society",
    },
    {
      value: "Others",
      label: "Others",
    },
  ];
  const [downloadDonor, setDonorDownload] = useState({
    indicomp_type: "",
    indicomp_donor_type: "",
  });
  //ONCHANGE
  const onInputChange = (e) => {
   
    const { name, value } = e.target;
    setDonorDownload({
      ...downloadDonor,
      [name]: value,
    });
  };
  //SUBMIT
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      indicomp_type: downloadDonor.indicomp_type,
      indicomp_donor_type: downloadDonor.indicomp_donor_type,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    e.preventDefault();
    if (v) {
      setIsButtonDisabled(true);

      axios({
        url: BASE_URL + "/api/download-donor",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "donor_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Donor is Downloaded Successfully");
          setDonorDownload({ indicomp_type: "", indicomp_donor_type: "" });
          setIsButtonDisabled(false);
        })
        .catch((err) => {
          toast.error("Donor is Not Downloaded");
          setIsButtonDisabled(false);
        });
    }
  };

  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row gap-2 items-center  rounded-xl p-2 ">
            {/* <IconInfoCircle className="w-4 h-4" /> */}
            <span>Download Donors</span>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <h3 className="text-red-500 mb-5">
            Leave blank if you want all records.
          </h3>

          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <SelectInput
                label="Category"
                name="indicomp_donor_type"
                value={downloadDonor.indicomp_donor_type}
                options={DonorTypes}
                onChange={onInputChange}
                placeholder="Select Category"
              />
              <SelectInput
                label="Source"
                name="indicomp_type"
                value={downloadDonor.indicomp_type}
                options={DonorType}
                onChange={onInputChange}
                placeholder="Select Source"
              />
            </div>

            <div className="flex justify-start py-4">
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                {" "}
                {isButtonDisabled ? "Downloading..." : "Download"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Donor;
