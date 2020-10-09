var lat = 0
//-34.57
  
var lng = 0
///-58.62

var moment = ""
var apiKey = "64a34881721002bce21dc2a8c9046bec"
var unit = "metric";

var pressure = document.getElementById("pressure")

var apiMap = "r0HlA9hfn59svAOsz8sTgIyhV0HvhuGZ"
var city = "marcospaz"
var requestMap = `https://www.mapquestapi.com/geocoding/v1/address?key=${apiMap}&location=${city}`

//var request = `https://api.openweathermap.org/data/2.5/onecall?lat=${getLat()}&lon=${getLng()}&units=${unit}&exclude=${moment},hourly&appid=${apiKey}`
function getRequest(){
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=${unit}&exclude=${moment},hourly&appid=${apiKey}`
}

function setLatAndLng(){
    fetch(requestMap)
    .then(response => response.json())
    .then(json => {
        lat = json.results[0].locations[1].latLng.lat
        lng = json.results[0].locations[1].latLng.lng
        init()
    })
}

function getStatusCurrentDay() {
    console.log(getRequest())
    return fetch(getRequest())
        .then(response => response.json())
        .then(json => {
            return json.daily[0]
        })
}

function getStatusDaily() {
    return fetch(getRequest())
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
    return fetch(getRequest())
        .then(response => response.json())
        .then(json => {
            document.getElementById("current_temp").innerHTML = Math.round(json.current.temp)
            document.getElementById("city").innerHTML = "Marcos Paz"
            var icon = json.current.weather[0].icon
            var url = `http://openweathermap.org/img/wn/${icon}@2x.png`
            var image = `<img src=${url}>`;
            //http: //openweathermap.org/img/wn/10d@2x.png
            document.getElementById("image_status").innerHTML = image
            document.getElementById("description_weather").innerHTML = json.current.weather[0].main


        })
}

function init() {

    getStatusDaily()
    getCurrentTemp()
    getStatusCurrentDay()

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

            //Le saco la zona horaria porque queda muy largo.
            document.getElementById("current_hour").innerHTML = new Date().toString().substr(0, 21);

        })
}