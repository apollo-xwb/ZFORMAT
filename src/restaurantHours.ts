export const RONDEBOSCH_VENUE = {
  name: "RocoMamas Rondebosch",
  address: "Shop 37, Riverside Mall, Main Road",
  summary: "Open daily • Sun–Thu 09:00–21:00 • Fri–Sat 09:00–22:00"
};

export function getCloseHourForDate(dateIso: string): number {
  const day = new Date(`${dateIso}T12:00:00`).getDay();
  return day === 5 || day === 6 ? 22 : 21;
}

export function getHoursLabelForDate(dateIso: string): string {
  const day = new Date(`${dateIso}T12:00:00`).getDay();
  if (day === 5 || day === 6) return "Fri–Sat 09:00–22:00";
  return "Sun–Thu 09:00–21:00";
}

/** 30-minute slots from 09:00 through last seating (30 min before close). */
export function getBookingTimeSlots(dateIso: string): string[] {
  const closeHour = getCloseHourForDate(dateIso);
  const lastSeatMinutes = closeHour * 60 - 30;
  const slots: string[] = [];
  for (let minutes = 9 * 60; minutes <= lastSeatMinutes; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

export function getDefaultBookingTime(dateIso: string): string {
  const slots = getBookingTimeSlots(dateIso);
  const preferred = slots.find((t) => t === "12:00") || slots.find((t) => t === "18:30");
  return preferred || slots[Math.floor(slots.length / 2)] || "12:00";
}
