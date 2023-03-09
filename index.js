console.log("Star Wars Trivia");

let charContainer = document.querySelector("#compareCharacter")
let charForm = document.querySelector("#characterForm")
let compareBtn = document.querySelector("#compareBtn")

let charArr = []
let errorData = false;

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
        console.log("hej");
        charContainer.innerHTML += `
            <article class="col" data-character="${this.name.toLowerCase().split(' ').join("-")}">
                <div class="text-center">
                    <h3>${(this.name).toLowerCase()}</h3>
                    <img src="/images/${this.pictureUrl.toLowerCase().split(' ').join("-")}" alt="Portrait of ${this.name}"/>
                </div>
            </article>
        `
    }
    renderProperties(container) {
        container.innerHTML += `
            <article class="col">
                <ul class="list-group"> 
                    <li class="list-group-item"><span>Hair color: </span>${(this.hairColor)}</li>
                    <li class="list-group-item"><span>Gender: </span>${(this.gender)}</li>
                    <li class="list-group-item"><span>Heigth: </span>${(this.height)}</li>
                    <li class="list-group-item"><span>Mass: </span>${(this.mass)}</li>
                    <li class="list-group-item"><span>Skin color: </span>${(this.skinColor)}</li>
                    <li class="list-group-item"><span>Movies: </span>${(this.movies.length)}</li>
                </ul>
            </article>
        `
    }
}

// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------

charForm.addEventListener("submit", (e) => {

    e.preventDefault()
    let charOneInput = document.querySelector("#charOne").value
    let charTwoInput = document.querySelector("#charTwo").value
    compareBtn.classList.remove("hidden")
    charForm.classList.add("hidden")

    //todo! Undersök varför loop ej funkar - se graveyard
    loadCharacters(charOneInput).then(() => {

        loadCharacters(charTwoInput).then(() => {
            if(errorData) {
                console.log("errorData i 2:a", errorData);
                compareBtn.classList.add("hidden")
                charContainer.innerHTML= ""
                let h3 = document.createElement("h3");
                h3.innerText = "Sorry, we had problems getting the data.. Try again later.";
                document.body.append(h3);
            }
        })
    })
    console.log("outside",charArr);
})

// -------------------------------------------------------- Compare Character -----------------------------------------------------------

let compareCharacter = () => {
    console.log("clicked");
    console.log(charArr);
    event.target.classList.add("hidden")

    charArr.forEach(obj => {

        let article = document.querySelector(`[data-character="${obj.name.toLowerCase().split(' ').join("-")}"]`)

        obj.renderProperties(article)

    })
}
// -------------------------------------------------------- Load characters -----------------------------------------------------------


let loadCharacters = async (charInput) => {
    //todo! error hantering - om karaktären ej finns
    //todo! error hantering - om anv. ej valt två karaktärer - 
    //todo! dubbelkolla båda om första och andra ej existerar
    try {
        route = "people/?"

        let params = new URLSearchParams({
            //todo! ta bort !== "any"
            ...(charInput !== "any" ? { search: charInput } : {})
        })
    
        console.log(`${API_BASE_URL}${route}${params}`);

        let charObj = await getData(route, params)

        let { name, gender, height, mass, hair_color, skin_color, eye_color, films } = charObj.results[0];
        
        //todo! fixa dynamiskt namn?
        let charOneProto = new Character(name, gender, height, mass, hair_color, skin_color, eye_color, films, name)
        charArr.push(charOneProto)

        console.log(charOneProto);
        charOneProto.renderCharacter()
           
    } catch (error) {
        errorData = true
        console.log(error);
    }

}