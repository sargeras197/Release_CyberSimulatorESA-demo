// Система автентифікації через LocalStorage

// Ініціалізація користувачів (якщо немає)
function initUsers() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: hashPassword('CyberAdmin#2026!SecurePass'),
                isAdmin: true,
                registrationDate: new Date().toISOString()
            },
            {
                id: 2,
                username: 'user',
                password: hashPassword('user123'),
                isAdmin: false,
                registrationDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

// Проста хеш-функція (для демонстрації)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Отримання всіх користувачів
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Збереження користувачів
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Отримання поточного користувача
function getCurrentUser() {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return null;
    
    const users = getUsers();
    return users.find(u => u.id === parseInt(userId));
}

// Вхід
function login(username, password) {
    const users = getUsers();
    const user = users.find(u => 
        u.username === username && 
        u.password === hashPassword(password)
    );
    
    if (user) {
        localStorage.setItem('currentUserId', user.id);
        return { success: true, user: user };
    }
    
    return { success: false, message: 'Невірне ім\'я користувача або пароль' };
}

// Реєстрація
function register(username, password) {
    const users = getUsers();
    
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Користувач з таким ім\'ям вже існує' };
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: username,
        password: hashPassword(password),
        isAdmin: false,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Реєстрація успішна' };
}

// Вихід
function logout() {
    localStorage.removeItem('currentUserId');
    window.location.href = 'login.html';
}

// Перевірка аутентифікації
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// Ініціалізація
initUsers();

// Обробники форм
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');
        
        const result = login(username, password);
        
        if (result.success) {
            if (result.user.isAdmin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            errorDiv.textContent = result.message;
            errorDiv.classList.add('show');
        }
    });
}

if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('error-message');
        
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Паролі не співпадають';
            errorDiv.classList.add('show');
            return;
        }
        
        if (password.length < 4) {
            errorDiv.textContent = 'Пароль має бути не менше 4 символів';
            errorDiv.classList.add('show');
            return;
        }
        
        const result = register(username, password);
        
        if (result.success) {
            alert(result.message + '. Тепер ви можете увійти.');
            window.location.href = 'login.html';
        } else {
            errorDiv.textContent = result.message;
            errorDiv.classList.add('show');
        }
    });
}
