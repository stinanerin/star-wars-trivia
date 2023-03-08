console.log("Star Wars Trivia");

// -------------------------------------------------------- Set up: fetching API -----------------------------------------------------------

let API_BASE_URL = "https://swapi.dev/api/"

let getData = async(route, params) => {
   
    let res = await fetch(`${API_BASE_URL}` + route + params)
    return await res.json();
    
}

// -------------------------------------------------------- Character Prototype -----------------------------------------------------------

class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, pictureUrl) {
        this.name = name;
        this.gender = gender;
        this.height = height;
        this.mass = mass;
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.movies = movies;
        this.pictureUrl = pictureUrl;
    }
}

// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------

document.querySelector("#characterForm").addEventListener("submit", (e) => {
    e.preventDefault()

    let charOne = document.querySelector("#charOne").value
    let charTwo = document.querySelector("#charTwo").value

    route = "people/?"

    let paramsCharOne = new URLSearchParams({
        //todo! ta bort !== "any"
        ...(charOne !== "any" ? { search: charOne } : {})
    })

    let paramsCharTwo = new URLSearchParams({
        //todo! ta bort !== "any"
        ...(charTwo !== "any" ? { search: charTwo } : {})
    })

    console.log(`${API_BASE_URL}${route}${paramsCharOne}`);
    console.log(`${API_BASE_URL}${route}${paramsCharTwo}`);

    getData(route, paramsCharOne).then((obj) => {
        console.log(obj.results);
    
        //todo! Skapa metod för html på class prototypen
        //todo! error hantering - om karaktären ej finns
        //todo! error hantering - om anv. ej valt två karaktärer

    })
    getData(route, paramsCharTwo).then((obj) => {
        console.log(obj.results);
    
        //todo! Skapa metod för html på class prototypen
        //todo! error hantering - om karaktären ej finns
        //todo! error hantering - om anv. ej valt två karaktärer

    })
})
