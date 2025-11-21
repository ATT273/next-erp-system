import { ISummaryItem } from "@/types/inventories.type";
import { useDashboard } from "./dashboard-provider";

interface SummaryItemProps {
  item: ISummaryItem;
  className?: string;
}
const SummaryItem = ({ item, className }: SummaryItemProps) => {
  const { type, setType } = useDashboard();
  return (
    <div
      className={`
        flex flex-col justify-between h-[150px] p-4 rounded-xl shadow-md flex-1 cursor-pointer hover:ring-4 hover:ring-blue-400 hover:shadow-lg transition-all  
        ${className}
        ${type === item.key ? "ring-2 ring-blue-400" : ""}
        `}
      onClick={() => setType(item.key)}
    >
      <div className="flex justify-between items-center font-semibold">
        <p className="font-semibold text-2xl">{item.title}</p>
        {item.icon}
      </div>
      <p className="font-bold text-4xl text-end">{item.value}</p>
    </div>
  );
};

export default SummaryItem;
