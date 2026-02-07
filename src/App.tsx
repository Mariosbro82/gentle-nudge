import { Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/dashboard/sidebar";

// Page imports - will be lazy loaded
import { Suspense, lazy } from "react";

// Dashboard pages
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const DevicesPage = lazy(() => import("@/pages/dashboard/devices"));
const LeadsPage = lazy(() => import("@/pages/dashboard/leads"));
const AnalyticsPage = lazy(() => import("@/pages/dashboard/analytics"));
const SettingsPage = lazy(() => import("@/pages/dashboard/settings"));

// Auth pages
const LoginPage = lazy(() => import("@/pages/login"));

// NFC public pages
const ProfilePage = lazy(() => import("@/pages/p/[userId]"));
const NfcTapPage = lazy(() => import("@/pages/t/[uid]"));
const CampaignPage = lazy(() => import("@/pages/campaign/[companyId]"));
const ReviewPage = lazy(() => import("@/pages/review/[companyId]"));

// Marketing
// Marketing
const MarketingPage = lazy(() => import("@/pages/marketing"));
const ProductsPage = lazy(() => import("@/pages/products"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const CompanyPage = lazy(() => import("@/pages/company"));
const ClaimPage = lazy(() => import("@/pages/claim/[uid]"));

// Loader component
function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-zinc-400">Loading...</span>
            </div>
        </div>
    );
}

// Admin layout wrapper
function AdminLayout() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans antialiased pl-64">
            <AdminSidebar />
            <main className="p-8">
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
}

// NFC layout wrapper (minimal, for public pages)
function NfcLayout() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Suspense fallback={<PageLoader />}><MarketingPage /></Suspense>} />
                    <Route path="/products" element={<Suspense fallback={<PageLoader />}><ProductsPage /></Suspense>} />
                    <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><PricingPage /></Suspense>} />
                    <Route path="/company" element={<Suspense fallback={<PageLoader />}><CompanyPage /></Suspense>} />
                    <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />

                    {/* NFC public routes */}
                    <Route element={<NfcLayout />}>
                        <Route path="/p/:userId" element={<ProfilePage />} />
                        <Route path="/t/:uid" element={<NfcTapPage />} />
                        <Route path="/campaign/:companyId" element={<CampaignPage />} />
                        <Route path="/review/:companyId" element={<ReviewPage />} />
                        <Route path="/claim/:uid" element={<ClaimPage />} />
                    </Route>

                    {/* Protected admin routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="devices" element={<DevicesPage />} />
                        <Route path="leads" element={<LeadsPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </ThemeProvider>
    );
}
