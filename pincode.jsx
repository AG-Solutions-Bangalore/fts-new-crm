import React, { useState } from 'react'
import axios from 'axios';
const PincodeChecker = () => {
    const [fromPincode, setFromPincode] = useState('');
    const [toPincode, setToPincode] = useState('');
    const [distance, setDistance] = useState('');

    const getDistance = async () => {
        
        if (!/^\d{6}$/.test(fromPincode) || !/^\d{6}$/.test(toPincode)) {
          setDistance('Error: Invalid pincode format. Please enter a valid 6-digit Indian pincode.');
          return;
        }
    
        const data = new FormData();
        data.append('pincode1', fromPincode);
        data.append('pincode2', toPincode);
    
        const options = {
          method: 'POST',
          url: 'https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/distance',
          headers: {
            'x-rapidapi-key': '0f81ae5b8bmsha72eecdec16b1e7p17c937jsnab541b3724f9',
            'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
          },
          data: data
        };
    
        try {
          const response = await axios.request(options);
          console.log("data response",response.data.distance)
      
        setDistance(`The distance between pincode ${fromPincode} and ${toPincode} is ${(response.data.distance / 1000).toFixed(2)} km.`);
        } catch (error) {
          setDistance('Error: Unable to fetch distance.');
          console.error(error);
        }
      };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">India Pincode Distance Lookup</h1>
      <input
        type="text"
        id="fromPincode"
        placeholder="From Pincode"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        value={fromPincode}
        onChange={(e) => setFromPincode(e.target.value)}
      />
      <input
        type="text"
        id="toPincode"
        placeholder="To Pincode"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        value={toPincode}
        onChange={(e) => setToPincode(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        onClick={getDistance}
      >
        Get Distance
      </button>
      {distance && <div className="mt-4 font-bold text-center">{distance}</div>}
    </div>
  </div>
  )
}

export default PincodeChecker