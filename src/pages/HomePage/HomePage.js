import PageLayout from "../../components/PageLayout";
import TagsCloud from "./TagsCloud/";
import HomeTable from "./HomeTable/HomeTable";
import LargestCollections from "./LargestCollections";

const HomePage = () => {
  return (
    <PageLayout>
      <LargestCollections />
      <HomeTable />
      <TagsCloud />
    </PageLayout>
  );
};

export default HomePage;
