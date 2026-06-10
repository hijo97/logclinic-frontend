/* ==========================================================================
   LÓGICA DE BUSCA E RENDERIZAÇÃO DA TABELA DE SERVIÇOS (LOG CLINIC)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {

    carregarServicos();

    async function carregarServicos() {
        const tabelaCorpo = document.getElementById("tabela-servicos-corpo");

        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/servicos/listar');

            if (resposta.ok) {
                const servicos = await resposta.json();

                if (tabelaCorpo) {
                    tabelaCorpo.innerHTML = "";

                    if (servicos.length === 0) {
                        tabelaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum serviço cadastrado.</td></tr>`;
                        return;
                    }

                    // Percorre a lista do banco e injeta todas as colunas (inclusive as Ações)
                    servicos.forEach(servico => {
                        const linha = document.createElement("tr");

                        const valorFormatado = servico.valor.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        });

                        linha.innerHTML = `
                            <td>${servico.id}</td>
                            <td><strong>${servico.nome}</strong></td>
                            <td>${valorFormatado}</td>
                            <td style="text-align: right;">
                                <button class="btn-mini-acao btn-mini-editar" title="Editar Serviço" onclick="location.href='cadastro-servico.html?id=${servico.id}'">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn-mini-acao btn-mini-excluir" title="Excluir Serviço" onclick="excluirServico(${servico.id})">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        `;

                        tabelaCorpo.appendChild(linha);
                    });
                }
            } else {
                console.error("Erro do servidor ao buscar a lista de serviços.");
            }
        } catch (erro) {
            console.error("Erro de rede ao conectar com o backend:", erro);
            if (tabelaCorpo) {
                tabelaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Erro ao carregar dados do servidor.</td></tr>`;
            }
        }
    }
});

// === FUNÇÃO PARA EXCLUIR UM SERVIÇO ===
async function excluirServico(id) {
    if (confirm("Deseja realmente excluir este serviço do catálogo?")) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/servicos/excluir/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                alert("Serviço excluído com sucesso!");
                if(typeof window.carregarServicos === "function") {
                    window.carregarServicos();
                } else {
                    location.reload(); 
            } 
        }else {
                alert("Erro ao excluir o serviço no banco de dados.");
            }
        } catch (erro) {
            console.error("Erro ao enviar requisição de exclusão:", erro);
        }
    }
}

function prepararEdicao(id) {
    // Correção: Removida a duplicidade. Vai direto para a tela de cadastro com o ID na URL
    window.location.href = `cadastrar-servico.html?id=${id}`;
}


window.excluirServico = excluirServico;
window.prepararEdicao = prepararEdicao;