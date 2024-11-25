import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userTypeId = localStorage.getItem("user_type_id");
  const [currentYear, setCurrentYear] = useState("");

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentYear(response.data?.year?.current_year || "");
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };
    fetchYearData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPath = [
          "/home",
          "/form",
          "/profile",
          "/change-password",
          //superrecepit
          "/recepit-sup",
          //guidebook
          "/manualguide-book",
          // donor
          "/donor-list",
          "/add-indivisual",
          "/add-company",
          "/member-list",
          "/donor-view",
          "/receipt-details",
          "/receipt-list",
          "/donor-edit",
          "/receipt-view",
          "/viewer-list",
          "/add-viewer",
          "/edit-viewer",
          "/duplicate-list",
          "/create-receipts",
          "/duplicate-edit",
          //master
          "/master/chapters",
          "/edit-chapter",
          "/edit-datasource",
          "/master/states",
          "/master/designation",
          "/master/expensive-type",
          "/master/faqList",
          "/view-chapter",
          "/view-school",
          //chapters
          "/chapter",
          "/chapter/view-shool",
          //datasoucre
          "/datasource",
          // receipt
          "/receipt-list",
          "/receipt-edit",
          "/view-receipts",
          ///downloads
          "/download/receipts",
          "/download/donor",
          "/download/school",
          "/download/ots",
          "/download/team",
          "/download/allrecepit",
          // REPORT
          "/report/donorsummary",
          "/report/recepit",
          "/report/promoter",
          "/report/donation",
          "/report/school",
          "/report/otg",
          "/report/payment",
          "/report/suspense",
          //report view
          "/d-summary-view",
          "/report-donation-view",
          "/recepit-summary-view",
          "/recepit-otg-view",
          "/recepit-nopan-view",
          "/recepit-group-view",
          "/report/payment-view",
          "/report/donor-view",
          "/report/donorgroup-view",
          "/report/schoolview",
          //students
          "/students-full-list",
          "/students-to-allot",
          "/students-report-donor",
          "/students-full-list-view",
          "/students-addschoolalot",
          "/students-schoolallot",
          "/repeat-donor-allot",
          "/students-allotedit",
          "/students-allotview",
          "/students-report-donor",
          "/students-allotletter",
          "/students-schoolallot",
          "/students-allotedit",

          // other
          "/faq",
          "/team",
          "/notification",
        ];

        const isAllowedPath = allowedPath.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
          navigate(currentPath + location.search);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password" ||
          currentPath === "/sign-up-page"
        ) {
          navigate(currentPath);
        } else {
          navigate("/"); // Redirect to login if no token
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider
      value={{ isPanelUp, setIsPanelUp, userTypeId, currentYear }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
