const charContainer = document.querySelector("#compareCharacter")
const charForm = document.querySelector("#characterForm")
const main = document.querySelector("main")
const comparisonWrapper = document.querySelector("#comparisonWrapper")
const compareBtn = document.querySelector("#compareBtn")
const charOneChoice = document.querySelector("#charOne")
const charTwoChoice = document.querySelector("#charTwo")
const loader = document.querySelector(".loader")
const h3 = document.createElement("h3");
const errorDiv = document.createElement("div");
const restartBtn = document.createElement("button")
let charArr = []
let duplicateChar;

// -------------------------------------------------------- Character Prototype -----------------------------------------------------------
class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, homePlanet, vehicles, starships, pictureUrl) {
        this.name = name;
        this.gender = gender == "n/a" ? "no gender" : gender;
        this.height = +height ? +height : "unknown";
        this.mass = +mass ? +mass : "unknown";
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.movies = movies;
        this.homePlanet = homePlanet;
        this.vehicles = vehicles;
        this.starships = starships;
        this.pictureUrl = pictureUrl + ".svg";
    }
    renderCharacter() {
        let article = document.createElement("article")
        article.classList.add("col-sm-6", "pb-5")
        article.innerHTML += `
        <div class="profile-card text-center ">
        <h3>${(this.name).toLowerCase()}</h3>
        <img class="svg" src="assets/images/${this.pictureUrl.toUpperCase().split(' ').join("-")}" alt="Portrait of ${this.name}"/>
        </div>
        <section class="col-md ">
            <ul class="list-group my-4">
                <li class="list-group-item"><span>Hair color: </span>${(this.hairColor)}</li>
                <li class="list-group-item"><span>Gender: </span>${(this.gender)}</li>
                <li class="list-group-item"><span>Height: </span>${(this.height)} cm</li>
                <li class="list-group-item"><span>Mass: </span>${(this.mass)} kg</li>
                <li class="list-group-item"><span>Skin color: </span>${(this.skinColor)}</li>
                <li class="list-group-item"><span>Movies: </span>${(this.movies.length)}</li> 
            </ul>
            <div class="row g-2">
                <div class="col"><button class="h-100 method vehicle">$Vehicle?</button></div>
                <div class="col"><button class="h-100 method debut">Movie debut?</button></div>
            </div>
            <p class="mt-4"><p>
        </section>`
        charContainer.append(article)
        
        article.querySelector(".vehicle").addEventListener("click", () => this.compareVehicles(article)) 
        article.querySelector(".debut").addEventListener("click", () => this.filmDebut(article))
    }
    renderComparison() {
        let charTwo = charArr.find(obj => obj != this)
        comparisonWrapper.innerHTML += `
        <section class="col-md mb-4">
            <h4 class="text-center">Comparison</h4>
            <ul class="list-group">
                <li class="list-group-item">${this.name} ${this.compareCharacters(this.hairColor,charTwo.hairColor) ? "has the same" : "doesn´t have the same"} hair color as ${charTwo.name}.</li>
                <li class="list-group-item">${this.name} is ${this.compareCharacters(this.gender,charTwo.gender) ? "the same gender" : "not the same gender"} as ${charTwo.name}.</li>
                <li class="list-group-item">${this.name}´s skin color is ${this.compareCharacters(this.skinColor,charTwo.skinColor) ? "the same" : "not the same"} as ${charTwo.name}'s skin color.</li>
                <li class="list-group-item">${this.name} is ${(this.height)} cm tall ${this.compareCharacters(this.height,charTwo.height, charTwo, "height")}.</li>
                <li class="list-group-item">${this.name} weighs ${this.mass} kg ${this.compareCharacters(this.mass,charTwo.mass, charTwo, "mass")}.</li>
                <li class="list-group-item">${this.name} has appeared in ${(this.movies.length)} movies ${this.compareCharacters(this.movies.length,charTwo.movies.length, charTwo, "length")}.</li>
            </ul>
        </section>
        <section class="container">
            <h4 class="text-center p-1">Want to find out more?</h4>
            <div class="row g-2 pt-4">
                <div class="col"><button class="h-100 method movie-list">Co-starring?</button></div>
                <div class="col"><button class="h-100 method home-planets">Home planet?</button></div>
            </div>
            <p class="mt-4"></p>
        </section>`
        
        comparisonWrapper.querySelector(".movie-list").addEventListener("click", () => this.compareFilms(charTwo))
        comparisonWrapper.querySelector(".home-planets").addEventListener("click", () =>  this.compareHomePlanet(charTwo))  
    }
    compareCharacters(valueOne, valueTwo, charTwo, str){
        let string;
        if (typeof valueOne === "string") {
            return (valueOne === valueTwo)
        } else {
            if (valueOne > valueTwo){
                if(str === "length") {
                    string = `, compared to ${charTwo.name}'s measly ${charTwo.movies.length} movie appearances`
                } else if (str === "mass") {
                    string = `, which is ${this.mass - charTwo.mass} kg more than ${charTwo.name}, who weighs in on ${charTwo.mass} kg`
                }else if (str === "height") {
                    string = `, and therefore taller than ${charTwo.name}, who is only ${charTwo.height} cm`
                }
                return string;
            } else if (valueOne < valueTwo) {
                if(str === "length") {
                    string = `, and has therefore been in less movies than ${charTwo.name}`
                } else if (str === "mass") {
                    string = `, weighing less than ${charTwo.name}, who weighs ${charTwo.mass - this.mass} kg more`
                }else if (str === "height") {
                    string = `, practically a gnome compared to ${charTwo.name}'s impressive ${charTwo.height} cm`
                }
                return string
            } else if (valueOne === valueTwo) {
                if(str === "length") {
                    string = `, the same amount as ${charTwo.name}`
                } else if (str === "mass") {
                    string = `, the same as ${charTwo.name}`
                }else if (str === "height") {
                    string = `, just as ${charTwo.name}`
                }
                return string;
            }
        }
    }
    filmDebut = async (wrapper) => {
        renderStr(`Loading...`, wrapper)
        let firstMovie = await getData(chopChop(this.movies[0])) 
        renderStr(`${this.name} first graced the movie screen in the film "${firstMovie.title}" released ${dateToText(firstMovie.release_date)}.`, wrapper)
    }
    compareFilms = async (charTwo) => {
        renderStr(`Loading...`)
        let movieArr = await fetchApiUrlArr(this.movies, "title")
        let movieArr2 = await fetchApiUrlArr(charTwo.movies, "title")
        let sharedMovies = movieArr[0].filter((movie) => movieArr2[0].includes(movie));
        if(sharedMovies.length === 0) {
            renderStr( `${this.name} & ${charTwo.name} have never co-starred in the same movie.`)            
        } else {
            renderStr(`${this.name} & ${charTwo.name} both appeared in ${arrayToText(sharedMovies)}.`)
        }
    }
    compareHomePlanet = async (charTwo) => {
        renderStr(`Loading...`)
        let homePlanet = await getData(chopChop(this.homePlanet)) 
        let homePlanet2 = await getData(chopChop(charTwo.homePlanet)) 
        if(homePlanet.name === homePlanet2.name) {
            renderStr( `Both ${this.name} & ${charTwo.name} originate from the planet of ${homePlanet.name}.`);
        } else {
            renderStr(`${this.name} hails from the planet of ${homePlanet.name} and ${charTwo.name} originates from the planet ${homePlanet2.name}.`);
        }
    }
    compareVehicles = async(wrapper) => {
        renderStr(`Loading...`, wrapper)
        // Fetches array of [vehicle prices, vehicle objects]
        let starShipArr = await fetchApiUrlArr(this.starships, "cost_in_credits")
        let vehicleArr = await fetchApiUrlArr(this.vehicles, "cost_in_credits")
        // Array - consists of the value of the most expensive starship & the value of the most expensive vehicle
        let arrStarVeh = [+getMaxValue(starShipArr[0]), +getMaxValue(vehicleArr[0])]
        // Determins and returns the value of the characters most expensive vehicle or starship
        let max = getMaxValue(arrStarVeh);
        if(max == 0) {
            renderStr(`${this.name} hasn't kept the receipts for any of their means of transport.`, wrapper);
        } else {
            if(arrStarVeh.indexOf(max) == 0) {
                // Returns the name of the determined most expensive starship
                let expStarship = mostExpVeh(starShipArr[1], max)
                renderStr(`${expStarship.name} is ${this.name}'s most expensive starship, costing an astounding ${expStarship.cost_in_credits} galactic credits.`, wrapper)
            } else {
                // Returns the name of the determined most expensive vehicle
                let expVehicle = mostExpVeh(vehicleArr[1], max)
                renderStr(`${expVehicle.name} is ${this.name}'s most expensive vehicle, costing an astounding ${expVehicle.cost_in_credits} galactic credits.`, wrapper)
            }
        }
    }
}

// -------------------------------------------------------- Set up: API -----------------------------------------------------------
const API_BASE_URL = "https://swapi.dev/api/"

const getData = async(route, params) => {
    try {
        let res = await fetch(`${API_BASE_URL}${route}${params ? params : ""}`)
        return  await res.json();
    } catch (error) {
        main.innerHTML= ""
        main.classList.add("text-center")
        h3.innerText = "Something went wrong...";
        restartBtn.innerText = "Try again"
        main.append(h3, restartBtn);
    }
}

// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------
charForm.addEventListener("submit", (e) => {
    e.preventDefault()
    
    let charInputArr = [charOneChoice.value, charTwoChoice.value]
    // Prevents user from comparing the same characters
    if(!duplicateChar) {
        charForm.classList.add("hidden")
        loader.classList.remove("loader-hidden")
        // Renders characters to the DOM
        renderCharView(charInputArr)
        .then(() => {
            compareBtn.classList.remove("hidden")
            loader.classList.add("loader-hidden")
            // Removes loader element from the DOM
            loader.ontransitionend = () => {
                loader.remove()
            }
        });
    }
})

// -------------------------------------------------------- Renders the users choosen characters -----------------------------------------------------------
let renderCharView = async (arr) => {
    // Fetches character from API and creates a new instance of the Character prototype - returns arr of pending promises 
    let response = arr.map((char) => loadCharacters(char))
    
    // Resolves response array and assign it to global character array
    charArr = await Promise.all(response)
    // Renders charArr
    charArr.forEach((char) => char.renderCharacter())
}

// -------------------------------------------------------- Creates new instance of character prototype-----------------------------------------------------------
let loadCharacters = async (charInput) => {
    
    route = "people/?"
    let params = new URLSearchParams({
        ...(charInput != "" ? { search: charInput } : "")
    })
    let charObj = await getData(route, params)
    
    // Destructuring the character object fetched from API
    let { name, gender, height, mass, hair_color, skin_color, eye_color, films, homeworld, vehicles, starships } = charObj.results[0];
    // Creates new Character instance with thee data from the character obj fetched from the API
    let charProto = new Character(name, gender, height, mass, hair_color, skin_color, eye_color, films, homeworld, vehicles, starships, name)
    return charProto
}

// -------------------------------------------------------- Initates the rendering of the list comparison between the characters -----------------------------------------------------------
compareBtn.addEventListener("click", () => {
    event.target.classList.add("hidden")
    charArr[0].renderComparison()
})

// -------------------------------------------------------- Informs user if they have choosen the same character -----------------------------------------------------------
charForm.addEventListener('change', (e) => {
    duplicateChar = false
    charOneChoice.classList.remove("error")
    charTwoChoice.classList.remove("error")
    errorDiv.innerText = ""

    if(charOneChoice.value === charTwoChoice.value) {
        duplicateChar = true;

        errorDiv.innerText = "It is more fun if you don't compare the same character:)"
        charForm.prepend(errorDiv)
        charOneChoice.classList.add("error")
        charTwoChoice.classList.add("error")
    }
});

// -------------------------------------------------------- Reload page when api-fetch throws error -----------------------------------------------------------
restartBtn.addEventListener("click", () => {
    location.reload();
})

// -------------------------------------------------------- Helper functions -----------------------------------------------------------
// Returns incoming url:s unique route
let chopChop =  url => {
    const [first, last] = url.split("api/");
    return last
}
// Returns array of asynchronously fulfilled objects & an array of the values of passed in obj.key
let fetchApiUrlArr = async (arr, key) => {
    let resArr = arr.map(elem => getData(chopChop(elem)));
    let dataArr = await Promise.all(resArr)
    return [dataArr.map(elem => elem[key]), dataArr]
}
// Returns the max value of passed in array or zero if array is empty or the value is "unknown"
let getMaxValue = (arr) => {
    if(arr.length == 0) {
        return 0
    } else {
        let max = arr.reduce((a, b) => Math.max(a, b));
        if(max == "unknown") {
            max = 0
        } 
        return +max
    }
}
// Returns the obj from the passed in array which cost_in_credits matches the max-value passed in
let mostExpVeh = (arr, max) => {
    return arr.find(obj => obj.cost_in_credits == max);
}
let renderStr = (str, wrapper) => {
    if(wrapper) {
        let p = wrapper.querySelector("p")
        p.innerText = str
    } else {
        let p = comparisonWrapper.querySelector("p")
        p.innerText = str
    }
}
// Courtesy of: https://stackoverflow.com/questions/16251822/array-to-comma-separated-string-and-for-last-tag-use-the-and-instead-of-comma
let arrayToText = (arr) => {
    if (arr.length <= 2) {
        return arr.join(' and ');
    } else {
        return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length-1];
    }
}
let dateToText = (date) => {
    return new Date(date).toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"})
}