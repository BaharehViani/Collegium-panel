const API_BASE_URL = "http://localhost:5000";

const requestsContainer = document.getElementById('requests');

async function fetchPendingForms() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/users/pending-forms`);
    const data = res.data;

    data.forms.forEach(form => {
      const card = document.createElement('div');
      card.className = 'request-card';

      card.innerHTML = `
        <div class="request-card-grid">
            <div class="request-main">
            <h3 class="request-title">${form.title}</h3>
            <p class="request-desc">${form.content}</p>
            </div>

            <div class="request-details">
            <div class="detail-item"><i class="fa-solid fa-tags"></i> <span>${form.type}</span></div>
            <div class="detail-item"><i class="fa-solid fa-hashtag"></i> <span>${form.tracking_code}</span></div>
            <div class="detail-item"><i class="fa-solid fa-user"></i> <span>${form.username || 'Unknown'}</span></div>
            <div class="detail-item"><i class="fa-regular fa-clock"></i> <span>${new Date(form.createdAt).toLocaleDateString()}</span></div>
            </div>

            <div class="request-actions">
            <button class="btn btn-approve" onclick="updateStatus('${form._id}', 'approved')">
                <i class="fa-solid fa-check"></i> Approve
            </button>
            <button class="btn btn-reject" onclick="updateStatus('${form._id}', 'rejected')">
                <i class="fa-solid fa-xmark"></i> Reject
            </button>
            </div>
        </div>
        `;


      requestsContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading pending requests:', err);
  }
}

async function updateStatus(id, status) {
  try {
    const res = await axios.patch(`${API_BASE_URL}/api/users/form/${id}/status`, {
      status: status
    });

    alert(res.data.message);
    window.location.reload();
  } catch (err) {
    alert('Error updating status');
    console.error(err);
  }
}

fetchPendingForms();
