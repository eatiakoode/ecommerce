import { HiOutlineRefresh } from "react-icons/hi";
import { HiOutlineSquare3Stack3D, HiCalendarDays } from "react-icons/hi2";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Typography = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export default function SalesOverview() {
  const cards = [
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Today Orders",
      value: "$897.40",
      gradient: "from-violet-500 via-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/25",
      glowColor: "group-hover:shadow-purple-500/40",
    },
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Yesterday Orders", 
      value: "$679.93",
      gradient: "from-pink-500 via-rose-500 to-rose-600",
      shadowColor: "shadow-rose-500/25",
      glowColor: "group-hover:shadow-rose-500/40",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "This Month",
      value: "$13,146.96",
      gradient: "from-blue-500 via-indigo-500 to-indigo-600",
      shadowColor: "shadow-indigo-500/25",
      glowColor: "group-hover:shadow-indigo-500/40",
    },
    {
      icon: <HiCalendarDays />,
      title: "Last Month",
      value: "$31,964.92",
      gradient: "from-emerald-500 via-teal-500 to-teal-600",
      shadowColor: "shadow-teal-500/25",
      glowColor: "group-hover:shadow-teal-500/40",
    },
    {
      icon: <HiCalendarDays />,
      title: "All-Time Sales",
      value: "$626,513.05",
      gradient: "from-amber-500 via-orange-500 to-orange-600",
      shadowColor: "shadow-orange-500/25",
      glowColor: "group-hover:shadow-orange-500/40",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 p-1">
      {cards.map((card, index) => (
        <div
          key={`sales-overview-${index}`}
          className={cn(
            "group relative overflow-hidden rounded-2xl p-8 text-white text-center",
            "transform transition-all duration-300 ease-out",
            "hover:scale-105 hover:-translate-y-2",
            "bg-gradient-to-br",
            card.gradient,
            "shadow-xl",
            card.shadowColor,
            "hover:shadow-2xl",
            card.glowColor,
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
          )}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
            {/* Icon with enhanced styling */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl scale-110"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="[&>svg]:w-8 [&>svg]:h-8 [&>svg]:drop-shadow-lg">
                  {card.icon}
                </div>
              </div>
            </div>

            {/* Title */}
            <Typography className="text-sm font-medium tracking-wide opacity-90 uppercase letterspacing">
              {card.title}
            </Typography>

            {/* Value with enhanced typography */}
            <Typography className="text-3xl font-bold tracking-tight drop-shadow-lg">
              {card.value}
            </Typography>
            
            {/* Subtle accent line */}
            <div className="w-12 h-0.5 bg-white/30 rounded-full"></div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          </div>
        </div>
      ))}
    </div>
  );
}