import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useAppointmentActions } from "./hooks/useAppointmentActions";

export default function CreateAppointmentButton() {
  const { createAppointment } = useAppointmentActions();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<{
    id: string;
    patientName: string;
    service: string;
    staffMember: string;
    datetime: Dayjs | null;
  }>({
    id: "",
    patientName: "",
    service: "",
    staffMember: "",
    datetime: dayjs(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    if (!form.id || !form.patientName || !form.service || !form.staffMember || !form.datetime) {
      return;
    }

    createAppointment.mutate({
      id: form.id,
      patientName: form.patientName,
      appointmentTime: form.datetime.toISOString(),
      service: form.service,
      status: "scheduled", // default when creating
      staffMember: form.staffMember,
    });

    setOpen(false);
    setForm({
      id: "",
      patientName: "",
      service: "",
      staffMember: "",
      datetime: dayjs(),
    });
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create Appointment
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Appointment</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="ID"
            name="id"
            value={form.id}
            onChange={handleChange}
          />
          <TextField
            label="Patient Name"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
          />
          <TextField
            label="Service"
            name="service"
            value={form.service}
            onChange={handleChange}
          />
          <TextField
            label="Staff Member"
            name="staffMember"
            value={form.staffMember}
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={form.datetime}
              onChange={(newValue) =>
                setForm((prev) => ({ ...prev, datetime: newValue }))
              }
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
