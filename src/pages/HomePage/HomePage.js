import { useSelector } from "react-redux";
import { Spin } from "antd";

import PageLayout from "../../components/PageLayout";
import TagsCloud from "./TagsCloud/";
import HomeTable from "./HomeTable/HomeTable";
import LargestCollections from "./LargestCollections";

const HomePage = () => {
  const { items, collections } = useSelector((state) => state.home);
  const isLoading =
    items.length != 0 && collections.length != 0;

  return (
    <PageLayout>
      {isLoading ? (
        <>
          <LargestCollections />
          <HomeTable />
          <TagsCloud />
        </>
      ) : (
        <div
          style={{
            margin: "100px 0",
            textAlign: "center",
          }}
        >
          <Spin />
        </div>
      )}
    </PageLayout>
  );
};

export default HomePage;
