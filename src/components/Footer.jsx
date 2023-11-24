const Footer = () => {
  return (
    <footer className="py-6 text-center bg-primary text-white mt-12">
      <div className="container">
        <p>Copyright &copy; {new Date().getFullYear()} - CircleSync. All rights reserved. Developed by <a className="font-bold" href="https://www.facebook.com/ashikujjaman.himel" target="_blank" rel="noopener noreferrer">Ashik-Himel</a></p>
      </div>
    </footer>
  );
};

export default Footer;