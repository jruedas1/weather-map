function windCardinalDirection(degrees){
    let cardinalDirection = '';
    if ((degrees > 348.75 && degrees <= 360) || (degrees >=0 && degrees <= 11.25)){
        cardinalDirection = "N";
    } else if (degrees > 11.25 && degrees  <= 33.75) {
        cardinalDirection = "NNE";
    } else if (degrees > 33.75 && degrees <= 56.25) {
        cardinalDirection = "NE";
    } else if (degrees > 56.25 && degrees <= 78.75) {
        cardinalDirection = "ENE";
    } else if (degrees > 78.75 && degrees <= 101.25) {
        cardinalDirection = "E";
    } else if (degrees > 101.25 && degrees <= 123.75) {
        cardinalDirection = "ESE";
    } else if (degrees > 123.75 && degrees <= 146.25) {
        cardinalDirection = "SE";
    } else if (degrees > 146.25 && degrees <= 168.75) {
        cardinalDirection = "SSE";
    } else if (degrees > 168.75 && degrees <= 191.25) {
        cardinalDirection = "S";
    } else  if (degrees > 191.25 && degrees <= 213.75) {
        cardinalDirection = "SSW";
    } else if (degrees > 213.75 && degrees <= 236.25)  {
        cardinalDirection = "SW";
    } else if (degrees > 236.25 && degrees <= 258.75) {
        cardinalDirection = "WSW";
    } else if (degrees > 258.75 && degrees <= 281.25) {
        cardinalDirection = "W";
    } else if (degrees > 281.25 && degrees <= 303.75) {
        cardinalDirection = "WNW";
    } else if (degrees > 303.75 && degrees <= 326.25) {
        cardinalDirection = "NW";
    } else if (degrees > 326.75 && degrees <= 348.75) {
        cardinalDirection = "NNW";
    }
    return cardinalDirection;
}

function appendLeadingZeroes(n){
    if(n <= 9){
        return "0" + n;
    }
    return n;
}

mapboxgl.accessToken = MAPBOX_API_TOKEN;
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-98.4683, 29.5312], // starting position [lng, lat]
    zoom: 12 // starting zoom
});

var marker;

map.on('click', function (e) {
    let latitude = e.lngLat.lat;
    let longitude = e.lngLat.lng;
    function setMarker(){
        marker = new mapboxgl.Marker({
            color: "#FFFFFF",
            draggable: true
        }).setLngLat([longitude, latitude])
            .addTo(map);
    }
    if (marker) {
        marker.remove();
        setMarker();
    } else {
        setMarker();
    }
    getAndSetWeather(latitude, longitude);
});

function getAndSetWeather(latitude, longitude){
    $.get("http://api.openweathermap.org/data/2.5/onecall", {
        APPID: OPEN_WEATHER_APPID,
        lat:    !latitude? 29.423017: latitude,
        lon:   !longitude? -98.48527: longitude,
        units: "imperial"
        // lang: "en"
    }).done(function(data) {
        $("#weather").html('');
        $("#forecast").html('');
        function formatTime(timeStamp){
            let dateTime = new Date(timeStamp * 1000);
            let year = dateTime.getFullYear();
            let month = months[dateTime.getMonth()];
            let day = dateTime.getDate();
            let hour = appendLeadingZeroes(dateTime.getHours());
            let minutes = appendLeadingZeroes(dateTime.getMinutes());
            let seconds = appendLeadingZeroes(dateTime.getSeconds());
            let formattedDateTime = month + " " + day + " " + year + " " + hour + ":" + minutes + ":" + seconds;
            return formattedDateTime;
        }

        let unixTimeStamp = data.current.dt;
        const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        let currentTemp = data.current.temp;
        let humidity = data.current.humidity;
        let feelsLike = data.current.feels_like;
        let clouds = data.current.clouds;
        let windSpeed = data.current.wind_speed;
        let windDirection = data.current.wind_deg;
        let weatherDescription = data.current.weather[0].description;
        let icon = data.current.weather[0].icon;
        let iconLink = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        $("#weather").append("<p>San Antonio, TX</p>");
        $("#weather").append("<p>"+ formatTime(unixTimeStamp) + "</p>");
        $("#weather").append("<p>Current weather: " + weatherDescription + "</p>");
        $("#weather").append("<p><img src='" + iconLink +"'></p>");
        $("#weather").append("<p>Current temperature: " + currentTemp + "</p>");
        $("#weather").append("<p>Humidity: " + humidity + "%");
        $("#weather").append("<p>Feels Like: " + feelsLike + "</p>");
        $("#weather").append("<p>Wind: " + windCardinalDirection(windDirection) + " " + windSpeed + "mph.</p>");

        $("#weather").append("<hr>")

        // console.log(data.daily[0]);
        for (let i = 0; i < 5; i++){
            $("#forecast").append("<p>" + formatTime(data.daily[i].dt) + '</p>');
            $("#forecast").append("<p>Expected weather: " + data.daily[i].weather[0].description + "</p>");
            $("#forecast").append("<p><img src='" + "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon +"@2x.png'></p>");
            $("#forecast").append("<p>Temperature: " + data.daily[i].temp.max + "/" + data.daily[0].temp.min + "</p>");
            $("#forecast").append("<p>Humidity: " + data.daily[i].humidity + "%</p>");
            $("#forecast").append("<p>Wind: " + windCardinalDirection(data.daily[i].wind_deg) + " " + data.daily[i].wind_speed + "mph.</p>");
            $("#forecast").append("<hr>");
        }
    });
}

getAndSetWeather();

