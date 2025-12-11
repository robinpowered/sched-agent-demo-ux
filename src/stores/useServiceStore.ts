import { create } from 'zustand';
import { ServiceTicket } from '../types';
import { MOCK_SERVICE_TICKETS } from '../constants/mockData';

interface ServiceState {
    serviceTickets: ServiceTicket[];
    selectedServiceTicket: ServiceTicket | null;

    // Actions
    setServiceTickets: (tickets: ServiceTicket[] | ((prev: ServiceTicket[]) => ServiceTicket[])) => void;
    setSelectedServiceTicket: (ticket: ServiceTicket | null) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
    serviceTickets: MOCK_SERVICE_TICKETS,
    selectedServiceTicket: null,

    setServiceTickets: (tickets) => {
      if (typeof tickets === "function") {
        set((state) => ({ serviceTickets: tickets(state.serviceTickets) }));
      } else {
        set({ serviceTickets: tickets });
      }
    },
    setSelectedServiceTicket: (ticket) => set({ selectedServiceTicket: ticket }),
}));
