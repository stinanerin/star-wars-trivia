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
            <article class="col-sm pb-5" data-character="${this.name.toLowerCase().split(' ').join("-")}">
                <div class="text-center">
                    <h3>${(this.name).toLowerCase()}</h3>
                    <img class="svg" src="/images/${this.pictureUrl.toLowerCase().split(' ').join("-")}" alt="Portrait of ${this.name}"/>
                </div>
            </article>
        `
    }
    renderProperties(container) {
        let charTwo = charArr.find(obj => obj != this)
        container.innerHTML += `
            <article class="col mt-4">
                <ul class="list-group"> 
                    <li class="list-group-item ">${this.name}'s hair is ${(this.hairColor)}<span class="${this.compareCharacters(this.hairColor,charTwo.hairColor)}"> just like ${charTwo.name}'s hair.</span></li>
                    <li class="list-group-item ">${this.name} is ${(this.gender)}<span class="${this.compareCharacters(this.gender,charTwo.gender)}"> just like ${charTwo.name}</span></li>
                    <li class="list-group-item ">${this.name} is ${(this.height)} cm tall<span> ${this.compareCharacters(this.height,charTwo.height, charTwo, "height")}</span></li>
                    <li class="list-group-item ">${this.name} weighs ${this.mass} kg<span> ${this.compareCharacters(this.mass,charTwo.mass, charTwo, "mass")} </span></li>
                    <li class="list-group-item ">${this.name}´s skin is ${(this.skinColor)}<span class="${this.compareCharacters(this.skinColor,charTwo.skinColor)}"> , the same as ${charTwo.name}'s skin.</span></li>
                    <li class="list-group-item">${this.name} has been in ${(this.movies.length)} movies<span> ${this.compareCharacters(this.movies.length,charTwo.movies.length, charTwo, "length")} </span></li>
                </ul>
            </article>
        `
    }
    compareCharacters(valueOne, valueTwo, charTwo, str){
        if(typeof valueOne === "string") {
            console.log("we are here");
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
                    string = `, and has therefore been in ${this.movies.length - charTwo.movies.length} more movies than ${charTwo.name}`
                } else if (str === "mass") {
                    string = `, which is ${this.mass - charTwo.mass} kg more than ${charTwo.name}, who weighs in on ${charTwo.mass} kg`
                }else if (str === "height") {
                    string = `, and therefore taller than ${charTwo.name}, who is only ${charTwo.height} cm`
                }
                return string;
            } else if (valueOne < valueTwo) {
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
}

// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------

charForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let charOneInput = document.querySelector("#charOne").value
    let charTwoInput = document.querySelector("#charTwo").value
    charForm.classList.add("hidden")
    compareBtn.classList.remove("hidden")

    //todo! Brandon!!!! hur i helvääätööö funkar detta???
    console.log("outside but before",charArr);

    //todo! Lös problemas med om anv, gett noll input. - gör bägge required?
    [charOneInput, charTwoInput].forEach(char => {
        // Creates a new instance of Character prototype for each user input and adds to global array of characters
        loadCharacters(char).then(() => {
            // Finds the last added character instance of the global charArr and renders it to the DOM - without mutating the original array
            [...charArr].pop().renderCharacter()
            console.log("errorData", errorData);
            if(errorData) {
                charContainer.innerHTML= ""
                compareBtn.classList.add("hidden")
                let h3 = document.createElement("h3");
                h3.innerText = "Sorry, we had problems getting the data.. Try again later.";
                document.body.append(h3);
            }
        })
    })
    //todo! Brandon!!!! hur i helvääätööö funkar detta???
    console.log("outside",charArr);
})

// -------------------------------------------------------- Compare Character -----------------------------------------------------------

let compareCharacter = () => {
    console.log("clicked");
    console.log(charArr);
    event.target.classList.add("hidden")

    charArr.forEach(obj => {
        console.log("hejsan");

        let article = document.querySelector(`[data-character="${obj.name.toLowerCase().split(' ').join("-")}"]`)

        obj.renderProperties(article)

    })
}
// -------------------------------------------------------- Creates new instance of character prototype-----------------------------------------------------------


let loadCharacters = async (charInput) => {
    //todo! error hantering - om karaktären ej finns
    //todo! dubbelkolla båda om första och andra ej existerar
    //todo! error hantering - om anv. ej valt två karaktärer - 
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
  
    } catch (error) {
        errorData = true
        console.log(error);        
    }
}