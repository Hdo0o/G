let dayCounter = 3; // عداد الأيام
const exercises = { 1: [], 2: [], 3: [] }; // حفظ التمارين لكل يوم

// تحميل صورة الجم
function loadImage(event) {
    const imagePreview = document.getElementById("gym-image-preview");
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

// إضافة تمرين جديد
function addExercise(day) {
    const nameInput = document.getElementById(`exercise-name${day}`);
    const setsInput = document.getElementById(`sets${day}`);
    const repsInput = document.getElementById(`reps${day}`);
    const list = document.getElementById(`exercise-list${day}`);

    const name = nameInput.value.trim();
    const sets = setsInput.value.trim();
    const reps = repsInput.value.trim();

    if (name && sets && reps) {
        const exercise = { name, sets, reps };
        exercises[day].push(exercise);

        const li = document.createElement("li");
        li.textContent = `${name} - ${sets}×${reps}`;
        li.appendChild(createEditButton(day, exercise, li));
        li.appendChild(createDeleteButton(day, exercise, li));
        list.appendChild(li);

        nameInput.value = '';
        setsInput.value = '';
        repsInput.value = '';
    } else {
        alert("يرجى ملء جميع الحقول!");
    }
}

// زر التعديل
function createEditButton(day, exercise, listItem) {
    const button = document.createElement("button");
    button.textContent = "تعديل";
    button.style.marginLeft = "10px";
    button.onclick = () => {
        const name = prompt("اسم التمرين:", exercise.name);
        const sets = prompt("عدد المجموعات:", exercise.sets);
        const reps = prompt("عدد التكرارات:", exercise.reps);

        if (name && sets && reps) {
            exercise.name = name;
            exercise.sets = sets;
            exercise.reps = reps;
            listItem.textContent = `${name} - ${sets}×${reps}`;
            listItem.appendChild(createEditButton(day, exercise, listItem));
            listItem.appendChild(createDeleteButton(day, exercise, listItem));
        }
    };
    return button;
}

// زر الحذف
function createDeleteButton(day, exercise, listItem) {
    const button = document.createElement("button");
    button.textContent = "حذف";
    button.style.marginLeft = "10px";
    button.onclick = () => {
        const index = exercises[day].indexOf(exercise);
        if (index > -1) {
            exercises[day].splice(index, 1);
            listItem.remove();
        }
    };
    return button;
}

// إضافة يوم جديد
function addNewDay() {
    dayCounter++;
    const daysContainer = document.getElementById("days-container");
    const newDay = document.createElement("div");
    newDay.className = "day-section";
    newDay.id = `day${dayCounter}`;
    newDay.innerHTML = `
        <h2 class="day-title">اليوم ${dayCounter}</h2>
        <div class="exercise-form">
            <input type="text" id="exercise-name${dayCounter}" placeholder="اسم التمرين" />
            <input type="number" id="sets${dayCounter}" placeholder="عدد المجموعات" />
            <input type="number" id="reps${dayCounter}" placeholder="عدد التكرارات" />
            <button onclick="addExercise(${dayCounter})">إضافة التمرين</button>
        </div>
        <ul id="exercise-list${dayCounter}" class="exercise-list"></ul>
    `;
    daysContainer.appendChild(newDay);
    exercises[dayCounter] = [];
}

// طباعة الجدول
function printExercises() {
    const printWindow = window.open('', '', 'width=800,height=600');
    const gymImage = document.getElementById("gym-image-preview");
    const gymImageSrc = gymImage.src;

    printWindow.document.write(`
        <html>
        <head>
            <title>طباعة الجدول</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                ul { list-style: none; padding: 0; font-size: 18px; }
                h2 { color: #007bff; font-size: 20px; margin-bottom: 10px; }
                img { width: 100%; height: auto; margin-bottom: 20px; }
            </style>
        </head>
        <body>
    `);

    if (gymImageSrc) {
        printWindow.document.write(`<img src="${gymImageSrc}" alt="صورة الجم">`);
    }

    Object.keys(exercises).forEach(day => {
        if (exercises[day].length > 0) {
            printWindow.document.write(`<h2>اليوم ${day}</h2>`);
            printWindow.document.write(`<ul>`);
            exercises[day].forEach(exercise => {
                printWindow.document.write(
                    `<li>${exercise.name} - ${exercise.sets}×${exercise.reps}</li>`
                );
            });
            printWindow.document.write(`</ul>`);
        }
    });

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}