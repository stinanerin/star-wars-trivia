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
        this.height = +height;
        this.mass = +mass;
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
        let charTwo = charArr.find(obj => obj != this)
        container.innerHTML += `
            <article class="col">
                <ul class="list-group"> 
                    <li class="list-group-item ">${this.name}'s hair is ${(this.hairColor)}<span class="${this.compareCharacters(this.hairColor,charTwo.hairColor)}"> just like ${charTwo.name}'s hair.</span></li>
                    <li class="list-group-item ">${this.name} is ${(this.gender)}<span class="${this.compareCharacters(this.gender,charTwo.gender)}"> just like ${charTwo.name}</span></li>
                    <li class="list-group-item ${this.compareCharacters(this.height,charTwo.height)}"><span>Heigth: </span>${(this.height)}</li>
                    <li class="list-group-item ${this.compareCharacters(this.mass,charTwo.mass)}"><span>Mass: </span>${(this.mass)}</li>
                    <li class="list-group-item ">${this.name}´s skin is ${(this.skinColor)}<span class="${this.compareCharacters(this.skinColor,charTwo.skinColor)}"> , the same as ${charTwo.name}'s skin.</span></li>
                    <li class="list-group-item ${this.compareCharacters(this.movies.length,charTwo.movies.length)}"><span>Movies: </span>${(this.movies.length)}</li>
                </ul>
            </article>
        `
    }
    compareCharacters(valueOne, valueTwo){
        console.log(typeof valueOne, typeof valueTwo);
        if(typeof valueOne === "string") {
            console.log("we are here");
            if (valueOne === valueTwo) {
                console.log(`${valueOne} is the same as ${valueTwo}`) 
                return 
            }
            else {
                console.log(`${valueOne} is not the same as ${valueTwo}`)
                return "hidden" 
            }
        } else {
            console.log("charTwo", charTwo.name);
            console.log("this", this.name);
            if (valueOne > valueTwo){
                console.log(`${valueOne} is bigger than ${valueTwo}`); 
                return "text-success"
            }
            else if (valueOne < valueTwo) {
                console.log(`${valueOne} is smaller than ${valueTwo}`)
                return "text-danger"  
                 
            } else {
                console.log(`${valueOne} is the same as ${valueTwo}`) 
                return "text-warning "     
            }

        }
    }
    
}

// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------

charForm.addEventListener("submit", (e) => {

    e.preventDefault()
    let charOneInput = document.querySelector("#charOne").value
    let charTwoInput = document.querySelector("#charTwo").value
    charForm.classList.add("hidden")

    //todo! Undersök varför loop ej funkar - se graveyard 
    //todo! ta bort dennna .then()
    loadCharacters(charOneInput).then(() => {

        loadCharacters(charTwoInput).then(() => {
            compareBtn.classList.remove("hidden")
            if(errorData) {
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

        //todo! bryt ut denna bit?
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