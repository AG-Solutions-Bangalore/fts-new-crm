import React from "react";
import { useNavigate } from "react-router-dom";

const PageTitle = ({ title, icon: Icon, backLink }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backLink === "-1") {
      navigate(-1);
    } else {
      navigate(backLink);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-black text-xl mt-4 mb-6">
      {Icon && (
        <div
          className="text-black cursor-pointer hover:text-red-600"
          onClick={handleBackClick}
        >
          <Icon className="text-black cursor-pointer hover:text-red-600" />
        </div>
      )}
      <div className=" text-black  ">{title}</div>
    </div>
  );
};

export default PageTitle;
