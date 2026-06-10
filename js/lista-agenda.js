/* ==========================================================================
   LÓGICA DE EXIBIÇÃO DA AGENDA DE CONSULTAS - LOG CLINIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {

    // 1. Define a data de hoje no campo de filtro como padrão ao abrir a tela
    const filtroData = document.getElementById("filtro-data-agenda");
    if (filtroData) {
        const hoje = new Date().toISOString().split('T')[0];
        filtroData.value = hoje;
    }

    // 2. Carrega a lista de consultas vinda do banco de dados
    carregarConsultas();

    async function carregarConsultas() {
        const tabelaCorpo = document.getElementById("tabela-agenda-corpo");
        if (!tabelaCorpo) return;

        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/consultas/listar');

            if (resposta.ok) {
                const consultas = await resposta.json();
                
                // Limpa a linha estática de exemplo do HTML antes de renderizar
                tabelaCorpo.innerHTML = "";

                if (consultas.length === 0) {
                    tabelaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhuma consulta agendada no sistema.</td></tr>`;
                    return;
                }

                // Percorre as consultas do banco e joga na tabela
                consultas.forEach(consulta => {
                    const tr = document.createElement("tr");

                    // Proteção contra valores nulos ou indefinidos na data/hora
                    let dataFormatada = "Não Informada";
                    if (consulta.data_consulta) {
                        dataFormatada = consulta.data_consulta.split('-').reverse().join('/');
                    }

                    let horaFormatada = "00:00";
                    if (consulta.hora_consulta) {
                        horaFormatada = consulta.hora_consulta.substring(0, 5);
                    }

                    // Exibe o ID do serviço caso o nome completo não venha no JOIN
                    const servicoExibicao = consulta.servico_nome || (consulta.servicos_id ? `Serviço #${consulta.servicos_id}` : 'Não Informado');

                    tr.innerHTML = `
                        <td><strong>${dataFormatada} - ${horaFormatada}</strong></td>
                        <td>${consulta.paciente_nome || 'Paciente Não Identificado'}</td>
                        <td>${servicoExibicao}</td>
                        <td style="text-align: right;">
                            <button class="btn-mini-acao btn-mini-excluir" title="Desmarcar Consulta" onclick="desmarcarConsulta(${consulta.id})">
                                <i class="fa-solid fa-calendar-xmark"></i>
                            </button>
                        </td>
                    `;

                    tabelaCorpo.appendChild(tr);
                });
            } else {
                console.error("Erro do servidor ao carregar a lista de consultas.");
            }
        } catch (erro) {
            console.error("Erro de rede ao conectar com o backend da agenda:", erro);
            tabelaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Erro ao carregar agenda do servidor.</td></tr>`;
        }
    }

    // Torna a função global para que o botão de desmarcar possa atualizar a lista
    window.carregarConsultas = carregarConsultas;
});

// === FUNÇÃO PARA REMOVER/DESMARCAR UMA CONSULTA ===
async function desmarcarConsulta(id) {
    if (confirm("Deseja realmente desmarcar esta consulta da agenda?")) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/consultas/desmarcar/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                alert("Consulta desmarcada com sucesso!");
                if (typeof window.carregarConsultas === "function") {
                    window.carregarConsultas();
                } else {
                    location.reload();
                }
            } else {
                alert("Erro ao desmarcar consulta no banco de dados.");
            }
        } catch (erro) {
            console.error("Erro ao enviar requisição de exclusão de consulta:", erro);
        }
    }
}

// Vincula a função ao objeto window corretamente fora do escopo do DOMContentLoaded
window.desmarcarConsulta = desmarcarConsulta;