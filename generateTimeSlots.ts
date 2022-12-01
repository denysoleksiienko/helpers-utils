// Function: generate time slots with 30 min interval started from current time:

const generateTimeSlots = ({
  start,
  end,
  interval,
  unit,
}: {
  start: Moment;
  end: Moment;
  interval: number;
  unit: unitOfTime.DurationConstructor;
}): Slot[] => {
  const slotStart = moment.parseZone(start);
  const slotEnd = moment.parseZone(end);

  const slots = [];

  while (slotStart.clone().add(interval, unit).isBefore(slotEnd)) {
    const startTime = slotStart.toISOString(true);
    const endTime = slotStart.add(interval, unit).toISOString(true);

    if (moment().isAfter(startTime)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    slots.push({
      key: moment(slotStart).toISOString(true),
      start: startTime,
      end: endTime,
    });
  }
  return slots;
};

// Usage:

generateTimeSlots({
  start: moment().startOf('hour'),
  end: moment().add(1, 'd').endOf('day'),
  interval: 30,
  unit: 'minutes',
}),
