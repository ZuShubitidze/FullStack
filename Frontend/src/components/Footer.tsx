import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="my-auto flex justify-center items-center gap-10 pb-8">
      <p>© {new Date().getFullYear()}</p>
      <Link to={"/"}>Contact</Link>
    </footer>
  );
};

export default Footer;
