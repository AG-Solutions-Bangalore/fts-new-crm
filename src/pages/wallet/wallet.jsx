import Layout from "../../layout/Layout";

const Wallet = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Wallet
        </h3>
      </div>
      <div className="text-lg bg-white mt-5 rounded-lg p-4 flex justify-center font-sans font-semibold">
        Coming Soon
      </div>
    </Layout>
  );
};

export default Wallet;
