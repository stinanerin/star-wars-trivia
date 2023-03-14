let charContainer = document.querySelector("#compareCharacter")
let charForm = document.querySelector("#characterForm")
let compareBtn = document.querySelector("#compareBtn")
let charOneChoice = document.querySelector("#charOne")
let charTwoChoice = document.querySelector("#charTwo")
let loader = document.querySelector(".loader")
let h3 = document.createElement("h3");
let errorDiv = document.createElement("div");

let charArr = []
let duplicateChar;

// -------------------------------------------------------- Set up: API -----------------------------------------------------------
let API_BASE_URL = "https://swapi.dev/api/"

let getData = async(route, params) => {
    try {
        let res = await fetch(`${API_BASE_URL}${route}${params ? params : ""}`)
        return  await res.json();
    } catch (error) {
        compareBtn.classList.add("hidden")
        charContainer.innerHTML= ""
        h3.innerText = "Something went wrong.. Please try again later.";
        document.body.append(h3);
    }
}
// -------------------------------------------------------- Character Prototype -----------------------------------------------------------
class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, homePlanet, vehicles, starships, pictureUrl) {
        this.name = name;
        this.gender = gender;
        this.height = +height;
        this.mass = +mass;
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
        charContainer.innerHTML += `
            <article class="col-sm pb-5" data-character="${this.name.toLowerCase().split(' ').join("-")}">
                <div class="profile-card text-center ">
                    <h3>${(this.name).toLowerCase()}</h3>
                    <img class="svg" src="assets/images/${this.pictureUrl.toLowerCase().split(' ').join("-")}" alt="Portrait of ${this.name}"/>
                </div>
            </article>
        `
    }
    renderProperties(container) {
        let charTwo = charArr.find(obj => obj != this)
        container.innerHTML += `
            <section class="col-md my-4">
                <ul class="list-group">
                    <li class="list-group-item ">${this.name}'s hair is ${(this.hairColor)}<span class="${this.compareCharacters(this.hairColor,charTwo.hairColor)}"> just like ${charTwo.name}'s hair.</span></li>
                    <li class="list-group-item ">${this.name} is ${(this.gender)}<span class="${this.compareCharacters(this.gender,charTwo.gender)}"> just like ${charTwo.name}</span></li>
                    <li class="list-group-item ">${this.name} is ${(this.height)} cm tall<span> ${this.compareCharacters(this.height,charTwo.height, charTwo, "height")}</span></li>
                    <li class="list-group-item ">${this.name} weighs ${this.mass} kg<span> ${this.compareCharacters(this.mass,charTwo.mass, charTwo, "mass")} </span></li>
                    <li class="list-group-item ">${this.name}´s skin is ${(this.skinColor)}<span class="${this.compareCharacters(this.skinColor,charTwo.skinColor)}"> , the same as ${charTwo.name}'s skin.</span></li>
                    <li class="list-group-item">${this.name} has appeared in ${(this.movies.length)} movies<span> ${this.compareCharacters(this.movies.length,charTwo.movies.length, charTwo, "length")} </span></li>
                </ul>
            </section>
            <section class="container">
                <h4 class="text-center">Tell me more about how we are different?</h4>
                <div class="row g-2">
                    <div class="col-6"><button class="h-100 method p-3 compare-debut">Movie debut</button></div>
                    <div class="col-6"><button class="h-100 method p-3 movie-list">Filmography</button></div>
                    <div class="col-6"><button class="h-100 method p-3 home-planets">Home planet</button></div>
                    <div class="col-6"><button class="h-100 method p-3 vehicles">$Vehicle</button></div>
                </div>
                <p class="my-4"></p>
            </section>
        `;
        
        // All game-play event-listeners
        container.querySelector(".compare-debut").addEventListener("click", (e) => this.compareDebut(e))
        container.querySelector(".movie-list").addEventListener("click", (e) => this.compareFilms(charTwo, e))
        container.querySelector(".home-planets").addEventListener("click", (e) =>  this.compareHomePlanet(charTwo, e))  
        container.querySelector(".vehicles").addEventListener("click", (e) =>  this.compareVehicles(e))  
        // onclick="${this.compareDebut()}
    }
    compareCharacters(valueOne, valueTwo, charTwo, str){
        if(typeof valueOne === "string") {
            if (valueOne === valueTwo) {
                // console.log(`${valueOne} is the same as ${valueTwo}`) 
                return 
            }
            else {
                // console.log(`${valueOne} is not the same as ${valueTwo}`)
                return "hidden" 
            }
        } else {
            let string;
            if (valueOne > valueTwo){
                // console.log(`${valueOne} is bigger than ${valueTwo}`)
                if(str === "length") {
                    string = `, compared to ${charTwo.name}'s measly ${charTwo.movies.length} movie appearances.`
                } else if (str === "mass") {
                    string = `, which is ${this.mass - charTwo.mass} kg more than ${charTwo.name}, who weighs in on ${charTwo.mass} kg`
                }else if (str === "height") {
                    string = `, and therefore taller than ${charTwo.name}, who is only ${charTwo.height} cm`
                }
                return string;
            } else if (valueOne < valueTwo) {
                //todo! Vill jag lägga tillbaka?
                return ""
            } else if (valueOne === valueTwo) {
                // console.log(`${valueOne} is the same as ${valueTwo}`) 
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
    compareDebut = async (e) => {
        console.log("in compareDebut function", this.name);
        let firstMovie = await getData(chopChop(this.movies[0])) 
        renderStr(e, `${this.name} first graced the movie screen in the film "${firstMovie.title}" released ${new Date(firstMovie.release_date).toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"})}.`)
    }
    compareFilms = async (charTwo, e) => {
        console.log("in compareFilms function", this.name);
        let movieArr = await fetchApiUrlArr(this.movies, "title")
        let movieArr2 = await fetchApiUrlArr(charTwo.movies, "title")
        let sharedMovies = movieArr[0].filter((movie) => movieArr2[0].includes(movie));
        if(sharedMovies.length === 0) {
            renderStr(e, `${this.name} & ${charTwo.name} have never appeared in the same movie.`)            
        } else {
            // console.log("sharedMovies", sharedMovies);
            renderStr(e, `${this.name} & ${charTwo.name} have both been in ${arrayToText(sharedMovies)}.`)
        }
    }
    compareHomePlanet = async (charTwo, e) => {
        console.log("in compareHomePlanet function", this.name);

        let homePlanet = await getData(chopChop(this.homePlanet)) 
        let homePlanet2 = await getData(chopChop(charTwo.homePlanet)) 
        renderStr(e, `${this.name} hails from the planet of ${homePlanet.name}`);
        if(homePlanet.name === homePlanet2.name) {
            renderStr(e, `Both ${this.name} & ${charTwo.name} originate from the planet of ${homePlanet.name}.`);
        }
    }
    compareVehicles = async(e) => {
        console.log("in comapareVehicle function", this.name);
        // Fetch array of vehicle prices and array of vehicle objects
        let starShipArr = await fetchApiUrlArr(this.starships, "cost_in_credits")
        let vehicleArr = await fetchApiUrlArr(this.vehicles, "cost_in_credits")
        // console.log("starship maxVal", +getMaxValue(starShipArr[0]), "starshipArr", starShipArr[1]);
        // console.log("vehicle maxVal", +getMaxValue(vehicleArr[0]), "vehicleArr", vehicleArr[1]);

        // Array - consists of the value of the most expensive starship & the value of the most expensive vehicle
        let arrStarVeh = [+getMaxValue(starShipArr[0]), +getMaxValue(vehicleArr[0])]
        // console.log("arrStarVeh", arrStarVeh);
        // Determins and returns the value of the characters most expensive vehicle or starship
        let max = getMaxValue(arrStarVeh);
        // console.log("max", max);
        if(max == 0) {
            renderStr(e, `${this.name} hasn't kept the recepits for any of their means of transport.`);
        } else {
            if(arrStarVeh.indexOf(max) == 0) {
                // Returns the name of the determined most expensive starship
                let expStarship = mostExpVeh(starShipArr[1], max)
                renderStr(e, `${expStarship} is ${this.name}'s most expensive starship.`);
            } else {
                // Returns the name of the determined most expensive vehicle
                let expVehicle = mostExpVeh(vehicleArr[1], max)
                renderStr(e, `${expVehicle} is ${this.name}'s most expensive vehicle.`);
            }
        }
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

// -------------------------------------------------------- Initates the rendering of the list comparison between the characters -----------------------------------------------------------
let compareCharacter = () => {
    event.target.classList.add("hidden")

    charArr.forEach(obj => {
        let article = document.querySelector(`[data-character="${obj.name.toLowerCase().split(' ').join("-")}"]`)
        //todo! borde kanske göra om till redan existerande html där jag togglar hidden class kom jag på nu?
        obj.renderProperties(article)
    })
}

// -------------------------------------------------------- Creates new instance of character prototype-----------------------------------------------------------
let loadCharacters = async (charInput) => {
    //todo! error hantering - om karaktären ej finns
    //todo! dubbelkolla båda om första och andra ej existerar
    //todo! error hantering - om anv. ej valt två karaktärer - 
    // try {
        route = "people/?"

        let params = new URLSearchParams({
            ...(charInput != "" ? { search: charInput } : "")
        })
        // console.log(`${API_BASE_URL}${route}${params}`);
        
        let charObj = await getData(route, params)

        //todo! bryt ut denna bit?
        // Destructuring the character object fetched from API
        let { name, gender, height, mass, hair_color, skin_color, eye_color, films, homeworld, vehicles, starships } = charObj.results[0];
        //todo! fixa dynamiskt namn?
        // Creates new Character instance with thee data from the character obj fetched from the API
        let charProto = new Character(name, gender, height, mass, hair_color, skin_color, eye_color, films, homeworld, vehicles, starships, name)
        return charProto
        // return charArr.push(charProto)
}

// -------------------------------------------------------- Informs user if they have choosen the same character -----------------------------------------------------------
charForm.addEventListener('change', (e) => {
    duplicateChar = false
    charOneChoice.classList.remove("error")
    charTwoChoice.classList.remove("error")
    errorDiv.innerText = ""

    if(charOneChoice.value === charTwoChoice.value) {
        // console.log("you have choosen the same character dummy");
        duplicateChar = true;

        errorDiv.innerText = "It is more fun if you don't compare the same character:)"
        charForm.prepend(errorDiv)
        charOneChoice.classList.add("error")
        charTwoChoice.classList.add("error")
    }
});
// Returns incoming url:s unique route
let chopChop =  url => {
    const [first, last] = url.split("api/");
    return last
}
// Returns array of asynchronously fulfilled objects & an array of the values of passed in obj.key
let fetchApiUrlArr = async (arr, key) => {
    let resArr = arr.map(elem => getData(chopChop(elem)));
    // console.log(resArr);
    //todo! settledAll + lägg in try & catch
    let dataArr = await Promise.all(resArr)
    // console.log(dataArr);
    return [dataArr.map(elem => elem[key]), dataArr]
}
// Returns the max value of passed in array or zero if array is empty or the value is "unknown"
let getMaxValue = (arr) => {
    // console.log("arr inside getMax before reduce", arr);
    if(arr.length == 0) {
        // console.log("empty arr");
        return 0
    } else {
        let max = arr.reduce((a, b) => Math.max(a, b));
        if(max == "unknown") {
            max = 0
        } 
        // console.log("max in get maxVal", +max);
        return +max
    }
}

// Returns the obj.name from the passed in array which cost_in_credits matches the max-value passed in
let mostExpVeh = (arr, max) => {
    // console.log("arr in mostExpVeh", arr);
    // console.log("max in mostExpVeh", max);
    return arr.find(obj => obj.cost_in_credits == max).name;
}

let renderStr = (event, str) => {
    let p = event.target.parentElement.parentElement.nextElementSibling
    p.innerText = str
}

// Courtesy of: https://stackoverflow.com/questions/16251822/array-to-comma-separated-string-and-for-last-tag-use-the-and-instead-of-comma
let arrayToText = (arr) => {
    if (arr.length <= 2) {
        return arr.join(' and ');
    } else {
        return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length-1];
    }
}

//! -------------------------------------------------------- Renders the users choosen characters -----------------------------------------------------------
let renderCharView = async (arr) => {
    // Fetches character from API and creates a new instance of the Character prototype - returns arr of pending promises 
    let response = arr.map((char) => loadCharacters(char))

    try {
        // Resolves response array and assign it to global character array
        charArr = await Promise.all(response)
        // console.log(charArr);
        // Renders charArr
        charArr.forEach((char) => char.renderCharacter())
    }
    catch (error) {
        //todo! error?
        console.log("Error", error);
    }
}