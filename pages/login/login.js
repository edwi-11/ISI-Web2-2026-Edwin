const baseUrl = "https://localhost:7286/api";

async function handleLoginSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const login = Object.fromEntries(formData.entries());
    
    const endpoint = `${baseUrl}/authentication/login`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(login)
    });
    const data = await response.json();
    if (response.ok) {
        const tokenString = JSON.stringify(data);
        localStorage.setItem('token', tokenString);
        setTimeout(() => {
            window.location.href = window.location.origin + '/pages/admin/edwin/teams.html';
        }, 2000);
    } else {
        console.log('Login failed: ' + data.message);
    }
}