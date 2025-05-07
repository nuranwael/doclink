async function fetchData(endpoint) {
    const res = await fetch(`https://doclink-production.up.railway.app/api/admin/${endpoint}`);
    return res.json();
  }
  
  // Load Users
  async function loadUsers() {
    const users = await fetchData('users');
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
  
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.fullname}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.role}</td>
        <td>
         <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  
  
    document.getElementById('totalDoctors').innerText = users.filter(u => u.role === 'doctor').length;
    document.getElementById('totalPatients').innerText = users.filter(u => u.role === 'patient').length;
  
    setupUserSearch();
  }
  
  //  Load Bookings
  async function loadBookings() {
    const bookings = await fetchData('bookings');
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '';
  
    bookings.forEach(booking => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${booking.doctorId?.fullname || 'Unknown'}</td>
        <td>${booking.patientId?.fullname || 'Unknown'}</td>
        <td>${booking.date}</td>
        <td>${booking.time}</td>
        <td>${booking.status}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteBooking('${booking._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  
    
    document.getElementById('totalBookings').innerText = bookings.length;
  }
  
  //  Load Reviews
async function loadReviews() {
    const reviews = await fetchData('reviews');
    const tbody = document.getElementById('reviewsTableBody');
    tbody.innerHTML = '';
  
    reviews.forEach(review => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${review.bookingId}</td>
        <td>${review.doctorId}</td>
        <td>${review.patientId}</td>
        <td>${review.attitude || 0} / ${review.cleanliness || 0} / ${review.experience || 0}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteReview('${review._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  
  //delete user
  
  async function deleteUser(userId) {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This user will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!'
    });
  
    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://doclink-production.up.railway.app/api/admin/users/${userId}`, {
          method: 'DELETE'
        });
        const result = await res.json();
  
        if (res.ok) {
          Swal.fire('Deleted!', result.message, 'success');
          loadUsers();
        } else {
          Swal.fire('Error!', result.error || 'Delete failed.', 'error');
        }
      } catch (err) {
        console.error("❌ Delete error:", err);
        Swal.fire('Error!', 'Server error while deleting user.', 'error');
      }
    }
  }
  
  
  // Delete a Booking
  async function deleteBooking(bookingId) {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This booking will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!'
    });
  
    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://doclink-production.up.railway.app/api/admin/bookings/${bookingId}`, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
          Swal.fire('Deleted!', result.message, 'success');
          loadBookings();
        } else {
          Swal.fire('Error!', result.error, 'error');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        Swal.fire('Error!', 'Failed to delete booking.', 'error');
      }
    }
  }

  async function deleteReview(reviewId) {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This review will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!'
    });
  
    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://doclink-production.up.railway.app/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
          Swal.fire('Deleted!', result.message, 'success');
          loadReviews();
        } else {
          Swal.fire('Error!', result.error || 'Delete failed.', 'error');
        }
      } catch (err) {
        console.error("❌ Delete error:", err);
        Swal.fire('Error!', 'Server error while deleting review.', 'error');
      }
    }
  }
  
  
  //  User search filter
  function setupUserSearch() {
    const input = document.getElementById('userSearch');
    input.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      document.querySelectorAll('#usersTableBody tr').forEach(row => {
        const fullname = row.children[0].textContent.toLowerCase();
        const username = row.children[1].textContent.toLowerCase();
        const email = row.children[2].textContent.toLowerCase();
        const phone = row.children[3].textContent.toLowerCase();
        const role = row.children[4].textContent.toLowerCase();
  
        if (fullname.includes(query) || username.includes(query) || email.includes(query) || phone.includes(query) || role.includes(query)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }
  
  window.onload = function() {
    loadUsers();
    loadBookings();
    loadReviews();
    drawCharts();
  };
  
  
  // Logout
  function logout() {
    localStorage.clear();
    window.location.href = "/Login.html";
  }

  let bookingsChart;
  let rolesChart;
  
  async function drawCharts() {
    const users = await fetchData('users');
    const bookings = await fetchData('bookings');
  
    //  Line Chart for Bookings
    const bookingsByDate = {};
    bookings.forEach(b => {
      bookingsByDate[b.date] = (bookingsByDate[b.date] || 0) + 1;
    });
  
    const dates = Object.keys(bookingsByDate).sort();
    const counts = dates.map(date => bookingsByDate[date]);
  
    if (bookingsChart) bookingsChart.destroy();
    bookingsChart = new Chart(document.getElementById('bookingsChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Bookings per Day',
          data: counts,
          borderColor: '#5e72e4',
          backgroundColor: 'rgba(94, 114, 228, 0.2)',
          tension: 0.4, 
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        animation: {
          duration: 1500, 
          easing: 'easeInOutQuart',
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Pie Chart for Users
    const doctorsCount = users.filter(u => u.role === 'doctor').length;
    const patientsCount = users.filter(u => u.role === 'patient').length;
  
    if (rolesChart) rolesChart.destroy();
    rolesChart = new Chart(document.getElementById('rolesChart'), {
      type: 'doughnut',
      data: {
        labels: ['Doctors', 'Patients'],
        datasets: [{
          data: [doctorsCount, patientsCount],
          backgroundColor: ['#5e72e4', '#f5365c'],
          hoverBackgroundColor: ['#324cdd', '#fb6340'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        animation: {
          animateScale: true, 
          animateRotate: true, 
          duration: 1500,
          easing: 'easeOutBounce'
        }
      }
    });
  }
  