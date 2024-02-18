let openingTime = "09:30"
let closingTime = "19:30"
let openHour = parseInt(openingTime.split(":")[0])
let openMinute = parseInt(openingTime.split(":")[1])
let closingHour = parseInt(closingTime.split(":")[0])
let closingMinute = parseInt(closingTime.split(":")[1])


let barberHours = new Map();

barberHours.set("John Doe", [1, 5])
barberHours.set("Jane Smith", [2])
barberHours.set("Mike Johnson", [3,4])


$("#cardNumber").keyup(function() {

    let cardNum = $("#cardNumber").val()
    let formated = ""

    if (cardNum.length === 4 && cardNum[3] !== '-') {
        cardNum = cardNum + "-"
    }

    if (cardNum.length === 9 && cardNum[8] !== '-') {
        cardNum = cardNum + "-"
    }

    if (cardNum.length === 14 && cardNum[13] !== '-') {
        cardNum = cardNum + "-"
    }

    $("#cardNumber").val(cardNum)

});

$("#expiry").keyup(function () {
    let expiry = $("#expiry").val()
    let formated = expiry.replace("/", "")


    if (expiry.length <= 2) {
        formated = expiry

        if (parseInt(expiry) > 12) {
            alert("Month must be <= 12")
        }

    } else {
        formated = formated.slice(0,2) + "/" + formated.slice(2,4)
    }

    $("#expiry").val(formated)
})

$("#cvv").keyup(function (){

})

$("#payBtn").click(function () {
    $("#paymentForm").attr("class", "was-validated")
})


$(document).ready(function () {
    $('.datepicker').datepicker({
        formatDate: "yyyy-mm-dd",
        minDate: new Date(),
        beforeShowDay: function (date) {
            let response = []
            let closedDays =  barberHours.get($("#barber").val())

            //closed weekend
            if (date.getDay() === 0 || date.getDay() === 6) {
                response[0] = false
                response[1] = ""
                response[2] = "closed on weekends"
            } else {
                response[0] = true
                response[1] = ""
                response[2] = "valid date!"
            }

            for (let i = 0; i < closedDays.length; i++) {
                if (date.getDay() === closedDays[i]) {
                    response[0] = false
                    response[1] = ""
                    response[2] = "Your selected barber is closed today!"
                }
            }
            return response
        }
    });
})


document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('.btn-primary[data-target="#bookingModal"]').forEach(function (button) {
        button.addEventListener('click', function () {
            document.querySelector('#serviceName').value = this.getAttribute('data-service');
            document.querySelector('#barber').value = this.getAttribute('data-barber');
            var isHaircutStyle = this.getAttribute('data-service').includes('Haircut');
            $('#serviceName').prop('readonly', isHaircutStyle);
        });
    });

    document.querySelector('#bookingModal .btn-primary').addEventListener('click', function () {
        if (validateBookingForm()) {
            submitBookingForm();
        }
    });

    function validateBookingForm() {
        let barberName = document.querySelector('#barber').value;
        let serviceName = document.querySelector('#serviceName').value;

        document.getElementById("bookingForm").setAttribute("class", "was-validated")

        // call all validations so they update ui
        validateName()
        validateDate()
        validateTime()
        validateEmail()

        if (barberName !== "" && serviceName !== "" && validateDate() && validateTime() && validateName() && validateEmail()) {
            alert("Successfully booked!")
            return true;
        } else {
            return false;
        }
    }

    function submitBookingForm() {
        let formData = {
            barberName: document.querySelector('#barber').value,
            serviceName: document.querySelector('#serviceName').value,
            date: document.querySelector('#bookingDate').value,
            time: document.querySelector('#bookingTime').value,
            name: document.querySelector('#userName').value,
            email: document.querySelector('#userEmail').value,
        };

        console.log('Form submitted:', formData);

        $('#bookingModal').modal('hide');
    }

    $('[data-target="#bookingModal"]').on('click', function () {
        var serviceName = $(this).data('service');
        $('#serviceName').val(serviceName);

        var barberName = $(this).data('barber');
        $('#barber').val(barberName);

        var isHaircutStyle = serviceName.includes('Haircut');
        $('#serviceName').prop('readonly', isHaircutStyle);

        var isBarberName = barberName.includes('Barber');
        $('#barber').prop('readonly', isBarberName);

        var isStaffSection = $(this).closest('#staff').length > 0;

        if (isStaffSection) {
            $('#serviceDropdownGroup').show();
            $('#serviceNameInputGroup').hide();
        } else {
            $('#serviceDropdownGroup').hide();
            $('#serviceNameInputGroup').show();
        }
    });
});


function validDate() {
    let currentDate = new Date()

    let currentMonth = currentDate.getMonth() + 1
    let currentDay = currentDate.getDate()


    if (currentMonth < 10) {
        currentMonth = `0${currentMonth}` // need to append a 0 to match date format if only 1 digit
    }

    if (currentDay < 10) {
        currentDay = `0${currentDay}` // need to append a 0 to match date format if only 1 digit
    }

    let earliestDate = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`
    let latestDate = `${currentDate.getFullYear() + 1}-${currentMonth}-${currentDay}` // can book upto 1 year ahead of time

    document.getElementById("bookingDate").setAttribute("min", earliestDate)
    document.getElementById("bookingDate").setAttribute("max", latestDate)

}

function validateDate() {
    let bookedDate = new Date(document.getElementById("bookingDate").value + "EST") // must be EST or else date is off by a day
    console.log(bookedDate)
    let currentDate = new Date()
    let message
    let isValid = false

    let feedback = document.createElement("div")

    feedback.setAttribute("class", "invalid-feedback")

    if (bookedDate == "Invalid Date") { // date will be an "Invalid Date" if date passed into date constructer is null/invalid. Also if date is invalid (ex april 31 2024)
        message = "Please enter a valid date"
    } else if (bookedDate < currentDate) {
        message = "Cannot book for past date. Please book a date in the future"
    } else if (bookedDate > currentDate.setFullYear(currentDate.getFullYear() + 1)) {
        message = "Please select a date within a year of today!"
    } else {
        feedback.setAttribute("class", "valid-feedback")
        message = "Looks good!"
        isValid = true
    }

    feedback.innerHTML = message

    if (document.getElementById("bookingDate").nextElementSibling == null) {
        document.getElementById("bookingDate").insertAdjacentElement('afterend', feedback)
    } else {
        document.getElementById("bookingDate").nextElementSibling.replaceWith(feedback)
    }
    return isValid
}


function validTime() {
    let currentDate = new Date()

    let currentHour = currentDate.getHours()
    let currentMinute = currentDate.getMinutes()

    let scheduledDate = document.getElementById("bookingDate").value
    console.log(scheduledDate)

    document.getElementById("bookingTime").setAttribute("min", openingTime)
    document.getElementById("bookingTime").setAttribute("max", closingTime)
}

function validateTime() {
    let bookedDate = new Date(document.getElementById("bookingDate").value + "EST")
    let feedback = document.createElement("div")

    let time = document.getElementById("bookingTime").value
    let splitTime = time.split(":")
    let message = "Looks good!"
    let isValid = true

    let bookedHour = parseInt(splitTime[0])
    let bookedMinute = parseInt(splitTime[1])

    bookedDate.setHours(parseInt(splitTime[0]))
    bookedDate.setMinutes(parseInt(splitTime[1]))


    feedback.setAttribute("class", "valid-feedback")

    if (document.getElementById("bookingTime").value === "") {
        message = "Please enter a time"
        feedback.setAttribute("class", "invalid-feedback")
    } else if (bookedHour > openHour && bookedHour < closingHour) {
        message = "Looks good!"
    } else if (bookedHour === openHour && bookedMinute >= openMinute) { // if opening hour compare minutes also!
        message = "Looks good!"
    } else if (bookedHour === closingHour && bookedMinute <= closingMinute) { // if closing hour compare minutes also!
        message = "Looks good!"
    } else {
        message = `Sorry we are closed at that hour :( \nOur hours are from ${openingTime} until ${closingTime}`
        feedback.setAttribute("class", "invalid-feedback")
        isValid = false
    }

    feedback.innerHTML = message

    if (document.getElementById("bookingTime").nextElementSibling == null) {
        document.getElementById("bookingTime").insertAdjacentElement('afterend', feedback)
    } else {
        document.getElementById("bookingTime").nextElementSibling.replaceWith(feedback)
    }

    return isValid
}

function validateName() {

    //just check that only alphabetic characters
    let alphabetic = new RegExp("^[a-z A-Z]+$") // this regex makes sure only allowed characters are alphabetic and spaces. Also ensures at least 1 character long
    let name = document.getElementById("userName").value.trim()
    let message

    let feedback = document.createElement("div")
    feedback.setAttribute("class", "invalid-feedback")


    if (name.length === 0) {
        message = "Please enter a name"
    } else if (!alphabetic.test(name)) {
        message = "You can only enter alphabetic characters."
    } else {
        message = "Looks good!"
        feedback.setAttribute("class", "valid-feedback")
    }

    feedback.innerHTML = message

    console.log("h")
    if (document.getElementById("userName").nextElementSibling == null) {
        document.getElementById("userName").insertAdjacentElement('afterend', feedback)
    } else {
        document.getElementById("userName").nextElementSibling.replaceWith(feedback)
    }

    return alphabetic.test(name)
}

function validateEmail() {

    let emailPattern = new RegExp("^([\\w\\.])*(\\w@)(\\w)*((.com)|(.ca)|(.co)|(.net)|(.org)|(.gov)|(.edu))$")
    let email = document.getElementById("userEmail").value.slice().toLowerCase()
    let message

    let feedback = document.createElement("div")
    feedback.setAttribute("class", "invalid-feedback")

    if (email === "") {
        message = "Please enter an email"
    } else if (!emailPattern.test(email)) {
        message = "Please enter an valid email format. Ex mail@email.com"
    } else {
        message = "Looks good!"
        feedback.setAttribute("class", "valid-feedback")
    }

    feedback.innerHTML = message

    if (document.getElementById("userEmail").nextElementSibling == null) {
        document.getElementById("userEmail").insertAdjacentElement('afterend', feedback)
    } else {
        document.getElementById("userEmail").nextElementSibling.replaceWith(feedback)
    }

    return emailPattern.test(email)
}