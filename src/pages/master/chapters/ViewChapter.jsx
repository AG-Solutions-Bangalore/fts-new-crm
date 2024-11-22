import { Dialog, FormLabel, SwipeableDrawer, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import {
  IconArrowBack,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import SelectInput from "../../../components/common/SelectInput";
const UserDrop = [
  {
    value: "1",
    label: "User",
  },
  {
    value: "2",
    label: "Admin",
  },
  // {
  //   value: "4",
  //   label: "Viewer",
  // },
];

const ViewChapter = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [student, setStudent] = useState({});
  const [individualDrawer, setIndividualDrawer] = useState(false);
  const toggleIndividualDrawer = (open) => () => {
    setIndividualDrawer(open);
  };
  const [chapter, setChapter] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    user_type_id: "",
  });
  const [selected_user_id, setSelectedUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [error, setError] = useState("");

  const handleClose = (e) => {
    setOpen(false);
    setIndividualDrawer(false);
  };

  const handleClickOpen1 = (e) => {
    setOpen1(true);
  };

  const handleClose1 = (e) => {
    e.preventDefault();
    setOpen1(false);
    setIndividualDrawer(false);
    setUser({
      name: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      confirm_password: "",
      user_type_id: "",
    });
  };
  const fetchData = () => {
    axios
      .get(`${BASE_URL}/api/fetch-chapter-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setChapter(res.data.chapter);
        setUsers(res.data.users);
      });
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const onUserInputChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
    if (name === "confirm_password") {
      if (value && value !== user.password) {
        setError("Passwords do not match");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (user.password !== user.confirm_password) {
      setError("!Passwords do not match");
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      name: user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      user_type: user.user_type_id,
      chapter_id: chapter.chapter_code,
    };
    console.log("data", formData);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/create-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // setUsers(response.data.users);
        fetchData();

        handleClose();
        toast.success("User is Created Successfully");
        setUser({
          name: "",
          email: "",
          first_name: "",
          last_name: "",
          phone: "",
          password: "",
          confirm_password: "",
          user_type_id: "",
        });
      } else {
        toast.error("User Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating User:", error);
      toast.error("Error updating User");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Check if form is valid
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);

    const formData = {
      name: user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      user_type: user.user_type_id,
      chapter_id: user.chapter_code,
    };

    try {
      // Send PUT request
      const response = await axios.put(
        `${BASE_URL}/api/update-user/${selected_user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.users);
        toast.success("User is Updated Successfully");
        handleClose1(e);
      } else {
        toast.error("User Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating User:", error);
      toast.error("Error updating User");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const columns = [
    {
      accessorKey: "first_name",
      header: "Name",
    },

    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "edit",
      header: "Edit",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            className=" text-center  w-20 text-sm font-[400 ] cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
            onClick={() => {
              setUser({
                ...user,
                name: row.original.name,
                email: row.original.email,
                phone: row.original.phone,
                first_name: row.original.first_name,
                last_name: row.original.last_name,
                user_type_id: row.original.user_type_id,
              });
              setSelectedUserId(row.original.id);
              handleClickOpen1();
            }}
          >
            Edit
          </button>
        </div>
      ),
    },
    {
      accessorKey: "school",
      header: "School",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            className=" text-center  w-20 text-sm font-[400 ] cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
            onClick={() => {
              localStorage.setItem("schoolId", id);

              navigate(`/view-school/${row.original.id}`);
            }}
          >
            School
          </button>
        </div>
      ),
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: users,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableHiding: false,
  });

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2   border-b-2 border-green-500 rounded-t-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Chapter Details</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/master/chapters")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>

        <div className="p-4 bg-red-50 rounded-b-xl">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-black">
                {chapter.chapter_name}
              </h3>
              <p className="text-xs font-semibold text-black">
                State :{chapter.chapter_state}
              </p>
              <p className="text-xs font-semibold text-black">
                City : {chapter.chapter_city}
              </p>
              <p className="text-xs font-semibold text-black">
                {chapter.mobile_device}
              </p>
              <p className="text-xs font-semibold text-black">
                PIN : {chapter.chapter_pin}
              </p>
            </div>
            <div className="space-y-1 relative">
              <p className="   text-xs font-semibold text-black">
                {chapter.chapter_date_of_incorporation}
              </p>
              <p className="   text-xs font-semibold text-black">
                Phone : {chapter.chapter_phone}{" "}
              </p>
              <p className="text-xs font-semibold text-black">
                {" "}
                What's App : {chapter.chapter_whatsapp}{" "}
              </p>
              <p className="text-xs font-semibold text-black">
                {" "}
                Email: {chapter.chapter_email}{" "}
              </p>
              <p className="text-xs font-semibold text-black">
                {" "}
                {chapter.chapter_website}{" "}
              </p>
              <p className="text-xs font-semibold text-black">
                {" "}
                Address : {chapter.chapter_address}
              </p>
            </div>{" "}
          </div>
        </div>

        <div className="sticky top-0 p-2   border-b-2 border-green-500 rounded-t-lg  bg-[#E1F5FA] mt-2 ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconArrowBack
                className="cursor-pointer hover:text-red-600"
                onClick={() => navigate("/master/chapters")}
              />
              <span>User Details</span>
            </div>

            <button
              className=" text-center  w-36 text-sm font-[400 ] cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
              onClick={toggleIndividualDrawer(true)}
            >
              Create New User
            </button>
          </h2>
        </div>
        <MantineReactTable table={table} />

        <SwipeableDrawer
          anchor="right"
          open={individualDrawer}
          onClose={toggleIndividualDrawer(false)}
          onOpen={toggleIndividualDrawer(true)}
          style={{
            backdropFilter: "blur(5px) sepia(5%)",
          }}
        >
          <form onSubmit={createUser} autoComplete="off">
            <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] ">
              <div>
                <div className="sticky top-0 p-2   border-b-2 border-green-500 rounded-t-lg  bg-[#E1F5FA] ">
                  <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
                    <div className="flex  items-center gap-2">
                      <IconInfoCircle className="w-4 h-4" />
                      <span>Create User</span>
                    </div>
                    <IconCircleX
                      onClick={handleClose}
                      className="cursor-pointer hover:text-red-600"
                    />
                  </h2>
                </div>

                <hr />

                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                    <div>
                      <FormLabel required>Enter Username</FormLabel>
                      <input
                        name="name"
                        value={user.name}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <FormLabel required>Enter Email</FormLabel>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Enter Full Name</FormLabel>
                      <input
                        name="first_name"
                        value={user.first_name}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Enter Phone Number</FormLabel>
                      <input
                        type="text"
                        name="phone"
                        value={user.phone}
                        onChange={(e) => {
                          const phone = e.target.value;
                          // Only update the value if it consists of digits and doesn't exceed length of 10
                          if (/^\d*$/.test(phone) && phone.length <= 10) {
                            onUserInputChange(e);
                          }
                        }}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="form-group ">
                      <SelectInput
                        label="Select User Type"
                        options={UserDrop}
                        name="user_type_id"
                        value={user.user_type_id}
                        onChange={(e) => onUserInputChange(e)}
                        placeholder="Select  User Type"
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Enter Password</FormLabel>
                      <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <FormLabel required>Confirm Password</FormLabel>
                      <input
                        type="password"
                        name="confirm_password"
                        value={user.confirm_password}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                      {error && <p className="text-red-600 text-sm">{error}</p>}
                    </div>
                  </div>
                  <div className="mt-5 flex justify-center">
                    <button
                      disabled={isButtonDisabled}
                      type="submit"
                      className=" text-center  w-36 text-sm font-[400 ] cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                    >
                      {isButtonDisabled ? "SUbmiting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </SwipeableDrawer>

        {/* Edit User  */}

        <Dialog
          open={open1}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
          sx={{
            backdropFilter: "blur(5px) sepia(5%)",
            "& .MuiDialog-paper": {
              borderRadius: "18px",
            },
          }}
        >
          <form onSubmit={updateUser} autoComplete="off">
            <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-slate-800 text-xl font-semibold">
                    Edit a User
                  </h1>
                  <div className="flex">
                    <Tooltip title="Close">
                      <button className="ml-3 pl-2 " onClick={handleClose1}>
                        <IconCircleX />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                    <div>
                      <FormLabel required>Enter Username</FormLabel>
                      <input
                        name="name"
                        value={user.name} // Ensure the value is bound to user.name
                        onChange={(e) => onUserInputChange(e)} // Handle change
                        className={inputClass}
                        required
                        disabled
                      />
                    </div>
                    <div>
                      <FormLabel required>Enter Email</FormLabel>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Enter Full Name</FormLabel>
                      <input
                        name="first_name"
                        value={user.first_name}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Enter Phone Number</FormLabel>
                      <input
                        type="text"
                        maxLength={10}
                        name="phone"
                        value={user.phone}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="form-group ">
                      <SelectInput
                        label="Select User Type"
                        options={UserDrop}
                        name="user_type_id"
                        value={user.user_type_id}
                        onChange={(e) => onUserInputChange(e)}
                        placeholder="Select  User Type"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-center">
                    <button
                      disabled={isButtonDisabled}
                      type="submit"
                      className=" text-center w-36 text-sm font-[400 ] cursor-pointer hover:animate-pulse  text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                    >
                      {isButtonDisabled ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ViewChapter;
