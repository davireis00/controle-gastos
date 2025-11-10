function carregarGraficosPorUsuario(userId) {
    fetch(`http://localhost:3000/usuario/${userId}/obras-gastos`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            if (data.error) {
                console.error(data.error);
                return;
            }

            const obraGraficosContainer = document.getElementById('obra-graficos');
            obraGraficosContainer.innerHTML = '';

            if (data.result.length === 0) {
                obraGraficosContainer.innerHTML = '<p>Não há obras ou gastos registrados.</p>';
                document.getElementById('total-valor').innerText = `R$ 0,00`; 
                return;
            }

            let totalGastos = 0;

            data.result.forEach((obra, index) => {
                const obraNome = obra.nome_obra ? obra.nome_obra : `Obra ${index + 1}`;
                const obraId = obraNome.toLowerCase().replace(/\s/g, '-');

                obraGraficosContainer.innerHTML += `
                    <div class="obra-section">
                        <h2>${obraNome}</h2>
                        <canvas id="grafico-${obraId}"></canvas>
                        <p id="total-${obraId}">Total: R$ 0</p>
                        <button data-obra-id="${obraId}" class="detalhes-btn">Detalhes</button> <!-- Botão de Detalhes -->
                    </div>
                `;

                const totalObra = obra.gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
                totalGastos += totalObra;

                document.getElementById(`total-${obraId}`).innerText = `Total: R$ ${totalObra.toFixed(2)}`;

                requestAnimationFrame(() => {
                    const ctx = document.getElementById(`grafico-${obraId}`).getContext('2d');

                    const meuGrafico = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: obra.gastos.map(gasto => gasto.descricao),
                            datasets: [{
                                data: obra.gastos.map(gasto => gasto.valor),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0']
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                tooltip: {
                                    enabled: true
                                }
                            }
                        }
                    });
                });
            });

            const botoesDetalhes = document.querySelectorAll('.detalhes-btn');
            botoesDetalhes.forEach(botao => {
                botao.addEventListener('click', (e) => {
                    const obraId = e.target.getAttribute('data-obra-id');

                    window.location.href = `../detalhes/detalhes.html?obraId=${obraId}`;
                });
            });
            

            document.getElementById('total-valor').innerText = `R$ ${totalGastos.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            document.getElementById('obra-graficos').innerHTML = '<p>Erro ao carregar os gráficos. Tente novamente mais tarde.</p>';
        });
}


function carregarUltimosGastos(userId) {
    fetch(`http://localhost:3000/gastos/ultimos/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const gastosTabelaBody = document.querySelector('#gastos-tabela tbody');
            gastosTabelaBody.innerHTML = '';

            if (data.result.length === 0) {
                gastosTabelaBody.innerHTML = '<tr><td colspan="4">Não há gastos registrados.</td></tr>'; // Adiciona colspan="4" porque haverá 4 colunas agora
                document.getElementById('total-valor').innerText = `R$ 0,00`;
                return;
            }

            let totalGastos = 0;

            data.result.forEach(gasto => {
                gastosTabelaBody.innerHTML += `
                    <tr>
                        <td>${gasto.descricao}</td>
                        <td>R$ ${gasto.valor.toFixed(2)}</td>
                        <td>${new Date(gasto.data).toLocaleDateString()}</td>
                        <td>${gasto.nome_obra ? gasto.nome_obra : 'Obra não informada'}</td> <!-- Exibe o nome da obra ou 'Obra não informada' -->
                    </tr>
                `;
                totalGastos += gasto.valor;
            });

            document.getElementById('total-valor').innerText = `R$ ${totalGastos.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Erro ao carregar últimos gastos:', error);
            const gastosTabelaBody = document.querySelector('#gastos-tabela tbody');
            gastosTabelaBody.innerHTML = '<tr><td colspan="4">Erro ao carregar os gastos. Tente novamente mais tarde.</td></tr>'; // Adiciona colspan="4" porque haverá 4 colunas
        });
}



document.addEventListener('DOMContentLoaded', () => {
    const id_usuario = localStorage.getItem('userId');
    if (id_usuario) {
        carregarGraficosPorUsuario(id_usuario);
        carregarUltimosGastos(id_usuario);
    } else {
        console.error('ID do usuário não encontrado no localStorage.');
    }
});
