

import { cn } from "@/lib/utils";

interface TemplatePreviewProps {
    template: 'minimalist-card' | 'premium-gradient' | 'event-badge';
    user: {
        name: string;
        title: string;
        avatar?: string | null;
    };
    scale?: number;
    className?: string;
}

export const TemplatePreview = ({ template, user, scale: _scale = 1, className }: TemplatePreviewProps) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const commonStyles = {
        wrapper: "w-full aspect-[1/0.6] relative rounded-lg overflow-hidden shadow-lg transition-all duration-300",
        content: "absolute inset-0 flex flex-col items-center justify-center p-4",
        avatar: "w-16 h-16 rounded-full mb-3 object-cover shadow-sm",
        name: "text-lg font-bold mb-1 truncate max-w-full text-center",
        title: "text-xs opacity-80 mb-4 truncate max-w-full text-center",
        actions: "flex gap-2 w-full justify-center mt-auto",
        button: "h-8 px-4 rounded-full text-[10px] font-medium flex items-center justify-center min-w-[80px]"
    };

    const renderContent = () => (
        <>
            <div className="flex flex-col items-center">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className={commonStyles.avatar} />
                ) : (
                    <div className={cn(commonStyles.avatar, "flex items-center justify-center text-xl font-bold",
                        template === 'minimalist-card' ? "bg-gray-100 text-gray-600" :
                            template === 'premium-gradient' ? "bg-white/10 text-white" :
                                "bg-black/20 text-white"
                    )}>
                        {getInitials(user.name || "User Name")}
                    </div>
                )}

                <h3 className={commonStyles.name}>{user.name || "Max Mustermann"}</h3>
                <p className={commonStyles.title}>{user.title || "CEO & Founder"}</p>
            </div>

            <div className={commonStyles.actions}>
                <div className={cn(commonStyles.button, "opacity-90", "bg-primary text-primary-foreground")}>Kontakt</div>
                <div className={cn(commonStyles.button, "opacity-70", "bg-muted text-muted-foreground")}>Website</div>
            </div>
        </>
    );

    switch (template) {
        case 'minimalist-card':
            return (
                <div className={cn("bg-white border border-gray-200", commonStyles.wrapper, className)}>
                    <div className={cn(commonStyles.content, "text-gray-900")}>
                        {renderContent()}
                    </div>
                </div>
            );

        case 'premium-gradient':
            return (
                <div className={cn("bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900", commonStyles.wrapper, className)}>
                    <div className={cn(commonStyles.content, "text-white")}>
                        {renderContent()}
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -ml-16 -mb-16" />
                </div>
            );

        case 'event-badge':
            return (
                <div className={cn(commonStyles.wrapper, className)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500" />
                    <div className="absolute inset-1 bg-white/95 rounded-md backdrop-blur-sm" />
                    <div className={cn(commonStyles.content, "text-gray-900")}>
                        {renderContent()}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-pink-500" />
                </div>
            );
        default:
            return null;
    }
};
