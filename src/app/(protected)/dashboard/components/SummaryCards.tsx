import {SummaryData} from "@/types/summaryData";

export default function SummaryCards({data}: { data: SummaryData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div role="listitem" className="p-4 bg-white rounded-xl shadow w-full  border-l-4 border-sky-500">
                <h3 className="text-gray-500">Total Users</h3>
                <p className="text-2xl font-semibold">{data.total}</p>
            </div>
            <div role="listitem" className="p-4 bg-white rounded-xl shadow w-full  border-l-4 border-green-500">
                <h3 className="text-gray-500">Active Users</h3>
                <p className="text-2xl font-semibold">{data.active}</p>
            </div>

            <div role="listitem" className="p-4 bg-white rounded-xl shadow w-full border-l-4 border-red-500">
                <h3 className="text-gray-500">Inactive Users</h3>
                <p className="text-2xl font-semibold">{data.inactive}</p>
            </div>
        </div>
    );
}
