// import { useEffect, useState } from "react";

// import Layout from "../../layout/Layout";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Edit, Receipt } from "@mui/icons-material";
// import MUIDataTable from "mui-datatables";
// import { createTheme, CssBaseline } from "@mui/material";
// import { ThemeProvider } from "@mui/material";


// const Registration = () => {
//   const [donorData, setDonorData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   // const { isPanelUp } = useContext(ContextPanel);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchDonorData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`https://agsrb.online/api/public/api/fetch-donors`, {
//           headers: {
//             Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjcxOTI5MjVlMmFjNDliOWE1YjMyNTNmNGMyMmU2Y2VlNDI4MDliMDViYjdjOTY2OTYwZDEyNTM5NDk2NGE1MzBkYWVlN2Q2ZWM0ZTMwODQiLCJpYXQiOjE3MzA3MjYyOTEuMjAyNzc1OTU1MjAwMTk1MzEyNSwibmJmIjoxNzMwNzI2MjkxLjIwMjc3OTA1NDY0MTcyMzYzMjgxMjUsImV4cCI6MTc2MjI2MjI5MS4yMDA5Mjc5NzI3OTM1NzkxMDE1NjI1LCJzdWIiOiI3MiIsInNjb3BlcyI6W119.VMaOXV_chHBKTFfxnWR8JsfNtPhrnoYLVzAn8cFJbX8lrty4c6LbEoQBgWLVuNPxfBN-ziVR4yw_157-E-9sV43mobfNofqzgpC7gag7655Ir08c_NAfVvSJkVxkOhEkK03p5G8w4fAxuSWURyZyE2aJPUbhRebrFPbPZln_A3YMiBeCwumyaA_qT5bUZDqPni-KhlbsHJRtwnLqJJI_nx48-tiN0eOUOyfsYpd6_5xSTJivZRGQB9zqdiMzS-emrd34GGx69xkeKZSQiEYjiRCyUDYLdw0SpjPafw5o4_u3G5vSFS_Wzm4Pp4gRy0Q8wvTG08ELEkHeWzBOS0TKiT2vkS24Znp3UlnI5YIybAOBe1zHsqHojSn8ikAdiIZOOUBEpNDQU_5OrWDAPZ6r05iJAjSEHmasE1eiwGY_J8XApY_FQJc2spIap3R3kuEVlxNGbAPNCq7CnyJLHSwQNmkfWhRk8k0ozUIjKLvj9RcI1NSOlVHodm1rdrttjnup1ooWYhNIUV591UO7KuSePvuor6aILUWcInxiyWo137lH28-4b52Loej7mizUaHBwY1r7P9shJgR1m_MKLrpRTwb8uNjj6plOgS0ARV1age5TrUFWQRIzEbXFbqKg9vPD0EIeCAkSAJaJgcG5m21j0CcIfC_2WuLLpzo6x-gDR_0`,
//           },
//         });

//         setDonorData(response.data?.individualCompanies);
//       } catch (error) {
//         console.error("Error fetching Factory data", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDonorData();
//     setLoading(false);
//   }, []);

//   const columns = [
//     {
//       name: "slNo",
//       label: "SL No",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           return tableMeta.rowIndex + 1;
//         },
//       },
//     },

//     {
//       name: "indicomp_fts_id",
//       label: "Fts Id",
//       options: {
//         display: "included",
//         filter: true,
//         sort: false,
//       },
//     },
//     {
//       name: "indicomp_full_name",
//       label: "Full Name",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },
//     {
//       name: "indicomp_type",
//       label: "Type",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },

//     {
//       name: "indicomp_spouse_name",
//       label: "Spouse",
//       options: {
//         display: false,
//       },
//     },
//     {
//       name: "indicomp_com_contact_name",
//       label: "Contact",
//       options: {
//         display: false,
//       },
//     },
//     {
//       name: "spouse_contact",
//       label: "Spouse/Contact",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const indicompType = tableMeta.rowData[2]; // Assuming "Type" is the 3rd column (index 2)
//           const spouseName = tableMeta.rowData[3]; // Assuming "indicomp_spouse_name" is the 4th column (index 3)
//           const contactName = tableMeta.rowData[4]; // Assuming "indicomp_com_contact_name" is the 5th column (index 4)

//           if (indicompType === "Individual") {
//             return spouseName;
//           } else {
//             return contactName;
//           }
//         },
//       },
//     },

//     {
//       name: "indicomp_mobile_phone",
//       label: "Mobile",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },
//     {
//       name: "indicomp_email",
//       label: "Email",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },

//     {
//       name: "id",
//       label: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (id) => {
//           return (
//             <div className="flex gap-2">
//               <div
//                   onClick={() => navigate(`/donor-edit/${id}`)}
//                   className="flex items-center space-x-2"
//                 >
//                   <Edit title="Edit" className="h-5 w-5 cursor-pointer" />
//                 </div>
//                 <div
//                   onClick={() => navigate(`/create-receipts/${id}`)}
//                   className="flex items-center space-x-2"
//                 >
//                   <Receipt
//                     title="Reciept"
//                     className="h-5 w-5 cursor-pointer"
//                   />
//                 </div>
//             </div>
//           );
//         },
//       },
//     },
//   ];

//   const options = {
//     // selectableRows: "none",
//     filterType: "textField",
//     selectableRows: false,
//     elevation: 0,
//     responsive: "standard",
//     viewColumns: true,
//     download: false,
//     print: false,
   
    
  
//   };


//   const darkTheme = createTheme({
//     palette: {

//       background: {
       
//         paper: "#FFFFFF",   // Table background
//       },
//       text: {
//         primary: "#343F4F",  // White text
//       },
//     },
//   });

//   return (
//     <Layout>
//         <ThemeProvider theme={darkTheme}>
//         <div className=" flex justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
//           <h1 className="border-b-2  font-[400] border-dashed border-orange-800">Donor List</h1>
//          <div className="flex gap-2">
//          <Link
//             to="/add-indivisual"
//             className=" text-center text-sm font-[400 ] md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
//           >
//             + Individual
//           </Link>
//           <Link
//             to="/add-company"
//             className=" text-center  text-sm font-[400 ] md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
//           >
//             + Company
//           </Link>
//          </div>
//         </div>
//        <div className="shadow-md" >
//         <MUIDataTable
//           // title={'Donor List'}
//           data={donorData ? donorData : []}
//           columns={columns}
//           options={options}
//         />
//       </div>
//       </ThemeProvider>
//     </Layout>
//   );
// };

// export default Registration;
