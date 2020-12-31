let inputOfUser = document.forms["data"];
let list = document.getElementById("selectCountires");
let arr = [] ;




/*
    fill data from api into the table using fetch
    and insert the  max and min temperature
    and wind speed, if wind speed is 1 dont insert
    into the table
 */
function showWeatherTable(event){


    let cityPos = list.selectedIndex;
    let Obj = arr[Number(cityPos - 1)];

    fetch(`http://www.7timer.info/bin/api.pl?lon=${Number(Obj.lon)}&lat=${Number(Obj.lat)}}&product=civillight&output=json`)
        .then(status)
        .then(function json(response) {
            return response.json()
        })
        .then(function(response) {


            let outputsTab = document.getElementById('weatherTable');

            let cols=0;
            for (var i = 1; tableRow = outputsTab.rows[i]; i++)
            {

                tableRow.cells[1].innerHTML =  response.dataseries[cols].weather;
                tableRow.cells[2].innerHTML = response.dataseries[cols].temp2m.min + "/"
                    + response.dataseries[cols].temp2m.max + " °C";
                response.dataseries[cols].wind10m_max == 1 ? tableRow.cells[3].innerHTML = '' :
                    tableRow.cells[3].innerHTML = response.dataseries[cols].wind10m_max;
                cols++;
            }


        }).catch(function(error) { //error case
        document.querySelector("#data").innerHTML =
            `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Error !</strong> weather forecast service is not available right now, please try again later</div>`;

    });
}


// check if the response is not getting errors
function status(response)
{

    if (response.status >= 200 && response.status < 300)
    {
        return Promise.resolve(response)
    } else
    {
        return Promise.reject(new Error(response.statusText))
    }
}


// check if longitude and latitude are decimals
// if not print an error msg
function decimalInputs(lat,lon){
    let decimal = document.getElementById('decimal');
    decimal.innerHTML= '';
    if(lat % 1 === 0 || lon % 1 === 0 ) {
        decimal.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Wrong Input!</strong> latitude and longitude must be a decimal number`
        return false;
    }

    else{ return true;}
}

/*
check if user input is valid:
 -Latitude Must Be Dicemal Number [-90 +90]
  -Longitude Must Be Dicemal Number [-180+180]
  - the nume of city must be a string without numbers
  if its not, Print a msg
 */
function checkIfInputsValid(city, lat, lon)
{
    let menu = document.getElementById('menu');
    menu.innerHTML= '';

    if((lat <= -90 || lat >= 90) || (lon <= -180 || lon >= 180) ||
        isNaN(lat) || isNaN(lon) || !lat || !lon || !(/^[a-zA-Z\s]+$/.test(city))){
        menu.innerHTML = `<div class="alert alert-danger
 alert-dismissible fade show" role="alert">
            <strong>Wrong Input!</strong>
<ul>
  <li>Please enter a valid City Name</li>
  <li>Latitude Must Be Dicemal Number [-90 +90]</li>
  <li>Longitude Must Be Dicemal Number [-180+180]</li></ul>`
        return false;
    }
    else if(arr.find(x => x.Location === city)){
        menu.innerHTML = `<div class="alert alert-danger 
alert-dismissible fade show" role="alert">
        <strong>City Name Already Exist</strong>`
        return false;
    }
    else{ return true;}
}


// Delete City From List
function deleteLoction(){
    let dropdown = document.getElementById("selectCountires");
    dropdown.remove(dropdown.selectedIndex);
}


// call functions to make the table and image of the weather forecast
document.getElementById("showWeatherData").addEventListener('click', event => { //if user submits the form
    event.preventDefault();
    showWeatherImage();
   showWeatherTable();
    clearInputsValues();

});
function clearInputsValues(){
    inputOfUser["Location"].value = ' ';
    inputOfUser["Longitude"].value = ' ';
    inputOfUser["Latitude"].value = ' ';
}
// get weather image from api if there errors on loading
// the picture print a deafult picture
function showWeatherImage(event){

    let imageOfWeatherForcaset = document.getElementById('weatherImg');
    let cityPos = list.selectedIndex;
    let obje = arr[Number(cityPos-1)];


    imageOfWeatherForcaset.src = `http://www.7timer.info/bin/astro.php?lon=${Number(obje.lon)}&lat=${Number(obje.lat)}
    &ac=0&lang=en&unit=metric&output=internal&tzshift=0`;

    imageOfWeatherForcaset.onerror = (event) => {
        imageOfWeatherForcaset.src = `img/weather.jpeg`;

    }
}



// Get the user Input and Check if the inputs are
// valid if the values is valid insert them on array
inputOfUser.addEventListener('submit', event => {

    event.preventDefault();
    let  Location = inputOfUser["Location"].value;
    let lat = Number(inputOfUser["Latitude"].value);
    let lon = Number(inputOfUser["Longitude"].value);


    if (checkIfInputsValid(Location, lat, lon) ) {
        arr.push({Location, lat, lon})  ;
        let option = document.createElement("option");
        option.innerHTML = Location;
        list.options.add(option);

        let i = list.selectedIndex;
        const val = arr[Number(i-1)];
    }


});