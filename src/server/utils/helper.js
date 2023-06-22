const formatDate = () => {
  const date = new Date();
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

module.exports = {
  formatDate,
};
