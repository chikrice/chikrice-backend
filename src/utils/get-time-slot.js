const getCurrentTimeSlot = () => {
  const now = new Date();
  const hours = now.getHours();

  // Define time slots
  const timeSlots = [
    { start: 0, end: 6, slot: '00:00-06:00' },
    { start: 6, end: 9, slot: '06:00-09:00' },
    { start: 9, end: 12, slot: '09:00-12:00' },
    { start: 12, end: 15, slot: '12:00-15:00' },
    { start: 15, end: 18, slot: '15:00-18:00' },
    { start: 18, end: 20, slot: '18:00-21:00' },
    { start: 21, end: 0, slot: '21:00-24:00' },
  ];

  // Get the current time slot
  for (const { start, end, slot } of timeSlots) {
    if (hours >= start && hours < end) {
      return slot;
    }
  }

  // Fallback if somehow not found
  return null;
};

module.exports = getCurrentTimeSlot;
