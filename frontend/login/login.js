async function loginUsuario(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value; 
    const senha = document.getElementById('password').value; 

    try {
        const response = await fetch('http://localhost:3000/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }), 
        });

        const result = await response.json(); 

        if (result.error) {
            Swal.fire({
                title: 'Erro!',
                text: `Erro: ${result.error}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } else {
            localStorage.setItem('userId', result.result.codigo); 

            Swal.fire({
                title: 'Sucesso!',
                text: 'Login realizado com sucesso!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000, 
            });

            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html'; 
            }, 2000); 
        }
    } catch (error) {
        Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao tentar realizar o login. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
}

document.getElementById('login-form').addEventListener('submit', loginUsuario);
