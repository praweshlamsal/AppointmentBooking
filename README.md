# Appointment Quick Actions – Frontend Coding Assignment

## Overview

This project is a mini-feature for an **Appointment Management System** built using **Vite** and **React 18**. 

---

## Core Features

- **AppointmentQuickActions Component**: Displays appointment cards in a responsive grid layout.
- **Appointment Cards**:
  - Patient Name
  - Appointment Time
  - Service
  - Status
  - Staff Member
- **Action Buttons**:
  - `Check In`
  - `Reschedule`
  - `Cancel`
  - `View Receipt`
- **Status Indicators**: Color-coded for quick reference
  - `Scheduled` → Info
  - `Checked In` → Success
  - `Completed` → Default
  - `Cancelled` → Error
- **Data Management**:
  - Uses **React Query** with a **mock API hook** (`useAppointmentActions.ts`)
  - Implements **optimistic updates** for status changes
- **UI Feedback**:
  - Loading indicators while fetching data
  - Error messages for failed requests
  - Toast notifications for successful actions

---

## Bonus Features

- **Confirmation Dialogs** for destructive actions like `Reschedule` and `Cancel`
- **Multilingual Support** (English / French) using a translation setup
- **Search and Filter Functionality**:
  - Search by patient name
  - Filter by appointment status
- **Responsive Grid Layout**:
  - Displays 2–4 cards per row depending on screen size

---

## Technical Specifications

### Appointment Interface

```ts
interface Appointment {
  id: string;
  patientName: string;
  appointmentTime: string;
  service: string;
  status: 'scheduled' | 'checked-in' | 'completed' | 'cancelled';
  staffMember: string;
}
