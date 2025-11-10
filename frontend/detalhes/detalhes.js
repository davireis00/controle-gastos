function carregarDetalhesObra(idObra) {
    fetch(`/obras/${idObra}`)
        .then(response => response.json())
        .then(obra => {
            document.getElementById('nome-obra').textContent = obra.nome;
            document.getElementById('endereco-obra').textContent = obra.endereco;
            document.getElementById('data-inicio').textContent = new Date(obra.dataInicio).toLocaleDateString();
            document.getElementById('data-termino').textContent = obra.dataTermino ? new Date(obra.dataTermino).toLocaleDateString() : 'Em andamento';
            document.getElementById('total-gasto').textContent = `R$ ${obra.totalGasto.toFixed(2)}`;
            document.getElementById('status-obra').textContent = obra.status;
        })
        .catch(error => console.error('Erro ao carregar os detalhes da obra:', error));
}

function carregarGastosObra(idObra) {
    fetch(`/gastos/obra/${idObra}`)
        .then(response => response.json())
        .then(gastos => {
            const tbody = document.querySelector('#tabela-gastos tbody');
            tbody.innerHTML = ''; 
            gastos.forEach(gasto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${gasto.descricao}</td>
                    <td>R$ ${gasto.valor.toFixed(2)}</td>
                    <td>${new Date(gasto.data).toLocaleDateString()}</td>
                    <td>${gasto.categoria}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao carregar os gastos da obra:', error));
}

function carregarGraficoGastos(idObra) {
    fetch(`/gastos/graficos?idObra=${idObra}`)
        .then(response => response.json())
        .then(dadosGrafico => {
            const ctx = document.getElementById('grafico-gastos').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dadosGrafico.labels,
                    datasets: [{
                        label: 'Gastos por Categoria',
                        data: dadosGrafico.valores,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Erro ao carregar gráfico de gastos:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const idObra = 43; 
    carregarDetalhesObra(idObra);
    carregarGastosObra(idObra);
    carregarGraficoGastos(idObra);
});
