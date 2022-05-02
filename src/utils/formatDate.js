import { format, parseISO } from 'date-fns';

function formatDate(time) {
  return format(parseISO(time), 'E, dd LLL');
}

export default formatDate;
