import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector(['#search-box']),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let name = e.target.value.trim();
  if (!name) {
    clearCountriesSearchResult();
    return;
  }
  fetchCountries(name)
    .then(checkSearchResult)
    .catch(() => {
      clearCountriesSearchResult();
      onError();
    });
}

function checkSearchResult(countries) {
  if (countries.length > 10) {
    return manySearchResults(countries);
  } else if (countries.length >= 2) {
    return markupOfCountriesList(countries);
  } else {
    return markupOfCountryInfo(countries);
  }
}

function clearCountriesSearchResult() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function markupOfCountriesList(countries) {
  clearCountriesSearchResult();
  const markup = countries
    .map(
      country => `<li class="country-item">
           <img src="${country.flags.svg}" />
           <p>${country.name.official}</p>
         </li>`
    )
    .join('');

  refs.countryList.innerHTML = markup;
}

function markupOfCountryInfo(countries) {
  clearCountriesSearchResult();
  const languages = Object.values(countries[0].languages).join(', ');
  const markup = countries.map(
    country => `<h2><img src="${country.flags.svg}" />${country.name.official}</h2>
         <p><b>Capital: </b>${country.capital}</p>
         <p><b>Population: </b>${country.population}</p>
         <p><b>Laungages: </b>${languages}</p>`
  );

  refs.countryInfo.innerHTML = markup;
}

function manySearchResults(countries) {
  clearCountriesSearchResult();
  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function onError() {
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}
