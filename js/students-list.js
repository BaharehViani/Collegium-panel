const API_BASE_URL = "https://collegium-api.up.railway.app";

const studentsList = document.getElementById("students-list");

try {
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    const students = response.data.users;

    students.forEach(student => {
        const studentCard = document.createElement("div");
        studentCard.classList.add("student-card");
        const imageUrl = student.photo && student.photo.trim() !== "" ? student.photo : "../assets/img/primary_pic.JPG";

        studentCard.innerHTML = `
            <img src="${imageUrl}" alt="Student Photo">
            <div class="student-info">
                <h3>${student.full_name}</h3>
                <p><strong>National ID:</strong> ${student.username}</p>
                <p><strong>Date of Birth:</strong> ${student.birth_date}</p>
                <p><strong>Phone:</strong> ${student.phone_number}</p>
            </div>
        `;

        studentsList.appendChild(studentCard);
    });
} catch (error) {
    console.error("Error fetching students:", error);
}