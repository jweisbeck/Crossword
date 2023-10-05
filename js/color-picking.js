const body = document.body
const colors = Array.from(document.querySelectorAll('input[type="radio"]'))
const actualColor = document.querySelector('input[type="radio"]:checked')

if (localStorage.getItem("color") === null) {
  localStorage.setItem("color", actualColor.value);
  body.style.setProperty("--main-color", actualColor.value)
  console.log(localStorage.getItem("color"))
} else {
  body.style.setProperty("--main-color", localStorage.getItem("color"))
  colors.forEach(color => {
    color.checked = false
    
    if (color.value === localStorage.getItem("color")) {
      color.checked = true
    }
  })
}


colors.forEach(color => {
  color.parentNode.style.setProperty("--bg-color", color.value)
  color.addEventListener('change', (e) => {
    body.style.setProperty("--main-color", e.target.value)
    localStorage.setItem("color", e.target.value);
  })
})