/* ==========================================================================
   LÓGICA DE CAPTURA,  CADASTRO E ATUALIZAÇÃO DE OPERADORES
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async function() {

   
    // 2. Verifica se veio algum ID de paciente na URL (Modo Edição)
    const urlParams = new URLSearchParams(window.location.search);
    const operadorIdEdicao = urlParams.get('id');

    if (operadorIdEdicao) {
        console.log("Modo Edição ativado para o Operador ID:", operadorIdEdicao);
        // Altera o título da página ou do botão se quiser dar um charme visual
        const botaoSalvar = document.querySelector("#form-cadastro-operador button[type='submit']");
        if (botaoSalvar) botaoSalvar.textContent = "Atualizar Operador";
        
        // Busca os dados do paciente e preenche o formulário
        await carregarDadosOperadorParaEdicao(operadorIdEdicao);
    }

    const formCadastro = document.getElementById("form-cadastro-operador");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async function(e) {
            e.preventDefault();

            const dadosOperador = {
                nome: document.getElementById("usu-nome").value.trim(),
                cpf: document.getElementById("usu-cpf").value.trim(),
                setor: document.getElementById("usu-setor").value.trim(),
                login: document.getElementById("usu-login").value.trim().ToLowerCase(),
                senha: document.getElementById("usu-senha").value.trim(),
                perfil: document.getElementById("usu-perfil").value.trim(),
            };

            // Se for edição, precisamos enviar o ID junto
            if (operadorIdEdicao) {
                dadosOperador.id = parseInt(operadorIdEdicao);
                await enviarAtualizacao(dadosOperador);
            } else {
                await enviarCadastro(dadosOperador);
            }
        });
    }

    // === FUNÇÃO PARA TRAZER OS DADOS DO JAVA E PREENCHER OS CAMPOS ===
    async function carregarDadosOperadorParaEdicao(id) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/operador/buscar/${id}`);
            if (resposta.ok) {
                const operador = await resposta.json();
                
                // Coloca os dados recebidos dentro de cada input do HTML
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

    // === FUNÇÃO PARA ENVIAR O OPERADOR COMPLETO PARA O BANCO ===
    async function enviarCadastro(operador) {
        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/operador/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(operador)
            });

            if (resposta.ok) {
                alert("Operador cadastrado com sucesso!");
            window.location.href = "usuario.html"; // Volta para a lista
            } else {
                const msgErro = await resposta.text();
                alert("Erro ao cadastrar: " + msgErro);
            }
        } catch (erro) {
            console.error("Erro ao conectar com o backend:", erro);
            alert("Não foi possível conectar ao servidor backend.");
        }
    }

    async function enviarAtualizacao(operador) {
    try {
        const resposta = await fetch('https://logclinic-backend.onrender.com/api/operador/atualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(operador)
        });

        if (resposta.ok) {
            alert("Operador atualizado com sucesso!");
            window.location.href = "usuario.html"; // Voltar para a listagem
        } else {
            const msgErro = await resposta.text();
            alert("Erro ao atualizar: " + msgErro);
        }
    } catch (erro) {
        console.error("Erro ao conectar com o backend:", erro);
    }
}

});// <--- ESTE É O FECHAMENTO DO DOMContentLoaded!