import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import { toast } from 'react-toastify';
import { DONOR_CHANGE_PROMOTER_UPDATE_SUMBIT } from '../../../api';

const ChangePromoter = () => {
  const [promoter, setPromoters] = useState([]);
  const [changePromoter, setChangePromoter] = useState({
    new_promoter: "",
    old_promoter: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const onInputChange = (e) => {
    setChangePromoter({
      ...changePromoter,
      [e.target.name]: e.target.value,
    });
  };

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
      console.error("Error fetching promoter data", error);
      toast.error("Failed to fetch promoters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoter();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const form = document.getElementById("changePromoterForm");
    if (!form.checkValidity()) {
      form.reportValidity();
      toast.error("Please fill all required fields");
      return;
    }
    
    if (changePromoter.new_promoter === changePromoter.old_promoter) {
      toast.error("New promoter must be different from old promoter");
      return;
    }

    const data = {
      new_promoter: changePromoter.new_promoter,
      old_promoter: changePromoter.old_promoter,
    };

    setIsUpdating(true);
    try {
      const response = await axios({
        url: DONOR_CHANGE_PROMOTER_UPDATE_SUMBIT,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        setChangePromoter({
          new_promoter: "",
          old_promoter: "",
        });
      } else if (response.data.code === 400) {
        toast.error(response.data.msg);
      } else {
        toast.error("Unexpected Error");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update promoter");
    } finally {
      setIsUpdating(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect = "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";

  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-black text-lg flex flex-row gap-2 items-center rounded-xl p-2">
            <span>Change Promoter</span>
          </h2>
        </div>
        
        <div className="p-4">
          <form id="changePromoterForm" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FormLabel required>Old Promoter</FormLabel>
                <select
                  name="old_promoter"
                  value={changePromoter.old_promoter}
                  onChange={onInputChange}
                  required
                  disabled={loading || isUpdating}
                  className={inputClassSelect}
                >
                  <option value="">Select Old Promoter</option>
                  {promoter.map((option) => (
                    <option
                      key={option.indicomp_promoter}
                      value={option.indicomp_promoter}
                    >
                      {option.indicomp_promoter}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <FormLabel required>New Promoter</FormLabel>
                <select
                  name="new_promoter"
                  value={changePromoter.new_promoter}
                  onChange={onInputChange}
                  required
                  disabled={loading || isUpdating}
                  className={inputClassSelect}
                >
                  <option value="">Select New Promoter</option>
                  {promoter.map((option) => (
                    <option
                      key={option.indicomp_promoter}
                      value={option.indicomp_promoter}
                    >
                      {option.indicomp_promoter}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-start py-4">
              <button
                type="submit"
                className={`text-center text-sm font-[400] w-36 text-white p-2 rounded-lg shadow-md ${
                  isUpdating || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-green-700 cursor-pointer"
                }`}
                onClick={handleSubmit}
                disabled={isUpdating || loading}
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ChangePromoter