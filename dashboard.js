const apiKey="REMOVED";

let favorites=JSON.parse(localStorage.getItem("favorites"))||[];

let currentTempC=null;
let currentFeelsC=null;
let currentUnit="C";

async function getWeather(){

document.getElementById("message").innerHTML="";

let city=document.getElementById("city").value.trim();

if(city===""){
document.getElementById("message").style.color="red";
document.getElementById("message").innerHTML="⚠️ Please enter a city name";
return;
}

document.getElementById("loader").style.display="flex";

let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

try{

let response=await fetch(url);

let data=await response.json();

document.getElementById("loader").style.display="none";

if(data.cod!=200){

document.getElementById("message").style.color="red";
document.getElementById("message").innerHTML="❌ City Not Found";

return;

}

displayWeather(data);
displayDateTime(data);
getForecast(city);

}

catch(error){

document.getElementById("loader").style.display="none";

alert("Something went wrong!");

console.log(error);

}

}

function getLocation(){

async function showPosition(position){

let lat=position.coords.latitude;

let lon=position.coords.longitude;

let url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

try{

let response=await fetch(url);

document.getElementById("loader").style.display="flex";

let data=await response.json();

document.getElementById("loader").style.display="none";

displayWeather(data);

}

catch(error){

document.getElementById("loader").style.display="none";

document.getElementById("message").style.color="red";

document.getElementById("message").innerHTML="Unable to fetch weather.";

}

}

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(showPosition);

}

else{

alert("Geolocation is not supported.");

}

}

function displayWeather(data){

document.getElementById("message").innerHTML="";

let weather=data.weather[0].main;

if(weather==="Clouds"){

document.body.style.backgroundImage="url('https://images.unsplash.com/photo-1534088568595-a066f410bcda')";

}

else if(weather==="Rain"){

document.body.style.backgroundImage="url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0')";

}

else if(weather==="Clear"){

document.body.style.backgroundImage="url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b')";

}

else if(weather==="Snow"){

document.body.style.backgroundImage="url('https://images.unsplash.com/photo-1483664852095-d6cc6870702d')";

}

else{

document.body.style.backgroundImage="url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')";

}

currentTempC=data.main.temp;
currentFeelsC=data.main.feels_like;
currentUnit="C";

document.getElementById("temp").innerHTML=currentTempC.toFixed(1)+" °C";
document.getElementById("feels").innerHTML=currentFeelsC.toFixed(1)+" °C";

document.getElementById("condition").innerHTML=data.weather[0].main;

document.getElementById("humidity").innerHTML=data.main.humidity+" %";

document.getElementById("wind").innerHTML=data.wind.speed+" m/s";
let windDirection=getWindDirection(data.wind.deg);
document.getElementById("windDirection").innerHTML="🧭 "+windDirection;

document.getElementById("feels").innerHTML=data.main.feels_like+" °C";

document.getElementById("pressure").innerHTML=data.main.pressure+" hPa";

document.getElementById("visibility").innerHTML=data.visibility/1000+" km";

let regionNames=new Intl.DisplayNames(["en"],{type:"region"});

document.getElementById("country").innerHTML=regionNames.of(data.sys.country);

document.getElementById("icon").src="https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";

let sunrise=new Date(data.sys.sunrise*1000);

document.getElementById("sunrise").innerHTML=
sunrise.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

}

function setCelsius(){

if(currentTempC===null)return;

currentUnit="C";

document.getElementById("temp").innerHTML=currentTempC.toFixed(1)+" °C";
document.getElementById("feels").innerHTML=currentFeelsC.toFixed(1)+" °C";

updateForecastUnits();

}

function setFahrenheit(){

if(currentTempC===null)return;

currentUnit="F";

let tempF=(currentTempC*9/5)+32;
let feelsF=(currentFeelsC*9/5)+32;

document.getElementById("temp").innerHTML=tempF.toFixed(1)+" °F";
document.getElementById("feels").innerHTML=feelsF.toFixed(1)+" °F";

updateForecastUnits();

}

async function getForecast(city){

let url=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

try{

let response=await fetch(url);

let data=await response.json();

if(data.cod!="200"){

document.getElementById("forecast").innerHTML="Unable to load forecast.";

return;

}

displayForecast(data);

}

catch(error){

console.log(error);

document.getElementById("forecast").innerHTML="Unable to load forecast.";

}

}

function displayForecast(data){

let forecastDiv=document.getElementById("forecast");

forecastDiv.innerHTML="";

let days={};

data.list.forEach(item=>{

let date=item.dt_txt.split(" ")[0];

if(!days[date]){

days[date]=[];

}

days[date].push(item);

});

let forecastDays=Object.keys(days).slice(0,5);

forecastDays.forEach(date=>{

let items=days[date];

let firstItem=items[0];

let temperatures=items.map(item=>item.main.temp);

let high=Math.max(...temperatures);

let low=Math.min(...temperatures);

let weather=firstItem.weather[0];

let day=new Date(firstItem.dt*1000).toLocaleDateString("en-US",{weekday:"long"});

forecastDiv.innerHTML+=`

<div class="forecast-card" data-high="${high}" data-low="${low}">

<h3>${day}</h3>

<img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png">

<p>${weather.main}</p>

<p class="high">🔥 High: ${high.toFixed(1)} °C</p>

<p class="low">❄️ Low: ${low.toFixed(1)} °C</p>

<p>💧 ${firstItem.main.humidity}%</p>

<p>💨 ${firstItem.wind.speed} m/s</p>

</div>

`;

});

}

function updateForecastUnits(){

let forecastCards=document.querySelectorAll(".forecast-card");

forecastCards.forEach(card=>{

let highC=parseFloat(card.dataset.high);
let lowC=parseFloat(card.dataset.low);

if(currentUnit==="F"){

card.querySelector(".high").innerHTML="🔥 High: "+((highC*9/5)+32).toFixed(1)+" °F";
card.querySelector(".low").innerHTML="❄️ Low: "+((lowC*9/5)+32).toFixed(1)+" °F";

}else{

card.querySelector(".high").innerHTML="🔥 High: "+highC.toFixed(1)+" °C";
card.querySelector(".low").innerHTML="❄️ Low: "+lowC.toFixed(1)+" °C";

}

});

}

function displayDateTime(data){

let timezone=data.timezone;

let utcTime=Date.now()+new Date().getTimezoneOffset()*60000;

let cityTime=new Date(utcTime+timezone*1000);

let date=cityTime.toLocaleDateString("en-US",{
weekday:"long",
month:"long",
day:"numeric",
year:"numeric"
});

let time=cityTime.toLocaleTimeString("en-US",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:true
});

document.getElementById("datetime").innerHTML=
"📅 "+date+"<br>🕒 "+time;

}

function getWindDirection(degrees){

let directions=["N","NE","E","SE","S","SW","W","NW"];

let index=Math.round(degrees/45)%8;

return directions[index];

}

function displayFavorites(){

let favoritesDiv=document.getElementById("favorites");

favoritesDiv.innerHTML="";

favorites.forEach((city,index)=>{

favoritesDiv.innerHTML+=`

<div class="favorite-item">

<button class="favorite-city" onclick="getWeatherFromFavorite('${city}')">
⭐ ${city}
</button>

<button class="remove-favorite" onclick="removeFavorite(${index})">
❌
</button>

</div>

`;

});

}

function removeFavorite(index){

favorites.splice(index,1);

localStorage.setItem("favorites",JSON.stringify(favorites));

displayFavorites();

}

function addFavorite(){

let city=document.getElementById("city").value.trim();

if(city===""){
return;
}

if(!favorites.includes(city)){

favorites.push(city);

localStorage.setItem("favorites",JSON.stringify(favorites));

displayFavorites();

}

}

function getWeatherFromFavorite(city){

document.getElementById("city").value=city;

getWeather();

}

displayFavorites();

function toggleTheme(){

document.body.classList.toggle("dark-mode");

let button=document.getElementById("themeButton");

if(document.body.classList.contains("dark-mode")){

button.innerHTML="☀️ Light Mode";

}else{

button.innerHTML="🌙 Dark Mode";

}

}