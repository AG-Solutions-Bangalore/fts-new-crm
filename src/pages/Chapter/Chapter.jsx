import { Dialog, FormLabel, SwipeableDrawer, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import {
  IconArrowBack,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import SelectInput from "../../components/common/SelectInput";
const committee_type = [
  {
    value: "President",
    label: "President",
  },
  {
    value: "Secretary",
    label: "Secretary",
  },
  {
    value: "Treasurer",
    label: "Treasurer",
  },
];
const UserDrop = [
  {
    value: "1",
    label: "User",
  },
  {
    value: "4",
    label: "Admin",
  },
];
const Chapter = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("chapter_id");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
  const [isButtonDisabled2, setIsButtonDisabled2] = useState(false);

  const [individualDrawer, setIndividualDrawer] = useState(false);
  const toggleIndividualDrawer = (open) => () => {
    setIndividualDrawer(open);
  };
  const [users, setUsers] = useState([]);
  const [chapter, setChapter] = useState({
    chapter_name: "",
    chapter_code: "",
    chapter_address: "",
    chapter_city: "",
    chapter_pin: "",
    chapter_state: "",
    chapter_phone: "",
    chapter_whatsapp: "",
    chapter_email: "",
    chapter_website: "",
    chapter_date_of_incorporation: "",
    chapter_region_code: "",
    auth_sign: "",
  });

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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const validateOnlyDigits = (value) => {
    return /^\d+$/.test(value);
  };
  const onInputChange = (e) => {
    if (e.target.name == "chapter_phone") {
      if (validateOnlyDigits(e.target.value)) {
        setChapter({
          ...chapter,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "chapter_whatsapp") {
      if (validateOnlyDigits(e.target.value)) {
        setChapter({
          ...chapter,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setChapter({
        ...chapter,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onInputChange1 = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setChapter({
      ...chapter,
      [name]: value,
    });
  };
  const handleClose = (e) => {
    setOpen(false);
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
  };

  const createUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled2(true);
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
        setUsers(response.data.users);
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
      setIsButtonDisabled2(false);
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
    setIsButtonDisabled1(true);

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

      // Check for successful response
      if (response.status === 200) {
        // console.log(response.data.users);
        // setUsers(response.data.users);
        toast.success("User is Updated Successfully");
        handleClose1(e);
        fetchData();
      } else {
        toast.error("User Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating User:", error);
      toast.error("Error updating User");
    } finally {
      setIsButtonDisabled1(false); // Re-enable the button after processing
    }
  };

  const columns = [
    // {
    //   accessorKey: "index",
    //   header: "#",
    //   Cell: ({ row }) => <span>{row.index + 1}</span>,
    // },
    {
      accessorKey: "first_name",
      header: "Name",
    },

    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "edit",
      header: "Edit",
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            className="bg-[#269fbd] hover:bg-green-700 p-2 text-white rounded"
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
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            className="bg-[#269fbd] hover:bg-green-700 p-2 text-white rounded"
            onClick={() => navigate(`/chapter/view-shool/${row.original.id}`)}
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
  const onSubmit = (e) => {
    e.preventDefault();

    let data = {
      chapter_name: chapter.chapter_name,
      chapter_code: chapter.chapter_code,
      chapter_address: chapter.chapter_address,
      chapter_city: chapter.chapter_city,
      chapter_pin: chapter.chapter_pin,
      chapter_state: chapter.chapter_state,
      chapter_phone: chapter.chapter_phone,
      chapter_whatsapp: chapter.chapter_whatsapp,
      chapter_email: chapter.chapter_email,
      chapter_website: chapter.chapter_website,
      chapter_date_of_incorporation: chapter.chapter_date_of_incorporation,
      chapter_region_code: chapter.chapter_region_code,
      auth_sign: chapter.auth_sign,
    };

    e.preventDefault();

    setIsButtonDisabled(true);
    axios({
      url:
        BASE_URL + "/api/update-chapter/" + localStorage.getItem("chapter_id"),
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast.success("User is Updated Successfully");
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Failed to update user");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2   border-b-2 border-green-500 rounded-t-lg  bg-[#E1F5FA] mt-2 ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="cursor-pointer hover:text-red-600" />
              <span>Chapters</span>
            </div>

            <button
              className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
              onClick={toggleIndividualDrawer(true)}
            >
              Create New User
            </button>
          </h2>
        </div>
        <div>
          <div className="flex justify-center p-4 font-semibold ">
            {chapter.chapter_name != "" && (
              <div>
                <h1>
                  {chapter.chapter_name}{" "}
                  {"( " +
                    chapter.chapter_city +
                    "," +
                    chapter.chapter_state +
                    "- " +
                    chapter.chapter_pin +
                    " )"}
                </h1>
              </div>
            )}
          </div>
          <form onSubmit={(e) => onSubmit(e)} autoComplete="off">
            <div className="p-6 space-y-1 ">
              <div>
                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
                    <div>
                      <FormLabel required>Address</FormLabel>
                      <input
                        name="chapter_address"
                        value={chapter.chapter_address}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Phone</FormLabel>
                      <input
                        type="text"
                        maxLength={10}
                        name="chapter_phone"
                        value={chapter.chapter_phone}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Whatsapp</FormLabel>
                      <input
                        type="text"
                        maxLength={10}
                        name="chapter_whatsapp"
                        value={chapter.chapter_whatsapp}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <FormLabel required>Email</FormLabel>
                      <input
                        type="email"
                        name="chapter_email"
                        value={chapter.chapter_email}
                        onChange={onInputChange1}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <FormLabel required>Website</FormLabel>
                      <input
                        name="chapter_website"
                        value={chapter.chapter_website}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="form-group ">
                      <SelectInput
                        label="Committee Member for Sign"
                        name="auth_sign"
                        value={chapter.auth_sign}
                        options={committee_type}
                        onChange={(e) => onInputChange(e)}
                        placeholder="Select  User Type"
                      />
                    </div>
                    <div>
                      <FormLabel required>Date Of Incorporation</FormLabel>
                      <input
                        type="date"
                        name="chapter_date_of_incorporation"
                        value={chapter.chapter_date_of_incorporation}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-center">
                    <button
                      disabled={isButtonDisabled}
                      type="submit"
                      className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                    >
                      {isButtonDisabled ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
                        onChange={(e) => onUserInputChange(e)}
                        placeholder="Select  User Type"
                      />
                    </div>
                    <div>
                      <FormLabel required>Enter Password</FormLabel>
                      <input
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
                        name="confirm_password"
                        value={user.confirm_password}
                        onChange={(e) => onUserInputChange(e)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-center">
                    <button
                      disabled={isButtonDisabled2}
                      type="submit"
                      className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                    >
                      {isButtonDisabled2 ? "SUbmiting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </SwipeableDrawer>

        {/* Edit User  */}
        <div className="bg-red rounded-full">
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
              <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white  shadow-md">
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
                          options={UserDrop.map((item) => ({
                            value: item.value,
                            label: item.label,
                          }))}
                          value={user.user_type_id}
                          name="user_type_id"
                          onChange={(e) => onUserInputChange(e)}
                          placeholder="Select  User Type"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled1}
                        type="submit"
                        className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                      >
                        {isButtonDisabled1 ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Chapter;
