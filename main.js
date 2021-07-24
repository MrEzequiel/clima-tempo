const cities = [
  'Tóquio',
  'Delhi',
  'Xangai',
  'São Paulo',
  'Cidade do México',
  'Dhaka',
  'Cairo',
  'Pequim',
  'Mumbai',
  'Osaka',
  'Istambul',
  'Buenos Aires',
  'Washington'
]

cities.forEach(city => {
  showCard(city)
})

async function createCard(city) {
  let card = document.createElement('div')

  const atributes = await getCardAtributes(city)

  card.setAttribute('class', 'climate')
  card.innerHTML = `
  <div class="climate-temp">
    <div class="climate-title">${atributes.name}, ${atributes.sys.country}</div>
    <div class="climate-info">${atributes.main.temp} <sup>ºC</sup></div>
    <img src="http://openweathermap.org/img/wn/${atributes.weather[0].icon}@2x.png" />
  </div>
  `
  let climates = document.querySelector('#climates')
  climates.appendChild(card)
}

async function getCardAtributes(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
    city
  )}&appid=a329def91cdddc3614f443270c05189b&units=metric&lang=pt_br`

  let results = await fetch(url)
  let json = await results.json()

  return json
}

function showCard(city) {
  createCard(city)
}

document.querySelector('.search').addEventListener('submit', async event => {
  event.preventDefault()

  clearWarnings()
  document.querySelector('.result').style.display = 'none'

  let input = document.querySelector('#search-input').value

  if (input !== '') {
    showWarning('loading')

    const json = await getCardAtributes(input)

    if (json.cod === 200) {
      showInfo({
        name: json.name,
        country: json.sys.country,
        temp: json.main.temp,
        tempIcons: json.weather[0].icon,
        windSpeed: json.wind.speed,
        windAngle: json.wind.deg
      })
    } else {
      showWarning('nothing')
    }
  }
})

function showInfo(json) {
  showWarning('')

  document.querySelector(
    '.title h2'
  ).innerHTML = `${json.name}, ${json.country}`
  document.querySelector(
    '.temperature-info'
  ).innerHTML = `${json.temp} <sup>ºC</sup>`
  document.querySelector(
    '.wind-info'
  ).innerHTML = `${json.windSpeed} <span>km/h</span>`
  document
    .querySelector('.temperature img')
    .setAttribute(
      'src',
      `http://openweathermap.org/img/wn/${json.tempIcons}@2x.png`
    )

  document.querySelector('.wind-point').style.transform = `rotate(${
    json.windAngle - 90
  }deg)`

  document.querySelector('.result').style.display = 'flex'
}

function clearWarnings() {
  document.querySelector('.alert').style.display = 'none'
  document.querySelector('.alert').classList.remove('active')
  document.querySelector('.alert').classList.remove('stop-animation')
}

function showWarning(msg) {
  const alertMsg = document.querySelector('.alert h2')
  const alert = document.querySelector('.alert')

  if (msg === 'loading') {
    alert.style.display = 'block'
    alert.classList.add('active')
    alertMsg.innerHTML = 'Carregando'
  } else if (msg === 'nothing') {
    alert.classList.add('stop-animation')
    alertMsg.innerHTML = 'Localização não encontrada :('
  } else {
    clearWarnings()
  }
}
