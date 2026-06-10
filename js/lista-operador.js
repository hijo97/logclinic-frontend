/* ==========================================================================
   LÓGICA DE BUSCA E RENDERIZAÇÃO DA TABELA DE USUÁRIOS (LOG CLINIC)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {

    carregarOperador();

    async function carregarOperador() {
        const tabelaCorpo = document.getElementById("tabela-operador-corpo");

        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/operador/listar');

            if (resposta.ok) {
                const operador = await resposta.json();

                if (tabelaCorpo) {
                    tabelaCorpo.innerHTML = "";

                    if (operador.length === 0) {
                        tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum serviço cadastrado.</td></tr>`;
                        return;
                    }
                    // Percorre a lista do banco e injeta todas as colunas (inclusive as Ações)
                    operador.forEach(operador => {
                        const linha = document.createElement("tr");

                        linha.innerHTML = `
                            <td>${operador.cpf}</td>
                            <td><strong>${operador.nome}</strong></td>
                            <td>${operador.setor}</td>
                            <td>${operador.perfil}</td>
                            <td>
                                <button class="btn-mini-acao btn-mini-editar" title="Editar Serviço" onclick="prepararEdicao(${operador.id})">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn-mini-acao btn-mini-excluir" title="Excluir Usuário" onclick="excluirOperador(${operador.id})">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        `;

                        tabelaCorpo.appendChild(linha);
                    });
               }
            } else {
                console.error("Erro do servidor ao buscar a lista de Usuários.");
            }
        } catch (erro) {
            console.error("Erro de rede ao conectar com o backend:", erro);
            if (tabelaCorpo) {
                tabelaCorpo.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Erro ao carregar dados do servidor.</td></tr>`;
          }
        }
   }
   window.carregarOperador = carregarOperador; // Torna a função global para ser chamada após exclusão

    // === FUNÇÃO PARA BUSCAR OS DADOS DE UM USUÁRIO E COLOCAR NOS INPUTS ===
    async function carregarDadosOperador(id) {
         try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/operador/buscar/${id}`);
            if (resposta.ok) {
                const operador = await resposta.json();
                document.getElementById("usu-nome").value = operador.nome || '';
                document.getElementById("usu-cpf").value = operador.cpf || '';
                document.getElementById("usu-setor").value = operador.setor || '';
                document.getElementById("usu-login").value = operador.login || '';
                document.getElementById("usu-senha").value = operador.senha || '';
                document.getElementById("usu-perfil").value = operador.perfil || '';
            } else {
                alert("Erro ao carregar dados do operador.");
            }                                                           
        } catch (erro) {
            console.error("Erro ao buscar dados do operador:", erro);
        }
    }

    // === FUNÇÃO PARA TRAZER OS DADOS DO JAVA E PREENCHER OS CAMPOS ===
    async function carregarDadosOperadorParaEdicao(id) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/operador/buscar/${id}`);
            if (resposta.ok) {
                const operador = await resposta.json();
                document.getElementById("usu-nome").value = operador.nome || '';
                document.getElementById("usu-cpf").value = operador.cpf || '';
                document.getElementById("usu-setor").value = operador.setor || '';
                document.getElementById("usu-login").value = operador.login || '';
                document.getElementById("usu-senha").value = operador.senha || '';
                document.getElementById("usu-perfil").value = operador.perfil || '';
            } else {
                alert("Erro ao carregar dados do operador.");
            }
        } catch (erro) {
            console.error("Erro ao buscar dados do operador:", erro);
        }
    }

});

// === FUNÇÃO PARA EXCLUIR UM USUARIO ===
async function excluirOperador(id) {
    if (confirm("Deseja realmente excluir este serviço do catálogo?")) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/operador/excluir/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                alert("Operador excluído com sucesso!");
                if(typeof window.carregarOperador === "function") {
                    window.carregarOperador();
                } else {
                    location.reload(); 
            } 
        }else {
                alert("Erro ao excluir o usuário no banco de dados.");
            }
        } catch (erro) {
            console.error("Erro ao enviar requisição de exclusão:", erro);
        }
    }
}

function prepararEdicao(id) {
    // Correção: Removida a duplicidade. Vai direto para a tela de cadastro com o ID na URL
    window.location.href = `cadastro-operador.html?id=${id}`;
}


window.excluirOperador = excluirOperador;
window.prepararEdicao = prepararEdicao;