import {Card} from "@/components/common/Card";
import {Cell, Legend, Pie, PieChart, Tooltip} from "recharts";
import {PieChartData} from "@/types/pieChartData";

export default function AppPieChart({title, data, colors = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28']}: PieChartData) {
    return <Card className="w-full flex justify-center shadow-sm">
        {title &&
            <h2 className="text-center text-lg font-semibold mb-2">{title}</h2>
        }
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label>
                {data.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]}/>
                ))}
            </Pie>
            <Tooltip/>
            <Legend/>
        </PieChart>
    </Card>
}