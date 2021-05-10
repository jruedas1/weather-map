// $.get("http://api.openweathermap.org/data/2.5/weather", {
//     APPID: OPEN_WEATHER_APPID,
//     lat:    29.423017,
//     lon:   -98.48527,
//     units: "imperial"
// }).done(function(data) {
//     console.log('current weather', data);
// });

// $.get("http://api.openweathermap.org/data/2.5/forecast", {
//     APPID: OPEN_WEATHER_APPID,
//     lat:    29.423017,
//     lon:   -98.48527,
//     units: "imperial"
// }).done(function(data) {
//     console.log('forecast', data);
// });

$.get("http://api.openweathermap.org/data/2.5/onecall", {
    APPID: OPEN_WEATHER_APPID,
    lat:    29.423017,
    lon:   -98.48527,
    units: "imperial"
}).done(function(data) {
    function appendLeadingZeroes(n){
        if(n <= 9){
            return "0" + n;
        }
        return n;
    }

    console.log('onecall', data);
    let unixTimeStamp = data.current.dt;
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    let dateTime = new Date(unixTimeStamp * 1000);
    let year = dateTime.getFullYear();
    let month = months[dateTime.getMonth()];
    let day = dateTime.getDay();
    let hour = appendLeadingZeroes(dateTime.getHours());
    let minutes = appendLeadingZeroes(dateTime.getMinutes());
    let seconds = appendLeadingZeroes(dateTime.getSeconds());
    console.log(month + " " + day + " " + year + " " + hour + ":" + minutes + ":" + seconds);

});