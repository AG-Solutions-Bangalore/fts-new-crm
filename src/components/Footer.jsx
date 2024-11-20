import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ContextPanel } from "../utils/ContextPanel";

const Footer = () => {
 const {currentYear} = useContext(ContextPanel)

 
  return (
    <>

     <div className="bg-[#FFFFFF]  rounded-lg shadow-sm p-2   ">
     
       
       <div className=" flex flex-row items-center justify-between">
         <h2 className="text-xs  text-gray-600 ">
         Current Year : {currentYear}
         </h2>
         <p className="text-xs  text-gray-600 ">
         Handcrafted with love by <Link to='https://ag-solutions.in/' target="_blank" className="text-blue-800" >AG Solutions</Link>.
         </p>
      
     </div>
   </div>
   </>
  );
};

export default Footer;
