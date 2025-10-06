document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('login-page');

    if (sessionStorage.getItem('loggedInUser')) {
        window.location.href = 'home.html';
    }

    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const errorDiv = document.getElementById('registerError');
        const successDiv = document.getElementById('registerSuccess');

        errorDiv.textContent = '';
        successDiv.textContent = '';

        if (password.length < 6) {
            errorDiv.textContent = 'A senha deve ter no mínimo 6 caracteres.';
            return;
        }

        const users = JSON.parse(localStorage.getItem('vehicle_app_users')) || [];

        if (users.find(user => user.email === email)) {
            errorDiv.textContent = 'Este email já está cadastrado.';
            return;
        }

        users.push({ email, password });
        localStorage.setItem('vehicle_app_users', JSON.stringify(users));

        successDiv.textContent = 'Conta criada com sucesso! Você pode fazer o login.';
        registerForm.reset();
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        errorDiv.textContent = '';

        const users = JSON.parse(localStorage.getItem('vehicle_app_users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            sessionStorage.setItem('loggedInUser', user.email);
            window.location.href = 'home.html';
        } else {
            errorDiv.textContent = 'Email ou senha inválidos.';
        }
    });
});