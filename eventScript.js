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
        UI.showAlert('Missing info', 'danger');
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

