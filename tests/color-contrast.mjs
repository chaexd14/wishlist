const colors = {
  canvas: "#F7EEDB", notebook: "#F8F4E9", mat: "#2E6B55", matInk: "#FFF8E7",
  surface: "#FFF9EC", ink: "#35222E", softInk: "#624B55",
  warm: "#A8472F", rose: "#A63B67", lilac: "#68499A", sky: "#2E6F8A",
  roseSpot: "#E9A7B8", lilacSpot: "#C5B3E6", skySpot: "#A9D8EA", mintSpot: "#A8D5B5", honeySpot: "#F0C85E",
};

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const checks = [
  ["primary text on canvas", colors.ink, colors.canvas, 4.5],
  ["secondary text on canvas", colors.softInk, colors.canvas, 4.5],
  ["primary text on notebook", colors.ink, colors.notebook, 4.5],
  ["secondary text on notebook", colors.softInk, colors.notebook, 4.5],
  ["cream text on cutting mat", colors.matInk, colors.mat, 4.5],
  ["primary text on sheet", colors.ink, colors.surface, 4.5],
  ...["warm", "rose", "lilac", "sky"].map((mood) => [`cream text on ${mood} action`, colors.surface, colors[mood], 4.5]),
  ...["roseSpot", "lilacSpot", "skySpot", "mintSpot", "honeySpot"].map((spot) => [`ink on ${spot}`, colors.ink, colors[spot], 4.5]),
];

for (const [label, foreground, background, minimum] of checks) {
  const ratio = contrast(foreground, background);
  if (ratio < minimum) throw new Error(`${label} is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1`);
  console.log(`${label}: ${ratio.toFixed(2)}:1`);
}
