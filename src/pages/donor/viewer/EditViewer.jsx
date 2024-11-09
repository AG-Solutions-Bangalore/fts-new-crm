import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from '../../../layout/Layout'
import BASE_URL from '../../../base/BaseUrl';
import axios from "axios";
import { IoPersonAdd } from "react-icons/io5";
import { Button, Input } from "@material-tailwind/react";
import { MenuItem, TextField } from "@mui/material";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "react-toastify";
const EditViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [viewerId, setID] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [viewerChapterIds, setViewerChapterIds] = useState([]);
    const [chapterIds, setChapterIds] = useState("");
    const [chapter_id, setchapter_id] = useState("");
    const [user_position, setuser_position] = useState([]);
    const [loader, setLoader] = useState(true);
    const [viewer, setViewer] = useState({});
  
    const [chapters, setChapters] = useState([]);
    const [currentViewerChapterIds, setCurrentViewerChapterIds] = useState([]);
  
    const handleClick = (e) => {
      var targetName = e.target.name;
  
      if (e.target.checked == true) {
        var temparray = viewerChapterIds;
        temparray.push(e.target.name);
        setViewerChapterIds(temparray);
      } else {
        var temparray = viewerChapterIds;
  
        temparray.splice(temparray.indexOf(targetName), 1);
        setViewerChapterIds(temparray);
      }
  
      var theChapterIds = "";
      for (var i = 0; i < viewerChapterIds.length; i++) {
        theChapterIds = theChapterIds + "," + viewerChapterIds[i];
      }
  
      setChapterIds(theChapterIds);
    };
  
    const onFirstNameChange = (e) => {
      setFirstName(e.target.value);
    };
  
    const onLastNameChange = (e) => {
      setLastName(e.target.value);
    };
  
    const onUserNameChange = (e) => {
      setUserName(e.target.value);
    };
  
    const validateOnlyDigits = (inputtxt) => {
      var phoneno = /^\d+$/;
      if (inputtxt.match(phoneno) || inputtxt.length == 0) {
        return true;
      } else {
        return false;
      }
    };
  
    const onContactChange = (e) => {
      if (e.target.name == "mobile_number") {
        if (validateOnlyDigits(e.target.value)) {
          setContact(e.target.value);
        }
      } else {
        setContact(e.target.value);
      }
    };
  
    const onEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const onStartDateChange = (e) => {
      setStartDate(e.target.value);
    };
  
    const onEndDateChange = (e) => {
      setEndDate(e.target.value);
    };
  
    const onuser_positionChange = (e) => {
      setuser_position(e.target.value);
    };
  
    const onuser_chapteridChange = (e) => {
      setchapter_id(e.target.value);
    };
  
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("id");
      if (!isLoggedIn) {
        window.location = "/signin";
      } else {
      }
  
      var theLoginToken = localStorage.getItem("token");
  
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + theLoginToken,
        },
      };
  
      fetch(BASE_URL + "/api/fetch-chapters", requestOptions)
        .then((response) => response.json())
        .then((data) => setChapters(data.chapters));
    }, []);
  
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("id");
      if (!isLoggedIn) {
        window.location = "/signin";
      } else {
      }
      axios({
        url: BASE_URL + "/api/fetch-viewer-by-id/" + id,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        console.log("editdon", res.data);
        setTheViewer(res.data.users);
        setLoader(false);
      });
    }, []);
  
    const setTheViewer = (users) => {
      setID(users.id);
      setFirstName(users.first_name);
      setLastName(users.last_name);
      setUserName(users.name);
      setEmail(users.email);
      setContact(users.phone);
      setuser_position(users.user_position);
      setStartDate(users.viewer_start_date);
      setEndDate(users.viewer_end_date);
      setChapterIds(users.viewer_chapter_ids);
      setchapter_id(users.chapter_id);
      var res = users.viewer_chapter_ids.split(",");
  
      var tempChapterIds = [];
  
      for (var i = 0; i < res.length; i++) {
        tempChapterIds.push(res[i]);
      }
  
      setCurrentViewerChapterIds(tempChapterIds);
    };
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
  
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = document.getElementById("addIndiv");
      if (!form.checkValidity()) {
        toast.error("Fill all required");
        return;
      }
      const data = {
        id:viewerId,  
        first_name: firstName, 
        last_name: lastName,  
        chapter_id:chapter_id,
        name: userName,
        mobile_number: contact,
        email: email,
        viewer_start_date: startDate,
        viewer_end_date: endDate,
        chapter_ids_comma_separated:chapterIds,
        user_position:user_position
      };
  
      setIsButtonDisabled(true);
      const token = localStorage.getItem("token");
  
      const res = await axios.post(
        `${BASE_URL}/api/update-viewer`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Viewer Edited Succesfully");
      navigate("/viewer-list")
  
  
      setIsButtonDisabled(false);
    };

    
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
   <Layout>
       <div className="bg-[#FFFFFF] p-2    rounded-lg">
       
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Edit Viewer</span>
          </div>
          <IconArrowBack
            onClick={() => navigate('/viewer-list')}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
      <hr />

       
          <form id="addIndiv" onSubmit={handleSubmit} className="w-full max-w-7xl  rounded-lg mx-auto p-6 space-y-8 ">
           <div>
           <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Viewer Details</span>
          </h2>
         
             <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
         

         <div>
           <FormLabel required>Full Name</FormLabel>
           <input
             type="text"
             name="firstName"
             value={firstName}
             onChange={(e) => onFirstNameChange(e)}
             className={inputClass}
             required
           />
         </div>

      

         <div>
           <FormLabel required>User Name (Login Name)</FormLabel>
           <input
             type="text"
             name="username"
             value={userName}
             onChange={(e) => onUserNameChange(e)}
             className={inputClass}
             required
           />
         </div>

        
         <div>
           <FormLabel required>Mobile</FormLabel>
           <input
             type="tel"
             name="mobile_number"
             value={contact}
             onChange={(e) => onContactChange(e)}
             className={inputClass}
             maxLength={10}
             required
           />
         </div>
        

         <div>
           <FormLabel required>Email</FormLabel>
           <input
             type="email"
             name="email"
             value={email}
             onChange={(e) => onEmailChange(e)}
             className={inputClass}
             required
           />
         </div>

        

         <div>
           <FormLabel>Chapter</FormLabel>
           <select
             name="chapter_id"
             value={chapter_id}
             onChange={(e) => onuser_chapteridChange(e)}
             className={inputClassSelect}
           >
             <option value="">Select Chapter</option>
             {chapters.map((chapter) => (
               <option key={chapter.id} value={chapter.id}>
                 {chapter.chapter_name}
               </option>
             ))}
           </select>
           <p className="text-xs text-gray-500 mt-1">
             Please select your Chapter
           </p>
         </div>

    
         <div>
           <FormLabel required>Designation</FormLabel>
           <input
             type="text"
             name="user_position"
             value={user_position}
             onChange={(e) => onuser_positionChange(e)}
             className={inputClass}
             required
           />
         </div>

       
         <div>
           <FormLabel>Start Date</FormLabel>
           <input
             name="startDate"
             type="date"
             value={startDate}
             onChange={(e) => onStartDateChange(e)}
             className={inputClass}
           />
         </div>

       
         <div>
           <FormLabel>End Date</FormLabel>
           <input
             name="endDate"
             type="date"
             value={endDate}
             onChange={(e) => onEndDateChange(e)}
             className={inputClass}
           />
         </div>
       </div>
           </div>

            <div >
            <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Chapters Associated</span>
          </h2>
              <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center gap-2">
                    {currentViewerChapterIds.includes(chapter.id+'') == true &&
                           <input type="checkbox" defaultChecked={true} onChange={handleClick} name={chapter.id} id={chapter.id}/>
                          }

                          {currentViewerChapterIds.includes(chapter.id+'') == false &&
                           <input type="checkbox" defaultChecked={false} onChange={handleClick} name={chapter.id} id={chapter.id}/>
                          }
                    <label
                      htmlFor={`chapter-${chapter.id}`}
                      className="text-sm"
                    >
                      {chapter.chapter_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-start">
            <Button
            type="submit"
            color="blue"
            disabled={isButtonDisabled}
            className="px-6 py-2"
          >
            {isButtonDisabled ? "Updating..." : "Update"}
          </Button>

              {/* <Link to="/">
                <Button color="red" className="px-6">
                  Cancel
                </Button>
              </Link> */}
            </div>
          </form>
       
      </div>
   </Layout>
  )
}

export default EditViewer