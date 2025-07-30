"use client"
import {useUsers} from "@/hooks/useUsers";
import AppPieChart from "@/components/common/PieChart";
import JoinByDateBarChart from "@/app/(protected)/dashboard/components/JoinByDateBarChart";
import SummaryCards from "@/app/(protected)/dashboard/components/SummaryCards";

export default function UserAnalytics() {
    const {data: users = []} = useUsers();

    const roleData = Object.entries(
        users.reduce((acc: Record<string, number>, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({name, value}));


    const joinData = Object.entries(
        users.reduce((acc: Record<string, number>, user) => {
            const month = new Date(user.joinDate).toLocaleString('default', {month: 'short', year: 'numeric'});
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {})
    ).map(([month, count]) => ({month, count}));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-between">
                <AppPieChart data={[
                    {name: "Present", value: 10},
                    {name: "Absent", value: 3},
                    {name: "Leave", value: 4}]}
                             title={"Today's Attendance"}
                             colors={['#03ad31', '#ad1a03', '#FFBB28']}
                />
                <AppPieChart data={roleData} title={"User Role Breakdown"}/>
            </div>
            <JoinByDateBarChart data={joinData}/>
            <SummaryCards data={{total: 200, active: 150, inactive: 50}}/>
        </div>
    )
}