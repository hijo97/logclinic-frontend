/* ==========================================================================
   LÓGICA DE BUSCA E RENDERIZAÇÃO DA TABELA DE PACIENTES (LOG CLINIC)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {

    carregarPacientes();

    async function carregarPacientes() {
        const tabelaCorpo = document.getElementById("tabela-pacientes-corpo");

        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/pacientes/listar');

            if (resposta.ok) {
                const pacientes = await resposta.json();

                if (tabelaCorpo) {
                    tabelaCorpo.innerHTML = "";

                    if (pacientes.length === 0) {
                        tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum paciente cadastrado.</td></tr>`;
                        return;
                    }

                    pacientes.forEach(paciente => {
                        // Correção: Criando o elemento tr de forma única e limpa
                        const linha = document.createElement("tr");

                        // Monta as células batendo exatamente com as colunas do seu HTML
                        linha.innerHTML = `
                            <td>${paciente.id}</td>
                            <td><strong>${paciente.nome}</strong></td>
                            <td>${paciente.cpf}</td>
                            <td>${paciente.telefone || '-'}</td>
                            <td>
                                <button class="btn-mini-acao" title="Editar Paciente" onclick="prepararEdicao(${paciente.id})">
                                        <i class="fa-solid fa-pen"></i>
                                </button>
                                
                                <button class="btn-mini-acao btn-mini-excluir" title="Excluir Paciente" onclick="deletarPaciente(${paciente.id})">
                                        <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        `;

                        tabelaCorpo.appendChild(linha);
                    });
                }
            } else {
                console.error("Erro do servidor ao buscar lista.");
            }
        } catch (erro) {
            console.error("Erro de rede ao conectar com o backend:", erro);
            if (tabelaCorpo) {
                tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Erro ao carregar dados do servidor.</td></tr>`;
            }
        }
    }

    // Torna a função de carregar visível globalmente para que a exclusão consiga atualizar a tela
    window.carregarPacientes = carregarPacientes;
}); 

// ==========================================================
// FUNÇÕES DE AÇÃO (Do lado de fora do DOMContentLoaded)
// ==========================================================

async function deletarPaciente(id) {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/pacientes/excluir/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                alert("Paciente removido com sucesso!");
                // Chama a função global para atualizar a tabela sem dar F5
                if (typeof window.carregarPacientes === "function") {
                    window.carregarPacientes();
                } else {
                    location.reload(); 
                }
            } else {
                const erro = await resposta.text();
                alert("Erro ao remover: " + erro);
            }
        } catch (erro) {
            console.error("Erro na requisição de exclusão:", erro);
        }
    }
}

function prepararEdicao(id) {
    // Correção: Removida a duplicidade. Vai direto para a tela de cadastro com o ID na URL
    window.location.href = `cadastro-paciente.html?id=${id}`;
}

// Garante que o HTML consiga enxergar as funções nos eventos 'onclick'
window.deletarPaciente = deletarPaciente;
window.prepararEdicao = prepararEdicao;