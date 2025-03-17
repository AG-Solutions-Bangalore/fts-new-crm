import { Dialog, FormLabel, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { IconCircleX } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { CREATE_FAQ, FAQ_LIST, UPDATES_FAQ } from "../../../api";

const FAQList = () => {
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    header: "",
    text: "",
  });
  const [user1, setUser1] = useState({
    header1: "",
    text1: "",
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
    setUser({ header: "", text: "" });
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = (e) => {
    e.preventDefault();
    setOpen1(false);
    setUser1({ header1: "", text1: "" });
  };
  const fetchData = () => {
    axios
      .get(`${FAQ_LIST}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data.faqs);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onUserInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onUserInputChange1 = (e) => {
    const { name, value } = e.target;
    setUser1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      header: user.header,
      text: user.text,
    };
    try {
      const res = await axios.post(`${CREATE_FAQ}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        fetchData();
        setUser({ header1: "", text1: "" });
        handleClose(e);
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Error updating FAQ");
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
      header: user1.header1,
      text: user1.text1,
    };
    try {
      const res = await axios.put(
        `${UPDATES_FAQ}/${selected_user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.code === 200) {
        toast.success(res.data.msg);
        fetchData();
        handleClose1(e);
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Error updating  FAQ");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const columns = [
    {
      accessorKey: "header",
      header: "Heading",
    },
    {
      accessorKey: "text",
      header: "Message",
    },
    {
      accessorKey: "edit",
      header: "Edit",
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <button
          onClick={() => {
            setUser1({
              ...user1,
              header1: row.original.header,
              text1: row.original.text,
            });
            setSelectedUserId(row.original.id);
            handleClickOpen1();
          }}
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          Edit
        </button>
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
  const autoResize = (e) => {
    e.target.style.height = "100px";
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 resize-none";
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
          <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-xl md:text-2xl sm:text-sm text-center md:text-left">
            New FAQ
          </h1>

          <div className="flex flex-wrap gap-2 justify-center mt-2 md:mt-0">
            <button
              onClick={handleClickOpen}
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
            >
              Create FAQ
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <MantineReactTable table={table} />
          <Dialog
            open={open}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            sx={{
              backdropFilter: "blur(5px) sepia(5%)",
              "& .MuiDialog-paper": {
                borderRadius: "18px",
              },
            }}
          >
            <form onSubmit={createUser} autoComplete="off">
              <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Create FAQ
                    </h1>
                    <div className="flex">
                      <Tooltip title="Close">
                        <button className="ml-3 pl-2 " onClick={handleClose}>
                          <IconCircleX />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="grid grid-cols-1  gap-6 mb-2">
                      <div>
                        <FormLabel required>Enter Heading</FormLabel>
                        <input
                          name="header"
                          value={user.header}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <FormLabel required>Enter Message</FormLabel>
                        <textarea
                          name="text"
                          value={user.text}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          onInput={autoResize}
                          style={{ height: "100px" }}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled}
                        type="submit"
                        className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                      >
                        {isButtonDisabled ? "Submiting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Dialog>

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
              <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-3xl shadow-md">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Edit FAQ
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
                    <div className="grid grid-cols-1  gap-6 mb-2">
                      <div>
                        <FormLabel required>Enter Heading</FormLabel>
                        <input
                          name="header1"
                          value={user1.header1}
                          onChange={(e) => onUserInputChange1(e)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <FormLabel required>Enter Message</FormLabel>
                        <textarea
                          name="text1"
                          value={user1.text1}
                          onChange={(e) => onUserInputChange1(e)}
                          className={inputClass}
                          onInput={autoResize}
                          style={{ height: "100px" }}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled}
                        type="submit"
                        className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
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
      </div>
    </Layout>
  );
};

export default FAQList;
