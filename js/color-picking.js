const colorNames = {
  "#C56FFF": "Фиолетовый",
  "#FF8630": "Оранжевый",
  "#2E9AFF": "Голубой",
  "#41E847": "Зелёный",
  "#FFD829": "Жёлтый",
  "#F498AD": "Розовый",
};

const init = (body) => {
  const colors = Object.keys(colorNames);
  const colorsContainer = document.querySelector(".colorpicker");
  const colorButton = document.querySelector(".color__button");
  const currentColorOutput = document.getElementById("currentColor");

  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", colorButton.value);

  if (localStorage.getItem("color") !== null) {
    colorButton.value = localStorage.getItem("color");
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", localStorage.getItem("color"));
  } else {
    localStorage.setItem("color", colorButton.value);
  }

  body.style.setProperty("--main-color", colorButton.value);
  colorButton.style.setProperty("--bg-color", colorButton.value);
  currentColorOutput.textContent = colorNames[colorButton.value];

  generateOtherColors();

  function removeOtherColors() {
    let allOtherColors = colorsContainer.querySelectorAll(".color__other");
    allOtherColors.forEach((color) => {
      colorsContainer.removeChild(color);
    });
  }

  function generateOtherColors() {
    let index = 0;
    colors.forEach((color) => {
      if (colorButton.value !== color) {
        let otherColor = document.createElement("span");
        const angle = (2 * Math.PI * index) / (colors.length + 1);
        const radius = 28;
        const offset = 30;

        let x = offset + radius * Math.cos(angle);
        let y = offset + radius * Math.sin(angle);
        otherColor.classList.add("color__other");
        otherColor.style.setProperty("--bg-color", color);
        otherColor.style.width = 20 - 3 * index + "px";
        otherColor.style.left = `${x}px`;
        otherColor.style.bottom = `${y}px`;
        otherColor.setAttribute("data-color", color);
        colorsContainer.append(otherColor);
        index++;
      }
    });
  }

  colorButton.addEventListener("click", (event) => {
    let nextColor = colors[colors.indexOf(event.target.value) + 1];
    if (colors.indexOf(event.target.value) + 1 === colors.length) {
      nextColor = colors[0];
    }
    colorButton.value = nextColor;
    colorButton.style.setProperty("--bg-color", nextColor);
    removeOtherColors();
    generateOtherColors();
    body.style.setProperty("--main-color", colorButton.value);
    currentColorOutput.textContent = colorNames[colorButton.value];
    localStorage.setItem("color", colorButton.value);
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", colorButton.value);
  });
};

init(document.body);
