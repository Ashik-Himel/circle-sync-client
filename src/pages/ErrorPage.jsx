import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

const ErrorPage = () => {
  return (
    <main>
      <Helmet>
        <title>Page Not Found - CircleSync</title>
      </Helmet>

      <Header />
      <section>
        <div className="container">
          <div className="max-w-[650px] mx-auto pt-10 md:pt-16 text-center">
            <h1 className="mb-4 text-7xl sm:text-9xl tracking-tight font-bold text-primary">404</h1>
            <p className="mb-4 text-3xl sm:text-4xl font-bold text-primary">Page Not Found</p>
            <p className="mb-6 sm:text-lg">Oops! The page you&apos;re looking for seems to have taken a detour. Please check the URL or navigate back home.</p>
            <Link to='/'>
              <AwesomeButton type="primary">Back to Home</AwesomeButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;