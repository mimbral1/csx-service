function addSlaToDate(baseDate, amount, measuredIn) {
  const date = new Date(baseDate);

  if (!amount || !measuredIn) {
    return null;
  }

  if (measuredIn === 'hours') {
    date.setHours(date.getHours() + amount);
  }

  if (measuredIn === 'days') {
    date.setDate(date.getDate() + amount);
  }

  if (measuredIn === 'weeks') {
    date.setDate(date.getDate() + amount * 7);
  }

  return date;
}

function isPast(date) {
  if (!date) return false;
  return new Date(date).getTime() < Date.now();
}

module.exports = {
  addSlaToDate,
  isPast
};
