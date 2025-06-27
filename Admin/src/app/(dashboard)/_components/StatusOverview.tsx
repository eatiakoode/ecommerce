import {
  HiOutlineShoppingCart,
  HiOutlineRefresh,
  HiOutlineCheck,
} from "react-icons/hi";
import { BsTruck } from "react-icons/bs";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Typography = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export default function StatusOverview() {
  const cards = [
    {
      icon: <HiOutlineShoppingCart />,
      title: "Total Orders",
      value: "815",
      gradient: "from-amber-400 via-orange-500 to-orange-600",
      iconBg: "bg-gradient-to-br from-amber-100 to-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200/50",
      shadowColor: "shadow-orange-500/10",
      hoverShadow: "group-hover:shadow-orange-500/25",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "Orders Pending",
      value: "263",
      gradient: "from-yellow-400 via-amber-500 to-yellow-600",
      iconBg: "bg-gradient-to-br from-yellow-100 to-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200/50",
      shadowColor: "shadow-amber-500/10",
      hoverShadow: "group-hover:shadow-amber-500/25",
    },
    {
      icon: <BsTruck />,
      title: "Orders Processing",
      value: "97",
      gradient: "from-blue-400 via-indigo-500 to-blue-600",
      iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200/50",
      shadowColor: "shadow-blue-500/10",
      hoverShadow: "group-hover:shadow-blue-500/25",
    },
    {
      icon: <HiOutlineCheck />,
      title: "Orders Delivered",
      value: "418",
      gradient: "from-emerald-400 via-green-500 to-emerald-600",
      iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200/50",
      shadowColor: "shadow-emerald-500/10",
      hoverShadow: "group-hover:shadow-emerald-500/25",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-white border-2 p-6",
            "transform transition-all duration-300 ease-out",
            "hover:scale-105 hover:-translate-y-1",
            "shadow-lg hover:shadow-xl",
            card.borderColor,
            card.shadowColor,
            card.hoverShadow,
            "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-all before:duration-300",
            `before:${card.gradient}`,
            "hover:before:opacity-5"
          )}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <div className={cn("w-full h-full rounded-full bg-gradient-to-br", card.gradient)}></div>
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
            {/* Enhanced Icon */}
            <div className="relative">
              {/* Glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-2xl blur-lg opacity-20 transition-opacity duration-300 group-hover:opacity-40 bg-gradient-to-br",
                card.gradient
              )}></div>
              
              {/* Icon container */}
              <div className={cn(
                "relative w-16 h-16 rounded-2xl flex items-center justify-center",
                "border border-white/50 backdrop-blur-sm shadow-lg",
                "transition-all duration-300 group-hover:scale-110",
                card.iconBg
              )}>
                <div className={cn(
                  "[&>svg]:w-7 [&>svg]:h-7 [&>svg]:drop-shadow-sm transition-transform duration-300 group-hover:scale-110",
                  card.iconColor
                )}>
                  {card.icon}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 flex-1">
              <Typography className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                {card.title}
              </Typography>

              <div className="flex items-baseline gap-2">
                <Typography className="text-3xl font-bold text-slate-800 tabular-nums">
                  {card.value}
                </Typography>
                
                {/* Subtle accent */}
                <div className={cn(
                  "w-2 h-2 rounded-full bg-gradient-to-br opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:scale-125",
                  card.gradient
                )}></div>
              </div>
            </div>
          </div>

          {/* Progress bar effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={cn(
              "h-full bg-gradient-to-r transition-all duration-700 group-hover:w-full w-0",
              card.gradient
            )}></div>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          </div>
        </div>
      ))}
    </div>
  );
}