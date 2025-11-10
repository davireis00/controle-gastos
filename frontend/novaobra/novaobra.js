document.getElementById('form-obra').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const localizacao = document.getElementById('localizacao').value;
    const data_inicio = document.getElementById('data_inicio').value;
    const data_fim = document.getElementById('data_fim').value;

    try {
        const response = await fetch('http://localhost:3000/obra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, localizacao, data_inicio, data_fim })
        });

        if (response.ok) {
            Swal.fire({
                title: 'Sucesso!',
                text: 'Obra cadastrada com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            document.getElementById('form-obra').reset();
        } else {
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível cadastrar a obra. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao cadastrar a obra. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
