function setRandColor() {
  let hexes = [
    " #CC99FF",
    "#A9D1F7",
    "#B4F0A7",
    "#FFFFBF",
    " #FFDFBE",
    "#FFB1B0",
  ];

  let colorChoice = hexes[Math.floor(Math.random() * hexes.length)];
  return colorChoice;
}
setRandColor();
