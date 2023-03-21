# star-wars-trivia 

An object-oriented project that allows users to compare Star Wars characters and their respective characteristics using the free [SWAPI-API](https://swapi.dev/).

The application also features a loading animation when the characters are first fetched (using Promise.all) and rendered to the DOM, and a different one(Loading...) for when a user clicks one of the action buttons.

>[View application](https://stormstina.github.io/star-wars-trivia/)

## Summary

* Constructor function takes 12 parameters for name, gender, height, mass, hair color, skin color, eye color, movies, home planet, vehicles, starships, and picture URL

* renderCharacter() method generates HTML markup for character profile and inserts it into DOM, includes name, picture, gender, height, mass, hair color, skin color, and number of movies character has appeared in, and adds buttons for comparing vehicles and movie debuts

* renderComparison() method generates comparison between character and another object, including hair color, gender, skin color, height, mass, and number of movies, and adds buttons for comparing co-stars and home planets

* compareCharacters() method is a helper function that compares two values and returns true or false, with an optional fourth argument for generating a string for height, mass, or number of movies comparisons
