import { getDateUTCStart } from '@/utils/datetime';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { format } from 'date-fns';

Date.prototype.getWeekNumber = function () {
  var d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

export const VOLUME_SESSION_PERIODS = {
  Minute: () => {},
  Hours: () => {},
  Day:
    (timezone, symbolType) =>
    ({ d, sessionData, i }) => {
      //  start time
      if (!sessionData[i - 1]) {
        return true;
      }

      let number = 0;

      if (symbolType && symbolType.toUpperCase() === 'FUTURES') {
        number = number + 1;
      }
      const startTime = utcToZonedTime(getDateUTCStart(d.date), timezone);
      const startHours = format(startTime, 'HH:mm:ss');
      const dateHours = format(d.date, 'HH:mm:ss');
      const [hours1, minutes1, seconds1] = startHours.split(':');

      const [hours2, minutes2, seconds2] = dateHours.split(':');

      const date1 = new Date(
        2022,
        0,
        1,
        +hours1 - number,
        +minutes1,
        +seconds1
      );
      const date2 = new Date(2022, 0, 1, +hours2, +minutes2, +seconds2);

      if (date1.getTime() === date2.getTime()) {
        return true;
      }
      return false;
    },
  Week: ({ d, i, fullData }) =>
    i > 0 &&
    fullData[i - 1] &&
    fullData[i - 1].date.getWeekNumber() !== d.date.getWeekNumber(),
  Month: ({ d, i, fullData }) =>
    i > 0 &&
    fullData[i - 1] &&
    fullData[i - 1].date.getMonth() !== d.date.getMonth(),
};

export const VOLUME_SESSION_TYPES = {
  buysell: (d, bins) => {
    bins.push({ direction: 'up', volume: d.buy });
    bins.push({ direction: 'down', volume: d.sell });
  },
  volume: (d, bins) => {
    bins.push({ direction: 'up', volume: d.buy + d.sell });
  },
};
