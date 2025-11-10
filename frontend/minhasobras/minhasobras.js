document.addEventListener('DOMContentLoaded', () => {
    fetchObras();

    async function fetchObras() {
        try {
            const response = await fetch('http://127.0.0.1:3000/obras');
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const data = await response.json();
            const obras = data.result;

            const tbody = document.querySelector('#tabela-obras tbody');
            tbody.innerHTML = '';  
            obras.forEach(obra => {  
                const row = createRow(obra);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao buscar obras:', error);
            showAlert('Erro!', 'Erro ao buscar obras. Tente novamente mais tarde.', 'error');
        }
    }

    function createRow(obra) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', obra.codigo);
        row.innerHTML = `
            <td><span>${obra.nome_obra}</span><input type="text" value="${obra.nome_obra}" class="input-editar" style="display:none;"></td>
            <td><span>${obra.endereco}</span><input type="text" value="${obra.endereco}" class="input-editar" style="display:none;"></td>
            <td><span>${formatarData(obra.data_inicio)}</span><input type="date" value="${obra.data_inicio}" class="input-editar" style="display:none;"></td>
            <td><span>${formatarData(obra.data_fim)}</span><input type="date" value="${obra.data_fim}" class="input-editar" style="display:none;"></td>
            <td class="acao-icones">
                <span class="material-icons" onclick="atualizarObra(${obra.codigo}, this)" style="color: #4CAF50; cursor: pointer;">edit</span>
                <span class="material-icons" onclick="deletarObra(${obra.codigo})" style="color: red; cursor: pointer;">delete</span>
                <span class="material-icons btn-salvar" onclick="salvarObra(${obra.codigo}, this)" style="display:none; color: #4CAF50; cursor: pointer;">save</span>
                <span class="material-icons btn-cancelar" onclick="cancelarEdicao(${obra.codigo}, this)" style="display:none; color: red; cursor: pointer;">cancel</span>
            </td>
        `;
        return row;
    }

    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;  
    }

    window.atualizarObra = (id_obra, btn) => {
        toggleEditMode(btn, true);
    };

    window.salvarObra = async (id_obra, btn) => {
        const row = btn.closest('tr');
        const nome_obra = row.querySelector('input[type="text"]').value.trim();
        const endereco = row.querySelectorAll('input[type="text"]')[1].value.trim();
        const data_inicio = row.querySelector('input[type="date"]').value;
        const data_fim = row.querySelectorAll('input[type="date"]')[1].value;

        if (!nome_obra || !endereco || !data_inicio || !data_fim) {
            showAlert('Erro!', 'Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (new Date(data_inicio) > new Date(data_fim)) {
            showAlert('Erro!', 'A data de início não pode ser posterior à data de fim.', 'error');
            return;
        }

        console.log('Dados enviados:', { id_obra, nome_obra, endereco, data_inicio, data_fim });

        try {
            const response = await fetch(`http://127.0.0.1:3000/obra/${id_obra}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome_obra,  
                    localizacao: endereco, 
                    data_inicio: data_inicio,
                    data_fim: data_fim
                })
            });

            const responseData = await response.json();
            console.log('Resposta do servidor:', responseData);

            if (response.ok) {
                fetchObras();
                showAlert('Atualizado!', 'A obra foi atualizada com sucesso.', 'success');
            } else {
                throw new Error('Erro ao atualizar obra: ' + responseData.error);
            }
        } catch (error) {
            console.error('Erro ao atualizar obra:', error);
            showAlert('Erro!', 'Erro ao atualizar a obra. Verifique os dados e tente novamente.', 'error');
        }
    };

    window.cancelarEdicao = (id_obra, btn) => {
        toggleEditMode(btn, false);
    };

    function toggleEditMode(btn, isEditing) {
        const row = btn.closest('tr');
        const spans = row.querySelectorAll('span');
        const inputs = row.querySelectorAll('.input-editar');
        const btnAtualizar = row.querySelector('.material-icons[onclick*="atualizarObra"]');
        const btnSalvar = row.querySelector('.btn-salvar');
        const btnCancelar = row.querySelector('.btn-cancelar');

        spans.forEach(span => span.style.display = isEditing ? 'none' : 'inline');
        inputs.forEach(input => input.style.display = isEditing ? 'inline' : 'none');
        btnAtualizar.style.display = isEditing ? 'none' : 'inline';
        btnSalvar.style.display = isEditing ? 'inline' : 'none';
        btnCancelar.style.display = isEditing ? 'inline' : 'none';
    }

    window.deletarObra = async (id_obra) => {
        const result = await Swal.fire({
            title: 'Você tem certeza?',
            text: 'Isso não pode ser desfeito!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://127.0.0.1:3000/obra/${id_obra}`, { method: 'DELETE' });
                if (response.status === 204) {
                    fetchObras();
                    showAlert('Deletado!', 'A obra foi deletada com sucesso.', 'success');
                } else {
                    throw new Error('Erro ao deletar obra: ' + response.statusText);
                }
            } catch (error) {
                console.error('Erro ao deletar obra:', error);
                showAlert('Erro!', 'Erro ao deletar obra. Tente novamente.', 'error');
            }
        }
    };

    function showAlert(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK'
        });
    }
});
