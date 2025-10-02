"use client";

import './Button.scss';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={`button-container ${props.className || ''}`}
      {...props}
    >
      {props.children}
    </button>
  );
};
