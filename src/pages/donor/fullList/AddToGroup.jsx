import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import { FaEye, FaEdit, FaTicketAlt, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../base/BaseUrl";
const TABLE_HEAD = ["Name", "Phone", "Actions"];
const AddToGroup = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          url: `${BASE_URL}/api/fetch-donors`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const formattedData = response.data.individualCompanies.map(
          (donor) => ({
            name: donor.indicomp_full_name,
            phone: donor.indicomp_mobile_phone,
            id: donor.indicomp_related_id,
          })
        );

        setDonorData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addMemberToGroup = async (relativeId) => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/update-donor/${id}`,
        method: "PUT",
        data: {
          indicomp_related_id: relativeId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Successfully added to group");
      navigate("/donor-list");
    } catch (error) {
      console.error("Error adding member to group:", error);
      toast.error("Failed to add member to group");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-56">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div>
      <Card className="h-56 w-full overflow-scroll custom-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-2"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donorData.map(({ name, phone, id }, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                <td className="p-2">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name}
                  </Typography>
                </td>
                <td className="p-2">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {phone}
                  </Typography>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => addMemberToGroup(id)}
                    className="flex items-center text-sm gap-1 p-1 bg-blue-500 hover:bg-red-500 text-white rounded-lg  transition-colors"
                  >
                    <FaPlus className="h-2 w-2" />
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AddToGroup;
