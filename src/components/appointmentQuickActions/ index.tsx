import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import {
  useAppointments,
  useAppointmentActions,
} from "./hooks/useAppointmentActions";
import { toast } from "react-toastify";
import ConfirmDialog from "../dialog/ConfirmDialog";
import CreateAppointmentButton from "./CreateAppointment";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../languageSwitch/LanguageSwitcher";

const statusColors: Record<
  string,
  "default" | "success" | "error" | "warning" | "info"
> = {
  scheduled: "info",
  "checked-in": "success",
  completed: "default",
  cancelled: "error",
};

const AppointmentQuickActions: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { data: appointments, isLoading, isError } = useAppointments();
  const { checkIn, reschedule, cancel, viewReceipt } = useAppointmentActions();

  const [confirmDialog, setConfirmDialog] = useState<{
    id: string;
    action: "cancel" | "reschedule";
  } | null>(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAppointments = useMemo(() => {
    return appointments
      ?.filter((appt) =>
        appt.patientName.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((appt) => (statusFilter ? appt.status === statusFilter : true));
  }, [appointments, searchText, statusFilter]);

  const handleAction = async (
    id: string,
    action: "checkIn" | "reschedule" | "cancel" | "viewReceipt",
    newTime?: string
  ) => {
    try {
      if (action === "checkIn") await checkIn.mutateAsync(id);
      if (action === "reschedule" && newTime)
        reschedule.mutate({ id, newTime });
      if (action === "cancel") await cancel.mutateAsync(id);
      if (action === "viewReceipt") await viewReceipt.mutateAsync(id);

      toast.success(
        t("appointment.messages.success", {
          action: t(`appointment.${action}`),
        })
      );
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    } catch {
      toast.error(
        t("appointment.messages.failure", {
          action: t(`appointment.${action}`),
        })
      );
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <Typography color="error">
        {t("appointment.messages.loadError")}
      </Typography>
    );

  return (
    <Box sx={{ p: 2 }}>
      {/* Top Controls */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <CreateAppointmentButton />
          <LanguageSwitcher />
          <TextField
            label={t("appointment.patientName")}
            placeholder={t("appointment.patientName")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t("appointment.status")}</InputLabel>
            <Select
              value={statusFilter}
              label={t("appointment.status")}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="scheduled">
                {t("appointment.scheduled")}
              </MenuItem>
              <MenuItem value="checked-in">
                {t("appointment.checked-in")}
              </MenuItem>
              <MenuItem value="cancelled">
                {t("appointment.cancelled")}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Appointment Grid */}
      {filteredAppointments?.length === 0 ? (
        <Typography variant="h4">😔 {t("appointment.messages.noAppointments")}</Typography>
      ) : null}
      <Grid container spacing={3}>
        {filteredAppointments.length && filteredAppointments?.map((appt) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={appt.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {appt.patientName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(appt.appointmentTime).toLocaleString()}
                </Typography>
                <Typography variant="body2">Service: {appt.service}</Typography>
                <Typography variant="body2">
                  Staff: {appt.staffMember}
                </Typography>

                <Chip
                  label={t(`appointment.${appt.status}`)}
                  color={statusColors[appt.status]}
                  size="small"
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 1 }} />

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAction(appt.id, "checkIn")}
                    disabled={checkIn.isLoading}
                  >
                    {t("appointment.checkIn")}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setConfirmDialog({ id: appt.id, action: "reschedule" })
                    }
                  >
                    {t("appointment.reschedule")}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() =>
                      setConfirmDialog({ id: appt.id, action: "cancel" })
                    }
                  >
                    {t("appointment.cancel")}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleAction(appt.id, "viewReceipt")}
                  >
                    {t("appointment.viewReceipt")}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={handleAction}
      />
    </Box>
  );
};

export default AppointmentQuickActions;
