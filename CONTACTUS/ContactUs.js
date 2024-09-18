document.getElementById('submitBtn').addEventListener('click', function() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;

    if (name === "" || email === "" || message === "") {
        alert("Please fill out all fields.");
    } else if (!validateEmail(email)) {
        alert("Please enter a valid email.");
    } else {
        alert("Thank you for contacting us!");
    }
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}
