import React, { useState } from "react";
import Layout from "../../layout/Layout";



const Form = () => {
  const [formData, setFormData] = useState({
    successInput: '',
    errorInput: '',
    errorTextInput: '',
    gender: '',
    country: '',
    selectedOption: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const countries = [
    { value: 'india', label: 'India' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'srilanka', label: 'Sri Lanka' }
  ];

  const genders = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' }
  ];

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-gray-700 mb-1 mt-6">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  return (
    <Layout>
   
      <div className="w-full ">
        <form className="bg-white shadow-md rounded-lg p-6 ">
          {/* Success Input */}
          <div>
            <FormLabel required>Success Input</FormLabel>
            <input
              type="text"
              name="successInput"
              value={formData.successInput}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500"
              required
            />
          </div>

          {/* Error Input */}
          <div>
            <FormLabel required>Error Input</FormLabel>
            <input
              type="text"
              name="errorInput"
              value={formData.errorInput}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-red-500 border-red-500"
              required
            />
          </div>

          {/* Input with Error Text */}
          <div>
            <FormLabel required>Input with Error Text</FormLabel>
            <input
              type="text"
              name="errorTextInput"
              value={formData.errorTextInput}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-red-500 border-red-500"
              required
            />
            <p className="mt-1 text-sm text-red-600">Incorrect entry.</p>
          </div>

          {/* Gender Select */}
          <div>
            <FormLabel>Gender</FormLabel>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500"
            >
              <option value="">Select gender</option>
              {genders.map(gender => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>
          </div>

          {/* Country Select */}
          <div>
            <FormLabel>Country</FormLabel>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          {/* Radio Options */}
          <div>
            <FormLabel>Options</FormLabel>
            <div className="space-y-2">
              {['option1', 'option2', 'option3'].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="selectedOption"
                    value={option}
                    checked={formData.selectedOption === option}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-24 mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    
    </Layout>
  );
};

export default Form;
