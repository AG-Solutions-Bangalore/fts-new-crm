import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import BASE_URL from "../../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconInfoCircle } from "@tabler/icons-react";
import moment from "moment";
import { MEMBERSHIP_DETAILS_LIST } from "../../../../api";

const MembershipDetails = ({ viewerId }) => {
  const [loader, setLoader] = useState(false);
  const [membership, setMembership] = useState([]);

  const fetchMemberShipDetails = async () => {
    try {
      setLoader(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${MEMBERSHIP_DETAILS_LIST}/${viewerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembership(response.data.membership_details);
    } catch (error) {
      console.error("Error fetching Membership details list data", error);
    } finally {
      setLoader(false);
    }
  };

  
  useEffect(() => {
    if(viewerId){
      fetchMemberShipDetails()
    }   
    }, [viewerId]);


  

  const columns = useMemo(
    () => [
      {
        accessorKey: "receipt_no",
        header: "Receipt No",
        size: 50,
      },

      {
        accessorKey: "individual_company.indicomp_full_name",
        header: "Full Name",
        size: 50,
        Cell:({row})=>{
            const fullName = row.original.individual_company.indicomp_full_name
            return fullName
        }
      },
      {
        accessorKey: "receipt_date",
        header: "Date",

        Cell: ({ row }) => {
          const date = row.original.receipt_date;
          return moment.utc(date).format("DD-MM-YYYY");
        },
      },
      {
        accessorKey: "receipt_total_amount",
        header: "Amount",
        size: 50,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: membership || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
  });
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white shadow-md rounded-xl ">
        <div className="bg-[#E1F5FA] p-4 rounded-t-xl border-b-2 border-green-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <IconInfoCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-sm font-semibold text-black">
                Membership Details
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className=" shadow-md">
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default MembershipDetails;
