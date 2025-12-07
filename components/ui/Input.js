export function Input({ label, error, className, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2 rounded-lg border border-charcoal-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200 bg-charcoal-800 text-white placeholder-gray-500 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    } ${className || ''}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
}
