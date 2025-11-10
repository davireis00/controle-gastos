async function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/usuario/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha }),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Sucesso!',
                text: 'Usuário cadastrado com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            limparCampos();
        } else {
            Swal.fire({
                title: 'Erro!',
                text: `Erro: ${result.error}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao tentar cadastrar o usuário. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
}
