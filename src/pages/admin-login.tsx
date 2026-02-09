
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"; // Assuming these exist
import { Input } from "@/components/ui/input"; // Assuming these exist
// import { toast } from "sonner"; // Removed as requested to fix dependency issue

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    secret: z.string().optional() // For admin promotion
});

type LoginForm = z.infer<typeof loginSchema>;


export default function AdminLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            secret: ""
        }
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            if (isSignup) {
                // Sign Up Flow
                const { data: authData, error } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            full_name: "Admin User" // Default name
                        }
                    }
                });
                if (error) throw error;
                alert("Account created! Please ask the system administrator to promote this account, or use the secret key if you have one.");

                // If secret key is provided and matches, auto-promote (requires backend support or SQL run)
                // Using client-side check for now as we don't have a secure edge function for this yet
                // Ideally this should be a DB function
                if (data.secret === "gemini-admin-setup" && authData.user) {
                    // CAUTION: This will likely fail due to RLS if the user isn't admin yet.
                    // However, users can update THEIR OWN row usually.
                    // But we want to update the ROLE.
                    // We will likely need to rely on the user asking me to run the SQL helper.
                    // BUT, let's try to see if we can do it via a special flow.
                    // Actually, RLS prevents users from updating their own role.
                    alert("Please tell the AI assistant to run the 'Promote to Admin' tool for your email: " + data.email);
                }

                setIsSignup(false);
            } else {
                // Login Flow
                const { data: authData, error } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });

                if (error) throw error;

                if (authData.user) {
                    // Check if user is actually an admin before redirecting
                    // This prevents regular users from logging in here and getting 404'd by the route
                    const { data: userData, error: _userError } = await supabase
                        .from('users')
                        .select('role')
                        .eq('auth_user_id', authData.user.id)
                        .single();

                    if (userData?.role !== 'admin') {
                        // Secret backdoor for setup
                        if (data.secret === "gemini-admin-setup") {
                            // We can't update role here due to RLS.
                            // We must fail and ask user to contact admin (me).
                            await supabase.auth.signOut();
                            throw new Error("Setup mode detected. Please ask the AI to run: Promote User " + data.email);
                        }

                        await supabase.auth.signOut();
                        throw new Error("Access Denied: Administrative privileges required.");
                    }

                    navigate("/admin/dashboard");
                }
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-zinc-950 p-8 rounded-lg border border-zinc-800 shadow-2xl shadow-red-900/10">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                        <ShieldCheck className="h-6 w-6 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isSignup ? "Create Admin Account" : "System Administration"}
                    </h1>
                    <p className="text-sm text-zinc-500">
                        {isSignup ? "Enter credentials to register." : "Restricted Access. Authorized Personnel Only."}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="Admin ID"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-red-500/20"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="Passcode"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-red-500/20"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition-all duration-200"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Lock className="w-4 h-4 mr-2" />
                        )}
                        Authenticate
                    </Button>
                </form>

                <div className="text-center text-xs text-zinc-700 font-mono">
                    IP: {`::1 (Localhost)`} <br />
                    Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
            </div>
        </div>
    );
}
