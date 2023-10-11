const body = document.body
const colorsContainer = document.querySelector('.colorpicker')
const colors = ['#C56FFF', '#FF8630', '#2E9AFF', '#41E847', '#FFD829', '#F498AD']
const colorButton = document.querySelector('.color__button')
const currentColorOutput = document.getElementById('currentColor')

const colorNames = {
  '#C56FFF': 'Фиолетовый',
  '#FF8630': 'Оранжевый',
  '#2E9AFF': 'Голубой',
  '#41E847': 'Зелёный',
  '#FFD829': 'Жёлтый',
  '#F498AD': 'Розовый'
};

document.querySelector('meta[name="theme-color"]').setAttribute('content', colorButton.value)

if (localStorage.getItem('color') !== null) {
  colorButton.value = localStorage.getItem('color')
  document.querySelector('meta[name="theme-color"]').setAttribute('content', localStorage.getItem('color'))
} else {
  localStorage.setItem('color', colorButton.value)
}

body.style.setProperty('--main-color', colorButton.value)
colorButton.style.setProperty('--bg-color', colorButton.value)
currentColorOutput.textContent = colorNames[colorButton.value]

generateOtherColors()

function removeOtherColors() {
  let allOtherColors = colorsContainer.querySelectorAll('.color__other')
  allOtherColors.forEach(color => {
    colorsContainer.removeChild(color)
  })
}

function generateOtherColors () {
  let index = 0
  colors.forEach(color => {
    if (colorButton.value !== color) {
      let otherColor = document.createElement('span')
      let x = 30 + 28 * Math.cos(2 * Math.PI * index / 7)
      let y = 30 + 28 * Math.sin(2 * Math.PI * index / 7)
      otherColor.classList.add('color__other')
      otherColor.style.setProperty('--bg-color', color)
      otherColor.style.width = (20 - 3 * index) + 'px'
      otherColor.style.left = x + 'px'
      otherColor.style.bottom = y + 'px'
      otherColor.setAttribute('data-color', color)
      colorsContainer.append(otherColor)
      index++
    }
  })
}

colorButton.addEventListener('click', event => {
  let nextColor = colors[colors.indexOf(event.target.value) + 1]
  if (colors.indexOf(event.target.value) + 1 === colors.length) {
    nextColor = colors[0]
  }
  colorButton.value = nextColor
  colorButton.style.setProperty('--bg-color', nextColor)
  removeOtherColors()
  generateOtherColors()
  body.style.setProperty('--main-color', colorButton.value)
  currentColorOutput.textContent = colorNames[colorButton.value]
  localStorage.setItem('color', colorButton.value)
  document.querySelector('meta[name="theme-color"]').setAttribute('content', colorButton.value)
})