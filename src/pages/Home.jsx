import { Helmet } from "react-helmet-async";
import Banner from "../components/home/Banner";

const Home = () => {
  return (
    <main>
      <Helmet>
        <title>CircleSync - Share your thoughts in your circle</title>
      </Helmet>

      <Banner />
    </main>
  );
};

export default Home;