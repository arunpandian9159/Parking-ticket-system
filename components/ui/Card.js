export function Card({ children, className, ...props }) {
    return (
        <div
            className={`bg-charcoal-800/90 backdrop-blur-md rounded-xl shadow-xl border border-charcoal-700/50 p-6 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
}
