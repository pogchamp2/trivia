"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Question } from "./question";
import newRoomCode from "@/utils/random-word";

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

type FormValues = {
  roomCode: string;
};

type SocketStuffProps = {
  roomCode: string;
};

const SocketStuff: React.FC<SocketStuffProps> = ({ roomCode }) => {
  const [roomNumber, setRoomNumber] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [messageData, setMessageData] = useState<WebSocketMessage | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    if (roomNumber) {
      const newSocket = new WebSocket(`wss://unixtm.dev:1337/${roomNumber}`);
      setSocket(newSocket);
      console.log(roomNumber);
    }
    return () => {
      socket?.removeEventListener("message", handleWebSocketMessage);
      socket?.close();
    };
  }, [roomNumber]);

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

  const createRoom = () => {
    console.log(`Create Room`);
    setRoomNumber(newRoomCode);
  };

  const joinRoom = (roomInput: string) => {
    setRoomNumber(roomInput);
  };

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    joinRoom(data.roomCode);
  };

  const handleAnswerSubmit = (selectedAnswers: number[]) => {
    if (!socket) return;

                      console.log(selectedAnswers);

    socket.send(
      JSON.stringify({
        answer: selectedAnswers,
        name: playerName, // If needed
        // Any other needed data
      })
    );
  };

  const hasQA =
    "question" in (messageData ?? {}) && "answers" in (messageData ?? {});
  const isQuestionVisible = hasQA && !!messageData?.question;

  console.log(messageData);
  console.log(resultsData);

  return (
    <div>
      {!playerName && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPlayerName(e.currentTarget.nameInput.value);
          }}
          className="absolute bottom-2 left-2 flex space-x-2"
        >
          <input
            className="text-black rounded px-4 py-2"
            type="text"
            name="nameInput"
            placeholder="Enter your name"
            required
          />
          <button className="bg-red-500 rounded px-4 py-2" type="submit">
            Set Name
          </button>
        </form>
      )}
      {roomNumber ? (
        <p className="absolute top-2 left-2">Room Code: {roomNumber}</p>
      ) : (
        ""
      )}
      {!roomNumber && (
        <div className="absolute top-2 left-2">
          <button onClick={createRoom}>Create Room</button>
          <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
            <input
              {...register("roomCode")}
              type="text"
              className="text-black rounded px-4 py-2"
              placeholder="Enter room code"
              required
            />
            <button type="submit" className="bg-red-500 rounded px-4 py-2">
              Join
            </button>
          </form>
        </div>
      )}
      {hasQA && (
        <Question
          question={messageData?.question || null}
          answers={messageData?.answers || null}
          visible={isQuestionVisible}
          onSubmit={handleAnswerSubmit}
        />
      )}
      {resultsData?.showResults && (
        <div className="results">
          <h2>Your Score:</h2>
          <p>
            Correct: {resultsData.user.correct}, Wrong: {resultsData.user.wrong}
          </p>
          <h2>Leaderboard:</h2>
          <ul>
            {resultsData.leaderboard.map((entry, index) => (
              <li key={index}>
                {index + 1}. {entry.name} - Correct: {entry.correct}, Wrong:{" "}
                {entry.wrong}
              </li>
            ))}
          </ul>
          {playerName && (
            <div className="absolute bottom-2 left-2">
              Welcome, {playerName}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocketStuff;
