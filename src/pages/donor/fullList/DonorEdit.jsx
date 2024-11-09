import React, { useEffect, useState } from "react";
import DonorEditIndv from "./DonorEditIndv";
import DonorEditComp from "./DonorEditComp";
import { useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";

const DonorEdit = () => {
  const { id } = useParams();
  const [usertype, setUsertype] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-donor-for-edit/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const donType = response.data.individualCompany.indicomp_type;
        localStorage.setItem("donType", donType);
        setUsertype(donType);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donor data", error);
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  const type = localStorage.getItem("donType");

  if (type == "Individual") {
    return (
      <Layout>
        <DonorEditIndv id={id} />
      </Layout>
    );
  }
  return (
    <Layout>
      <DonorEditComp id={id} />
    </Layout>
  );
};

export default DonorEdit;
