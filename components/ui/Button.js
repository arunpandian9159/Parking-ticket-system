export function Button({ children, className, variant = 'primary', ...props }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-900";

    const variants = {
        primary: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-lg shadow-teal-500/30 focus:ring-teal-500",
        secondary: "bg-charcoal-700 hover:bg-charcoal-600 text-white focus:ring-charcoal-500",
        outline: "border-2 border-teal-500/30 hover:border-teal-400 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 focus:ring-teal-500",
        ghost: "text-gray-400 hover:bg-charcoal-700 hover:text-white focus:ring-charcoal-500",
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
