"use client";

import './Button.scss';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const Button = ({children, ...props}: ButtonProps) => {
  return (
    <button
      className={`button-container ${props.className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
