import { Helmet } from "react-helmet-async";
import Banner from "../components/home/Banner";
import AllTags from "../components/home/AllTags";

const Home = () => {
  return (
    <main>
      <Helmet>
        <title>CircleSync - Share your thoughts in your circle</title>
      </Helmet>

      <Banner />
      <AllTags />
    </main>
  );
};

export default Home;