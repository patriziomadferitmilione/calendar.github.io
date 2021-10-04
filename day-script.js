today = new Date();

currentDay = today.getDate();

currentMonth = today.getMonth();

monthNames = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"];

monthName = monthNames[currentMonth];

document.getElementById("title-day").innerHTML = currentDay;
document.getElementById("title-month").innerHTML = monthName;

