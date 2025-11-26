import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Badge } from './ui/badge';
import { ServiceTicket } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface MeetingServicesPageProps {
  serviceTickets: ServiceTicket[];
  onTicketClick: (ticketId: string) => void;
}

export function MeetingServicesPage({ serviceTickets, onTicketClick }: MeetingServicesPageProps) {
  const [sortColumn, setSortColumn] = React.useState<keyof ServiceTicket | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const handleSort = (column: keyof ServiceTicket) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column: keyof ServiceTicket) => {
    if (sortColumn !== column) {
      return <FontAwesomeIcon icon={faSort} className="w-3 h-3 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="w-3 h-3 text-gray-600" />
      : <FontAwesomeIcon icon={faSortDown} className="w-3 h-3 text-gray-600" />;
  };

  const sortedTickets = React.useMemo(() => {
    if (!sortColumn) {
      // Default: show newest first (by created date)
      return [...serviceTickets].sort((a, b) => 
        new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    }

    return [...serviceTickets].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [serviceTickets, sortColumn, sortDirection]);

  const getStatusColor = (status: ServiceTicket['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">
      {/* Content */}
      <div className="flex-1 w-full overflow-auto p-6">
        {serviceTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 mb-2">No service tickets yet</p>
            <p className="text-gray-400">
              Service tickets will appear here when you order catering or request other meeting services
            </p>
          </div>
        ) : (
          <div className="w-full border border-gray-200 rounded-lg overflow-auto">
            <div className="min-w-max">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[120px]">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Status {getSortIcon('status')}
                      </button>
                    </TableHead>
                    <TableHead className="w-[130px]">
                      <button
                        onClick={() => handleSort('id')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        ID {getSortIcon('id')}
                      </button>
                    </TableHead>
                    <TableHead className="w-[180px]">
                      <button
                        onClick={() => handleSort('eventStartTime')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Event Start Time {getSortIcon('eventStartTime')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('serviceName')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Service Name {getSortIcon('serviceName')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('space')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Space {getSortIcon('space')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('eventTitle')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Event Title {getSortIcon('eventTitle')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('approver')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Approver {getSortIcon('approver')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('requester')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Requester {getSortIcon('requester')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('assignee')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Assignee {getSortIcon('assignee')}
                      </button>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <button
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Category {getSortIcon('category')}
                      </button>
                    </TableHead>
                    <TableHead className="w-[150px]">
                      <button
                        onClick={() => handleSort('created')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Created {getSortIcon('created')}
                      </button>
                    </TableHead>
                    <TableHead className="w-[150px]">
                      <button
                        onClick={() => handleSort('lastUpdated')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        Last Updated {getSortIcon('lastUpdated')}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge className={`${getStatusColor(ticket.status)} border capitalize`}>
                          {ticket.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => onTicketClick(ticket.id)}
                          className="text-[#2774C1] hover:underline font-mono"
                        >
                          {ticket.id}
                        </button>
                      </TableCell>
                      <TableCell>{formatEventTime(ticket.eventStartTime)}</TableCell>
                      <TableCell>{ticket.serviceName}</TableCell>
                      <TableCell>{ticket.space}</TableCell>
                      <TableCell>{ticket.eventTitle}</TableCell>
                      <TableCell>{ticket.approver}</TableCell>
                      <TableCell>{ticket.requester}</TableCell>
                      <TableCell>{ticket.assignee}</TableCell>
                      <TableCell className="capitalize">{ticket.category}</TableCell>
                      <TableCell className="text-gray-500">{formatDate(ticket.created)}</TableCell>
                      <TableCell className="text-gray-500">{formatDate(ticket.lastUpdated)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}