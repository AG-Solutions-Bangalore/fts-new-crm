import Layout from "../../layout/Layout";

const SelectChapter = () => {
  const [individualDrawer, setIndividualDrawer] = useState(false);
  const toggleIndividualDrawer = (open) => () => {
    setIndividualDrawer(open);
  };
  return (
    <Layout>
      <SwipeableDrawer
        anchor="right"
        open={individualDrawer}
        onClose={toggleIndividualDrawer(false)}
        onOpen={toggleIndividualDrawer(true)}
        style={{
          backdropFilter: "blur(5px) sepia(5%)",
        }}
      >
        {" "}
        <div>hello</div>
      </SwipeableDrawer>
    </Layout>
  );
};

export default SelectChapter;
