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