import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Crown } from "lucide-react";
import { useSelector } from 'react-redux';
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
function BillingDrawer({ open, onClose }) {

    const { userData } = useSelector((state) => state.user);


    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder(plan)
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data?.order?.amount,
                currency: data?.order?.currency,
                name: "Ciel-AI",
                description: `${data?.plan?.name} Plan`,
                order_id: data?.order?.id,
                handler: async (response) => {
                    //   console.log(response)

                    try {
                        const data = await verifyPayment(response)

                        console.log(data)
                    } catch (error) {
                             console.log(error)
                    }

                },
                theme:{
                    color:"#4F46E5"
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-y-0 right-0 z-50 w-[380px] max-w-full bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
                    >
                        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
                            <div>
                                <div className="text-white text-lg font-semibold">
                                    Billing
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Plans & Credits
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="text-white p-2 rounded-xl hover:bg-white/10 transition"
                            >
                                <X />
                            </button>
                        </div>

                        {/* =======PLAN-PAGE============== */}
                        <div className='px-6 pt-3 pb-2 flex-shrink-0'>
                            <div className='group rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all duration-300'>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Current Plan</p>
                                        <h3 className="text-base font-semibold text-white mt-0.5 group-hover:text-indigo-400 transition-colors duration-300">
                                            {userData?.plan || "Free"}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/10 to-yellow-500/5 border border-amber-400/20 group-hover:border-amber-400/40 transition-all duration-300">
                                        <Crown className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors duration-300" />
                                    </div>
                                </div>

                                {/* =========CREDITS============ */}
                                <div className='mt-3'>
                                    <div className='flex justify-between items-center text-xs text-slate-400 mb-2'>
                                        <span className="font-medium">Credits</span>
                                        <span className="font-mono text-slate-300">
                                            {userData?.credits || 0} / {userData?.totalCredits || 100}
                                        </span>
                                    </div>

                                    <div className='h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5'>
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out rounded-full"
                                            style={{
                                                width: `${((userData?.credits || 0) / (userData?.totalCredits || 1) * 100)}%`,
                                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =========PLANS CARDS=============== */}
                        <div className="flex-1 min-h-0 px-6 pb-5 space-y-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {/* Starter */}
                            <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-4 transition-all duration-300 hover:border-indigo-500/30">
                                <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-500 group-hover:bg-indigo-500/20" />
                                <div className="relative">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-semibold text-white">Starter Plan</h3>
                                        <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Popular</span>
                                    </div>
                                    <div className="mt-1.5 flex items-end gap-1">
                                        <span className="text-2xl font-bold text-indigo-400">₹199</span>
                                        <span className="mb-0.5 text-xs text-slate-400">/month</span>
                                    </div>
                                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                                        500 Credits
                                    </p>
                                    <button
                                        onClick={() => handleUpgrade("starter")}
                                        className="mt-3 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-2.5 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:from-indigo-600 hover:to-indigo-700 hover:scale-[1.01] active:scale-[0.98]">
                                        Upgrade Now
                                    </button>
                                </div>
                            </div>

                            {/* Pro */}
                            <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-4 transition-all duration-300 hover:border-purple-500/30">
                                <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20" />
                                <div className="relative">
                                    <h3 className="text-base font-semibold text-white">Pro Plan</h3>
                                    <div className="mt-1.5 flex items-end gap-1">
                                        <span className="text-2xl font-bold text-purple-400">₹499</span>
                                        <span className="mb-0.5 text-xs text-slate-400">/month</span>
                                    </div>
                                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                                        1000 Credits
                                    </p>
                                    <button
                                        onClick={() => handleUpgrade("pro")}
                                        className="mt-3 w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-2.5 text-white font-semibold text-sm shadow-lg shadow-purple-500/20 transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:scale-[1.01] active:scale-[0.98]">
                                        Upgrade Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default BillingDrawer;