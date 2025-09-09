import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";


const ConfirmDialog = ({ confirmDialog, onClose, onConfirm }: any) => {
  const [newDateTime, setNewDateTime] = useState<Dayjs | null>(dayjs());

  const isReschedule = confirmDialog?.action === "reschedule";

  return (
    <Dialog open={!!confirmDialog} onClose={onClose}>
      <DialogTitle>
        {isReschedule
          ? "Reschedule Appointment"
          : `Confirm ${confirmDialog?.action}`}
      </DialogTitle>
      <DialogContent>
        {isReschedule ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select new date & time"
              value={newDateTime}
              onChange={(newValue: Dayjs | null) => setNewDateTime(newValue)}
              sx={{ mt: 2 }}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        ) : (
          <Typography>
            Are you sure you want to {confirmDialog?.action} this appointment?
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color={isReschedule ? "primary" : "error"}
          onClick={() => {
            if (!isReschedule) {
              onConfirm(confirmDialog?.id, confirmDialog?.action);
            } else {
              if (!newDateTime) return; // prevent empty date
              onConfirm(confirmDialog?.id, "reschedule", newDateTime);
            }
            onClose();
          }}
          disabled={isReschedule && !newDateTime} // disable confirm if no date
        >
          {isReschedule ? "Confirm" : `Yes, ${confirmDialog?.action}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
