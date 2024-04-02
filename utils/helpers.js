module.exports = {
  format_time: (date) => {
    return date.toLocaleTimeString();
  },
    format_date: (date) => {
      const newDate = new Date(date);
      const year = newDate.getFullYear();
      const month = newDate.toLocaleString('default', { month: 'long' });
      const day = newDate.getDate();
      return `${month} ${day}, ${year}`;
    }

};
