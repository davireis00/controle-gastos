document.addEventListener('DOMContentLoaded', () => {
    let obras = [];

    async function fetchObras() {
        try {
            const response = await fetch('http://127.0.0.1:3000/obras');
            if (!response.ok) {
                throw new Error('Erro ao buscar obras');
            }
            const data = await response.json();
            obras = data.result; 
            console.log('Obras carregadas:', obras);
        } catch (error) {
            console.error('Erro ao buscar obras:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao buscar obras. Tente novamente mais tarde.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

   
    async function fetchGastos() {
        try {
            await fetchObras(); 

            const response = await fetch('http://127.0.0.1:3000/gastos');
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const data = await response.json();
            const gastos = data.result;

            const tbody = document.querySelector('#tabela-gastos tbody');
            tbody.innerHTML = '';
            gastos.forEach(gasto => {
                const row = createRow(gasto);
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao buscar gastos:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao buscar gastos. Tente novamente mais tarde.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
    
    function createRow(gasto) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', gasto.codigo);
        row.setAttribute('data-id-usuario', gasto.id_usuario);
        row.setAttribute('data-id-obra', gasto.id_obra);

        
        const obraCorrespondente = obras.find(obra => obra.codigo === gasto.id_obra);
        const obraNome = obraCorrespondente ? obraCorrespondente.nome_obra : 'Obra não informada';

        console.log(`ID da obra no gasto: ${gasto.id_obra}, Obra correspondente: ${obraNome}`); 

        row.innerHTML = `
            <td>
                <span>${gasto.descricao}</span>
                <input type="text" value="${gasto.descricao}" class="input-editar" style="display:none;">
            </td>
            <td>
                <span>${gasto.valor}</span>
                <input type="text" value="${gasto.valor}" class="input-editar" style="display:none;">
            </td>
            <td>
                <span>${formatarData(gasto.data)}</span>
                <input type="date" value="${gasto.data}" class="input-editar" style="display:none;">
            </td>
            <td>
                <span>${obraNome}</span>
                <select class="input-editar" style="display:none;">
                    ${obras.map(obra => `<option value="${obra.codigo}" ${obra.codigo === gasto.id_obra ? 'selected' : ''}>${obra.nome_obra}</option>`).join('')}
                </select>
            </td>
            <td class="acao-icones">
                <span class="material-icons" onclick="atualizarGasto(${gasto.codigo}, this)" style="color: #4CAF50; cursor: pointer;">edit</span>
                <span class="material-icons" onclick="deletarGasto(${gasto.codigo})" style="color: red; cursor: pointer;">delete</span>
                <span class="material-icons btn-salvar" onclick="salvarGasto(${gasto.codigo}, this)" style="display:none; color: #4CAF50; cursor: pointer;">save</span>
                <span class="material-icons btn-cancelar" onclick="cancelarEdicao(${gasto.codigo}, this)" style="display:none; color: red; cursor: pointer;">cancel</span>
            </td>
        `;
        return row;
    }

    
    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    
    function toggleEditMode(btn, isEditing) {
        const row = btn.closest('tr');
        const spans = row.querySelectorAll('span');
        const inputs = row.querySelectorAll('.input-editar');
        const btnAtualizar = row.querySelector('.material-icons[onclick*="atualizarGasto"]');
        const btnSalvar = row.querySelector('.btn-salvar');
        const btnCancelar = row.querySelector('.btn-cancelar');

        spans.forEach(span => span.style.display = isEditing ? 'none' : 'inline');
        inputs.forEach(input => input.style.display = isEditing ? 'inline' : 'none');
        btnAtualizar.style.display = isEditing ? 'none' : 'inline';
        btnSalvar.style.display = isEditing ? 'inline' : 'none';
        btnCancelar.style.display = isEditing ? 'inline' : 'none';
    }

    
    window.atualizarGasto = (id_gasto, btn) => {
        toggleEditMode(btn, true);
    };

    
    window.salvarGasto = async (id_gasto, btn) => {
        const row = btn.closest('tr');
        const descricao = row.querySelectorAll('input[type="text"]')[0].value.trim();
        const valor = row.querySelectorAll('input[type="text"]')[1].value.trim();
        const data = row.querySelector('input[type="date"]').value;
        const id_usuario = row.getAttribute('data-id-usuario');
        const id_obra = row.querySelector('select').value; 

        if (!descricao || !valor || !data || !id_usuario || !id_obra) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, preencha todos os campos obrigatórios.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        console.log('Dados enviados:', { id_gasto, descricao, valor, data, id_usuario, id_obra });

        try {
            const response = await fetch(`http://127.0.0.1:3000/gasto/${id_gasto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    descricao,
                    valor,
                    data,
                    id_usuario,
                    id_obra
                })
            });

            const responseData = await response.json();
            console.log('Resposta do servidor:', responseData);

            if (response.ok) {
                fetchGastos();
                Swal.fire({
                    title: 'Atualizado!',
                    text: 'O gasto foi atualizado com sucesso.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                throw new Error('Erro ao atualizar gasto: ' + responseData.error);
            }
        } catch (error) {
            console.error('Erro ao atualizar gasto:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao atualizar o gasto. Verifique os dados e tente novamente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    window.cancelarEdicao = (id_gasto, btn) => {
        toggleEditMode(btn, false);
    };

    window.deletarGasto = async (id_gasto) => {
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
                const response = await fetch(`http://127.0.0.1:3000/gasto/${id_gasto}`, { method: 'DELETE' });
                if (response.status === 204) {
                    fetchGastos();
                    Swal.fire({
                        title: 'Deletado!',
                        text: 'O gasto foi deletado com sucesso.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error('Erro ao deletar gasto');
                }
            } catch (error) {
                console.error('Erro ao deletar gasto:', error);
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao deletar o gasto. Tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };


    fetchGastos();
});
