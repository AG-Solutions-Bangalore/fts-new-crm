import { useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";
import PageTitle from "../../../components/common/PageTitle";
import { IoArrowBack } from "react-icons/io5";
import { Card } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import moment from "moment/moment";
import { IconArrowBack } from "@tabler/icons-react";

function FullListView() {
  const { id } = useParams();
  const [schooladoption, setSchoolAdoption] = useState([]);
  const [school, setSchool] = useState({});

  //FRTCH chapterwise
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/fetch-schools-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSchool(response.data.schools);
        setSchoolAdoption(response.data.schoolsadoption);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchSchoolData();
  }, []);
  console.log(schooladoption);
  console.log(school);
  return (
    <>
      <Layout>
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h4 className="text-black flex items-center text-center md:text-left">
            <PageTitle
              title="School Details"
              icon={IconArrowBack}
              backLink="/students-full-list"
            />
          </h4>
        </div>
        <hr />

        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <Card className="md:col-span-7 p-4">
              <div className="p-1 text-xl flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
                <h3 className="text-blue-500">{school.msid_fund}</h3>
                <h3 className="text-blue-500">
                  {school.village} - {school.district}
                </h3>
              </div>
              <hr />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <p>
                  <strong className="flex">School:</strong>
                  <span className="text-blue-500">
                    {school.village} - ({school.school_id})
                  </span>
                </p>
                <p>
                  <strong className="flex">Opening Date:</strong>
                  <span className="text-blue-500">
                    {moment(school.date_of_opening).format("DD-MM-YYYY")}
                  </span>
                </p>
                <p>
                  <strong className="flex">Region:</strong>
                  <span className="text-blue-500">
                    {school.region} - ({school.region_code})
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <p>
                  <strong className="flex">Achal:</strong>
                  <span className="text-blue-500">
                    {school.achal} - ({school.achal_code})
                  </span>
                </p>
                <p>
                  <strong className="flex">Cluster:</strong>
                  <span className="text-blue-500">
                    {school.cluster} - ({school.cluster_code})
                  </span>
                </p>
                <p>
                  <strong className="flex">Sub Cluster:</strong>
                  <span className="text-blue-500">
                    {school.sub_cluster} - ({school.sub_cluster_code})
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <p>
                  <strong className="flex">Teacher Name:</strong>
                  <span className="text-blue-500">
                    {school.teacher} - ({school.teacher_gender})
                  </span>
                </p>
                <p>
                  <strong className="flex">Total - Boys/Girls:</strong>
                  <span className="text-blue-500">
                    {school.total} - ({school.boys} / {school.girls})
                  </span>
                </p>
              </div>

              <h3 className="text-xl font-bold p-4">Village</h3>
              <hr />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <p>
                  <strong className="flex">Total Population:</strong>
                  <span className="text-blue-500">{school.population}</span>
                </p>
                <p>
                  <strong className="flex">Male Literacy:</strong>
                  <span className="text-blue-500">
                    {school.literacy_rate_male}
                  </span>
                </p>
                <p>
                  <strong className="flex">Female Literacy:</strong>
                  <span className="text-blue-500">
                    {school.literacy_rate_female}
                  </span>
                </p>
              </div>
            </Card>

            <div className="flex flex-col md:col-span-3 space-y-4">
              <Card className="w-full">
                <div className="p-5 text-md">
                  <h3 className="text-lg">Contact Info</h3>
                  <hr className="my-2" />

                  <div className="my-2">
                    <span className="text-blue-500">
                      Samiti Pramukh - {school.vidyalaya_samity_pramukh}
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-blue-500">
                      VCF - {school.vcf_name} - ({school.vcf_phone})
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-blue-500">
                      SCF - {school.scf_name} - ({school.scf_phone})
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-5 text-lg">
                  <h3>Adoption Details</h3>
                  <hr className="my-2 border-gray-300" />

                  {schooladoption.length > 0 ? (
                    <table className="w-full border-collapse mt-4">
                      <thead>
                        <tr className="bg-gray-100 text-sm">
                          <th className="p-3 border-b-2 border-gray-200">
                            FTS
                          </th>
                          <th className="p-3 border-b-2 border-gray-200">
                            Name
                          </th>
                          <th className="p-3 border-b-2 border-gray-200">
                            Year
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {schooladoption.map((adoption, key) => (
                          <tr key={key} className="hover:bg-gray-50 text-sm">
                            <td className="p-3 border-b border-gray-200">
                              {adoption.individual_company.indicomp_fts_id}
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              {adoption.individual_company.indicomp_full_name}
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              {adoption.schoolalot_financial_year}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 mt-4">No data available</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
export default FullListView;
