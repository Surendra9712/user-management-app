'use client';
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Card} from "@/components/common/Card";

type Props = {
    data: { month: string; count: number }[];
};

export default function JoinByDateBarChart({data}: Props) {
    return (
        <Card className="shadow-sm">
            <h2 className="text-center text-lg font-semibold mb-2">Users Joined Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="count" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}