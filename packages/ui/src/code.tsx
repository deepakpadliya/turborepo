import { type JSX } from "react";

const Code = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element => {
  return <code className={className}>{children}</code>;
}

export default Code;
