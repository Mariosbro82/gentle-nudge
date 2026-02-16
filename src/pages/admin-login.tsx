
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            if (authData.user) {
                // Use server-side is_admin() RPC to verify admin role
                const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin');

                if (roleError || !isAdmin) {
                    await supabase.auth.signOut();
                    throw new Error("Access Denied: Administrative privileges required.");
                }

                navigate("/admin/dashboard");
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Authentication failed.";
            alert(message);
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
                        System Administration
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Restricted Access. Authorized Personnel Only.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder="Admin ID"
                            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-red-500/20"
                        />
                        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input
                            {...register("password")}
                            type="password"
                            placeholder="Passcode"
                            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-red-500/20"
                        />
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
            </div>
        </div>
    );
}
