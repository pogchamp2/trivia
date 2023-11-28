"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import {
  Text3D,
  OrbitControls,
  Center,
  Stars,
  Float,
  Sparkles,
  useMatcapTexture,
} from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import QRCode from "react-qr-code";

export interface QuestionAndAnswers {
  question?: string;
  answers?: string[];
}

export interface ResultsData {
  showResults: boolean;
  user: { correct: number; wrong: number };
  leaderboard: Array<{ name: string; correct: number; wrong: number }>;
}

export type WebSocketMessage = QuestionAndAnswers | ResultsData;

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false); 
  const [clicked, click] = useState(false); // Subscribe this component to the render-loop, rotate the mesh every frame useFrame((state, delta) => (ref.current.rotation.x += delta));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function Hero({ roomCode }: { roomCode: string }) {
  const [matcapTexture] = useMatcapTexture("CB4E88_F99AD6_F384C3_ED75B9");
  const ref = useRef();

  const { width: w, height: h } = useThree((state) => state.viewport);

  console.log(roomCode);
  return (
    <>
      <Center scale={[0.9, 1, 1]}>
        <Physics gravity={10}>
          <Float speed={1}>
            <Text3D
              position={[0, 0, -10]}
              scale={[-1, 1, 1]}
              ref={ref}
              size={w / 9}
              maxWidth={[-w / 5, -h * 2, 3]}
              font={"/gt.json"}
              curveSegments={24}
              brevelSegments={1}
              bevelEnabled
              bevelSize={0.08}
              bevelThickness={0.03}
              height={1}
              lineHeight={0.9}
              letterSpacing={0.3}
            >
              {`${roomCode}`}
              <meshMatcapMaterial color="white" matcap={matcapTexture} />
            </Text3D>
          </Float>
        </Physics>
      </Center>
    </>
  );
}

export default function TV({ roomCode }: { roomCode?: string }) {
  const [roomNumber, setRoomNumber] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messageData, setMessageData] = useState<WebSocketMessage | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`wss://unixtm.dev:1337/tv/${roomCode}`);
    setSocket(newSocket);

    return () => {
      socket?.removeEventListener("message", handleWebSocketMessage);
      socket?.close();
    };
  }, []);

  const handleWebSocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data) as WebSocketMessage;
    if ("showResults" in data) {
      setResultsData(data as ResultsData);
    } else {
      setMessageData(data as QuestionAndAnswers);
    }
  };

  useEffect(() => {
    socket?.addEventListener("message", handleWebSocketMessage);
  }, [socket]);

  console.log(roomCode);
  return (
    <div className="h-screen">
      <div className="absolute ">
        <QRCode value={`https://trivia.unixtm.dev/room/${roomCode}`} />
      </div>
      <Canvas className="h-full" camera={{ position: [0, 0, -10], fov: 60 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {/* <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} /> */}
        <Suspense fallback={"Loading"}>
          <Stars
            radius={100}
            depth={100}
            count={4000}
            factor={4}
            saturation={0}
            fade
            speed={0.2}
          />
          <Sparkles
            count={300}
            size={3}
            speed={0.02}
            opacity={1}
            scale={10}
            color="#fff3b0"
          />
          <Hero roomCode={roomCode} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
