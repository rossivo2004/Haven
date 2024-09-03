import React from "react";

interface AppContainerProps {
  children: React.ReactNode;
  py?: React.CSSProperties["padding"];
  gap?: React.CSSProperties["gap"];
  className?: string;
}

const AppContainer: React.FC<AppContainerProps> = ({
  children,
  py = "20px",
  gap = "20px",
  className
}) => {
  return (
    <div
      className={`max-w-screen-xl mx-auto px-4 flex flex-col min-h-[60vh] ${className}`}
      style={{ paddingTop: py, paddingBottom: py, gap: gap }}
    >
      {children}
    </div>
  );
};

export default AppContainer;
