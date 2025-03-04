// const loc = navigator.geolocation.getCurrentPosition();
// console.log(loc);
const input = document.querySelector("#city");
const searchBtn = document.querySelector("#search");
const popUpContainer = document.querySelector(".pops")
const dataContainer = document.querySelector(".content")
const mainCard = document.querySelector(".container")
let dataCopy;

const popupImages = {
    information: ["images/information.png", "blue"],
    error : ["images/multiply.png", "red"],
    sucess : ["images/correct.png", "green"]
}

console.log(popupImages);


searchBtn.addEventListener("click", () => {
    searchBtn.disabled = true
    const city = input.value;

    if(!city) {
        createPopUp(popupImages.information[0], "Enter Valid City", popupImages.information[1]);
        enableSearchButton()
        dataContainer.style.display = "none";
        return
    }   else {
    fetchWeatherData(city);
    }
})

function enableSearchButton() {
    setTimeout(() => {
        searchBtn.disabled = false;
    }, 2000);
}


// logic for showing popup to the user
function createPopUp(image, msg, color) {
    const li = document.createElement("li");
    li.classList.add(color);
    li.innerHTML = `
        <img src="${image}" alt="">
        <p id="info">${msg}</p>
    `;

    popUpContainer.append(li);
    setTimeout(() => {
        deletePopup(li);
    },2200)
}

//deleting popups
function deletePopup(element) {
    element.classList.add("hide")
    setTimeout(() => {
        element.remove();
    },500)
}


// fetching data for the perticular city
async function fetchWeatherData(city) {
    // createPopUp(popupImages.information[0], "Gettind data.....", popupImages.information[1]);
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3e2e6a7a21d74160b8c806443862de09&units=metric`)
        const data = await response.json()


        dataCopy = data;
        if(Object.keys(data).length > 2) {
            createPopUp(popupImages.sucess[0], "Data recieved sucessfully", popupImages.sucess[1]);
            enableSearchButton()
        }


        // render weather data to the page
        renderData(data)
    } catch (error) {
        dataContainer.style.display = "none";
        enableSearchButton()
        let err;
        if(dataCopy.message) {
            err = dataCopy.message
        }   else {
            err = error;
        }
        createPopUp(popupImages.error[0], err, popupImages.error[1])
    }
}


// render data of the weather to the user
function renderData(data) {
    const weather  = data.weather[0];
    dataContainer.style.display = "block";
    dataContainer.innerHTML = `
        <div class="weather-condition">
                <img src="./images/${weather.main}.png" alt="">
                <p id="desc">${weather.description}</p>
                <p id="temp">${data.main.temp}° C</p>
        </div>

        <div class="details">
            <div class="wind one">
                    <img src="images/wind.png" alt="">
                    <div class="detail">
                            <p id="name">Wind</p>
                            <p id="val">${data.wind.speed}</p>
                    </div>
            </div>

            <div class="humidity one">
                    <img src="images/weather.png" alt="">
                    <div class="detail">
                            <p id="name">Humidity</p>
                            <p id="val">${data.main.humidity}</p>
                    </div>
            </div>
            </div>
    `;
}
