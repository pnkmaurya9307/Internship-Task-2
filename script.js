document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerHeight = header.offsetHeight;
                const offsetTop = targetElement.offsetTop - headerHeight - 20; // 20px extra padding

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile nav after clicking
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                }
            }
        });
    });

    // --- Highlight Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 50; // Offset by header height + some buffer
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navbar.querySelectorAll('a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    navToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // --- Project 1 & 2: Contact Form with Validation ---
    const contactForm = document.getElementById('contactForm');
    const contactNameInput = document.getElementById('contactName');
    const contactEmailInput = document.getElementById('contactEmail');
    const contactNameError = document.getElementById('contactNameError');
    const contactEmailError = document.getElementById('contactEmailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (inputElement, errorElement, validationFn, errorMessage) => {
        const value = inputElement.value.trim();
        if (!validationFn(value)) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            inputElement.classList.add('invalid');
            return false;
        } else {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            inputElement.classList.remove('invalid');
            return true;
        }
    };

    const isNotEmpty = (value) => value !== '';
    const isValidEmail = (value) => emailRegex.test(value);

    // Live validation on blur
    contactNameInput.addEventListener('blur', () => {
        validateField(contactNameInput, contactNameError, isNotEmpty, 'Name is required.');
    });

    contactEmailInput.addEventListener('blur', () => {
        validateField(contactEmailInput, contactEmailError, isValidEmail, 'Please enter a valid email address.');
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const isNameValid = validateField(contactNameInput, contactNameError, isNotEmpty, 'Name is required.');
        const isEmailValid = validateField(contactEmailInput, contactEmailError, isValidEmail, 'Please enter a valid email address.');

        if (isNameValid && isEmailValid) {
            // Simulate form submission
            alert('Message sent successfully! (Form submission simulated)');
            console.log('Form Data:', {
                name: contactNameInput.value.trim(),
                email: contactEmailInput.value.trim(),
                subject: document.getElementById('contactSubject').value.trim(),
                message: document.getElementById('contactMessage').value.trim()
            });
            contactForm.reset();
            // Clear any lingering error messages
            contactNameError.style.display = 'none';
            contactEmailError.style.display = 'none';
        } else {
            alert('Please correct the errors in the form.');
        }
    });

    // --- Project 4: Dynamic To-Do List ---
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn'); // Changed from clearAllBtn

    const saveTodos = (todos) => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const loadTodos = () => {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => createTodoItem(todo.text, todo.completed));
    };

    const createTodoItem = (text, completed = false) => {
        const listItem = document.createElement('li');
        listItem.classList.toggle('completed', completed); // Apply 'completed' class if true

        const textSpan = document.createElement('span');
        textSpan.classList.add('task-text');
        textSpan.textContent = text;
        textSpan.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            updateLocalStorage(); // Update status in localStorage
        });

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = completed ? '↩️' : '✔️'; // Unicode checkmark/undo
        completeBtn.classList.add('complete-btn');
        completeBtn.title = completed ? 'Mark as Incomplete' : 'Mark as Complete';
        completeBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            completeBtn.textContent = listItem.classList.contains('completed') ? '↩️' : '✔️';
            completeBtn.title = listItem.classList.contains('completed') ? 'Mark as Incomplete' : 'Mark as Complete';
            updateLocalStorage();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.title = 'Delete Task';
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(listItem);
            updateLocalStorage(); // Remove from localStorage
        });

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);
        listItem.appendChild(textSpan);
        listItem.appendChild(actionsDiv);
        todoList.appendChild(listItem);
    };

    const addTodo = () => {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            createTodoItem(todoText);
            todoInput.value = '';
            todoInput.focus();
            updateLocalStorage(); // Save new todo
        } else {
            alert('Please enter a task to add!');
        }
    };

    const updateLocalStorage = () => {
        const todos = [];
        todoList.querySelectorAll('li').forEach(item => {
            todos.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed')
            });
        });
        saveTodos(todos);
    };

    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        const completedTasks = todoList.querySelectorAll('li.completed');
        if (completedTasks.length === 0) {
            alert('No completed tasks to clear!');
            return;
        }
        completedTasks.forEach(task => {
            todoList.removeChild(task);
        });
        updateLocalStorage(); // Update localStorage after clearing
    });

    loadTodos(); // Load todos when the page loads

    // --- New Feature: Dynamic Image Gallery ---
    const imageUploadInput = document.getElementById('imageUploadInput');
    const uploadImagesBtn = document.getElementById('uploadImagesBtn');
    const imageGallery = document.getElementById('imageGallery');

    const loadImageFiles = () => {
        const storedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
        storedImages.forEach(src => addImageToGallery(src, false)); // false indicates not a new upload
    };

    const saveImageToLocalStorage = (base64String) => {
        const storedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
        storedImages.push(base64String);
        localStorage.setItem('galleryImages', JSON.stringify(storedImages));
    };

    const removeImageFromLocalStorage = (srcToRemove) => {
        let storedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
        storedImages = storedImages.filter(src => src !== srcToRemove);
        localStorage.setItem('galleryImages', JSON.stringify(storedImages));
    };


    const addImageToGallery = (src, isNewUpload = true) => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Uploaded Image';

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-image-btn');
        removeBtn.innerHTML = '&times;'; // HTML entity for 'x'
        removeBtn.title = 'Remove Image';
        removeBtn.addEventListener('click', () => {
            imageGallery.removeChild(galleryItem);
            removeImageFromLocalStorage(src);
        });

        galleryItem.appendChild(img);
        galleryItem.appendChild(removeBtn);
        imageGallery.appendChild(galleryItem);

        if (isNewUpload) {
            saveImageToLocalStorage(src);
        }
    };

    uploadImagesBtn.addEventListener('click', () => {
        if (imageUploadInput.files.length === 0) {
            alert('Please select at least one image to upload.');
            return;
        }

        Array.from(imageUploadInput.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    addImageToGallery(e.target.result);
                };
                reader.readAsDataURL(file); // Convert image to Base64 string
            } else {
                console.warn(`File ${file.name} is not an image.`);
            }
        });

        imageUploadInput.value = ''; // Clear file input
    });

    loadImageFiles(); // Load images when the page loads
});