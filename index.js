// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References --- //
    const studentForm = document.getElementById('student-form');
    const studentIdInput = document.getElementById('student-id');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const courseInput = document.getElementById('course');
    const addBtn = document.getElementById('add-btn');
    const updateBtn = document.getElementById('update-btn');
    const studentList = document.getElementById('student-list');

    // API base URL
    const apiUrl = 'http://localhost:3000/students';

    // --- Functions --- //

    // Function to fetch all students from the backend and display them
    const fetchStudents = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const students = await response.json();
            
            // Clear the existing list before rendering
            studentList.innerHTML = ''; 
            
            students.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${student.id}" data-name="${student.name}" data-email="${student.email}" data-course="${student.course}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${student.id}">Delete</button>
                    </td>
                `;
                studentList.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching students:', error);
            //  display an error message to the user
        }
    };

    // Function to reset the form fields and buttons
    const resetForm = () => {
        studentIdInput.value = '';
        nameInput.value = '';
        emailInput.value = '';
        courseInput.value = '';
        
        // Show the 'Add' button and hide the 'Update' button
        addBtn.style.display = 'inline-block';
        updateBtn.style.display = 'none';
    };

    // --- Event Listeners --- //

    // Event listener for the main form submission
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Create a student object from form data
        const studentData = {
            name: nameInput.value,
            email: emailInput.value,
            course: courseInput.value,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error('Failed to add student');
            }

            // After adding, refresh the student list and reset the form
            fetchStudents();
            resetForm();

        } catch (error) {
            console.error('Error adding student:', error);
        }
    });

    // Event listener for the 'Update' button
    updateBtn.addEventListener('click', async () => {
        const id = studentIdInput.value;
        const studentData = {
            name: nameInput.value,
            email: emailInput.value,
            course: courseInput.value,
        };

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error('Failed to update student');
            }
            
            // After updating, refresh the list and reset the form
            fetchStudents();
            resetForm();

        } catch (error) {
            console.error('Error updating student:', error);
        }
    });


    // Event listener for the student list (using event for Edit/Delete)
    studentList.addEventListener('click', async (e) => {
        // Handle 'Edit' button clicking
        if (e.target.classList.contains('edit-btn')) {
            const btn = e.target;
            studentIdInput.value = btn.dataset.id;
            nameInput.value = btn.dataset.name;
            emailInput.value = btn.dataset.email;
            courseInput.value = btn.dataset.course;

            // Hide 'Add' button and show 'Update' button
            addBtn.style.display = 'none';
            updateBtn.style.display = 'inline-block';

            // Scroll to the form if large amount of data is present
            studentForm.scrollIntoView({ behavior: 'smooth' });
        }

        // Handle what the 'Delete' button does
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            
            // Confirm with the user before deleting
            if (confirm(`Are you sure you want to delete student ID ${id}?`)) {
                try {
                    const response = await fetch(`${apiUrl}/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete student');
                    }
                    // Refresh the list after deletion
                    fetchStudents();
                } catch (error) {
                    console.error('Error deleting student:', error);
                }
            }
        }
    });

    // --- This is Initial Load --- //
    // Fetch and display all students when the page loads
    fetchStudents();
});
