"use client"
import React, { useState } from 'react';

type QuestionProps = {
  question: string | null;
  answers: string[] | null;
  visible: boolean;
  onSubmit: (selectedAnswer: number) => void;
};

export const Question: React.FC<QuestionProps> = ({ question, answers, visible, onSubmit }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleRadioChange = (index: number) => {
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected !== null) {
onSubmit(selected);
    }
    setSelected(null); // Reset the selection
  };

  return (
    <div className="question" style={{ display: visible ? 'block' : 'none' }}>
      <div>{question ? question : 'Loading question...'}</div>
      <ul className="options">
        {answers?.map((answer, index) => (
          <li key={index}>
            <input 
              type="radio" 
              name="answer"
              value={index} 
              onChange={() => handleRadioChange(index)} 
              checked={selected === index} 
            />
            {answer}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit} disabled={selected === null}>
        Submit
      </button>
    </div>
  );
};
