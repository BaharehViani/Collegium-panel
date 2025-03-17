//courses data
const courses = [
    {
      title: "Data Mining",
      time: "10:00 AM - 12:00 AM",
      day: "Tursday",
      instructor: "Dr. Balafar"
    },
    {
      title: "Information Security",
      time: "10:00 PM - 12:00 PM",
      day: "Wednesday",
      instructor: "Dr. Mortazavi"
    },
    {
      title: "Web Programming",
      time: "8:00 PM - 10:00 PM",
      day: "Sunday",
      instructor: "Dr. Mohammadzad"
    },
    {
      title: "Cloud Computing",
      time: "10:00 PM - 12:00 PM",
      day: "Sunday",
      instructor: "Dr. Khanli"
    },
    {
        title: "Software Engineering",
        time: "8:00 PM - 10:00 PM",
        day: "Tuesday",
        instructor: "Dr. Taghinezhad"
    },
    {
      title: "Tafsir Mozuei",
      time: "14:00 PM - 16:00 PM",
      day: "Wednesday",
      instructor: "Ms. Asl Nezhadi"
    },
];
  
// Function to render course cards
function renderCourses() {
    const container = document.getElementById('courses-container');
    
    courses.forEach(course => {
      // Create card element
      const card = document.createElement('div');
      card.className = 'card';
      
      // Create card header
      const cardHeader = document.createElement('div');
      cardHeader.className = 'card-header';
      cardHeader.textContent = course.title;
      
      // Create card body
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      
      // Create course details
      const timeEl = document.createElement('p');
      timeEl.innerHTML = `<strong>Time:</strong> ${course.time}`;
      
      const dayEl = document.createElement('p');
      dayEl.innerHTML = `<strong>Day:</strong> ${course.day}`;
      
      const instructorEl = document.createElement('p');
      instructorEl.innerHTML = `<strong>Instructor:</strong> ${course.instructor}`;
      
      // Create buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'card-buttons';

      // Create "Course Files" button
      const courseFilesLink = document.createElement('a');
      courseFilesLink.className = 'btn course-files';
      courseFilesLink.href = "../html/media.html";
      courseFilesLink.textContent = "Files & Videos";

      // Append buttons to container
      buttonsContainer.appendChild(courseFilesLink);

      // Append details to card body
      cardBody.appendChild(timeEl);
      cardBody.appendChild(dayEl);
      cardBody.appendChild(instructorEl);
      
      // Assemble card
      card.appendChild(cardHeader);
      card.appendChild(cardBody);
      card.appendChild(buttonsContainer);
      
      // Append card to container
      container.appendChild(card);
    });
}
  
// Call the function to render cards on page load
renderCourses();
