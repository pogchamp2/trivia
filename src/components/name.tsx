"use client"

import React from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
};

type FormValues = {
  name: string;
};

export const SetNameForm: React.FC<Props> = ({ setPlayerName }) => {
  const { register, handleSubmit } = useForm<FormValues>();
  
  const onSubmit = (data: FormValues) => {
    setPlayerName(data.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="set-name-form">
      <input {...register('name')} type="text" placeholder="Enter your name" required />
      <button type="submit">Set Name</button>
    </form>
  );
};
