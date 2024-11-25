import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import CountUp from "react-countup";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, registerables } from "chart.js";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import {
  Users,
  Building2,
  Bell,
  BarChart3,
  PieChart,
  RefreshCcw,
  X,
  LayoutDashboard,
  User,
  IndianRupee,
} from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";

// import { ContextPanel } from "../../utils/ContextPanel";

Chart.register(ArcElement, ...registerables);
const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            <CountUp end={value} separator="," />
          </h3>
        </div>
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [result, setResult] = useState([]);
  const [loadingRecentOrders, setLoadingRecentOrders] = useState([]);
  const [datanotification, setNotification] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [graph1, setGraph1] = useState([]);
  const [graph2, setGraph2] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentYear, setCurrentYear] = useState("");
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingDashboardData, setLoadingDashboardData] = useState(true);

  const handleOpen = () => setOpen(!open);
  const userTypeId = localStorage.getItem("user_type_id");
  // const { currentYear } = useContext(ContextPanel);
  const isLoading = loadingNotices || loadingDashboardData;

  // Panel visibility states
  const [visiblePanels, setVisiblePanels] = useState({
    notices: true,
    totalDonation: true,
    recentDonation: true,
    receiptsBar: true,
    receiptsPie: true,
  });
  const fetchYearData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/fetch-year`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCurrentYear(response.data?.year?.current_year || "");
    } catch (error) {
      console.error("Error fetching year data:", error);
    }
  };
  useEffect(() => {
    fetchYearData();
  }, []);
  const fetchNotices = async () => {
    setLoadingNotices(true);

    try {
      const url =
        userTypeId == "3"
          ? `${BASE_URL}/api/superadmin-fetch-notices`
          : `${BASE_URL}/api/user-fetch-notices`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotification(response.data.notices || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoadingNotices(false);
    }
  };

  const fetchResult = async () => {
    setLoadingDashboardData(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/fetch-dashboard-data-by/${currentYear}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == "200") {
        setResult(response.data);
        const barLabels =
          response.data?.graph1.map((item) => item.receipt_donation_type) || [];
        const barValue =
          response.data?.graph1.map((item) => item.total_count) || [];
        setGraph1(barLabels);
        setGraph2(barValue);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingDashboardData(false);
    }
  };

  useEffect(() => {
    if (currentYear) {
      fetchResult();
    }

    fetchNotices();
  }, [currentYear]);

  useEffect(() => {
    if (graph1.length > 0) {
      setGraphData({
        labels: graph1,
        datasets: [
          {
            data: graph2,
            backgroundColor: [
              "#3b82f6", // blue-500
              "#f59e0b", // amber-500
              "#10b981", // emerald-500
              "#6366f1", // indigo-500
            ],
            hoverBackgroundColor: [
              "#2563eb", // blue-600
              "#d97706", // amber-600
              "#059669", // emerald-600
              "#4f46e5", // indigo-600
            ],
          },
        ],
      });
    }
  }, [graph1, graph2]);

  const markNoticeAsRead = async (noticeId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user-mark-a-notice-as-read?notice_id=${noticeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Notice acknowledged successfully");
        fetchNotices();
      }
    } catch (error) {
      toast.error("Error acknowledging notice");
    }
  };

  const cardConfig = [
    {
      title: "Total Donors",
      value: result.total_companies_count,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Individual Donors",
      value: result.individual_company_count,
      icon: User,
      color: "bg-green-600",
    },
    {
      title: "Companies/Trusts",
      value: result.other_companies_count,
      icon: Building2,
      color: "bg-purple-600",
    },
    {
      title: "Total Donation",
      value: result.total_donation,
      icon: IndianRupee,
      color: "bg-amber-600",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 ">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <LayoutDashboard className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 ">
                Dashboard Overview
              </h2>
              <p className="text-sm text-gray-600">
                Welcome back! Here's your donation analytics
              </p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-56">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cardConfig.map((card, index) => (
                <DashboardCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Notices Panel */}
              {visiblePanels.notices && (
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Recent Notices
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setVisiblePanels((prev) => ({
                              ...prev,
                              notices: false,
                            }))
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="divide-y  h-[48.5rem]   overflow-y-auto custom-scroll divide-gray-100">
                      {datanotification.length > 0 ? (
                        datanotification.map((notice) => (
                          <div key={notice.id} className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {notice.notice_name}
                              </h3>
                              {notice.is_read == 0 ? (
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                                  New
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                                  Read
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                              {notice.notice_detail}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {moment(notice.created_at).format(
                                  "MMM DD, YYYY"
                                )}
                              </span>
                              {notice.is_read == 0 && (
                                <button
                                  onClick={() => {
                                    setSelectedNotice(notice);
                                    handleOpen();
                                  }}
                                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                                >
                                  Acknowledge
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No new notices available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Donation Details Column */}
              <div className="space-y-6">
                {/* Donation Summary */}
                {visiblePanels.totalDonation && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Summary
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setVisiblePanels((prev) => ({
                              ...prev,
                              totalDonation: false,
                            }))
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <DonationTypeRow
                        title="OTS"
                        amount={result.total_ots_donation}
                        count={result.ots_receipts_count}
                        color="bg-green-50"
                        textColor="text-blue-600"
                      />
                      <DonationTypeRow
                        title="Membership"
                        amount={result.total_membership_donation}
                        count={result.mem_receipts_count}
                        color="bg-amber-50"
                        textColor="text-amber-600"
                      />
                      <DonationTypeRow
                        title="General"
                        amount={result.total_general_donation}
                        count={result.gen_receipts_count}
                        color="bg-blue-50"
                        textColor="text-emerald-600"
                      />
                    </div>
                  </div>
                )}
                {/* Charts */}
                {visiblePanels.receiptsPie && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                          <PieChart className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Distribution
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setVisiblePanels((prev) => ({
                              ...prev,
                              receiptsPie: false,
                            }))
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {graphData && (
                        <Doughnut
                          data={graphData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "bottom",
                              },
                            },
                            cutout: "70%",
                          }}
                          height={300}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                fetchResult();
                fetchNotices();
                fetchYearData();

                // toast.success("Dashboard refreshed");
              }}
              className="fixed bottom-8 right-8 p-4 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-colors"
            >
              <RefreshCcw className="h-6 w-6 text-blue-600" />
            </button>
          </>
        )}
      </div>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Acknowledge Notice</DialogHeader>
        <DialogBody>
          Are you sure you have read and understood this notice?
        </DialogBody>
        <DialogFooter>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
            onClick={handleOpen}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              if (selectedNotice) {
                markNoticeAsRead(selectedNotice.id);
              }
              handleOpen();
            }}
          >
            Yes, I Understand
          </button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

const DonationTypeRow = ({ title, amount, count, color, textColor }) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}
      >
        <IndianRupee className={`w-5 h-5 ${textColor}`} />
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <NumericFormat
          value={amount}
          displayType="text"
          thousandSeparator={true}
          prefix="₹ "
          thousandsGroupStyle="lakh"
          className="text-sm text-gray-500"
        />
      </div>
    </div>
    <span className={`px-3 py-1 rounded-full text-sm ${color} ${textColor}`}>
      {count}
    </span>
  </div>
);

export default Home;
