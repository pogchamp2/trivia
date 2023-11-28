"use client";

import TV from "@/components/tv";

const Room = ({ params }: { params: { slug: string } }) => {
  return <TV roomCode={params.slug} />;
};

export default Room;
