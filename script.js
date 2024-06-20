// Pomodoro Sayaç işlevselliği
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('time');
const projectInput = document.getElementById('projectInput');
const addProjectBtn = document.getElementById('addProjectBtn');
const projectsList = document.getElementById('projectsList');
const addCustomTimerBtn = document.getElementById('addCustomTimerBtn');
const workDurationInput = document.getElementById('workDuration');
const customTimersList = document.getElementById('customTimersList');

let countdown;
let timeInSeconds = 1500; // 25 dakika = 1500 saniye varsayılan
let timerRunning = false;
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let customTimers = JSON.parse(localStorage.getItem('customTimers')) || [];

// Projeleri ve custom timer'ları localStorage'dan yükleme
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    loadCustomTimers();
});

function loadProjects() {
    projects.forEach(project => addProjectToDOM(project));
}

function loadCustomTimers() {
    customTimers.forEach(timer => addCustomTimerToDOM(timer));
}

// Zamanı biçimlendirme fonksiyonu
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Başlat / Duraklat butonuna tıklama işlevselliği ekleme
startPauseBtn.addEventListener('click', function() {
    if (!timerRunning) {
        startTimer();
    } else {
        pauseTimer();
    }
    playClickSound(); // Tıklama sesini çal
});

// Sıfırla butonuna tıklama işlevselliği ekleme
resetBtn.addEventListener('click', function() {
    clearInterval(countdown);
    timeInSeconds = 1500; // 25 dakika = 1500 saniye varsayılan
    timeDisplay.textContent = formatTime(timeInSeconds);
    startPauseBtn.textContent = 'Başlat';
    timerRunning = false;
    playClickSound(); // Tıklama sesini çal
});

// Timer başlatma fonksiyonu
function startTimer() {
    countdown = setInterval(function() {
        timeInSeconds--;
        timeDisplay.textContent = formatTime(timeInSeconds);
        if (timeInSeconds <= 0) {
            clearInterval(countdown);
            timeInSeconds = 0;
            timeDisplay.textContent = formatTime(timeInSeconds);
            // Timer bittiğinde yapılacak işlemler buraya eklenebilir
        }
    }, 1000); // Her saniye güncelle
    startPauseBtn.textContent = 'Duraklat';
    timerRunning = true;
}

// Timer duraklatma fonksiyonu
function pauseTimer() {
    clearInterval(countdown);
    startPauseBtn.textContent = 'Başlat';
    timerRunning = false;
}

// Tıklama sesini çalma işlevi
const clickSound = new Audio('click-sound.mp3');

function playClickSound() {
    clickSound.currentTime = 0; // Ses dosyasını başa sar
    clickSound.play();
}

// Başlangıçta zamanı ekranda gösterme
timeDisplay.textContent = formatTime(timeInSeconds);

// Proje ekleme işlevselliği
addProjectBtn.addEventListener('click', function() {
    const projectText = projectInput.value.trim();
    if (projectText !== '') {
        const project = { text: projectText };
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
        addProjectToDOM(project);
        projectInput.value = '';
    }
});

function addProjectToDOM(project) {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-gray-700 rounded-lg px-4 py-2 text-white'; // Arka plan rengi gri, metin rengi beyaz
    li.innerHTML = `
        <span>${project.text}</span>
        <div>
            <button class="deleteBtn bg-red-500 hover:bg-red-600 focus:outline-none text-white py-1 px-3 rounded-lg ml-2">Sil</button>
        </div>
    `;

    const deleteBtn = li.querySelector('.deleteBtn');

    deleteBtn.addEventListener('click', function() {
        projects = projects.filter(p => p !== project);
        localStorage.setItem('projects', JSON.stringify(projects));
        li.remove();
    });

    projectsList.appendChild(li);
}

// Sayaç ekleme işlevselliği
addCustomTimerBtn.addEventListener('click', function() {
    const workDuration = parseInt(workDurationInput.value);
    if (!isNaN(workDuration) && workDuration > 0) {
        const timer = { duration: workDuration, active: false };
        customTimers.push(timer);
        localStorage.setItem('customTimers', JSON.stringify(customTimers));
        addCustomTimerToDOM(timer);
        workDurationInput.value = '';
    }
});

function addCustomTimerToDOM(timer) {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-gray-700 rounded-lg px-4 py-2 text-white'; // Arka plan rengi gri, metin rengi beyaz
    li.innerHTML = `
        <span>${timer.duration} dakika</span>
        <div>
            <button class="activateTimerBtn bg-blue-500 hover:bg-blue-600 focus:outline-none text-white py-1 px-3 rounded-lg">${timer.active ? 'Aktif' : 'Aktif Et'}</button>
            <button class="deleteTimerBtn bg-red-500 hover:bg-red-600 focus:outline-none text-white py-1 px-3 rounded-lg ml-2">Sil</button>
        </div>
    `;

    const activateTimerBtn = li.querySelector('.activateTimerBtn');
    const deleteTimerBtn = li.querySelector('.deleteTimerBtn');

    activateTimerBtn.addEventListener('click', function() {
        customTimers.forEach(t => t.active = false);
        timer.active = true;
        localStorage.setItem('customTimers', JSON.stringify(customTimers));
        timeInSeconds = timer.duration * 60;
        timeDisplay.textContent = formatTime(timeInSeconds);
        updateTimerButtons();
    });

    deleteTimerBtn.addEventListener('click', function() {
        customTimers = customTimers.filter(t => t !== timer);
        localStorage.setItem('customTimers', JSON.stringify(customTimers));
        li.remove();
    });

    customTimersList.appendChild(li);
}

function updateTimerButtons() {
    const allTimerButtons = customTimersList.querySelectorAll('.activateTimerBtn');
    customTimers.forEach((timer, index) => {
        const button = allTimerButtons[index];
        button.textContent = timer.active ? 'Aktif' : 'Aktif Et';
    });
}
