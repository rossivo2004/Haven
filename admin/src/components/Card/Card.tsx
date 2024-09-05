import { FC } from 'react';

interface CardProps {
  title: string;
  value: number;
  icon: JSX.Element;
}

const Card: FC<CardProps> = ({ title, value, icon }) => (
  <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
    <div className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12">
      {icon}
    </div>
    <div className="flex flex-col justify-around flex-grow ml-5 text-white">
      <div className="text-xs whitespace-nowrap">{title}</div>
      <div>{value}</div>
    </div>
  </div>
);

export default Card;
