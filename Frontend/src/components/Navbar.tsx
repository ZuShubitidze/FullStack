import { NavLink } from "react-router";
import { ModeToggle } from "./theme/mode-toggle";
import { useAuth } from "@/context/Authcontext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications ";
import { Bell } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, markAllAsRead, unreadCount, markAsRead } =
    useNotifications();
  // console.log("Notifications:", notifications, "Unread Count:", unreadCount);

  return (
    <nav className="flex flex-col md:flex-row p-4 md:p-8 text-2xl md:justify-between font-bol">
      {/* General Display */}
      <section className="flex flex-row gap-4 md:gap-0">
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
      {/* User */}
      <section className="flex flex-row items-center gap-2">
        {user ? (
          // User logged in
          <section className="flex flex-row gap-2 md:gap-10 items-center">
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
            <Button onClick={logout}>Log out</Button>
            {/* Notifications */}
            <DropdownMenu>
              {/* Trigger */}
              <DropdownMenuTrigger className="relative p-2 outline-none">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              {/* Content */}
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="end"
                  className="w-[calc(100vw-2rem)] sm:w-80 z-50 shadow-xl"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {unreadCount > 0 && (
                      <Button
                        onClick={() => markAllAsRead()}
                        className="my-2 ml-2"
                      >
                        Mark all as read
                      </Button>
                    )}
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications yet
                      </div>
                    ) : (
                      <div>
                        {notifications.map(
                          ({ id, message, isRead, createdAt }) => (
                            <DropdownMenuItem
                              key={id}
                              className={`flex flex-col items-start ${!isRead ? "bg-blue-400 dark:bg-blue-900/20" : ""}`}
                            >
                              <p>{message}</p>
                              <span>
                                {new Date(createdAt).toLocaleDateString()}
                              </span>
                              {!isRead && (
                                <Button onClick={() => markAsRead(id)}>
                                  Mask as read
                                </Button>
                              )}
                            </DropdownMenuItem>
                          ),
                        )}
                      </div>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </section>
        ) : (
          // No User
          <section className="flex flex-row gap-5 md:gap-10 items-center">
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
        <ModeToggle />
      </section>
    </nav>
  );
};

export default Navbar;
