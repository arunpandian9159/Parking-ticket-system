'use client'

export default function TicketReceipt({ ticket }) {
    if (!ticket) return null

    return (
        <div id="ticket-receipt" className="hidden print:block print:w-full p-8 max-w-sm mx-auto bg-white">
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider">Parking Receipt</h1>
                <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-4 text-sm font-mono">
                <div className="flex justify-between">
                    <span className="text-gray-600">Ticket ID:</span>
                    <span className="font-bold">{ticket.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between"> 
                    <span className="text-gray-600">Spot:</span>
                    <span className="font-bold text-lg">{ticket.parking_spot}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-bold">{ticket.license_plate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Entry:</span>
                    <span>{new Date(ticket.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="border-t border-dashed border-gray-300 my-4"></div>

                <div className="flex justify-between items-end">
                    <span className="font-bold">Total:</span>
                    <span className="text-2xl font-bold">₹{ticket.price}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Rate:</span>
                    <span>{ticket.vehicle_type}</span>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                <p>Thank you for parking with us!</p>
                <p>Please retain this ticket for exit.</p>
            </div>
        </div>
    )
}
