let linhaAtual = null;

async function adicionarDespesa(event) {
    event.preventDefault();

    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const data = document.getElementById('data').value;
    const id_usuario = localStorage.getItem('userId'); 
    const id_obra = document.getElementById('id_obra').value;

    console.log('ID da obra selecionada:', id_obra);

    if (!id_obra) {
        Swal.fire({
            title: 'Erro!',
            text: 'Selecione uma obra válida.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/gasto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descricao, valor, data, id_usuario, id_obra }),
        });

        const result = await response.json();

        if (result.error) {
            Swal.fire({
                title: 'Erro!',
                text: `Erro: ${result.error}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Sucesso!',
                text: 'Gasto adicionado com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            
            limparCampos();
        }
    } catch (error) {
        console.error('Erro ao adicionar gasto:', error);
        Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao tentar adicionar o gasto. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

async function carregarObras() {
    try {
        const response = await fetch('http://localhost:3000/obras'); 
        if (!response.ok) {
            throw new Error('Erro ao buscar as obras: ' + response.statusText);
        }
        const obras = await response.json();
        popularObras(obras.result);
    } catch (error) {
        console.error('Erro ao carregar obras:', error);
        Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao carregar as obras. Tente novamente mais tarde.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function popularObras(obras) {
    const selectObra = document.getElementById('id_obra');
    selectObra.innerHTML = '<option value="">Selecione uma obra</option>'; 

    obras.forEach(obra => {
        const option = document.createElement('option');
        option.value = obra.codigo; 
        option.textContent = obra.nome_obra; 
        selectObra.appendChild(option);
    });
}

function limparCampos() {
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('data').value = '';
    document.getElementById('id_obra').value = ''; 

    const atualizarButton = document.querySelector('button[type="submit"]');
    atualizarButton.innerText = 'Cadastrar Despesa';
    atualizarButton.onclick = adicionarDespesa;
}

window.onload = function() {
    carregarObras(); 
};
