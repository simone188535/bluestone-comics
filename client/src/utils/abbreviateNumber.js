// Inspired By: https://stackoverflow.com/q/10599933/6195136
function abbreviateNumber(value) {
  let newValue = value;
  if (value >= 1000) {
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor(`${value}`.length / 3);
    let shortValue = "";
    for (let precision = 2; precision >= 1; precision -= 1) {
      shortValue = parseFloat(
        (suffixNum !== 0 ? value / 1000 ** suffixNum : value).toPrecision(
          precision
        )
      );
      const dotLessShortValue = `${shortValue}`.replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

export default abbreviateNumber;
