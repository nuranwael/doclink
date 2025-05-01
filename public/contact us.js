document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let email = document.getElementById("email").value.trim();
    let comments = document.getElementById("comments").value.trim();

    if (name === "" || mobile === "" || email === "" || comments === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (!/^\d{10,12}$/.test(mobile)) {
        alert("Please enter a valid mobile number.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    alert("Your message has been sent successfully!");
    document.getElementById("contactForm").reset();
});
