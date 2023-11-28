import SocketStuff from "@/components/socket-stuff";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* <h1 className='text-4xl'>
          This is a question
        </h1> */}
      <SocketStuff roomCode={"asdf"} />
    </main>
  );
}
