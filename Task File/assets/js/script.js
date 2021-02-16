// Variable initialization
let commentsList = document.getElementsByClassName("posted-comments")[0]; // Selects the comment section at the end of each page
let commentsArr = []; // Creates the array for all comments
let likeMap = new Map(); // Creates the Map for all like buttons
let saveMap = new Map(); // Creates the Map for all save buttons
let contentMap = new Map(); // Creates the Map for all saved content
let savedContentSpace = document.getElementById("saved-content-space"); // Selects the saved content space on the user's save file

// On page load function
window.onload = function Load() {

    // Saved Content
    // Displays saved content on usersaved.html
    if ((localStorage.getItem("contentMap")) != null) {
        contentMap = new Map(JSON.parse(localStorage.contentMap)); // Populates the content map if there is saved content
    }

    // Function that sets the save buttons back to the "saved" animation on startup
    contentMap.forEach((value, key) => { // loop that iterates through all the save map key-value pairs

        // Condition that checks if the usersaved.html page is currently loaded - used to avoid erors
        if (savedContentSpace === null) {
            return;
        }

        savedContentSpace.innerHTML += contentMap.get(key); // Adds the saved content to the usersaved.html page on load
    })

    // Comments
    // Condition that checks if the saved comment array is empty (null).
    if ((localStorage.getItem("commentsArr")) != null) {
        commentsArr = JSON.parse(localStorage.getItem("commentsArr")); // Populates the comments array if there is saved content
    }

    // Function that populate the comment list with the saved array
    commentsArr.forEach(entry => { // loop that adds all the array entries to the list shown on the page

        // Condition that checks ignores populating the comment list if the page has no comment section
        if (commentsList == undefined) {
            return;
        }

        let newItem = document.createElement("li"); // Creates a new list item
        newItem.appendChild(document.createTextNode(entry)); // Adds the array entry's contents to the list item
        commentsList.appendChild(newItem); // Adds the li as another child under the comment list
    })

    // Like - buttons
    // Condition that checks if the like map is empty (null)
    if ((localStorage.getItem("likeMap")) != null) {
        likeMap = new Map(JSON.parse(localStorage.likeMap)); // Populates the like map if there is saved content
    }

    // Function that sets the like buttons back to the "liked" animation on startup
    likeMap.forEach((value, key) => { // loop that iterates through all the like map key-value pairs
        let element = document.querySelector(`#${value}`); // Selects the id of the current "liked" button

        // Condition that skips an entry if it isn't on the html page
        if (element === null) {
            return;
        }

        let icon = element.children[0]; // Selects the icon child of the button
        icon.classList.add("heart"); // Adds the "liked" animation to the icon
    })

    // Saved content - buttons
    // Condition that checks if the save map is empty (null)
    if ((localStorage.getItem("saveMap")) != null) {
        saveMap = new Map(JSON.parse(localStorage.saveMap)); // Populates the save map if there is saved content
    }

    // Function that sets the save buttons back to the "saved" animation on startup
    saveMap.forEach((value, key) => { // loop that iterates through all the save map key-value pairs
        let element = document.querySelector(`#${value}`); // Selects the id of the current "saved" button

        // Condition that skips an entry if it isn't on the html page
        if (element === null) {
            return;
        }

        let icon = element.children[0]; // Selects the icon child of the button
        icon.classList.remove("nc-bookmark-2"); // removes the static icon
        icon.classList.add("bookmark"); // Adds the animated icon
    })

    // Button Listeners
    // Like button interaction
    $('.like-btn').click(function () {
        let key = this.id.substr(9); // Cuts the numeric value of the specific id of the pressed key, to be used in the like map

        // Condition that checks if the like button icon has already been pressed
        if (!$(this).children('i').hasClass('heart')) {
            $(this).children('i').addClass('heart'); // Animates icon to indicate it is "liked"
            likeMap.set(key, this.id); // Adds the new liked element to the like map
        } else {
            $(this).children('i').removeClass('heart'); // Removes animation to indicate it is not "liked"
            likeMap.delete(key); // Deletes the unliked element from the like map
        }

        localStorage.likeMap = JSON.stringify(Array.from(likeMap)); // Saves updated like map to local storage
    });

    // Save content button interaction
    $('.save-btn').click(function () {
        let buttonKey = this.id.substr(9); // Cuts the numeric value of the specific id of the pressed key, to be used in the save map
        let elementKey = ($(this).closest('.section')[0]).getAttribute('id'); // Selects the id of the section parent of the selected button

        // Condition if the save button is in saved state
        if (!$(this).children('i').hasClass('nc-bookmark-2')) {
            $(this).children('i').removeClass('bookmark'); // Removes the animated icon
            $(this).children('i').addClass('nc-bookmark-2'); // Adds the static icon
            saveMap.delete(buttonKey); // Deletes the unliked button element from the like map
            contentMap.delete(elementKey); // Deletes the unliked dom element from the like map

            // Condition that fades the saved content out of view when they are "unsaved"
            if (savedContentSpace != null) {
                ($(this).closest('.section').fadeOut('slow'));
            }

        // Condition if the save button is not in a saved state
        } else {
            $(this).children('i').removeClass('nc-bookmark-2'); // Removes static icon
            $(this).children('i').addClass('bookmark'); // Adds the animated icon
            saveMap.set(buttonKey, this.id); // Adds the new saved element to the save map
            let savedElement = ($(this).closest('.section')[0].outerHTML); // Selects the dom element section of the selected button
            contentMap.set(elementKey, savedElement); // Adds the dom element and its key to the content map
            alert(`You have ${contentMap.size} saved item(s)`); // Alerts the user of the amount of saved items
        }

        localStorage.saveMap = JSON.stringify(Array.from(saveMap)); // Saves updated save map to local storage
        localStorage.contentMap = JSON.stringify(Array.from(contentMap.entries())); // Saves updated save map to local storage
    });
}


// Functions that execute/ are ready to execute, after the page has been loaded
$(document).ready(function () {

    $('.comment-section').hide(); // Hides the comment sections upon page load

    // Section that hides/ shows the comment section when the button is clicked
    $('.comment-btn').click(function () {
        if ($(this).closest('.main').children('.comment-section').is(':visible')) { // Checks if the comment section is shown
            $(this).closest('.main').children('.comment-section').hide('slow'); // Hides the comment section
        } else {
            $(this).closest('.main').children('.comment-section').show('slow'); // Shows the comment section
            $('html, body').animate({ // Scrolls down a bit to show the previously hidden comment section
                scrollTop: $(window).scrollTop() + 1000
            });
        }
    });

    // Section that adds a comment to the comments list if there is content in the textarea
    $('.comment-section > .post-btn').click(function () {
            if ($(this).closest('.comment-section').children('textarea').val()) { // Checks text area for content
                let newComment = document.createElement('li'); // Creates a new li element
                let input = $(this).closest('.comment-section').children('textarea').val(); // Selects the text area input

                newComment.append(input); // Adds the text area input under the new list item element
                commentsList.appendChild(newComment); // Adds the new list item element under the UL comment list
                $(this).closest('.comment-section').children('textarea').val(''); // Clears the text area after the comment is added

                commentsArr.push(newComment.innerHTML); // Adds the new comment to the comment array
                localStorage.setItem('commentsArr', JSON.stringify(commentsArr)); // Saves comment array to local storage
            }
        }
    );

    // Contact-us submit button listener
    $('#contact-form-submit').click(function () {
        let name = $('#contact-form-name').val(); // Selects the name form input
        let email = $('#contact-form-email').val(); // Selects the email form input
        let message = $('#contact-form-message').val(); // Selects the message form input
        let newsletterCheck = $('#exampleRadios1')[0].checked; // Checks the radio button form input
        let newsletterMessage = ""; // Sets the default newsletter message

        // Condition that checks if the fields are all filled in
        if ((name == "") || (email == "") || (message == "")) {
            alert(`Please fill in all fields`);
            return;
        }

        // Condition that checks if the user ticked the newsletter radio button and updates the message
        if (newsletterCheck) {
            newsletterMessage = "You can also look forward to our monthly newsletter there!"
        }

        // Alerts the user that the message has been recieved
        alert(`Thank you for your message ${name}, we will get back to you as soon as possible at: ${email}. \n ${newsletterMessage}`)

        // Clears the input fields after submission
        $('#contact-form-name').val('');
        $('#contact-form-email').val('');
        $('#contact-form-message').val('');
    })
});