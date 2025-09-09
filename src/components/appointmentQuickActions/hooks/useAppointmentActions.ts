import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockAppointments } from "../../../mockdata";

let appointmentsData = [...mockAppointments];

const fetchAppointments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...appointmentsData]);
    }, 300);
  });
};

export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useAppointmentActions = () => {
  const queryClient = useQueryClient();

  const updateAppointment = (id: string, updates: Partial<any>) => {
    appointmentsData = appointmentsData.map((appt) =>
      appt.id === id ? { ...appt, ...updates } : appt
    );
  };

  const checkIn = useMutation({
    mutationFn: async (id: string) => ({ id, status: "checked-in" }),
    onSuccess: (data) => {
      updateAppointment(data.id, { status: data.status });
    },
  });

  const reschedule = useMutation({
    mutationFn: async ({ id, newTime }: { id: string; newTime: string }) => {
      return { id, status: "scheduled", appointmentTime: newTime };
    },
    onSuccess: (data) => {
      updateAppointment(data.id, {
        status: data.status,
        appointmentTime: data.appointmentTime,
      });
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => ({ id, status: "cancelled" }),
    onSuccess: (data) => {
      updateAppointment(data.id, { status: data.status });
    },
  });

  const viewReceipt = useMutation({
    mutationFn: async (id: string) => ({
      id,
      receiptUrl: `/receipts/${id}`,
    }),
    onSuccess: (data) => {
      // Open receipt in a new tab
      window.open(data.receiptUrl, "_blank");
    },
  });

  const createAppointment = useMutation({
    mutationFn: async (newAppointment: {
      id: string;
      patientName: string;
      appointmentTime:string;
      service: string;
      staffMember: string;
      status?: string;
    }) => ({
      ...newAppointment,
      status: newAppointment.status ?? "scheduled",
    }),
    onSuccess: (newApt) => {
      queryClient.setQueryData(["appointments"], (old: any) => [
        ...(old ?? []),
        newApt,
      ]);
    },
  });

  return { checkIn, reschedule, cancel, viewReceipt, createAppointment };
};
