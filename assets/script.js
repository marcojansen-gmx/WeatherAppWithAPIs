// create variables
const apiKey = "a68c335056a4a3d1000ef6aa6b67cc0b";
const searchedCities = [];
let previousSearches;
let indexUV;

// URL queries
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
let queryURL5Days = "https://api.openweathermap.org/data/2.5/forecast?q=";
// let queryURLUVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}";

init();

function init() {
    let city = getLastSearch();
    
    // request last cities from localstorage

    if (city === "empty") {
        // searchByGeolocation();
    }
    else {
        clear();
        getCurrentWeather(city);
        getFiveDayForecast(city);
        getCurrentDate();
        getUVIndex(lon,lat);
    }
    // let previousSearch = localStorage.getItem("cities");
    // console.log(previousSearch);

    //call getweather for last item in local storage

    // let lastIndexLocalStorage = previousSearch.length;
    // console.log(lastIndexLocalStorage);

    // diaplay weather for the above inti
}

function clear() {
    //all data in the weather 
    $("#dateCurrent").empty();
    $("#iconImage").empty();
    $("#cityCurrent").empty();
    $("#tempCurrent").empty();
    $("#humidityCurrent").empty();
    $("#windCurrent").empty();
    $("#UVCurrent").empty();
}


  // moment.js date/time request
  function getCurrentDate() {
    document.getElementById("dateCurrent")
      .innerHTML = moment().format('MMMM Do YYYY');
  }
  
//   setInterval(update, 1000);


function getLastSearch() {
    let city = "empty";
    // get values of local storage;
    let searchedValues = JSON.parse(localStorage.getItem("cities"));

    console.log(searchedValues.length);

    if (searchedValues.length == null) {
        city = "Perth";
        return city;
    }
    else {        
        city = searchedValues[searchedValues.length - 1];
        console.log(city)
        return city;
    }

}

$("#searchButton").on("click", searchWeather);

function searchWeather() {
    var cityName = $("#citySearch").val().trim();
    console.log(cityName);
    getCurrentWeather(cityName); // temp, humidity, windspeed, uv
    getFiveDayForecast(cityName); // five days into future five cards
    getUVIndex(lon,lat);
    getCurrentDate();
}

// function to request and return current weather
function getCurrentWeather(city) {
    clear();
    addCityToLS(city);
    var queryWeatherUrl = queryURL + city + "&appid=" + apiKey;

    $.ajax({
        url: queryWeatherUrl,
        method: "GET"
    }).then(
        function (res) {
            console.log(res);
            let city = res.name;
            let humidity = res.main.humidity
            let temperature = Math.round((res.main.temp - 273.15) * 100) / 100;
            let wind = Math.round((res.wind.speed * 1.6) * 100) / 100;
            let iconID = res.weather[0].icon;
            let iconURL = `https://openweathermap.org/img/wn/${iconID}@2x.png`
            console.log(city, humidity, temperature, wind)
            renderTodayWeather(city, humidity, iconURL, temperature, wind)
            let lon = res.coord.lon;
            let lat = res.coord.lat;
            getUVIndex(lon,lat);
        });

}

// function to request and return UV Index
function getUVIndex(lon,lat){
    let queryURLUVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey;
    $.ajax({
        url: queryURLUVIndex,
        method: "GET"
    }).then(
        function (res) {
            console.log(res);
            indexUV = res.value;
            renderUVIndexToday(indexUV)                
        });
}

function getFiveDayForecast(city) {
    console.log(city);

}

function renderTodayWeather(city, humidity, iconURL, temperature, wind) {
    // $("#dateCurrent").text(`Date: ${city}`);
    $("#cityCurrent").text(`City: ${city}`);
    $("#tempCurrent").text(`Temperature: ${temperature} °C`);
    $("#humidityCurrent").text(`Humidity: ${humidity} %`);
    $("#windCurrent").text(`Wind speed: ${wind} km/h`);
    
    let img = $('<img>');
    img.attr("src", iconURL);
    $("#iconImage").append(img);


}

function renderUVIndexToday(indexUV){
    console.log(indexUV);
    $("#UVCurrent").text(`UV Index: ${indexUV}`);
}

function addCityToLS(city) {


    searchedCities.push(city)
    console.log(searchedCities);
    localStorage.setItem("cities", JSON.stringify(searchedCities));
}
