document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const specialty = document.getElementById('specialty')?.value.trim();
    const address = document.getElementById('address')?.value.trim();

    if (!role) {
        alert("Please select a role.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const userData = { fullname, username, email, phone, password, role };

    if (role === 'doctor') {
        if (!specialty || !address) {
            alert("Please fill in specialty and address for doctor registration.");
            return;
        }
        userData.specialty = specialty;
        userData.address = address;
    }

    console.log("📤 Sending user data to backend:", userData);

    try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Server error:", data);
            alert(data.error || 'Signup failed.');
            return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        alert('✅ Registration successful! Redirecting...');
        window.location.href = data.user.role === "doctor" ? "/doctor-profile.html" : "/account.html";

    } catch (error) {
        console.error('❌ Network error:', error);
        alert("Network error. Please check your connection or ensure the server is running.");
    }
});
