import React from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

import Chart_Price from '../Chart_Price';

interface CardData {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change: string;
    changeType: "positive" | "negative";
    timeFrame: string;
}

const DashboardCard: React.FC<CardData> = ({
    icon,
    title,
    value,
    change,
    changeType,
    timeFrame,
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <div className="text-3xl">{icon}</div>
            <h4 className="text-gray-700 mt-2">{title}</h4>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            <p
                className={`mt-1 ${changeType === "positive" ? "text-green-500" : "text-red-500"
                    }`}
            >
                {change} than {timeFrame}
            </p>
        </div>
    );
};

const BodyDashboard: React.FC = () => {

    const cardsData: CardData[] = [
        {
            icon: <AttachMoneyIcon />,
            title: "Today's Money",
            value: "$53k",
            change: "+55%",
            changeType: "positive",
            timeFrame: "last week",
        },
        {
            icon: <PersonIcon />,
            title: "Today's Users",
            value: "2,300",
            change: "+3%",
            changeType: "positive",
            timeFrame: "last month",
        },
        {
            icon: <PersonAddIcon />,
            title: "New Clients",
            value: "3,462",
            change: "-2%",
            changeType: "negative",
            timeFrame: "yesterday",
        },
        {
            icon: <SignalCellularAltIcon />,
            title: "Sales",
            value: "$103,430",
            change: "+5%",
            changeType: "positive",
            timeFrame: "yesterday",
        },
    ];

    return (
        <div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
                {cardsData.map((card, index) => (
                    <DashboardCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        change={card.change}
                        changeType={card.changeType}
                        timeFrame={card.timeFrame}
                    />
                ))}
            </div>

            <div>
                <Chart_Price />
            </div>

            <div>
            <iframe
  src="https://vercel.com/duys-projects-07028252/haven/analytics"
  width="100%"
  height="600"
  frameBorder="0"
></iframe>


            </div>
        </div>

    );
};

export default BodyDashboard;
