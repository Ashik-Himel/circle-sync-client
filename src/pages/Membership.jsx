import { Helmet } from "react-helmet-async";
import useUserContext from "../hooks/useUserContext";
import {RiAdminFill} from 'react-icons/ri';
import { Link } from "react-router-dom";
import bronzeIcon from '../assets/images/bronze.png';
import goldIcon from '../assets/images/gold.png';

const Membership = () => {
  const {userRole} = useUserContext();

  const Admin = <div className="text-center">
    <RiAdminFill className="mx-auto text-[150px] text-primary mb-2" />
    <h2 className="text-3xl text-primary font-medium mb-2">Website Admin</h2>
    <p className="text-gray-500 max-w-[500px] mx-auto mb-4">You are an admin of this website. You don&apos;t need any membership plan.</p>
    <Link to='/' className="btn btn-primary">Back to Home</Link>
  </div>

  const Gold = <div className="text-center">
    <img className="w-[150px] mx-auto mb-2" src={goldIcon} alt="Gold Badge" />
    <h2 className="text-3xl text-primary font-medium mb-2">Congratulations!</h2>
    <p className="text-gray-500 max-w-[500px] mx-auto mb-4">You already have a gold badges. You can add unlimited post in our platform!</p>
    <Link to='/' className="btn btn-primary">Back to Home</Link>
  </div>

  const Bronze = <div className="text-center">
    <img className="w-[150px] mx-auto mb-2" src={bronzeIcon} alt="Bronze Badge" />
    <h2 className="text-3xl text-primary font-medium mb-2">Become a Gold Member!</h2>
    <p className="text-gray-500 max-w-[500px] mx-auto">You&apos;re a bronze member. You can add 5 post only. You have a chance to become a gold member to add unlimited post. Pay 1000 taka only to become a gold member.</p>
    
    <div className="mt-8">
      <h2 className="text-2xl font-medium text-primary">Make Payment</h2>
    </div>
  </div>

  return (
    <main>
      <Helmet>
        <title>Membership - CircleSync</title>
      </Helmet>

      <section className="mt-10">
        <div className="container">
          {userRole === "admin" ? Admin : userRole === "gold" ? Gold : Bronze}
        </div>
      </section>
    </main>
  );
};

export default Membership;