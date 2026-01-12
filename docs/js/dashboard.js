// Dashboard логіка

// Перевірка аутентифікації при завантаженні
window.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) return;
    
    // Відображення імені користувача
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }
    
    // Показати панель адміністратора, якщо користувач - адмін
    if (user.isAdmin) {
        const adminCard = document.getElementById('admin-card');
        if (adminCard) {
            adminCard.style.display = 'block';
        }
    }
    
    // Завантаження статистики
    loadUserStats();
});

function loadUserStats() {
    const statsDiv = document.getElementById('user-stats');
    if (!statsDiv) return;
    
    const user = getCurrentUser();
    const testLogs = JSON.parse(localStorage.getItem('testLogs') || '[]');
    const userLogs = testLogs.filter(log => log.userId === user.id);
    
    if (userLogs.length === 0) {
        statsDiv.innerHTML = '<p>Ви ще не проходили жодних тестів.</p>';
        return;
    }
    
    // Підрахунок статистики
    const quizLogs = userLogs.filter(log => log.testName === 'quiz');
    const totalAttempts = quizLogs.length;
    const totalSuccesses = quizLogs.reduce((sum, log) => sum + log.successes, 0);
    const totalQuestions = quizLogs.reduce((sum, log) => sum + log.successes + log.fails, 0);
    const avgScore = totalQuestions > 0 ? ((totalSuccesses / totalQuestions) * 100).toFixed(1) : 0;
    
    statsDiv.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Всього спроб</h3>
                <p class="stat-value">${totalAttempts}</p>
            </div>
            <div class="stat-card">
                <h3>Правильних відповідей</h3>
                <p class="stat-value">${totalSuccesses} / ${totalQuestions}</p>
            </div>
            <div class="stat-card">
                <h3>Середній результат</h3>
                <p class="stat-value">${avgScore}%</p>
            </div>
        </div>
    `;
}
