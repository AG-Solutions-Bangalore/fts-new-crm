import { Card } from "@material-tailwind/react";
import { CardContent, Dialog, FormLabel, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconArrowBack, IconCircleX } from "@tabler/icons-react";
import { decryptId } from "../../../utils/encyrption/Encyrption";
import { CHAPTER_DATASOURCE_CREATE, CHAPTER_DATASOURCE_UPDATE_BY_ID, fetchChapterDatasourceById } from "../../../api";

const EditDataSource = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    data_source_type: "",
    chapter_id: "",
  });

  const [selected_user_id, setSelectedUserId] = useState("");

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen1 = (userId) => {
    setOpen1(true);
    setSelectedUserId(userId);
    populateUserData(userId);
  };

  const handleClose1 = () => {
    setOpen1(false);
    setUser({
      data_source_type: "",
      chapter_id: "",
    });
  };

  // const fetchDataSources = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/api/fetch-data-sources-by-id/${decryptedId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     setUsers(response.data.datasource);
  //   } catch (error) {
  //     console.error("Error fetching data sources:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchDataSources();
  // }, [id]);

   
      const fetchDataSources = async () => {
        try {
          const data = await fetchChapterDatasourceById(id);
          setUsers(data.datasource);
        } catch (error) {
          toast.error("Failed to fetch datasource details");
        }
      };
      useEffect(() => {
      fetchDataSources();
    }, [id]);

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);
  const onUserInputChange = (e) => {
    if (e.target.name === "phone") {
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

  const populateUserData = (userId) => {
    const selectedUser = users.find((u) => u.id === userId);
    if (selectedUser) {
      setUser({
        data_source_type: selectedUser.data_source_type,
        chapter_id: selectedUser.chapter_id,
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
    if (user.password != user.confirm_password) {
      toast.danger("Passwords don't match");
      return false;
    }
    setIsButtonDisabled(true);
    const formData = {
      data_source_type: user.data_source_type,
      chapter_id: decryptedId,
    };
    try {
      const response = await axios.post(
        `${CHAPTER_DATASOURCE_CREATE}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success(response.data.msg);
        handleClose();
        fetchDataSources();
        setUser({
          data_source_type: "",
          chapter_id: "",
        });
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error updating Data Source:", error);
      toast.error("Error updating Data Source");
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
      data_source_type: user.data_source_type,
      chapter_id: decryptedId,
    };
    try {
      const response = await axios.put(
        `${CHAPTER_DATASOURCE_UPDATE_BY_ID}/${selected_user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success(response.data.msg);
        handleClose1();
        fetchDataSources();
        setUser({
          data_source_type: "",
          chapter_id: "",
        });
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error updating Data Source:", error);
      toast.error("Error updating Data Source");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Sl No",
      Cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "data_source_type",
      header: "Data Source",
    },
    {
      accessorKey: "edit",
      header: "Edit",
      enableColumnFilter: false,

      Cell: ({ row }) => (
        <button
          onClick={() => handleClickOpen1(row.original.id)}
          disabled={row.original.chapter_id === 0}
        >
          <span
            className={`btn text-white px-4 py-2 rounded-lg shadow-md ${
              row.original.chapter_id !== 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            }`}
          >
            Edit
          </span>
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
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconArrowBack
                className="cursor-pointer hover:text-red-600"
                onClick={() => navigate("/master/chapters")}
              />
              <span>Data Source</span>
            </div>
            <button
              onClick={handleClickOpen}
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse  text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
            >
              Create Data Source
            </button>
          </h2>
        </div>
        <hr />
        <div className="grid grid-cols-1 gap-4">
          <MantineReactTable table={table} />

          <Dialog
            open={open}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            sx={{
              backdropFilter: "blur(5px) sepia(5%)",
            }}
          >
            <form onSubmit={createUser} autoComplete="off">
              <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Create Data Source
                    </h1>
                    <div className="flex">
                      <Tooltip title="Close">
                        <button
                          type="button"
                          className="ml-3 pl-2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClose();
                          }}
                        >
                          <IconCircleX />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
                      <div>
                        <FormLabel required>Enter Data Source</FormLabel>
                        <input
                          name="data_source_type"
                          value={user.data_source_type}
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
            }}
          >
            <form autoComplete="off" onSubmit={updateUser}>
              <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Edit Data Source
                    </h1>
                    <Tooltip title="Close">
                      <button
                        type="button"
                        className="ml-3 pl-2l"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClose1();
                        }}
                      >
                        <IconCircleX />
                      </button>
                    </Tooltip>
                  </div>

                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
                      <div>
                        <FormLabel required>Enter Data Source</FormLabel>
                        <input
                          name="data_source_type"
                          value={user.data_source_type}
                          onChange={onUserInputChange}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        type="submit"
                        disabled={isButtonDisabled}
                        className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                      >
                        Update
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

export default EditDataSource;
