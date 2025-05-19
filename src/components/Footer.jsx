import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = localStorage.getItem("currentYear") || new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-600 font-medium">
            © {currentYear} All Rights Reserved
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <p className="text-xs text-gray-800">
            Crafted with <span className="text-red-500">❤️</span> by{" "}
            <Link 
              to="https://ag-solutions.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              AG Solutions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;