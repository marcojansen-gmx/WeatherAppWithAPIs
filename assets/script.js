// create h1 header Weather dashboard with Jumbotron

var div = $("<div class='container'>");

// load jumbotron header
    div.html(`
    <div class="jumbotron jumbotron-fluid">
    <div class="container">
    <h1 class="display-4">Weather Dashboard</h1>
    </div>
    </div>`);
    $("body").append(div);

   // create grid system
    div.html(`
    <main id="main" class="container">
        <aside id="aside" class="col">
            <div id="search" class="row">
            <div id="previous" "class="row">
        </aside>
        <div id="result" class="col">    
            <div id"current" class="row">
            <div id="forecast" class="row">    
        </div>    
    </main>`);
    $("body").append(div);

    
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


// create input form field for user input



// create "submit" button to start searching for selected city


//  send api request



// .error
// create alert in case city is no found


// .then 
// store selected city in localstorage
//


