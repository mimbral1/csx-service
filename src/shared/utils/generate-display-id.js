function generateDisplayId() {
  const now = new Date();

  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `CSX-${year}${month}${day}-${random}`;
}

module.exports = { generateDisplayId };
