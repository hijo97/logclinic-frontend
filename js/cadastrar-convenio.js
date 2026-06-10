/* ==========================================================================
   LÓGICA DE CAPTURA E SALVAMENTO DE CONVÊNIOS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async function() {
    console.log("O SCRIPT DO CONVÊNIO FOI CARREGADO COM SUCESSO!");

    const formCadastro = document.getElementById("form-cadastro-convenio");

    // Tenta pegar o ID do convênio na URL caso seja uma EDIÇÃO
    const urlParams = new URLSearchParams(window.location.search);
    const convenioIdEdicao = urlParams.get("id");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async function(e) {
            e.preventDefault();

            // Monta os dados do Convênio com o que foi digitado
            const dadosConvenio = {
                nome: document.getElementById("con-nome").value.trim(),
                cobertura: document.getElementById("con-cobertura").value.trim()
            };

            // Se for EDIÇÃO, precisamos enviar o ID junto
            if (convenioIdEdicao) {
                dadosConvenio.id = parseInt(convenioIdEdicao);
                await enviarAtualizacao(dadosConvenio);
            } else {
                // Se não tiver ID na URL, é um CADASTRO novo
                await enviarCadastro(dadosConvenio);
            }
        });
    }
}); // <-- ESTE É O FECHAMENTO DO DOMContentLoaded!


// ==========================================================
// FUNÇÕES DE REQUISIÇÃO (FETCH) PARA O BACKEND
// ==========================================================

async function enviarCadastro(dados) {
    try {
        const resposta = await fetch('https://logclinic-backend.onrender.com/api/convenios/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Convênio cadastrado com sucesso!");
            window.location.href = "convenios.html"; // Volta para a lista
        } else {
            const erro = await resposta.text();
            alert("Erro ao cadastrar: " + erro);
        }
    } catch (erro) {
        console.error("Erro de rede:", erro);
        alert("Não foi possível conectar ao servidor backend.");
    }
}

async function enviarAtualizacao(dados) {
    try {
        const resposta = await fetch('https://logclinic-backend.onrender.com/api/convenios/atualizar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Convênio atualizado com sucesso!");
            window.location.href = "convenios.html";
        } else {
            const erro = await resposta.text();
            alert("Erro ao atualizar: " + erro);
        }
    } catch (erro) {
        console.error("Erro de rede:", erro);
        alert("Não foi possível conectar ao servidor backend.");
    }
}