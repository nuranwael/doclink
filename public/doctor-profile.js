const doctor = JSON.parse(localStorage.getItem("user"));
const doctorName = document.getElementById("doctorName");
const specialty = document.getElementById("specialty");

if (doctor?.fullname && doctor?.role === "doctor") {
  doctorName.textContent = doctor.fullname;
  specialty.textContent = doctor.specialty || "Specialist";
} else {
  alert("Not authorized.");
  window.location.href = "/login.html";
}
const loggedInUser = JSON.parse(localStorage.getItem("user"));
if (loggedInUser) {
  document.getElementById("username").textContent = loggedInUser.username;
  // If you store image URL later: document.getElementById("userPic").src = loggedInUser.profilePic;
} else {
  window.location.href = "/login.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}

// Toggle time selection
document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

async function saveAvailability() {
  const date = document.getElementById("dateInput").value;
  const times = [...document.querySelectorAll(".time-btn.active")].map(b => b.textContent);

  if (!date || times.length === 0) {
    return alert("Pick a date and at least one time slot.");
  }

  const res = await fetch("doclink-production.up.railway.app/api/availability", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      doctorId: doctor.id,
      date,
      timeSlots: times
    })
  });

  const data = await res.json();
  alert(data.message || "Availability saved.");
}
const bookingsContainer = document.getElementById("upcomingBookings");

async function loadUpcomingBookings() {
  const doctorId = doctor._id || doctor.id;

  try {
    const res = await fetch(`doclink-production.up.railway.app/api/bookings/doctor/${doctorId}`);
    const bookings = await res.json();

    const list = document.getElementById("bookingList");
    list.innerHTML = ""; // Clear old bookings

    if (!bookings.length) {
      list.innerHTML = "<li class='list-group-item'>No upcoming bookings.</li>";
      return;
    }

    bookings.forEach(b => {
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row";

      const info = document.createElement("div");
      info.innerHTML = `
        <strong>Patient:</strong> ${b.patientId?.fullname || "Unknown"}<br>
        <strong>Date:</strong> ${b.date}<br>
        <strong>Time:</strong> ${b.time}
      `;

      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-outline-primary mt-2 mt-md-0";
      btn.textContent = "Send Prescription";
      btn.onclick = () => openPrescriptionForm(b.patientId._id || b.patientId);

      item.appendChild(info);
      item.appendChild(btn);

      list.appendChild(item);
    });
  } catch (err) {
    console.error("Failed to load bookings:", err);
  }
}

  
  loadUpcomingBookings();
  
  let selectedPatientId = null;

function openPrescriptionForm(patientId) {
  selectedPatientId = patientId;
  document.getElementById('prescriptionForm').style.display = 'block';
}

document.getElementById('pillCount').addEventListener('input', function () {
  document.getElementById('pillCountValue').textContent = this.value;
});

async function sendPrescription() {
  const medication = document.getElementById("medicationName").value;
  const intervalAmount = parseInt(document.getElementById("intervalAmount").value);
  const unit = document.getElementById("intervalUnit").value;
  const totalPills = parseInt(document.getElementById("pillCount").value);
  
  const interval = unit === 'hours' ? intervalAmount * 60 : intervalAmount; // convert to minutes

  const doctor = JSON.parse(localStorage.getItem('user'));

  const payload = {
    doctorId: doctor.id,
    patientId: selectedPatientId,
    medication,
    interval,
    totalPills
  };

  const response = await fetch('/api/prescriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (response.ok) {
    alert("Prescription sent!");
    document.getElementById('prescriptionForm').style.display = 'none';
  } else {
    alert("Error: " + result.error);
  }
}
