const urlParams = new URLSearchParams(window.location.search);
const course_name = urlParams.get("course");

async function fetchCourseData() {
    const urlParams = new URLSearchParams(window.location.search);
    const course_name = urlParams.get("course");

    try {
        const response = await axios.get(`http://localhost:3000/api/users/course/${encodeURIComponent(course_name)}`);
        
        document.querySelector('.course-info-left h2').textContent = response.data.course_name;
        document.querySelector('.course-info-left p').textContent = `Instructor : ${response.data.instructor_name}`;
        document.querySelector('.course-schedule p:nth-child(1)').textContent = response.data.first_class;
        document.querySelector('.course-schedule p:nth-child(2)').textContent = response.data.second_class;
    } catch (error) {
        console.error("Error fetching course data:", error);
    }
}

fetchCourseData();
