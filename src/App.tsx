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
const TeamPage = lazy(() => import("@/pages/dashboard/team"));
const TopPerformersPage = lazy(() => import("@/pages/dashboard/top-performers"));

// Auth pages
const LoginPage = lazy(() => import("@/pages/login"));
const OnboardingPage = lazy(() => import("@/pages/onboarding"));
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));
const AuthCallbackPage = lazy(() => import("@/pages/auth/callback"));

// Admin pages
import AdminSecretLogin from "@/pages/admin-secret-login"; // New secret signup page
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminRoute } from "@/components/auth/admin-route";
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard"));
const AdminUsersPage = lazy(() => import("@/pages/admin/users"));
const AdminChipsPage = lazy(() => import("@/pages/admin/chips"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/analytics"));
const AdminOrganizationsPage = lazy(() => import("@/pages/admin/organizations"));
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

// Footer Pages
const CareersPage = lazy(() => import("@/pages/careers"));
const ContactPage = lazy(() => import("@/pages/contact"));
const PrivacyPage = lazy(() => import("@/pages/privacy"));
const TermsPage = lazy(() => import("@/pages/terms"));
const ImprintPage = lazy(() => import("@/pages/imprint"));

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

import ScrollToTop from "@/components/ScrollToTop";
import { PasswordGate } from "@/components/PasswordGate";

export default function App() {
    return (
        <PasswordGate>
        <ThemeProvider defaultTheme="system">
            <AuthProvider>
                <ScrollToTop />
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

                    {/* Footer Routes */}
                    <Route path="/careers" element={<Suspense fallback={<PageLoader />}><CareersPage /></Suspense>} />
                    <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
                    <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />
                    <Route path="/terms" element={<Suspense fallback={<PageLoader />}><TermsPage /></Suspense>} />
                    <Route path="/imprint" element={<Suspense fallback={<PageLoader />}><ImprintPage /></Suspense>} />

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
                    <Route path="/admin-secret-login" element={<AdminSecretLogin />} />

                    <Route path="/admin" element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
                            <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>} />
                            <Route path="chips" element={<Suspense fallback={<PageLoader />}><AdminChipsPage /></Suspense>} />
                            <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AdminAnalyticsPage /></Suspense>} />
                            <Route path="organizations" element={<Suspense fallback={<PageLoader />}><AdminOrganizationsPage /></Suspense>} />
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
                        <Route path="team" element={<TeamPage />} />
                        <Route path="top-performers" element={<TopPerformersPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </ThemeProvider>
        </PasswordGate>
    );
}
