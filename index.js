console.log("Star Wars Trivia");

let API_BASE_URL = "https://swapi.dev/api/people/"

let getData = async() => {

    let res = await fetch(`${API_BASE_URL}`)

    return await res.json();

}



getData().then((data) => {
    console.log(data);

    // data.results.forEach(obj => {
        
    //     document.body.innerHTML += `Name: ${obj.name} <br>`
    // });
  
})

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

// -------------------------------------------------------- Form Event Listener -----------------------------------------------------------

document.querySelector("#characterForm").addEventListener("submit", (e) => {
    e.preventDefault()


    console.log("submit", e.target)
})

