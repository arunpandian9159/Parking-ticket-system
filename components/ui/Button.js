export function Button({ children, className, variant = 'primary', ...props }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";

    const variants = {
        primary: "bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-lg shadow-teal-500/30 focus:ring-teal-500",
        secondary: "bg-secondary hover:bg-secondary/80 text-foreground focus:ring-secondary",
        outline: "border-2 border-teal-500/30 hover:border-teal-400 text-teal-600 dark:text-teal-400 hover:text-teal-500 hover:bg-teal-500/10 focus:ring-teal-500",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground focus:ring-secondary",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 focus:ring-red-500"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
