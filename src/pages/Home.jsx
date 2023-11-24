import { Helmet } from "react-helmet-async";
import Banner from "../components/home/Banner";
import AllTags from "../components/home/AllTags";
import Announcements from "../components/home/Announcements";
import AllPosts from "../components/home/AllPosts";

const Home = () => {
  return (
    <main>
      <Helmet>
        <title>CircleSync - Share your thoughts in your circle</title>
      </Helmet>

      <Banner />
      <AllTags />
      <Announcements />
      <AllPosts />
    </main>
  );
};

export default Home;