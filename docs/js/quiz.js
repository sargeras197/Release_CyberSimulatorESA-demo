// Логіка квізу
let startTime;

window.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) return;
    
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }
    
    // Відображення питань
    displayQuestions();
    
    // Початок відліку часу
    startTime = Date.now();
    
    // Обробка форми
    document.getElementById('quizForm').addEventListener('submit', handleSubmit);
});

function displayQuestions() {
    const container = document.getElementById('questions-container');
    
    QUIZ_QUESTIONS.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionTitle);
        
        const optionsList = document.createElement('ul');
        optionsList.className = 'options';
        
        q.options.forEach((option, optIndex) => {
            const li = document.createElement('li');
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q${index}`;
            radio.value = optIndex;
            radio.id = `q${index}_${optIndex}`;
            
            const label = document.createElement('label');
            label.htmlFor = `q${index}_${optIndex}`;
            label.textContent = option;
            label.style.cursor = 'pointer';
            
            li.appendChild(radio);
            li.appendChild(label);
            optionsList.appendChild(li);
            
            // Дозволити вибір при кліку на весь елемент
            li.addEventListener('click', function() {
                radio.checked = true;
            });
        });
        
        questionDiv.appendChild(optionsList);
        container.appendChild(questionDiv);
    });
}

function handleSubmit(e) {
    e.preventDefault();
    
    let score = 0;
    let answered = 0;
    
    QUIZ_QUESTIONS.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected) {
            answered++;
            if (parseInt(selected.value) === q.answer) {
                score++;
            }
        }
    });
    
    if (answered < QUIZ_QUESTIONS.length) {
        alert(`Ви відповіли тільки на ${answered} з ${QUIZ_QUESTIONS.length} питань. Будь ласка, дайте відповідь на всі питання.`);
        return;
    }
    
    const timeSpent = (Date.now() - startTime) / 1000; // в секундах
    const minutes = Math.floor(timeSpent / 60);
    const seconds = Math.floor(timeSpent % 60);
    
    // Збереження результату
    saveTestLog(score, QUIZ_QUESTIONS.length - score, timeSpent);
    
    // Відображення результату
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    const percentage = ((score / QUIZ_QUESTIONS.length) * 100).toFixed(1);
    document.getElementById('score-display').textContent = 
        `Ваш результат: ${score} з ${QUIZ_QUESTIONS.length} (${percentage}%)`;
    document.getElementById('time-display').textContent = 
        `Витрачено часу: ${minutes} хв ${seconds} сек`;
}

function saveTestLog(successes, fails, timeSpent) {
    const user = getCurrentUser();
    const testLogs = JSON.parse(localStorage.getItem('testLogs') || '[]');
    
    testLogs.push({
        id: testLogs.length + 1,
        userId: user.id,
        testName: 'quiz',
        timestamp: new Date().toISOString(),
        attempts: 1,
        successes: successes,
        fails: fails,
        timeSpent: timeSpent
    });
    
    localStorage.setItem('testLogs', JSON.stringify(testLogs));
}
