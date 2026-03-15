import { Link } from "react-router";

const ErrorComponent = ({ content }: { content: string }) => {
  return (
    <div>
      <h1>Error {content}</h1>
      <Link to={"/"}>Return Home</Link>
    </div>
  );
};

export default ErrorComponent;
