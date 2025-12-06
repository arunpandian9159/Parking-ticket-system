export function Card({ children, className, ...props }) {
    return (
        <div
            className={`bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 ${className || ''}`}
            {...props}
        >
            {children}
        </div> 
    );
}
