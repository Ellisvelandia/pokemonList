AOS.init();

const getPokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}`;

let currentPage = 1;

const generatePokemonPromises = (page) => {
  const offset = (page - 1) * 20;
  const limit = 20;
  return Array(limit)
    .fill()
    .map((_, index) =>
      fetch(getPokemonUrl(offset + index + 1)).then((response) => response.json())
    );
}

const generateHTML = (pokemons) =>
  pokemons.reduce((accumulator, { name, id, types }) => {
    const elementTypes = types.map((typeInfo) => typeInfo.type.name);
    const imageUrl = `https://play.pokemonshowdown.com/sprites/xyani/${name}.gif`;

    accumulator += `<li class="card ${elementTypes[0]}" data-aos="flip-left"
    data-aos-easing="ease-out-cubic"
    data-aos-duration="1000">
      <img src="${imageUrl}" alt="${name}" class="card-image" />
      <h2 class="card-title">${id}. ${name}</h2>
      <p class="card-subtitle">${elementTypes.join(" | ")}</p>
      </li>`;

    return accumulator;
  }, "");

const insertPokemonIntoPage = (pokemons, page) => {
  currentPage = page;
  const ul = document.querySelector('[data-js="pokedex"]');
  ul.innerHTML = pokemons;
};

const nextButton = document.querySelector('[data-js="next-button"]');
nextButton.addEventListener("click", () => {
  const pokemonPromises = generatePokemonPromises(currentPage + 1);
  Promise.all(pokemonPromises)
    .then(generateHTML)
    .then((pokemons) => insertPokemonIntoPage(pokemons, currentPage + 1));
});

const previousButton = document.querySelector('[data-js="previous-button"]');
previousButton.addEventListener("click", () => {
  const pokemonPromises = generatePokemonPromises(currentPage - 1);
  Promise.all(pokemonPromises)
    .then(generateHTML)
    .then((pokemons) => insertPokemonIntoPage(pokemons, currentPage - 1));
});

const pokemonPromises = generatePokemonPromises(1);
Promise.all(pokemonPromises)
  .then(generateHTML)
  .then((pokemons) => insertPokemonIntoPage(pokemons, 1));
