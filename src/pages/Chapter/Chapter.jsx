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
import { encryptId } from "../../utils/encyrption/Encyrption";
import { ADMIN_CHAPTER_CREATE, ADMIN_CHAPTER_DATA_CHAPTER_LIST, ADMIN_CHAPTER_EDIT_UPDATE, ADMIN_CHAPTER_UPDATE, navigateToAdminSchoolView } from "../../api";
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
];
const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];
const Chapter = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("chapter_id");
  const [error, setError] = useState("");

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
    user_status: "",
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
      user_status: "",
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
      user_status: "",
    });
  };
  const fetchData = () => {
    axios
      .get(`${ADMIN_CHAPTER_DATA_CHAPTER_LIST}/${id}`, {
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
      s;
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
      setError("Passwords do not match");
      return;
    }
    setIsButtonDisabled2(true);
    const formData = {
      name: user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      user_type: user.user_type_id,
      chapter_id: id,
    };
    console.log(formData, "formdata");
    try {
      const response = await axios.post(
        `${ADMIN_CHAPTER_CREATE}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        fetchData();
        handleClose();
        toast.success(response.data.msg);
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
      } else if (response.data.code === 400) {
        toast.error(response.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
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
      user_status: user.user_status,
    };

    try {
      const response = await axios.put(
        `${ADMIN_CHAPTER_EDIT_UPDATE}/${selected_user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.msg);
        handleClose1(e);
        fetchData();
      } else if (response.data.code === 400) {
        toast.error(response.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error updating User:", error);
      toast.error("Error updating User");
    } finally {
      setIsButtonDisabled1(false);
    }
  };

  const columns = [
    {
      accessorKey: "first_name",
      header: "Name",
    },

    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "user_status", header: "Status" },
    {
      accessorKey: "edit",
      header: "Edit",
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
            onClick={() => {
              setUser({
                ...user,
                name: row.original.name,
                email: row.original.email,
                phone: row.original.phone,
                first_name: row.original.first_name,
                last_name: row.original.last_name,
                user_type_id: row.original.user_type_id,
                user_status: row.original.user_status,
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
            className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse  text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
            // onClick={() => navigate(`/chapter/view-shool/${row.original.id}`)}
            // onClick={() => {
            //   const encryptedId = encryptId(row.original.id);
            //   navigate(
            //     `/chapter/view-shool/${encodeURIComponent(encryptedId)}`
            //   );
            // }}
            onClick={() => {
              navigateToAdminSchoolView(navigate,row.original.id)
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
      ADMIN_CHAPTER_UPDATE  + localStorage.getItem("chapter_id"),
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.data.code === 200) {
          toast.success(res.data.msg);
          fetchData();
        } else if (res.data.code === 400) {
          toast.error(res.data.msg);
          setIsButtonDisabled(false);
        } else {
          toast.error("Unexcepted Error");
          setIsButtonDisabled(false);
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Failed to update user");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  return (
    <Layout>
      <div className="    bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2 border-b-2 border-green-500 bg-[#E1F5FA] mt-2 rounded-t-lg shadow-md">
          <h2 className="flex flex-col gap-4 md:flex-row justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2 text-center md:text-left">
              {chapter.chapter_name && (
                <div>
                  <h1 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
                    {chapter.chapter_name}{" "}
                    <span className="text-gray-600 text-xs md:text-sm lg:text-base">
                      {"( " +
                        chapter.chapter_city +
                        ", " +
                        chapter.chapter_state +
                        " - " +
                        chapter.chapter_pin +
                        " )"}
                    </span>
                  </h1>
                </div>
              )}
            </div>

            <button
              className="w-full md:w-auto text-sm font-medium bg-blue-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-lg transition duration-200 ease-in-out"
              onClick={toggleIndividualDrawer(true)}
            >
              Add New User
            </button>
          </h2>
        </div>

        <div>
          <form onSubmit={(e) => onSubmit(e)} autoComplete="off">
            <div className="p-6 space-y-1 ">
              <div>
                <div className="mt-2">
                  <div className="mb-4 ">
                    <FormLabel required>Address</FormLabel>
                    <input
                      name="chapter_address"
                      value={chapter.chapter_address}
                      onChange={(e) => onInputChange(e)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
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
                      <FormLabel>Whatsapp</FormLabel>
                      <input
                        type="text"
                        maxLength={10}
                        name="chapter_whatsapp"
                        value={chapter.chapter_whatsapp}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
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
                      <FormLabel>Website</FormLabel>
                      <input
                        name="chapter_website"
                        value={chapter.chapter_website}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
                      />
                    </div>
                    <div className="form-group ">
                      <SelectInput
                        label="Committee Member for Sign"
                        name="auth_sign"
                        required
                        value={chapter.auth_sign}
                        options={committee_type}
                        onChange={(e) => onInputChange(e)}
                        placeholder="Select  User Type"
                      />
                    </div>
                    <div>
                      <FormLabel>Date Of Incorporation</FormLabel>
                      <input
                        type="date"
                        name="chapter_date_of_incorporation"
                        value={chapter.chapter_date_of_incorporation}
                        onChange={(e) => onInputChange(e)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-center">
                    <button
                      disabled={isButtonDisabled}
                      type="submit"
                      className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                    >
                      {isButtonDisabled ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

       
          <div className="relative max-w-5xl">
            <h2
              className="absolute top-3 left-2 z-50 text-lg px-4 font-bold
           text-black"
            >
              Chapter List
            </h2>
            <MantineReactTable table={table} />
          </div>
     

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
                        required
                        onChange={(e) => onUserInputChange(e)}
                        placeholder="Select  User Type"
                      />
                    </div>
                    <div>
                      <FormLabel required>Enter Password</FormLabel>
                      <input
                        name="password"
                        type="password"
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
                        type="password"
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
                      disabled={isButtonDisabled2}
                      type="submit"
                      className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
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
                          const
                          className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 cursor-not-allowed"
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
                          onChange={(e) => {
                            const phone = e.target.value;
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
                          options={UserDrop.map((item) => ({
                            value: item.value,
                            label: item.label,
                          }))}
                          required
                          value={user.user_type_id}
                          name="user_type_id"
                          onChange={(e) => onUserInputChange(e)}
                          placeholder="Select  User Type"
                        />
                      </div>
                      <div className="form-group ">
                        <SelectInput
                          label="Status"
                          options={status.map((item) => ({
                            value: item.value,
                            label: item.label,
                          }))}
                          required
                          value={user.user_status}
                          name="user_status"
                          onChange={(e) => onUserInputChange(e)}
                          placeholder="Select  Status"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled1}
                        type="submit"
                        className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
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
