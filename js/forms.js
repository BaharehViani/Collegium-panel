import userStore from "./userStore.js";
const user = userStore.getUser();
const API_BASE_URL = "http://localhost:5000";

loadUserForms();
async function loadUserForms() {
  if (!user || !user._id) {
    console.error("User ID not found.");
    return;
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/users/forms/${user._id}`
    );
    const forms = response.data.forms;
    renderFormsTable(forms);
  } catch (err) {
    console.error("Error fetching user forms:", err);
    alert("Error fetching user forms.");
  }
}

function renderFormsTable(forms) {
  const tbody = document.querySelector("#formsTable tbody");
  tbody.innerHTML = "";

  forms.forEach((form) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td data-label="Code">${form.tracking_code}</td>
      <td data-label="Title">${form.title}</td>
      <td data-label="Type">${form.type}</td>
      <td data-label="Content">${form.content}</td>
      <td data-label="Status">${form.status}</td>
      <td>
        <button class="edit-btn" data-id="${form._id}">Edit</button>
        <button class="delete-btn" data-id="${form._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", onEditClick);
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", onDeleteClick);
  });
}

let editingFormId = null;
async function onEditClick(event) {
  event.currentTarget.disabled = true;
  event.currentTarget.classList.add("disabled");

  const formId = event.currentTarget.dataset.id;
  editingFormId = formId;

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/users/form/${formId}`
    );
    const form = response.data;
    document.getElementById("requestTitle").value = form.title;
    document.getElementById("requestType").value = form.type;
    document.getElementById("requestContent").value = form.content;
    document.querySelector("#form-submit").textContent = "Update Request";
  } catch (err) {
    console.error("Error loading form for editing:", err);
    alert("Error loading form for editing");
  }
}

async function onDeleteClick(event) {
  const formId = event.currentTarget.dataset.id;
  if (!confirm("Are you sure you want to delete this request?")) return;

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/users/form/${formId}`,
      { data: { user_id: user.id } }
    );
    alert(response.data.message);
    loadUserForms();
  } catch (err) {
    console.error("Error deleting form:", err);
    alert("Error deleting form.");
  }
}

const form = document.getElementById("requestForm");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("requestTitle").value.trim();
  const type = document.getElementById("requestType").value;
  const content = document.getElementById("requestContent").value.trim();

  const requestData = {
    title: title,
    type: type,
    content: content,
    user_id: user._id,
  };

  try {
    if (editingFormId) {
      const response = await axios.patch(
        `${API_BASE_URL}/api/users/form/${editingFormId}`,
        requestData
      );
      alert("Your request was updated successfully!");
    } else {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/form`,
        requestData
      );
      alert("Your request was submitted successfully!");
    }
    editingFormId = null;
    event.target.reset();
    document.getElementById("requestForm").reset();
    loadUserForms();
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Something went wrong while submitting your request.");
  }
});
