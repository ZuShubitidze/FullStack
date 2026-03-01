import { NavLink } from "react-router";
import { ModeToggle } from "./theme/mode-toggle";
import { useAuth } from "@/context/Authcontext";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log(user);

  return (
    <nav className="flex flex-col md:flex-row p-10 text-2xl justify-between font-bold items-center">
      <section className="flex flex-row items-center">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive ? "active navlink" : "inactive navlink"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/posts"
          className={({ isActive }) =>
            isActive ? "active navlink" : "inactive navlink"
          }
        >
          Posts
        </NavLink>
      </section>
      <section className="flex flex-row items-center">
        {user ? (
          // User logged in
          <section className="flex flex-row gap-10 items-center">
            <NavLink
              to="/createPost"
              className={({ isActive }) =>
                isActive ? "active navlink" : "inactive navlink"
              }
            >
              Create Post
            </NavLink>
            <NavLink
              to={"/profile"}
              className={({ isActive }) =>
                isActive ? "active navlink" : "inactive navlink"
              }
            >
              Profile
            </NavLink>
            <Button className="mr-10" onClick={logout}>
              Log out
            </Button>
          </section>
        ) : (
          // No User
          <section className="flex flex-row gap-10 mr-10">
            <NavLink
              to={"/login"}
              className={({ isActive }) =>
                isActive ? "active  navlink" : "inactive  navlink"
              }
            >
              Login
            </NavLink>
            <NavLink
              to={"/register"}
              className={({ isActive }) =>
                isActive ? "active  navlink" : "inactive  navlink"
              }
            >
              Register
            </NavLink>
          </section>
        )}
        {/* <div className="absolute right-4"> */}
        <ModeToggle />
        {/* </div> */}
      </section>
    </nav>
  );
};

export default Navbar;
