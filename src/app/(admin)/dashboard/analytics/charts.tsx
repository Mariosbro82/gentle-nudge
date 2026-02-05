"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartsProps {
    scanData: { date: string; scans: number }[];
    deviceData: { name: string; value: number }[];
    metrics: {
        totalScans: number;
        uniqueVisitors: number;
        avgDaily: number;
        conversionRate: number;
    };
}

const COLORS = ["#0ea5e9", "#14b8a6", "#6366f1", "#f59e0b"]; // Sky, Teal, Indigo, Amber

export function AnalyticsCharts({ scanData, deviceData, metrics }: ChartsProps) {
    const statCards = [
        { title: "Total Scans", value: metrics.totalScans, icon: BarChart3, color: "text-sky-500" },
        { title: "Unique Visitors", value: metrics.uniqueVisitors, icon: Users, color: "text-teal-500" },
        { title: "Avg. Daily Scans", value: metrics.avgDaily, icon: TrendingUp, color: "text-indigo-500" },
        { title: "Conversion Rate", value: `${metrics.conversionRate}%`, icon: Target, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="bg-zinc-900/50 border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Scans Over Time */}
                <Card className="bg-zinc-900/50 border-white/5 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white">Scans Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {scanData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={scanData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#666"
                                            fontSize={12}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            stroke="#666"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#18181b",
                                                border: "1px solid #333",
                                                borderRadius: "8px",
                                                color: "#fff"
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="scans"
                                            stroke="#0ea5e9"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-zinc-500">
                                No data available yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Device Breakdown */}
                <Card className="bg-zinc-900/50 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-white">Device Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {deviceData.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {deviceData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#18181b",
                                                border: "1px solid #333",
                                                borderRadius: "8px",
                                                color: "#fff"
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                                    {deviceData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-xs text-zinc-400">
                                                {entry.name} ({entry.value})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-zinc-500">
                                No data available yet
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
