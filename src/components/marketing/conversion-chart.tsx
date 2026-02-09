import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConversionChart() {
    // Data based on user instruction:
    // Papier: 4.4%
    // QR-Code: 6.4%
    // NFCwear: 300% (Performance gain implied/displayed as max value)

    // To make "300%" visually striking against 4.4 and 6.4, if we used raw numbers, 
    // 300 vs 6.4 would dwarf the others completely (50x difference).
    // If the user means "300% OF paper", that's 13.2 vs 4.4. 
    // If the user means "300% increase", that's 4x or 400% of paper.
    // However, the user said "displayt soll hier werden 300% als papier".
    // Visualizing 4.4, 6.4, and 300 on the same linear scale is tricky if 300 is the value.
    // BUT, usually these charts compare "Efficiency" or "Relative Conversion".
    // Let's assume the "Index" approach is still best for the *bars*, but the *labels* should be what the user asked.
    // 
    // Bar Heights (visual):
    // Paper: 1
    // QR: 1.5 
    // NFCwear: 3 (representing 3x / 300% performance of paper)

    const data = [
        {
            name: "Papier",
            value: 1,
            label: "4.4%",
            subLabel: "Conversion",
            color: "#52525b" // zinc-600
        },
        {
            name: "QR-Code",
            value: 1.45,
            label: "6.4%",
            subLabel: "Conversion",
            color: "#3b82f6" // blue-500
        },
        {
            name: "NFCwear",
            value: 3,
            label: "+300%",
            subLabel: "Performance",
            color: "#a855f7" // purple-500
        }
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="font-bold text-popover-foreground mb-1">{label}</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        {payload[0].payload.subLabel}
                    </p>
                    <p className="text-lg font-mono font-bold text-popover-foreground">
                        {payload[0].payload.label}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLabel = (props: any) => {
        const { x, y, width, index } = props;
        const entry = data[index];
        return (
            <g>
                <text
                    x={x + width / 2}
                    y={y - 25}
                    fill={entry.color}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-lg font-bold"
                    style={{ fontSize: '18px', fontWeight: 800 }}
                >
                    {entry.label}
                </text>
                <text
                    x={x + width / 2}
                    y={y - 10}
                    fill="#71717a"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ fontSize: '10px' }}
                >
                    {entry.subLabel}
                </text>
            </g>
        );
    };

    return (
        <Card className="bg-transparent border-0 shadow-none w-full max-w-3xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl md:text-3xl text-center font-bold text-foreground">
                    Lead-Conversion im Vergleich
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                            <XAxis
                                dataKey="name"
                                stroke="#52525b"
                                tick={{ fill: '#a1a1aa', fontSize: 14, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar
                                dataKey="value"
                                radius={[8, 8, 0, 0]}
                                animationDuration={1500}
                                barSize={80}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        fillOpacity={index === 2 ? 1 : 0.8}
                                        stroke={index === 2 ? "rgba(255,255,255,0.2)" : "none"}
                                        strokeWidth={1}
                                    />
                                ))}
                                <LabelList content={<CustomLabel />} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            {/* Footer removed as requested */}
        </Card>
    );
}
