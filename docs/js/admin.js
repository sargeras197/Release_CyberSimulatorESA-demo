// Адміністративна панель

window.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) return;
    
    // Перевірка прав адміністратора
    if (!user.isAdmin) {
        alert('У вас немає прав доступу до цієї сторінки');
        window.location.href = 'dashboard.html';
        return;
    }
    
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }
    
    loadUsers();
    loadTestStats();
    
    // Обробка форми додавання користувача
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
});

function loadUsers() {
    const users = getUsers();
    const tbody = document.getElementById('users-table');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        
        const registrationDate = new Date(user.registrationDate).toLocaleDateString('uk-UA');
        const role = user.isAdmin ? '👑 Адміністратор' : '👤 Користувач';
        
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${registrationDate}</td>
            <td>${role}</td>
            <td>
                ${user.id === getCurrentUser().id ? 
                    '<span style="color: #666;">Це ви</span>' : 
                    `<button onclick="deleteUser(${user.id})" class="btn btn-small" style="background: #dc3545;">Видалити</button>`
                }
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function handleAddUser(e) {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const isAdmin = document.getElementById('isAdmin').checked;
    const messageDiv = document.getElementById('add-message');
    
    const users = getUsers();
    
    if (users.find(u => u.username === username)) {
        messageDiv.innerHTML = '<p class="error-message show">Користувач з таким ім\'ям вже існує</p>';
        return;
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: username,
        password: hashPassword(password),
        isAdmin: isAdmin,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    messageDiv.innerHTML = '<p class="success-message">Користувача успішно додано!</p>';
    
    // Очистити форму
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('isAdmin').checked = false;
    
    // Оновити таблицю
    loadUsers();
    
    // Приховати повідомлення через 3 секунди
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
}

function deleteUser(userId) {
    if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) {
        return;
    }
    
    let users = getUsers();
    users = users.filter(u => u.id !== userId);
    saveUsers(users);
    
    // Видалити також логи тестів цього користувача
    let testLogs = JSON.parse(localStorage.getItem('testLogs') || '[]');
    testLogs = testLogs.filter(log => log.userId !== userId);
    localStorage.setItem('testLogs', JSON.stringify(testLogs));
    
    loadUsers();
    loadTestStats();
    
    alert('Користувача видалено');
}

function loadTestStats() {
    const statsDiv = document.getElementById('test-stats');
    const testLogs = JSON.parse(localStorage.getItem('testLogs') || '[]');
    const users = getUsers();
    
    if (testLogs.length === 0) {
        statsDiv.innerHTML = '<p>Немає даних про проходження тестів.</p>';
        return;
    }
    
    // Групування логів по користувачах
    const userStats = {};
    
    testLogs.forEach(log => {
        if (!userStats[log.userId]) {
            const user = users.find(u => u.id === log.userId);
            userStats[log.userId] = {
                username: user ? user.username : 'Видалений користувач',
                attempts: 0,
                totalSuccesses: 0,
                totalQuestions: 0
            };
        }
        
        userStats[log.userId].attempts++;
        userStats[log.userId].totalSuccesses += log.successes;
        userStats[log.userId].totalQuestions += (log.successes + log.fails);
    });
    
    let tableHTML = `
        <table class="admin-table" style="margin-top: 20px;">
            <thead>
                <tr>
                    <th>Користувач</th>
                    <th>Спроб</th>
                    <th>Правильних відповідей</th>
                    <th>Середній результат</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.values(userStats).forEach(stat => {
        const avgScore = stat.totalQuestions > 0 
            ? ((stat.totalSuccesses / stat.totalQuestions) * 100).toFixed(1) 
            : 0;
        
        tableHTML += `
            <tr>
                <td>${stat.username}</td>
                <td>${stat.attempts}</td>
                <td>${stat.totalSuccesses} / ${stat.totalQuestions}</td>
                <td>${avgScore}%</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    statsDiv.innerHTML = tableHTML;
}
