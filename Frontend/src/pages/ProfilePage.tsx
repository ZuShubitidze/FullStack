import { useAuth } from "@/context/Authcontext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <main className="flex flex-col gap-10 p-6 rounded-2xl dark:bg-zinc-800 bg-blue-300">
      <h1 className="text-center">Your Profile</h1>
      {user.name && user.email && (
        <section>
          <h2>Name: {user.name}</h2>
          <h2>Email: {user.email}</h2>
        </section>
      )}
    </main>
  );
};

export default ProfilePage;
