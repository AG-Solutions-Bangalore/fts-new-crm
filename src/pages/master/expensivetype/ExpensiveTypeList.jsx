import { Dialog, FormLabel, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconCircleX } from "@tabler/icons-react";
import { CREATE_EXPENSIVE_TYPE, EXPENSIVE_TYPE_LIST, UPDATES_EXPENSIVE_TYPE } from "../../../api";

const ExpensiveTypeList = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    ots_exp_type: "",
  });
  const [user1, setUser1] = useState({
    ots_exp_type1: "",
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

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = (e) => {
    e.preventDefault();
    setOpen1(false);
    setUser1({ ots_exp_type1: "" });
  };
  const fetchData = () => {
    axios
      .get(`${EXPENSIVE_TYPE_LIST}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data.otsexptype);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onUserInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
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
      ots_exp_type: user.ots_exp_type,
    };
    try {
      const res = await axios.post(
        `${CREATE_EXPENSIVE_TYPE}`,
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
        setUser({ ots_exp_type: "" });
        handleClose(e);
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error updating Expensive Type:", error);
      toast.error("Error updating Expensive Type");
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
      ots_exp_type: user1.ots_exp_type1,
    };
    try {
      const res = await axios.put(
        `${UPDATES_EXPENSIVE_TYPE}/${selected_user_id}`,
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
      console.error("Error updating Expensive Type:", error);
      toast.error("Error updating  Expensive Type");
    } finally {
      setIsButtonDisabled(false);
    }
  };
  const columns = [
    {
      accessorKey: "sl_no",
      header: "Sl No",
      Cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "ots_exp_type",
      header: "Expensive Type	",
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
              ots_exp_type1: row.original.ots_exp_type,
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
      <div>
        <div className="flex flex-col md:flex-row md:justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
          <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-xl md:text-2xl sm:text-sm text-center md:text-left">
            OTS Expensive Type
          </h1>

          <div className="flex flex-wrap gap-2 justify-center mt-2 md:mt-0">
            <button
              onClick={handleClickOpen}
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-48 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
            >
              Create OTS Expensive
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
                      CreateOTS Expensive
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
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
                      <div>
                        <FormLabel required>Enter Expensive Type</FormLabel>
                        <input
                          name="ots_exp_type"
                          value={user.ots_exp_type}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
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
                      Edit OTS Expensive
                    </h1>
                    <div className="flex">
                      <Tooltip title="Close">
                        <button className="ml-3 pl-2" onClick={handleClose1}>
                          <IconCircleX />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
                      <div>
                        <FormLabel required>Enter OTS Expensive </FormLabel>
                        <input
                          name="ots_exp_type1"
                          value={user1.ots_exp_type1}
                          onChange={(e) => onUserInputChange1(e)}
                          className={inputClass}
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

export default ExpensiveTypeList;
