document.addEventListener('DOMContentLoaded', function () {
    carregarUsuario();

    const togglePassword = document.getElementById('toggle-password');
    const senhaInput = document.getElementById('senha');

    if (togglePassword && senhaInput) {
        togglePassword.addEventListener('click', function () {
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text'; 
                togglePassword.textContent = 'visibility_off'; 
            } else {
                senhaInput.type = 'password'; 
                togglePassword.textContent = 'visibility'; 
            }
        });
    } else {
        console.error("Elementos de senha ou ícone não encontrados!");
    }
});

async function carregarUsuario() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        Swal.fire({ title: 'Erro!', text: 'ID do usuário não encontrado.', icon: 'error', confirmButtonText: 'OK' });
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.error) {
            Swal.fire({ title: 'Erro!', text: `Erro: ${result.error}`, icon: 'error', confirmButtonText: 'OK' });
        } else {
            document.getElementById('nome').value = result.result.nome || '';
            document.getElementById('email').value = result.result.email || '';
            document.getElementById('id_usuario').value = userId;

            if (result.result.senha) {
                document.getElementById('senha').value = result.result.senha; 
            } else {
                document.getElementById('senha').placeholder = '******'; 
            }
        }
    } catch (error) {
        Swal.fire({ title: 'Erro!', text: error.message || 'Ocorreu um erro ao tentar carregar os dados do usuário. Tente novamente.', icon: 'error', confirmButtonText: 'OK' });
    }
}

document.getElementById('senha').addEventListener('input', function () {
    if (this.value.length > 20) {
        this.value = this.value.slice(0, 20); 
    }
});
