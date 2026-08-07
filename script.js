function updateTime(){

let now=new Date();

let options={
weekday:"long",
year:"numeric",
month:"long",
day:"numeric"
};

let date=now.toLocaleDateString("en-US",options);

let time=now.toLocaleTimeString();

document.getElementById("datetime").innerHTML=date+"<br>"+time;

}

setInterval(updateTime,1000);

updateTime();

document.getElementById("startBtn").addEventListener("click",function(){

window.location.href="dashboard.html";

});