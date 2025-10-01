"use client";

import { ReactNode } from "react";
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
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
