'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { DataTable, Badge, Button } from './ui/DataTable';
import {
  Ticket,
  PlusCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Car,
  MapPin,
  Clock,
  FileText,
  Trash2,
  DollarSign
} from 'lucide-react';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parking_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const { error } = await supabase
        .from('parking_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const bulkUpdateStatus = async (tickets, newStatus) => {
    try {
      const ids = tickets.map(t => t.id);
      const { error } = await supabase
        .from('parking_tickets')
        .update({ status: newStatus })
        .in('id', ids);

      if (error) throw error;
      fetchTickets();
    } catch (error) {
      console.error('Error bulk updating tickets:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { variant: 'success', icon: <CheckCircle2 className="h-3 w-3" /> },
      pending: { variant: 'warning', icon: <Clock className="h-3 w-3" /> },
      disputed: { variant: 'error', icon: <AlertTriangle className="h-3 w-3" /> },
      overdue: { variant: 'error', icon: <AlertTriangle className="h-3 w-3" /> },
    };
    const config = statusConfig[status] || { variant: 'default', icon: null };
    return (
      <Badge variant={config.variant}>
        {config.icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Ticket ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
          #{row.original.id.slice(0, 8)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'license_plate',
      header: 'License Plate',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg">
            <Car className="h-4 w-4 text-indigo-600" />
          </div>
          <strong className="text-gray-900 font-semibold">{row.original.license_plate}</strong>
        </div>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.original.vehicle_make} {row.original.vehicle_model}
          </div>
          <div className="text-xs text-gray-500 capitalize">{row.original.vehicle_color}</div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'violation_type',
      header: 'Violation',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-100">
          {row.original.violation_type}
        </span>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-gray-600 max-w-[180px]">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
          <span className="truncate">{row.original.location}</span>
        </div>
      ),
    },
    {
      accessorKey: 'fine_amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-bold text-gray-900">{row.original.fine_amount.toFixed(2)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
      filterFn: (row, id, value) => {
        if (!value || value === 'all') return true;
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: 'issued_date',
      header: 'Issued Date',
      cell: ({ row }) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.original.issued_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link
            href={`/tickets/${row.original.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 transition-all shadow-sm"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
          {row.original.status === 'pending' && (
            <>
              <button
                onClick={() => updateTicketStatus(row.original.id, 'paid')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Pay
              </button>
              <button
                onClick={() => updateTicketStatus(row.original.id, 'disputed')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Dispute
              </button>
            </>
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], []);

  const filters = [
    {
      id: 'status',
      placeholder: 'All Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'disputed', label: 'Disputed' },
        { value: 'overdue', label: 'Overdue' },
      ],
    },
  ];

  const bulkActions = [
    {
      label: 'Mark Paid',
      icon: <CheckCircle2 className="h-4 w-4" />,
      variant: 'success',
      onClick: (selected) => bulkUpdateStatus(selected, 'paid'),
    },
    {
      label: 'Mark Disputed',
      icon: <AlertTriangle className="h-4 w-4" />,
      variant: 'destructive',
      onClick: (selected) => bulkUpdateStatus(selected, 'disputed'),
    },
  ];

  return (
    <div className="fade-in space-y-6">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Ticket className="text-violet-600" size={32} />
          Parking Tickets
        </h1>
        <div className="actions">
          <Link href="/tickets/create" className="btn btn-primary flex items-center gap-2">
            <PlusCircle size={18} /> Create New Ticket
          </Link>
        </div>
      </div>

      <DataTable
        data={tickets}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search tickets by plate, violation, location..."
        filterable={true}
        filters={filters}
        paginated={true}
        pageSize={10}
        selectable={true}
        onSelectionChange={setSelectedTickets}
        bulkActions={bulkActions}
        exportable={true}
        exportFilename="parking_tickets"
        columnToggle={true}
        onRefresh={fetchTickets}
        emptyMessage="No Tickets Found"
        emptyDescription="No parking tickets have been created yet. Create your first ticket to get started."
        emptyIcon={FileText}
      />
    </div>
  );
};

export default TicketList;
