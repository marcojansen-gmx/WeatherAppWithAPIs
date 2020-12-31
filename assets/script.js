
// create variables
const apiKey = "a68c335056a4a3d1000ef6aa6b67cc0b";
let searchedCities = [];
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
        clear();
        getCurrentWeather(city);
        getFiveDayForecast(city);
        getCurrentDate();
        getUVIndex(lon,lat);
    }
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
    $("#dayOne").empty();
    $("#humidityDayOne").empty();
    $("#iconImageDayOne").empty();
    $("#dayTwo").empty();
    $("#humidityDayTwo").empty();
    $("#iconImageDayTwo").empty();
    $("#dayThree").empty();
    $("#humidityDayThree").empty();
    $("#iconImageDayThree").empty();
    $("#dayFour").empty();
    $("#humidityDayFour").empty();
    $("#iconImageDayFour").empty();
    $("#dayFive").empty();
    $("#humidityDayFive").empty();
    $("#iconImageDayFive").empty();
}


// moment.js date/time request
function getCurrentDate() {
let date = moment().format('MMMM Do YYYY')
console.log("current date",date);
document.getElementById("dateCurrent")
.innerHTML = moment().format('MMMM Do YYYY');
  }

function getLastSearch() {
    let city = "empty";
    // get values of local storage;   
    let searchedValues = JSON.parse(localStorage.getItem("cities"));
    renderSearchedCities(searchedValues);    
}

function renderSearchedCities(searchedCities){
    console.log(searchedCities);
    let ul = $("<ul>");
    ul.addClass("list-group");
    $("#previousSearch").append(ul);
    let ulEl = $("#previousSearch ul");
    
    // console.log(searchedCities.length)
    // for (let i = searchedCities.length; i >= 0; i--) {
    //     let li = $("<li>");
    //     // li.addClass
    //     li.text(searchedCities[i]);
    //      ulEl.append(li);
    // }
}

$("#searchButton").on("click", searchWeather);

function searchWeather() {
    var cityName = $("#citySearch").val().trim();
    console.log(cityName);
    getCurrentWeather(cityName); // temp, humidity, windspeed, uv
    getFiveDayForecast(cityName); // five days into future five cards
    // getUVIndex(lon,lat);
    getCurrentDate();
    renderSearchedCities();
}

// function to request and return current weather
function getCurrentWeather(city) {
    clear();
    addCityToLS(city);
    var queryWeatherUrl = queryURL + city + "&appid=" + apiKey;
    getFiveDayForecast(city);
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
            console.log(lon);
            let lat = res.coord.lat;
            console.log(lat);
            getUVIndex(lon,lat);
            getFiveDayForecast(city)
        });

}

function getFiveDayForecast(city) {
    var query5DayUrl = queryURL5Days + city + "&appid=" + apiKey;
    console.log(query5DayUrl);
    $.ajax({
        url: query5DayUrl,
        method: "GET"
    }).then(
        function (res) {
            console.log(res);
            let tempDay1 = Math.round((res.list[0].main.temp - 273.15) * 100) / 100;
            let tempDay2 = Math.round((res.list[1].main.temp - 273.15) * 100) / 100;
            let tempDay3 = Math.round((res.list[2].main.temp - 273.15) * 100) / 100;
            let tempDay4 = Math.round((res.list[3].main.temp - 273.15) * 100) / 100;
            let tempDay5 = Math.round((res.list[4].main.temp - 273.15) * 100) / 100;
            console.log(tempDay1, tempDay2, tempDay3, tempDay4, tempDay5)
            let humidity1 = res.list[0].main.humidity;
            let humidity2 = res.list[1].main.humidity;
            let humidity3 = res.list[2].main.humidity;
            let humidity4 = res.list[3].main.humidity;
            let humidity5 = res.list[4].main.humidity;
            console.log(humidity1, humidity2, humidity3, humidity4, humidity5)
            let iconIDForecast1 = res.list[0].weather[0].icon;
            let iconIDForecast2 = res.list[1].weather[0].icon;
            let iconIDForecast3 = res.list[2].weather[0].icon;
            let iconIDForecast4 = res.list[3].weather[0].icon;
            let iconIDForecast5 = res.list[4].weather[0].icon;
            console.log(iconIDForecast1, iconIDForecast2, iconIDForecast3, iconIDForecast4, iconIDForecast5);
            let iconURLForecast1Png = `https://openweathermap.org/img/wn/${iconIDForecast1}@2x.png`
            let iconURLForecast2Png = `https://openweathermap.org/img/wn/${iconIDForecast2}@2x.png`
            let iconURLForecast3Png = `https://openweathermap.org/img/wn/${iconIDForecast3}@2x.png`
            let iconURLForecast4Png = `https://openweathermap.org/img/wn/${iconIDForecast4}@2x.png`
            let iconURLForecast5Png = `https://openweathermap.org/img/wn/${iconIDForecast5}@2x.png`
            renderFiveDayForecast(tempDay1,tempDay2,tempDay3,tempDay4,tempDay5,humidity1,humidity2,humidity3,humidity4,humidity5,iconURLForecast1Png,iconURLForecast2Png,iconURLForecast3Png,iconURLForecast4Png,iconURLForecast5Png); 
    }); 
};


// function to request and return UV Index
function getUVIndex(lon,lat){
    let queryURLUVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey;
    console.log(queryURLUVIndex);
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

function renderFiveDayForecast(tempDay1,tempDay2,tempDay3,tempDay4,tempDay5,humidity1,humidity2,humidity3,humidity4,humidity5,iconURLForecast1Png,iconURLForecast2Png,iconURLForecast3Png,iconURLForecast4Png,iconURLForecast5Png){
    $("#dayOne").text(`Temp: ${tempDay1}`);
    $("#dayTwo").text(`Temp: ${tempDay2}`);
    $("#dayThree").text(`Temp: ${tempDay3}`);
    $("#dayFour").text(`Temp: ${tempDay4}`);
    $("#dayFive").text(`Temp: ${tempDay5}`);
    $("#humidityDayOne").text(`Humidity:${humidity1}`);
    $("#humidityDayTwo").text(`Humidity:${humidity2}`);
    $("#humidityDayThree").text(`Humidity:${humidity3}`);
    $("#humidityDayFour").text(`Humidity:${humidity4}`);
    $("#humidityDayFive").text(`Humidity:${humidity5}`);
    let img1 = $('<img>');
    img1.attr("src", iconURLForecast1Png);
    $("#iconImageDayOne").append(img1);
    let img2 = $('<img>');
    img2.attr("src", iconURLForecast2Png);
    $("#iconImageDayTwo").append(img2);
    let img3 = $('<img>');
    img3.attr("src", iconURLForecast3Png);
    $("#iconImageDayThree").append(img3);
    let img4 = $('<img>');
    img4.attr("src", iconURLForecast4Png);
    $("#iconImageDayFour").append(img4);
    let img5 = $('<img>');
    img5.attr("src", iconURLForecast5Png);
    $("#iconImageDayFive").append(img5);
}

function renderUVIndexToday(indexUV){
    console.log(indexUV);
    $("#UVCurrent").text(`UV Index: ${indexUV}`);
}

function addCityToLS(city) {
    searchedCities.push(city)
    console.log(searchedCities);
    localStorage.setItem("cities", JSON.stringify(searchedCities));
};
