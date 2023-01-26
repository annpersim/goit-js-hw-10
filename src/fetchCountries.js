export { fetchCountries };

async function fetchCountries(name) {
  const fields = 'name,capital,population,flags,languages';
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=${fields}`
  );

  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
}
