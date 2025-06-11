const API_BASE_URL = "http://localhost:5000";

const studentsList = document.getElementById("students-list");
const majorSelect = document.getElementById("major-select");
const orderSelect = document.getElementById("order-select");

function renderStudentCard(student) {
    const studentCard = document.createElement("div");
    studentCard.classList.add("student-card");
    const imageUrl = student.photo?.trim() ? student.photo : "../assets/img/primary_pic.JPG";

    studentCard.innerHTML = `
        <img src="${imageUrl}" alt="Student Photo">
        <div class="student-info">
            <h3>${student.full_name}</h3>
            <p><strong>National ID:</strong> ${student.username}</p>
            <p><strong>Field of Study:</strong> ${student.major}</p>
            <p><strong>Date of Birth:</strong> ${student.birth_date}</p>
            <p><strong>Phone:</strong> ${student.phone_number}</p>
        </div>`;

    studentsList.appendChild(studentCard);
}

async function fetchStudents(major = "", orderBy = "") {
    try {
        const params = new URLSearchParams();
        if (major) params.append("major", major);
        if (orderBy) params.append("orderBy", orderBy);

        const response = await axios.get(`${API_BASE_URL}/api/users?${params}`);
        const students = response.data.users;

        studentsList.innerHTML = "";

        students.forEach(renderStudentCard);
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

async function fetchMajors() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/majors`);
        const data = await response.json();

        const excludedMajors = ["System Admin"]; 
        const filteredMajors = data.majors.filter(
            major => !excludedMajors.includes(major)
        );

        filteredMajors.forEach(major => {
            const option = document.createElement("option");
            option.value = major;
            option.textContent = major;
            majorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to load majors:", error);
    }
}

majorSelect.addEventListener("change", () => {
    fetchStudents(majorSelect.value, orderSelect.value);
});
  
orderSelect.addEventListener("change", () => {
    fetchStudents(majorSelect.value, orderSelect.value);
});

(async function initPage() {
    await fetchStudents("", "");
    await fetchMajors();
})();
