export function Card({ children, className, ...props }) {
    return (
        <div
            className={`bg-card backdrop-blur-md rounded-xl shadow-xl border border-border p-6 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
}
