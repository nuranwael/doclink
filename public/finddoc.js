$(document).ready(function () {
    fetchDoctors();
});

async function fetchDoctors() {
    try {
        const response = await fetch("https://doclink-production.up.railway.app/api/doctors");
        const doctors = await response.json();

        const doctorListContainer = document.querySelector(".list-group");
        doctorListContainer.innerHTML = '';

        doctors.forEach((doctor) => {
            const doctorCard = document.createElement("div");
            doctorCard.classList.add("doctor-card", "card", "p-3", "mb-3");

            doctorCard.innerHTML = `
  <div class="card-header-view d-flex flex-column align-items-center text-center">
      <img src="doc1.jpg" width="80" class="rounded-circle mb-2 doctor-img" />
      <h5 class="doctor-name">${doctor.fullname}</h5>
      <small class="doctor-specialty">${doctor.specialty || 'General Doctor'}</small>
  </div>
  <div class="booking-details mt-3 d-none">
      <p><strong>Address:</strong> ${doctor.address || 'N/A'}</p>
      <div class="date-buttons d-flex gap-2 mb-2 flex-wrap"></div>
      <div class="time-buttons d-flex gap-2 mb-2 flex-wrap"></div>
      <button class="btn btn-success book-btn">Book</button>
      <hr>
      <div class="reviews-section mt-3">
          <h6>Patient Reviews:</h6>
          <div class="reviews-list"></div>
      </div>
  </div>
`;


doctorCard.addEventListener("click", async function (e) {
    if (!e.target.classList.contains("date-btn") &&
        !e.target.classList.contains("time-btn") &&
        !e.target.classList.contains("book-btn")) {

        const details = doctorCard.querySelector(".booking-details");
        const isHidden = details.classList.contains("d-none");

      
        document.querySelectorAll(".doctor-card").forEach(card => {
            card.classList.remove("expanded");
            card.querySelector(".booking-details").classList.add("d-none");
        });

        if (isHidden) {
            doctorCard.classList.add("expanded");
            details.classList.remove("d-none");
            await loadAvailability(doctorCard, doctor._id, doctor.fullname);
            await loadReviews(doctor._id, doctorCard);
        } else {
            doctorCard.classList.remove("expanded");
            details.classList.add("d-none");
        }
    }
});


            doctorListContainer.appendChild(doctorCard);
        });

      
        $(".search-btn").click(function () {
            const query = $("#search-input").val().toLowerCase();
            $(".doctor-card").each(function () {
                const doctorName = $(this).find("h5").text()?.toLowerCase() || "";
                const specialty = $(this).find("small").text()?.toLowerCase() || "";
                if (doctorName.includes(query) || specialty.includes(query)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });

    } catch (err) {
        console.error("❌ Error fetching doctors:", err);
        alert("Failed to load doctors.");
    }
}

async function loadAvailability(card, doctorId, doctorName) {
    try {
        const res = await fetch(`https://doclink-production.up.railway.app/api/availability/${doctorId}`);
        const slots = await res.json();

        if (!Array.isArray(slots)) {
            throw new Error("Invalid availability response format.");
        }

        const dateButtonsDiv = card.querySelector(".date-buttons");
        const timeButtonsDiv = card.querySelector(".time-buttons");

        dateButtonsDiv.innerHTML = '';
        timeButtonsDiv.innerHTML = '';

        let selectedDate = null;
        let selectedTime = null;

        slots.forEach((slot) => {
            const dateBtn = document.createElement("button");
            dateBtn.classList.add("btn", "btn-outline-primary", "date-btn");
            dateBtn.textContent = slot.date;

            dateBtn.addEventListener("click", () => {
                selectedDate = slot.date;
                selectedTime = null;
                card.querySelectorAll(".date-btn").forEach(b => b.classList.remove("active"));
                dateBtn.classList.add("active");

               
                timeButtonsDiv.innerHTML = '';
                slot.timeSlots.forEach(time => {
                    const timeBtn = document.createElement("button");
                    timeBtn.classList.add("btn", "btn-outline-secondary", "time-btn");
                    timeBtn.textContent = time;

                    timeBtn.addEventListener("click", () => {
                        selectedTime = time;
                        card.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
                        timeBtn.classList.add("active");
                    });

                    timeButtonsDiv.appendChild(timeBtn);
                });
            });

            dateButtonsDiv.appendChild(dateBtn);
        });

       
          

      
        const bookBtn = card.querySelector(".book-btn");
        bookBtn.onclick = async () => {
            const patient = JSON.parse(localStorage.getItem("user"));
            if (!selectedDate || !selectedTime) {
                alert("Please select both date and time.");
                return;
            }

            try {
                const response = await fetch("https://doclink-production.up.railway.app/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        doctorId,
                        patientId: patient.id,
                        date: selectedDate,
                        time: selectedTime,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`✅ Appointment booked with Dr. ${doctorName} on ${selectedDate} at ${selectedTime}`);
                } else {
                    alert(`❌ ${result.error || "Booking failed."}`);
                }
            } catch (error) {
                console.error("❌ Booking error:", error);
                alert("Something went wrong while booking.");
            }
        };
    } catch (error) {
        console.error("❌ Error loading availability:", error);
        alert("Could not load availability.");
    }
}
async function loadReviews(doctorId, card) {
    try {
      const res = await fetch(`https://doclink-production.up.railway.app/api/reviews/doctor/${doctorId}`);
      const reviews = await res.json();
  
      const reviewsList = card.querySelector('.reviews-list');
      reviewsList.innerHTML = ''; // Clear previous
  
      if (!Array.isArray(reviews) || reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
        return;
      }
  
     
      const total = reviews.length;
      const sum = reviews.reduce((acc, r) => acc + (r.attitude + r.cleanliness + r.experience) / 3, 0);
      const avg = (sum / total).toFixed(1);
  
      
      const stars = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
  
      const avgDiv = document.createElement('div');
      avgDiv.classList.add('mb-2');
      avgDiv.innerHTML = `<strong>Average Rating:</strong> <span style="font-size: 1.2em; color: orange;">${stars}</span> (${avg}/5)`;
      reviewsList.appendChild(avgDiv);
  
      
      reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item', 'mb-2', 'p-2', 'border', 'rounded');
  
        const attitude = '★'.repeat(review.attitude) + '☆'.repeat(5 - review.attitude);
        const cleanliness = '★'.repeat(review.cleanliness) + '☆'.repeat(5 - review.cleanliness);
        const experience = '★'.repeat(review.experience) + '☆'.repeat(5 - review.experience);
  
        reviewItem.innerHTML = `
          <p><strong>Attitude:</strong> <span style="color: orange;">${attitude}</span></p>
          <p><strong>Cleanliness:</strong> <span style="color: orange;">${cleanliness}</span></p>
          <p><strong>Experience:</strong> <span style="color: orange;">${experience}</span></p>
        `;
  
        reviewsList.appendChild(reviewItem);
      });
    } catch (error) {
      console.error("❌ Error loading reviews:", error);
      const reviewsList = card.querySelector('.reviews-list');
      reviewsList.innerHTML = '<p style="color:red;">Failed to load reviews.</p>';
    }
  }
 
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("You're not logged in.");
    window.location.href = "/login.html";
  } else {
    document.getElementById("username").textContent = user.username;
    document.getElementById("userPic").src = user.image || "fpf.jpg"; // fallback image
  }

  document.getElementById("username").addEventListener("click", () => {
    if (user.role === "doctor") {
      window.location.href = "doctor-profile.html";
    } else {
      window.location.href = "account.html";
    }
  });

  function logout() {
    localStorage.clear();
    alert("You have been logged out.");
    window.location.href = "/login.html";
  }

