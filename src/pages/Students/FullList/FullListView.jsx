import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Card } from "@material-tailwind/react";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { IconArrowBack } from "@tabler/icons-react";
import { decryptId } from "../../../utils/encyrption/Encyrption";

// Reusable Components
const SectionHeader = ({ title }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-300">
    <h5 className="text-lg font-semibold text-black">{title}</h5>
  </div>
);

const InfoField = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <p className="text-sm font-medium text-black">{label}</p>
    <p className="text-sm text-gray-800">{value || "Not Available"}</p>
  </div>
);

const FullListView = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const [school, setSchool] = useState({});
  const [schoolAdoption, setSchoolAdoption] = useState([]);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-schools-by-id/${decryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSchool(response.data.schools);
        setSchoolAdoption(response.data.schoolsadoption);
      } catch (error) {
        console.error("Error fetching school data:", error);
      }
    };

    fetchSchoolData();
  }, [decryptedId]);

  return (
    <Layout>
      <div className="max-w-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main School Info */}
          <Card className="lg:col-span-8 p-6 space-y-6 shadow-lg">
            <div className=" flex flex-row items-center justify-between">
              <div>
                <h1 className=" flex flex-row gap-1 font-[500] ">
                  <IconArrowBack
                    onClick={() => navigate("/students-full-list")}
                    className="cursor-pointer hover:text-red-600"
                  />{" "}
                  <span className="border-b-2 text-black font-[500] border-dashed border-orange-800">
                    School Details
                  </span>
                </h1>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-blue-600">
                  {school.msid_fund}
                </h3>
                <p className="text-black">
                  {school.village}, {school.district}
                </p>
              </div>
            </div>
            <hr />

            <div>
              <InfoField
                label="School"
                value={`${school.village} (${school.school_id})`}
              />
              <InfoField
                label="Opening Date"
                value={moment(school.date_of_opening).format("DD-MM-YYYY")}
              />
              <InfoField
                label="Region"
                value={`${school.region} (${school.region_code})`}
              />
              <InfoField
                label="Acchal"
                value={`${school.achal} (${school.achal_code})`}
              />
              <InfoField
                label="Cluster"
                value={`${school.cluster} (${school.cluster_code})`}
              />
              <InfoField
                label="Sub Cluster"
                value={`${school.sub_cluster} (${school.sub_cluster_code})`}
              />
              <InfoField
                label="Teacher Name"
                value={`${school.teacher} (${school.teacher_gender})`}
              />
              <InfoField
                label="Total Students (Boys/Girls)"
                value={`${school.total} (${school.boys} / ${school.girls})`}
              />
            </div>
          </Card>

          {/* Additional Info and Contacts */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 shadow-lg">
              <SectionHeader title="Contact Information" />
              <div className="mt-4">
                <InfoField
                  label="Samiti Pramukh"
                  value={school.vidyalaya_samity_pramukh}
                />
                <InfoField
                  label="VCF"
                  value={`${school.vcf_name} (${school.vcf_phone})`}
                />
                <InfoField
                  label="SCF"
                  value={`${school.scf_name} (${school.scf_phone})`}
                />
              </div>
            </Card>

            <Card className="p-6 shadow-lg">
              <SectionHeader title="Village Statistics" />
              <div className="mt-4">
                <InfoField label="Total Population" value={school.population} />
                <InfoField
                  label="Male Literacy"
                  value={school.literacy_rate_male}
                />
                <InfoField
                  label="Female Literacy"
                  value={school.literacy_rate_female}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Adoption Details */}
        <Card className="mt-4 p-4 shadow-lg">
          <SectionHeader title="Adoption Details" />
          {schoolAdoption.length > 0 ? (
            <table className="w-full mt-4 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm flex items-center justify-between">
                  <th className="p-3 border-b border-gray-300">FTS</th>
                  <th className="p-3 border-b border-gray-300">Name</th>
                  <th className="p-3 border-b border-gray-300">Year</th>
                </tr>
              </thead>
              <tbody>
                {schoolAdoption.map((adoption, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 text-sm flex items-center justify-between"
                  >
                    <td className="p-3  border-b text-black border-gray-200">
                      {adoption.individual_company.indicomp_fts_id}
                    </td>
                    <td className="p-3  border-b  text-black border-gray-200">
                      {adoption.individual_company.indicomp_full_name}
                    </td>
                    <td className="p-3   border-b text-black border-gray-200">
                      {adoption.schoolalot_financial_year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-4">No adoption data available</p>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default FullListView;
