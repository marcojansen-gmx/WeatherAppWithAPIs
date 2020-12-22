// create variables
const apiKey = "a68c335056a4a3d1000ef6aa6b67cc0b";
const searchedCities = [];
let previousSearches;
// var div = $("<div class='container'>");

var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

init();

function init(){

    // request last cities from localstorage

    let previousSearch = localStorage.getItem("cities");
    console.log(previousSearch);

    //call getweather for last item in local storage
    
    let lastIndexLocalStorage = previousSearch.length;
    console.log(lastIndexLocalStorage);

    // diaplay weather for the above inti
}

$("#searchButton").on("click", searchWeather);

function searchWeather(){
    var cityName = $("#citySearch").val().trim();
    console.log(cityName);
    getCurrentWeather(cityName); // temp, humidity, windspeed, uv
    getFiveDayForecast(cityName); // five days into future five cards
}

function getCurrentWeather(city){
   var queryWeatherUrl = queryURL+city+"&appid="+apiKey;
  
    $.ajax({
        url: queryWeatherUrl,
        method: "GET"
    }).then(
            function(res) {
            console.log(res);
            var city = res.name;
            var humidity = res.main.humidity

            renderTodayWeather(city, humidity)

            addCityToLS(city)

        });

}

function getFiveDayForecast(city){
     console.log(city);

}

function renderTodayWeather(city, humidity){
    
}

function addCityToLS(city){


    searchedCities.push(city)
        console.log(searchedCities);
    localStorage.setItem("cities", searchedCities);
}

function getCityFromLS(cities){

    for (let i = 0; i < cities.length; i++) {

        $(previousSearches[i]).val(localStorage.getItem(cities[i]));
        consoleLog(previousSearches);
        return(previousSearches);
      };

}

// create function which makes initial query with last localstorage city

// create search input and submit button in id search

// create list of previous search options as read from localstorage
// attach list to id previous

// create function on click to start query

// make first query always last entry in localstorage


// fill first row with results
// 1. city and date, 2. temperature in celsius, 
// 3. humidity, 4. wind speed, 5.uv index

// fill second row with results
// 1.date, 2. weather symbol, 3. temp, 4. humidity
// 5 columns








// .error
// create alert in case city is no found


// .then 
// store selected city in localstorage
//


