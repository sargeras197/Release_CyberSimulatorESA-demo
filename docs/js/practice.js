// Практичні завдання

// Список популярних (небезпечних) паролів
const POPULAR_PASSWORDS = [
    '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890',
    'qwerty', 'abc123', '111111', '123123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234', 'password123', 'qwerty123', '000000', 'Password1', 'password1'
];

// Приклади листів для тесту на фішинг
const PHISHING_EXAMPLES = [
    {
        subject: "Термінове оновлення безпеки вашого акаунта",
        from: "security@paypa1.com",
        text: "Ваш акаунт буде заблоковано через 24 години. Клікніть тут для підтвердження.",
        isPhishing: true
    },
    {
        subject: "Звіт про продажі за місяць",
        from: "anna.koval@company.com",
        text: "Доброго дня! Надсилаю звіт про продажі за минулий місяць.",
        isPhishing: false
    },
    {
        subject: "Вітаємо! Ви виграли iPhone 15!",
        from: "prize@lоttery.com",
        text: "Ви стали переможцем лотереї! Введіть свої дані для отримання призу.",
        isPhishing: true
    },
    {
        subject: "Нагадування про зустріч",
        from: "ivan.petrov@company.com",
        text: "Нагадую про нашу зустріч завтра о 14:00.",
        isPhishing: false
    }
];

window.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) return;
    
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }
    
    displayPhishingExamples();
});

function checkPassword() {
    const password = document.getElementById('password-test').value;
    const resultDiv = document.getElementById('password-result');
    
    if (!password) {
        resultDiv.innerHTML = '<p style="color: #dc3545;">Будь ласка, введіть пароль.</p>';
        return;
    }
    
    const isWeak = POPULAR_PASSWORDS.includes(password.toLowerCase());
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let strength = 0;
    if (hasLength) strength++;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    
    let message = '';
    let color = '';
    
    if (isWeak) {
        message = '❌ <strong>Небезпечно!</strong> Цей пароль є в списку найпопулярніших паролів. Хакери перевірять його першим.';
        color = '#dc3545';
    } else if (strength < 3) {
        message = '⚠️ <strong>Слабкий пароль.</strong> Додайте більше різних типів символів.';
        color = '#ffc107';
    } else if (strength < 5) {
        message = '✓ <strong>Середній пароль.</strong> Можна покращити додавши спеціальні символи.';
        color = '#17a2b8';
    } else {
        message = '✅ <strong>Сильний пароль!</strong> Ваш пароль має хороший рівень захисту.';
        color = '#28a745';
    }
    
    resultDiv.innerHTML = `<p style="color: ${color};">${message}</p>`;
}

function displayPhishingExamples() {
    const container = document.getElementById('phishing-examples');
    
    PHISHING_EXAMPLES.forEach((email, index) => {
        const emailDiv = document.createElement('div');
        emailDiv.style.cssText = 'border: 2px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: #f8f9fa;';
        
        emailDiv.innerHTML = `
            <p><strong>Від:</strong> ${email.from}</p>
            <p><strong>Тема:</strong> ${email.subject}</p>
            <p><strong>Текст:</strong> ${email.text}</p>
            <label style="cursor: pointer; margin-top: 10px; display: block;">
                <input type="checkbox" name="phishing${index}" value="${email.isPhishing}"> 
                Це фішинговий лист
            </label>
        `;
        
        container.appendChild(emailDiv);
    });
}

function checkPhishingAnswers() {
    let correct = 0;
    let total = PHISHING_EXAMPLES.length;
    
    PHISHING_EXAMPLES.forEach((email, index) => {
        const checkbox = document.querySelector(`input[name="phishing${index}"]`);
        const isChecked = checkbox.checked;
        const shouldBeChecked = email.isPhishing;
        
        if (isChecked === shouldBeChecked) {
            correct++;
        }
    });
    
    const resultDiv = document.getElementById('phishing-result');
    const percentage = ((correct / total) * 100).toFixed(0);
    
    let message = '';
    let color = '';
    
    if (correct === total) {
        message = `✅ Відмінно! Ви правильно визначили всі ${total} листів!`;
        color = '#28a745';
    } else if (correct >= total / 2) {
        message = `✓ Добре! Правильних відповідей: ${correct} з ${total} (${percentage}%)`;
        color = '#17a2b8';
    } else {
        message = `⚠️ Потрібно більше практики. Правильних відповідей: ${correct} з ${total} (${percentage}%)`;
        color = '#ffc107';
    }
    
    resultDiv.innerHTML = `<p style="color: ${color}; font-weight: bold;">${message}</p>`;
}

function checkPractices() {
    const checkboxes = document.querySelectorAll('input[name="practice"]');
    let correct = 0;
    let total = 0;
    let allCorrect = true;
    
    checkboxes.forEach(checkbox => {
        total++;
        const isCorrectOption = checkbox.value === 'correct';
        const isChecked = checkbox.checked;
        
        if (isCorrectOption && isChecked) {
            correct++;
        } else if (isCorrectOption && !isChecked) {
            allCorrect = false;
        } else if (!isCorrectOption && isChecked) {
            allCorrect = false;
        } else if (!isCorrectOption && !isChecked) {
            correct++;
        }
    });
    
    const resultDiv = document.getElementById('practices-result');
    const percentage = ((correct / total) * 100).toFixed(0);
    
    let message = '';
    let color = '';
    
    if (allCorrect) {
        message = '✅ Відмінно! Ви знаєте всі безпечні практики!';
        color = '#28a745';
    } else if (correct >= total * 0.7) {
        message = `✓ Добре! Правильність: ${percentage}%. Перегляньте теорію для покращення.`;
        color = '#17a2b8';
    } else {
        message = `⚠️ Потрібно краще вивчити теорію. Правильність: ${percentage}%`;
        color = '#ffc107';
    }
    
    resultDiv.innerHTML = `<p style="color: ${color}; font-weight: bold;">${message}</p>`;
}
