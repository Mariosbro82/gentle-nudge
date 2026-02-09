import { motion } from "framer-motion";

export const MockDashboard = () => {
    return (
        <div className="w-full h-full min-h-[400px] bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
            {/* Header */}
            <div className="h-12 border-b border-gray-200 dark:border-white/10 flex items-center px-4 gap-2 bg-gray-50/50 dark:bg-white/5">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 h-6 w-64 bg-gray-200 dark:bg-white/10 rounded-md" />
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex gap-6">
                {/* Sidebar */}
                <div className="w-48 hidden md:flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="h-8 w-full bg-gray-100 dark:bg-white/5 rounded-md"
                        />
                    ))}
                </div>

                {/* Main Area */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + 0.1 * i }}
                                className="h-24 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg p-4"
                            >
                                <div className="h-4 w-12 bg-gray-200 dark:bg-white/10 rounded mb-2" />
                                <div className="h-8 w-20 bg-gray-300 dark:bg-white/20 rounded" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg relative overflow-hidden"
                    >
                        {/* Fake Chart Lines */}
                        <div className="absolute inset-0 flex items-end justify-between px-6 pb-6 pt-12 gap-2">
                            {[40, 60, 45, 70, 50, 80, 65, 85, 90, 75, 60, 50, 70, 80, 95].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.8 + (i * 0.05), duration: 0.5, ease: "easeOut" }}
                                    className="flex-1 bg-blue-500/20 dark:bg-blue-500/30 rounded-t-sm hover:bg-blue-500/40 transition-colors"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Notification */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2, type: "spring" }}
                className="absolute top-16 right-6 w-64 bg-white dark:bg-[#1a1a1a] p-3 rounded-lg shadow-xl border border-gray-100 dark:border-white/10 flex gap-3 items-center"
            >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-lg">✓</div>
                <div>
                    <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded mb-1" />
                    <div className="h-2 w-32 bg-gray-100 dark:bg-white/5 rounded" />
                </div>
            </motion.div>
        </div>
    );
};
