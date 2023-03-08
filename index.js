console.log("Star Wars Trivia");

let charContainer = document.querySelector("#compareCharacter")
let charForm = document.querySelector("#characterForm")
let charArr = []

// -------------------------------------------------------- Set up: API -----------------------------------------------------------

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
        this.pictureUrl = pictureUrl + ".svg";
    }
    renderCharacter() {
        charContainer.innerHTML += `
            <article class="col ${(this.name).toLowerCase()}">
                <h3>${(this.name).toLowerCase()}</h3>
                <img src="/images/${this.pictureUrl.toLowerCase()}" alt="Portrait of ${this.name}"/>
            </article>
        `
    }
    renderProperties() {
        charContainer.innerHTML += `
            <article class="col">
                <ul> 
                    <li><span>Hair color: </span>${(this.hairColor)}</li>
                    <li><span>Gender: </span>${(this.gender)}</li>
                    <li><span>Heigth: </span>${(this.height)}</li>
                    <li><span>Mass: </span>${(this.mass)}</li>
                    <li><span>Skin color: </span>${(this.skinColor)}</li>
                    <li><span>Movies: </span>${(this.movies.length)}</li>
                </ul>
            </article>
        `
    }
}

// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------

charForm.addEventListener("submit", (e) => {
    e.preventDefault()

    charContainer.innerHTML = "";
    let charOne = document.querySelector("#charOne").value
    let charTwo = document.querySelector("#charTwo").value
    charForm.classList.add("hidden")

    let compareButton = document.createElement("button")
    compareButton.innerText = "compare characters"
    compareButton.addEventListener('click', compareCharacter);

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
    // console.log(`${API_BASE_URL}${route}${paramsCharTwo}`);

    getData(route, paramsCharOne).then((obj) => {

        let { name, gender, height, mass, hair_color, skin_color, eye_color, films } = obj.results[0];
        
        let charOneProto = new Character(name, gender, height, mass, hair_color, skin_color, eye_color, films, name)
        charArr.push(charOneProto)

        console.log(charOneProto);

        charOneProto.renderCharacter()
    
        //todo! error hantering - om karaktären ej finns
        //todo! error hantering - om anv. ej valt två karaktärer

    })
    getData(route, paramsCharTwo).then((obj) => {

        // Destructuring
        let { name, gender, height, mass, hair_color, skin_color, eye_color, films } = obj.results[0];

        let charTwoProto = new Character(name, gender, height, mass, hair_color, skin_color, eye_color, films, name)
        charArr.push(charTwoProto)

        console.log(charTwoProto);

        charTwoProto.renderCharacter()
    
        //todo! error hantering - om karaktären ej finns
        //todo! error hantering - om anv. ej valt två karaktärer

        charContainer.append(compareButton)

    })
})

// -------------------------------------------------------- Compare Character -----------------------------------------------------------

let compareCharacter = () => {
    console.log(charArr);
    event.target.classList.add("hidden")

    charArr.forEach(obj => obj.renderProperties())

}