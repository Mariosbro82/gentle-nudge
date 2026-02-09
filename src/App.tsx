import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

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
const OnboardingPage = lazy(() => import("@/pages/onboarding"));
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));
const AuthCallbackPage = lazy(() => import("@/pages/auth/callback"));

// Admin pages
import AdminLogin from "@/pages/admin-login"; // Eager load for better UX on secret route
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminRoute } from "@/components/auth/admin-route";
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard"));
const AdminUsersPage = lazy(() => import("@/pages/admin/users"));
const AdminChipsPage = lazy(() => import("@/pages/admin/chips"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/analytics"));
const AdminSupportPage = lazy(() => import("@/pages/admin/support"));

// NFC public pages
const ProfilePage = lazy(() => import("@/pages/p/[userId]"));
const NfcTapPage = lazy(() => import("@/pages/t/[uid]"));
const CampaignPage = lazy(() => import("@/pages/campaign/[companyId]"));
const ReviewPage = lazy(() => import("@/pages/review/[companyId]"));

// Marketing
const MarketingPage = lazy(() => import("@/pages/marketing"));
const ShopPage = lazy(() => import("@/pages/shop/index"));
const ProductPage = lazy(() => import("@/pages/shop/[id]"));
const PlatformPage = lazy(() => import("@/pages/platform"));
const SolutionsPage = lazy(() => import("@/pages/solutions"));
const SustainabilityPage = lazy(() => import("@/pages/sustainability"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const AboutPage = lazy(() => import("@/pages/about"));
const CheckoutPage = lazy(() => import("@/pages/shop/checkout"));
const AnalyticsPublicPage = lazy(() => import("@/pages/analytics"));
const ClaimPage = lazy(() => import("@/pages/claim/[uid]"));

// Loader component
function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-zinc-400">Loading...</span>
            </div>
        </div>
    );
}

// NFC layout wrapper (minimal, for public pages)

// NFC layout wrapper (minimal, for public pages)
function NfcLayout() {
    return (
        <div className="dark min-h-screen bg-background text-foreground">
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider defaultTheme="system">
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Suspense fallback={<PageLoader />}><MarketingPage /></Suspense>} />
                    <Route path="/platform" element={<Suspense fallback={<PageLoader />}><PlatformPage /></Suspense>} />
                    <Route path="/solutions" element={<Suspense fallback={<PageLoader />}><SolutionsPage /></Suspense>} />
                    <Route path="/sustainability" element={<Suspense fallback={<PageLoader />}><SustainabilityPage /></Suspense>} />
                    <Route path="/shop" element={<Suspense fallback={<PageLoader />}><ShopPage /></Suspense>} />
                    <Route path="/shop/:id" element={<Suspense fallback={<PageLoader />}><ProductPage /></Suspense>} />
                    <Route path="/shop/checkout" element={<Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense>} />
                    <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><PricingPage /></Suspense>} />
                    <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
                    <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPublicPage /></Suspense>} />
                    <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
                    <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>} />
                    <Route path="/reset-password" element={<Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense>} />
                    <Route path="/auth/callback" element={<Suspense fallback={<PageLoader />}><AuthCallbackPage /></Suspense>} />

                    {/* NFC public routes */}
                    <Route element={<NfcLayout />}>
                        <Route path="/p/:userId" element={<ProfilePage />} />
                        <Route path="/t/:uid" element={<NfcTapPage />} />
                        <Route path="/campaign/:companyId" element={<CampaignPage />} />
                        <Route path="/review/:companyId" element={<ReviewPage />} />
                        <Route path="/claim/:uid" element={<ClaimPage />} />
                    </Route>

                    {/* Protected onboarding route */}
                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute skipOnboardingCheck>
                                <Suspense fallback={<PageLoader />}>
                                    <OnboardingPage />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />

                    {/* Secret Admin Routes */}
                    <Route path="/admin-secret-login" element={<AdminLogin />} />

                    <Route path="/admin" element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
                            <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>} />
                            <Route path="chips" element={<Suspense fallback={<PageLoader />}><AdminChipsPage /></Suspense>} />
                            <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AdminAnalyticsPage /></Suspense>} />
                            <Route path="support" element={<Suspense fallback={<PageLoader />}><AdminSupportPage /></Suspense>} />
                            {/* Redirect /admin to /admin/dashboard */}
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        </Route>
                    </Route>

                    {/* Protected admin routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
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
