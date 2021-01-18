
// create variables
const apiKey = "a68c335056a4a3d1000ef6aa6b67cc0b";
let searchedCities = [];
let previousSearches;
let indexUV;
let lon = -33.8679;
let lat = 151.2073;
let geoLat;
let geoLon;


// URL queries
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
let queryURLByGeo = "https://api.openweathermap.org/data/2.5/weather?lat=";
let queryURL5Days = "https://api.openweathermap.org/data/2.5/forecast?q=";
let query5DayUrlGeolocation = "https://api.openweathermap.org/data/2.5/forecast?lat=";

init();

function init() {
    let city = getLastSearch();

    console.log(city);
    
    // request last cities from localstorage

    if (city === "empty") {
        clear();
     
        getCurrentWeather("sydney");
        getFiveDayForecast("sydney");
        // getCurrentDate();
        // getUVIndex(lon,lat);
    }
    else {
        clear();
        getCurrentWeather(city);
        getFiveDayForecast(city);
        getCurrentDate();
    }
}

$("#searchLocation").on("click", searchByGeoLocation);

function searchByGeoLocation() {
    console.log("test");
  if (navigator.geolocation) {
    console.log("if condition")
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    $("#error").text("Geolocation is not supported by this browser.");
  }
}

function showPosition(position){
    geoLat = position.coords.latitude;
    geoLon = position.coords.longitude;
    console.log(geoLat, geoLon);
    getCurrentWeatherGeolocation (geoLat, geoLon);

}

function showGeoLocationError(error){
    console.log(error);
}

function getLastSearch() {
    let city = "empty";
    // get values of local storage;   
    let searchedValues = JSON.parse(localStorage.getItem("cities")) || [];
    if (Array.isArray(searchedValues) && searchedValues.length > 0){
        return searchedValues[searchedValues.length-1]
    }
    renderSearchedCities(searchedValues);  
    return city;
      
}

$("#previousSearch ul").on("click", "li", function(){
    getCurrentWeather($(this).text());
    getFiveDayForecast($(this).text());
})

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



function renderSearchedCities(searchedCities){
    console.log(searchedCities);
    let ul = $("<ul>");
    ul.addClass("list-group row");
    $("#previousSearch").append(ul); 
    console.log(searchedCities.length)
    for (let i = searchedCities.length; i >= 0; i--) {
        makeRow(searchedCities[i]);
    }
}

function makeRow(city){
    let li = $("<li>").addClass("list-group-item bg-primary text-light").text(city);
    $("#previousSearch ul").append(li);
}

$("#searchButton").on("click", searchWeather);

function searchWeather() {
    var cityName = $("#citySearch").val().trim();
           console.log(cityName);
        getCurrentWeather(cityName); // temp, humidity, windspeed, uv
        getFiveDayForecast(cityName); // five days into future five cards
        // getUVIndex(lon,lat);
        getCurrentDate();
        makeRow(cityName);   
}

$("#citySearch").on("keypress", function(event){
    if(event.keyCode == 13){
        searchWeather();
    }
})

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
            lon = res.coord.lon;
            console.log(lon);
            lat = res.coord.lat;
            console.log(lat);
            getUVIndex(lon,lat);
        });

}

function getCurrentWeatherGeolocation(geoLat, geoLon) {
    clear();
    
    var queryWeatherUrlGeolocation = queryURLByGeo + geoLat + "&lon=" + geoLon + "&appid=" + apiKey;
    console.log(queryWeatherUrlGeolocation);
    $.ajax({
        url: queryWeatherUrlGeolocation,
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
            lon = res.coord.geoLon;
            console.log(geoLon);
            lat = res.coord.geoLat;
            console.log(geoLat);
            getUVIndex(geoLon,geoLat);
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
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">")
            for (var i = 0; i < res.list.length - 1; i++) {

                if (res.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    let humidity = res.list[i].main.humidity;
                    let temp = Math.round((res.list[i].main.temp - 273.15) * 100) / 100;
                    let iconIDForecast = res.list[i].weather[0].icon;
                    let iconURLForecastUrl = `https://openweathermap.org/img/wn/${iconIDForecast}@2x.png`

                    let col = $("<div>").addClass("col-md-2");
                    let card = $("<div>").addClass("card bg-primary text-white");
                    let body = $("<div>").addClass("card-body p-2");

                    let title = $("<h6>").addClass("card-title").text(new Date(res.list[i].dt_txt).toLocaleDateString());

                    let p1 = $("<p>").addClass("card-text").text(humidity);
                    let p2 = $("<p>").addClass("card-text").text(temp);
                    let img1 = $("<img>").addClass("card-body").attr("src", iconURLForecastUrl);
                    col.append(card.append(body.append(title, p1, p2, img1)))
                     $("#forecast .row").append(col);
                    makeCard(humidity, temp, iconURLForecastUrl);
                }

               
            }
    }); 
};

function getFiveDayForecastGeolocation(geoLat, geoLon) {
    var query5DayUrlGeolocation = queryURL5Days + geoLat + "&lon=" + geoLon + "&appid=" +apiKey;
    console.log(query5DayUrlGeolocation);
    $.ajax({
        url: query5DayUrlGeolocation,
        method: "GET"
    }).then(
        function (res) {
            console.log(res);
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">")
            for (var i = 0; i < res.list.length - 1; i++) {

                if (res.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    let humidity = res.list[i].main.humidity;
                    let temp = Math.round((res.list[i].main.temp - 273.15) * 100) / 100;
                    let iconIDForecast = res.list[i].weather[0].icon;
                    let iconURLForecastUrl = `https://openweathermap.org/img/wn/${iconIDForecast}@2x.png`

                    let col = $("<div>").addClass("col-md-2");
                    let card = $("<div>").addClass("card bg-primary text-white");
                    let body = $("<div>").addClass("card-body p-2");

                    let title = $("<h6>").addClass("card-title").text(new Date(res.list[i].dt_txt).toLocaleDateString());

                    let p1 = $("<p>").addClass("card-text").text(humidity);
                    let p2 = $("<p>").addClass("card-text").text(temp);
                    let img1 = $("<img>").addClass("card-body").attr("src", iconURLForecastUrl);
                    col.append(card.append(body.append(title, p1, p2, img1)))
                     $("#forecast .row").append(col);
                    makeCard(humidity, temp, iconURLForecastUrl);
                }               
            }
    }); 
};


function makeCard(humidity, temp, iconURLForecastUrl){

}

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
