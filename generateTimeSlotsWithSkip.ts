import moment, { Moment, unitOfTime } from 'moment/moment';

type Slot = {
  from: string;
  to: string;
};

type Skip = {
  skipStart: string | number;
  skipEnd: string | number;
};

export const generateTimeSlots = ({
  start,
  end,
  intervals,
  unit,
  skip,
}: {
  start: Moment;
  end: Moment;
  intervals: number[];
  unit: unitOfTime.DurationConstructor;
  skip?: ({ skipStart, skipEnd }: Skip) => boolean;
}): Slot[] => {
  const slotStart = moment.parseZone(start);
  const slotEnd = moment.parseZone(end);
  let slotIndex = 0;
  const getInterval = () =>
    intervals[Math.min(slotIndex, intervals.length - 1)];

  const slots = [];

  while (slotStart.clone().add(getInterval(), unit).isBefore(slotEnd)) {
    const startTime = slotStart.toISOString(true);
    const endTime = slotStart.add(getInterval(), unit).toISOString(true);
    const slot = {
      from: startTime,
      to: endTime,
    };

    slotIndex += 1;

    if (
      moment().isAfter(startTime) ||
      skip({ skipStart: slot.from, skipEnd: slot.to })
    ) {
      // eslint-disable-next-line no-continue
      continue;
    }

    slots.push(slot);
  }

  return slots;
};

const slots = () =>
  generateTimeSlots({
    start: moment().utcOffset(1).startOf('day'),
    end: moment().utcOffset(1).add(1, 'd').endOf('day'),
    skip: ({ skipStart, skipEnd }) =>
      moment().add(60, 'minutes').isAfter(skipStart) ||
      moment(skipStart).utcOffset(1).hour() >= endHour ||
      moment(skipEnd).utcOffset(1).add(45, 'm').hour() <= startHour,
    intervals: [15],
    unit: 'm',
  });
