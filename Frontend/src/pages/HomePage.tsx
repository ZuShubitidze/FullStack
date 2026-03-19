const HomePage = () => {
  return (
    <main className="flex flex-col gap-4 md:gap-8">
      <h1 className="text-3xl text-center">Welcome to my fullstack web app</h1>
      <p>
        Here, you can login / register, create posts with or without image,
        comments and infinite replies to other comments. Viewing posts and
        comments doesn't require registration.
      </p>
      <p>
        You can also upload your profile picture, that will be displayed on your
        posts next to your name as an author.
      </p>
      <p>
        Using Socket, users also get notifications when someone comments on
        their posts
      </p>
      <p>Backend is on Render, Frontend - on Vercel.</p>
      <p>Data - Neon / Cloudinary</p>
      <h1>Tools used:</h1>
      <ul className="flex flex-row gap-20">
        <section>
          <h2>Backend</h2>
          <li>Node.js</li>
          <li>Express</li>
          <li>Prisma</li>
          <li>Bcrypt</li>
          <li>JWT</li>
          <li>Socket.io</li>
        </section>
        <section>
          <h2>Frontend</h2>
          <li>React / Vite</li>
          <li>Tailwind / Shadcn</li>
          <li>Tanstack / React Query</li>
        </section>
      </ul>
      {/* Contact */}
      <section className="flex flex-col gap-4">
        <h3>Contact: </h3>
        Name: Zura Shubitidze
        <a href="mailto:zurashubitidze123@gmail.com">
          Email: zurashubitidze123@gmail.com
        </a>
        <a href="tel:+558188548">Phone Number: 558188548</a>
      </section>
    </main>
  );
};

export default HomePage;
