document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch("https://doclink-production.up.railway.app/login.html", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Login successful!");
            console.log("✅ Server Response:", result);

            // ✅ Save user + token in localStorage
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", result.token);

            const user = result.user;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", result.token);
            
            if (user.role === 'doctor') {
              window.location.href = "/doctor-profile.html";
            } else {
              window.location.href = "/account.html";
            }
            if (user.role === 'admin') {
                window.location.href = '/admin-dashboard.html';
              } else {
                window.location.href = '/account.html';  // for patients and doctors
              }              
              
        } else {
            alert("❌ Error: " + result.error);
            console.error("Server Error:", result);
        }
    } catch (err) {
        console.error("❌ Request Failed:", err);
        alert("Something went wrong.");
    }
});
