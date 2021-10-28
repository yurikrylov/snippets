Array.prototype.hasMin = function (attrib) {
  return (
    (this.length &&
      this.reduce(function (prev, curr) {
        return prev[attrib] < curr[attrib] ? prev : curr;
      })) ||
    null
  );
};
