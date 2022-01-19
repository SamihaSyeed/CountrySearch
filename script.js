const searchDiv = document.querySelector(".search-div")
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const divContainer = document.querySelector(".container");

const countries = [];
fetch(`https://restcountries.com/v2/all`)
  .then(response => response.json())
  .then(data => { data.forEach(country => { countries.push(country.name)}) })

//fetch data and display when search button clicked
searchBtn.addEventListener("click", () => {
  divContainer.textContent = ""
  searchDiv.style = "margin:5 auto"
  fetch(`https://restcountries.com/v2/name/${searchBar.value}?fullText=true`)
    .then(response => response.json())
    .then(result => displayCountry(result))
})
//search on tapping enter key
searchBar.addEventListener("keypress", (e) => {
  if(e.keyCode === 13){
    searchBtn.click()
  }
})

//autocomplete search bar function
function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      divContainer.style.display="none"
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        searchBtn.click()
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
   searchBar.classList.remove("search-bar-extra")
   searchBtn.classList.remove("search-btn-extra")
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
autocomplete(document.getElementById("myInput"), countries);

//display searched country details
function displayCountry(country){
  country.forEach((country) => {
    const displayCard = document.createElement("div");
    displayCard.className = "display-card"
    let languagesArr = [];
    country.languages.forEach((item) => {
      languagesArr.push(item.name)
    });
    displayCard.innerHTML =  `
        <div class="map-div">
          <div class="gmap_canvas">
            <iframe width="500" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=${country.name}&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
          </div>
        </div>
        <div >
          <div class = "header">
            <div id = "name">${country.name.toUpperCase()}</div>
            <img src = "${country.flag}" alt = "country flag" id="flag-img">
          </div>
          <div class = "country-info">
          <div id = "capital"  class="div-label">
            <span class="label">Capital</span>
            <span class="info"> ${country.hasOwnProperty("capital")? country.capital : "none"}</span></div>
          <div id = "languages:" class="div-label">
            <span class="label"> Languages </span>
            <span class="info"> ${[...languagesArr]} </span>
          </div>
          </div>
        `
  if(country.hasOwnProperty("currencies")){
    displayCard.innerHTML +=   `
    <div id = "currencies" class ="currency-info" >
    <div class="div-label">
      <span class="label">  Currency </span>
      <span class="info"> ${country.currencies[0].name} </span>
    </div>
      <div id = "curr-code" class="div-label">
        <span class="label"> Code </span>
        <span class="info"> ${country.currencies[0].code} </span>
     </div>
     <div id = "curr-sym" class="div-label">
      <span class="label"> Symbol</span>
      <span class="info"> ${country.currencies[0].symbol}</span>

    </div>
    </div>
    `
  }else{
    displayCard.innerHTML += `
    <div id = "currencies" class="currency-info div-label">
    <span class="label"> Currency </span>
    <span class="info">none</span>
      `
        }
    divContainer.appendChild(displayCard);
    divContainer.style.display = "block"
  });
}
