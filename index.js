console.log("Star Wars Trivia");

let charContainer = document.querySelector("#compareCharacter")
let charForm = document.querySelector("#characterForm")
let compareBtn = document.querySelector("#compareBtn")
let h3 = document.createElement("h3");

let charArr = []
let errorData = false;

// -------------------------------------------------------- Set up: API -----------------------------------------------------------

let API_BASE_URL = "https://swa6pi.dev/api/"

let getData = async(route, params) => {
    try {
        let res = await fetch(`${API_BASE_URL}${route}${params}`)
        console.log(res);
        return  await res.json();
         
    } catch (error) {
        // console.log(error);
        compareBtn.classList.add("hidden")
        charContainer.innerHTML= ""
        h3.innerText = "Something went wrong.. Please try again later.";
        document.body.append(h3);
    }
   

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
                    <img class="svg" src="assets/images/${this.pictureUrl.toLowerCase().split(' ').join("-")}" alt="Portrait of ${this.name}"/>
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
                    <li class="list-group-item">${this.name} has appeared in ${(this.movies.length)} movies<span> ${this.compareCharacters(this.movies.length,charTwo.movies.length, charTwo, "length")} </span></li>
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
}

// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------

charForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let charOneInput = document.querySelector("#charOne").value
    let charTwoInput = document.querySelector("#charTwo").value
    charForm.classList.add("hidden")
    compareBtn.classList.remove("hidden")
    console.log(compareBtn);
    
    //todo! Brandon!!!! hur i helvääätööö funkar detta???
    console.log("outside but before",charArr);

    [charOneInput, charTwoInput].forEach(char => {
        // Creates a new instance of Character prototype for each user input and adds to global array of characters
        loadCharacters(char).then(() => {
            
            // Finds the last added character instance of the global charArr and renders it to the DOM - without mutating the original array
            [...charArr].pop().renderCharacter()
            
        })
    })

    //todo! Brandon!!!! hur i helvääätööö funkar detta???
    console.log("outside",charArr);

})

// -------------------------------------------------------- Initates the rendering of the list comparison between the characters -----------------------------------------------------------

let compareCharacter = () => {
    // Targets clicked button with display:none
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
            //todo! ta bort !== "any"
            ...(charInput != "" ? { search: charInput } : "")
        })
        console.log(`${API_BASE_URL}${route}${params}`);
        
        let charObj = await getData(route, params)

        //todo! bryt ut denna bit?
        // Destructuring the character object fetched from API
        let { name, gender, height, mass, hair_color, skin_color, eye_color, films } = charObj.results[0];
        //todo! fixa dynamiskt namn?
        // Creates new Character instance with thee data from the character obj fetched from the API
        let charOneProto = new Character(name, gender, height, mass, hair_color, skin_color, eye_color, films, name)
        charArr.push(charOneProto)
  
    
}
// -------------------------------------------------------- Error display -----------------------------------------------------------

//todo! error hantering - om anv. valt samma två karaktärer - 

