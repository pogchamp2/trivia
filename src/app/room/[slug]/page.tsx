const Room = ({ params }: { params: { slug: string } }) => {
  console.log(params);

  const roomCode = params.slug;

  console.log(roomCode);

  return <p>{params.slug}</p>;
};

export default Room;
