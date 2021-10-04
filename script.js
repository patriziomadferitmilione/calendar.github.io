// Calendar

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = [
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

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filling data about month and year in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filling them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                // create a cell in the calendar table
                cell = document.createElement("td");
                // create number to display in cell
                cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                     // color today's date
                    cell.classList.add("bg-secondary");
                }
                // put the number in the cell
                cell.appendChild(cellText);
                // put the cell in the row
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

}


// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

// End of Calendar




// Events

// Event Class: Represents an Event

class Event {
    constructor(title, datePicker) {
        this.title = title;
        this.datePicker = datePicker;
    }
}

// UI Class: Handle UI tasks

class UI {
    static displayEvents() {
        const events = Store.getEvents();

        events.forEach((event) => UI.addEventToList(event));
    }

    static addEventToList(event) {
        const list = document.querySelector('#event-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="text-light">${event.title}</td>
            <td class="text-light">${event.datePicker}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteEvent(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    } 

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.events-container');
        const form = document.querySelector('#event-form');
        container.insertBefore(div, form);

        // Vanish in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#date-picker').value = '';
    }
}

// Store Class: Handles Storage

class Store {
    static getEvents() {
        let events;
        if(localStorage.getItem('events') === null) {
            events = [];
        } else {
            events = JSON.parse(localStorage.getItem('events'));
        }

        return events;
    }

    static addEvent(event) {
        const events = Store.getEvents();

        events.push(event);

        localStorage.setItem('events', JSON.stringify(events));
    }

    static removeEvent(title) {
        const events = Store.getEvents();

        events.forEach((event, index) => {
            if(event.title === title) {
                events.splice(index, 1);
            }
        });

        localStorage.setItem('events', JSON.stringify(events));
    }
}

// Event: Display Events

document.addEventListener('DOMContentLoaded', UI.displayEvents);

// Event: Add an event

document.querySelector('#event-form').addEventListener('submit', (e) => {
    //Prevent Actual submit
    e.preventDefault();

    //Get Form Values
    const title = document.querySelector('#title').value;
    const datePicker = document.querySelector('#date-picker').value;

    //Validate

    if(title === '' || datePicker === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        //Instantiate event
        const event = new Event(title, datePicker);

        //Add event to UI
        UI.addEventToList(event);

        //Add event to store
        Store.addEvent(event);

        //Show success message
        UI.showAlert('Event Added', 'success');

        //Clear fields
        UI.clearFields();
    }
})

// Event: Remove an event

document.querySelector('#event-list').addEventListener('click', (e) => {

    //Remove event from UI
    UI.deleteEvent(e.target);

    //Remove event from store
    Store.removeEvent(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Event Removed', 'success');
});

