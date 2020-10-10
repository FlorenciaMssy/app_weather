var lat = 0
var lng = 0

var moment = ""
var apiKeyWeather = "64a34881721002bce21dc2a8c9046bec"
var unit = "metric";

var apiKeyMapQuest = "r0HlA9hfn59svAOsz8sTgIyhV0HvhuGZ"
var city = 'neuquen'

function upperCaseCity() {
    var cityUpper = city.charAt(0).toUpperCase();
    var restOfCity = city.substring(1, city.length);
    return cityUpper.concat(restOfCity)
}

function getRequestMapQuest() {
    return `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKeyMapQuest}&location=${city}`
}

function getRequestWeather() {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=${unit}&exclude=${moment},hourly&appid=${apiKeyWeather}`
}
var submitBtn = document.getElementById("submit")

function setLatAndLng() {
    fetch(getRequestMapQuest())
        .then(response => response.json())
        .then(json => {
            lat = json.results[0].locations[0].latLng.lat
            lng = json.results[0].locations[0].latLng.lng
        

            console.log(city)
        })

        init()
}

submitBtn.addEventListener('click', () => {

    city = document.getElementById("search").value
    setLatAndLng()
    
    })





/*function setPlace() {
    city = document.getElementById("search").value
    console.log(document.getElementById("search").value)
    console.log("holaa")
    console.log(city)
}*/
function getStatusCurrentDay() {
    fetch(getRequestWeather())
        .then(response => response.json())
        .then(json => {
            return json.daily[0]
        })
        .then(json => {

            var tempMax = parseInt(json.temp.max)
            document.getElementById("temp_max").innerHTML = tempMax + " °c ↑"

            var tempMin = parseInt(json.temp.min)
            document.getElementById("temp_min").innerHTML = tempMin + " °c ↓"

            document.getElementById("humidity").innerHTML = json.humidity + "%"

            document.getElementById("pressure").innerHTML = json.pressure + "mBar"

            document.getElementById("wind_speed").innerHTML = json.wind_speed + " km/h"

            var sunriseHour = new Date((json.sunrise * 1000))
            document.getElementById("sunrise").innerHTML = `${sunriseHour.getHours()}:${sunriseHour.getMinutes()}`

            var sunsetHour = new Date((json.sunset * 1000))
            document.getElementById("sunset").innerHTML = `${sunsetHour.getHours()}:${sunsetHour.getMinutes()}`

            var dateTime = new Date((json.dt) * 1000)
            document.getElementById("dt").innerHTML = dateTime.toString().substr(16, 5);

            document.getElementById("current_hour").innerHTML = new Date().toString().substr(0, 21);
        })
}

function getStatusNextDays() {
    fetch(getRequestWeather())
        .then(response => response.json())
        .then(json => {

            var date = new Date()

            for (var i = 1; i <= 3; i++) {

                var icon = json.daily[i].weather[0].icon;

                var url = `https://openweathermap.org/img/wn/${icon}@2x.png`;

                document.getElementById(`day_icon${i}`).innerHTML = `<img src=${url} width="70">`;

                document.getElementById(`max${i}`).innerHTML = `${parseInt(json.daily[i].temp.max)}°c↑`;

                document.getElementById(`min${i}`).innerHTML = `${parseInt(json.daily[i].temp.min)}°c↓`;

                var tomorrow = new Date(date.getTime() + ((24 * 60 * 60 * 1000) * `${i}`));
                document.getElementById(`day${i}`).innerHTML = tomorrow.toString().substr(0, 10);
            }
        })
}

function getCurrentTemp() {
    fetch(getRequestWeather())
        .then(response => response.json())
        .then(json => {
            document.getElementById("current_temp").innerHTML = Math.round(json.current.temp)

            document.getElementById("city").innerHTML = `${city}`

            var icon = json.current.weather[0].icon

            var url = `http://openweathermap.org/img/wn/${icon}@2x.png`

            var image = `<img src=${url}>`;

            document.getElementById("image_status").innerHTML = image

            document.getElementById("description_weather").innerHTML = json.current.weather[0].main
        })
}

function init() {
    getCurrentTemp()
    getStatusCurrentDay()
    getStatusNextDays()
    //upperCaseCity()
}