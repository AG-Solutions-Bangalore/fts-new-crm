import { CardBody, Card, Input } from "@material-tailwind/react";
import { CardContent, Dialog, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdHighlightOff, MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";

const UserDrop = [
  {
    value: "User",
    label: "User",
  },
  {
    value: "Admin",
    label: "Admin",
  },
];

const ViewChapter = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [student, setStudent] = useState({});

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleClickOpen1 = (e) => {
    setOpen1(true);
  };

  const handleClose1 = (e) => {
    setOpen1(false);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/fetch-chapter-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data.chapter);
        setUsers(res.data.users);
      });
  }, [id]);

  const onUserInputChange = (e) => {
    if (e.target.name == "phone") {
      if (validateOnlyDigits(e.target.value)) {
        setUser({
          ...user,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };





  const createUser = async (e) => {
    e.preventDefault();
    const form = e.target;
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
        password: user.password,
        phone: user.phone,
        user_type: user.user_type_id,
        chapter_id: user.chapter_code,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/create-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        setUsers(res.data.users);
        handleClose();
        toast.success("User is Created Successfully");
      } else {
        if (response.data.code == "401") {
          toast.error("User Duplicate Entry");
        } else if (response.data.code == "402") {
          toast.error("User  Duplicate Entry");
        } else {
          toast.error("User Duplicate Entry");
        }
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
      const response = await axios.put(
        `${BASE_URL}/api/update-user/${selected_user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        setUsers(res.data.users);
        handleClose();
        toast.success("User is Updated Successfully");
      } else {
        if (response.data.code == "401") {
          toast.error("User Duplicate Entry");
        } else if (response.data.code == "402") {
          toast.error("User  Duplicate Entry");
        } else {
          toast.error("User Duplicate Entry");
        }
      }
    } catch (error) {
      console.error("Error updating User:", error);
      toast.error("Error updating User");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="">
          <div className="flex  mb-4 mt-6">
            <Link to="/">
              <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
            </Link>

            <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Chapter Details
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Card className="mt-4">
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 md:h-[150px] h-full">
                  {" "}
                  <div className="space-y-2">
                    <Typography className="text-black">
                      <strong>Chapter Name : {user.chapter_name} </strong>
                    </Typography>
                    <Typography className="text-black">
                      <strong>Address : {user.chapter_address}</strong>
                    </Typography>
                    <Typography className="text-black">
                      <strong>State :{user.chapter_state}</strong>
                    </Typography>
                  </div>
                  <div className="space-y-2">
                    <Typography className="text-black">
                      <strong>City : {user.chapter_city}</strong>
                    </Typography>
                    <Typography className="text-black">
                      <strong>
                        Mobile Device for Study : {user.mobile_device}{" "}
                      </strong>
                    </Typography>
                    <Typography className="text-black">
                      <strong>PIN : {user.chapter_pin}</strong>{" "}
                    </Typography>
                    <Typography className="text-black">
                      <strong>
                        Date Of Incorporation :{" "}
                        {user.chapter_date_of_incorporation}
                      </strong>{" "}
                    </Typography>
                  </div>
                  <div className="space-y-2">
                    <Typography className="text-black">
                      <strong>Email : {user.chapter_email}</strong>
                    </Typography>
                    <Typography className="text-black">
                      <strong>Phone : {user.chapter_phone}</strong>{" "}
                    </Typography>
                    <Typography className="text-black">
                      <strong>What's App : {user.chapter_whatsapp}</strong>
                    </Typography>
                    <Typography className="text-black">
                      <strong>Website : {student.chapter_website}</strong>
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="min-w-full p-2 bg-white border border-gray-200 shadow-md rounded-lg">
            <div className="mt-3 p-2  mb-2">
              <div className="flex justify-between mb-2">
                <h1 className="text-xl font-bold">User Details</h1>
                <button
                  onClick={handleClickOpen}
                  className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
                >
                  Create A New User
                </button>
              </div>
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                <thead>
                  <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th class="py-3  text-center">Name</th>
                    <th class="py-3 text-center">Email</th>
                    <th class="py-3 px-12 text-center">Phone</th>
                    <th class="py-3 px-12 text-center">Edit</th>
                    <th class="py-3 px-12 text-center">School</th>
                  </tr>
                </thead>
                {users?.map((dataSumm, key) => (
                  <tbody class="text-gray-600 text-sm font-light">
                    <tr class="border-b border-gray-500 hover:bg-gray-100">
                      <td class="py-3 px-12 text-center">
                        <span>
                          {" "}
                          {dataSumm.first_name} {dataSumm.last_name}
                        </span>
                      </td>
                      <td class="py-3 px-12 text-center">
                        <span> {dataSumm.email}</span>
                      </td>
                      <td class="py-3 px-12 text-center">
                        <span> {dataSumm.phone}</span>
                      </td>
                      <td class="py-3 px-12 text-center">
                        <button
                          // onClick={handleClickOpen1}
                          onClick={() => {
                            setUser({
                              ...user,
                              name: dataSumm.name,
                              email: dataSumm.email,
                              phone: dataSumm.phone,
                              first_name: dataSumm.first_name,
                              last_name: dataSumm.last_name,
                              user_type_id: dataSumm.user_type_id,
                            });
                            setSelectedUserId(dataSumm.id);
                            handleClickOpen1();
                          }}
                          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
                        >
                          Edit
                        </button>
                      </td>
                      <td class="py-3 px-12 text-center">
                        <Link to={`/view-school/${dataSumm.id}`}>
                          <button className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md">
                            School
                          </button>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
          <Dialog
            open={open}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            // className="m-3  rounded-lg shadow-xl"
          >
            <form onSubmit={createUser} autoComplete="off">
              <Card className="p-6 space-y-1 w-[500px]">
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Create A New User
                    </h1>
                    <div className="flex">
                      <Tooltip title="Close">
                        <button
                          className="ml-3 pl-2 hover:bg-gray-200 rounded-full"
                          onClick={handleClose}
                        >
                          <MdHighlightOff />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                      <div className="form-group ">
                        <Fields
                          required={true}
                          types="text"
                          title="Enter Username"
                          type="textField"
                          autoComplete="Name"
                          name="name"
                          value={user.name}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                      <div className="form-group ">
                        <Fields
                          required={true}
                          types="email"
                          title="Enter Email"
                          type="textField"
                          autoComplete="Name"
                          name="email"
                          value={user.email}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-3">
                      <div className="form-group ">
                        <Fields
                          required={true}
                          types="text"
                          title="Enter Full Name"
                          type="textField"
                          autoComplete="Name"
                          name="first_name"
                          value={user.first_name}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                      <div className="form-group ">
                        <Input
                          required
                          type="tel"
                          label="Enter Phone Number"
                          autoComplete="Name"
                          name="phone"
                          value={user.phone}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                      <div className="form-group ">
                        <Fields
                          required={true}
                          title="Select User Type"
                          type="whatsappDropdown"
                          autoComplete="Name"
                          name="user_type_id"
                          onChange={(e) => onUserInputChange(e)}
                          options={UserDrop}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="form-group ">
                        <Input
                          required
                          type="password"
                          label="Enter Password"
                          autoComplete="Name"
                          name="password"
                          value={user.password}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                      <div className="form-group ">
                        <Input
                          required
                          type="password"
                          label="Confirm Password"
                          autoComplete="Name"
                          name="confirm_password"
                          value={user.confirm_password}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled}
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                      >
                        {isButtonDisabled ? "Submiting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Dialog>

          {/* Edit User  */}

          <Dialog
            open={open1}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            // className="m-3  rounded-lg shadow-xl"
          >
            <form onSubmit={updateUser} autoComplete="off">
              <Card className="p-6 space-y-1 w-[500px]">
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Edit a User
                    </h1>
                    <div className="flex">
                      <Tooltip title="Close">
                        <button
                          className="ml-3 pl-2 hover:bg-gray-200 rounded-full"
                          onClick={handleClose1}
                        >
                          <MdHighlightOff />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                      <div className="form-group ">
                        <Fields
                          required={true}
                          types="text"
                          title="Enter Username"
                          type="textField"
                          autoComplete="Name"
                          name="name"
                          value={user.name}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                      <div className="form-group ">
                        <Fields
                          required={true}
                          types="email"
                          title="Enter Email"
                          type="textField"
                          autoComplete="Name"
                          name="email"
                          value={user.email}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-3">
                      <div className="form-group ">
                        <Fields
                          required={true}
                          types="text"
                          title="Enter Full Name"
                          type="textField"
                          autoComplete="Name"
                          name="first_name"
                          value={user.first_name}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                      <div className="form-group ">
                        <Input
                          required
                          type="tel"
                          label="Enter Phone Number"
                          autoComplete="Name"
                          name="phone"
                          value={user.phone}
                          onChange={(e) => onUserInputChange(e)}
                        />
                      </div>
                      <div className="form-group ">
                        <Fields
                          required={true}
                          title="Select User Type"
                          type="whatsappDropdown"
                          autoComplete="Name"
                          name="user_type_id"
                          onChange={(e) => onUserInputChange(e)}
                          options={UserDrop}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled}
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                      >
                        {isButtonDisabled ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default ViewChapter;
