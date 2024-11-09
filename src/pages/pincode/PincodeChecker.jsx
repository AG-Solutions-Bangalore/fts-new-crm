import React, { useState } from 'react'
import axios from 'axios';
const PincodeChecker = () => {
    const [fromPincodes, setFromPincodes] = useState('');
  const [toPincodes, setToPincodes] = useState('');
  const [distances, setDistances] = useState([]);
 
  const getDistances = async () => {
  
    const fromPincodeArray = fromPincodes.split(',').map(pincode => pincode.trim());
    const toPincodeArray = toPincodes.split(',').map(pincode => pincode.trim());

    
    if (fromPincodeArray.some(pincode => !/^\d{6}$/.test(pincode)) || toPincodeArray.some(pincode => !/^\d{6}$/.test(pincode))) {
      setDistances([{ error: 'Error: Invalid pincode format. Please enter valid 6-digit Indian pincodes.' }]);
      return;
    }

    const distancePromises = [];
    for (let i = 0; i < fromPincodeArray.length; i++) {
      const data = new FormData();
      data.append('pincode1', fromPincodeArray[i]);
      data.append('pincode2', toPincodeArray[i]);

      const options = {
        method: 'POST',
        url: 'https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/distance',
        headers: {
          'x-rapidapi-key': '0f81ae5b8bmsha72eecdec16b1e7p17c937jsnab541b3724f9',
          'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
        },
        data: data
      };

      distancePromises.push(
        axios.request(options).then(response => ({
          from: fromPincodeArray[i],
          to: toPincodeArray[i],
          distance: `${(response.data.distance / 1000).toFixed(2)} km`
        }))
      );
    }

    try {
      const distanceResults = await Promise.all(distancePromises);
      setDistances(distanceResults);
    } catch (error) {
      setDistances([{ error: 'Error: Unable to fetch distances.' }]);
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <div className="bg-green-100 p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">India Pincode Batch Distance Lookup</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="fromPincodes" className="block font-medium mb-2">From Pincodes</label>
            <textarea
              id="fromPincodes"
              placeholder="Enter comma-separated pincodes"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={fromPincodes}
              onChange={(e) => setFromPincodes(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="toPincodes" className="block font-medium mb-2">To Pincodes</label>
            <textarea
              id="toPincodes"
              placeholder="Enter comma-separated pincodes"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={toPincodes}
              onChange={(e) => setToPincodes(e.target.value)}
            ></textarea>
          </div>
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-4"
          onClick={getDistances}
        >
          Get Distances ( Don't use Aggresively: Free Plan)
        </button>
       
        {distances.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border text-left">From Pincode</th>
                  <th className="p-2 border text-left">To Pincode</th>
                  <th className="p-2 border text-center">Distance(km)</th>
                </tr>
              </thead>
              <tbody>
                {distances.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{item.from}</td>
                    <td className="p-2 border">{item.to}</td>
                    <td className="p-2 border text-center">{item.distance || item.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PincodeChecker