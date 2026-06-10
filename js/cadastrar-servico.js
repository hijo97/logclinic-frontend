/* ==========================================================================
   LÓGICA DE CAPTURA, SALVAMENTO E ATUALIZAÇÃO DE SERVIÇOS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async function() {

    const formCadastro = document.getElementById("form-cadastro-servico");

    // Verifica se existe um ID na URL (indica se é uma EDIÇÃO)
    const urlParams = new URLSearchParams(window.location.search);
    const servicoIdEdicao = urlParams.get("id");

    // Se for edição, busca os dados atuais do banco para preencher os campos da tela
    if (servicoIdEdicao) {
        await carregarDadosParaEdicao(servicoIdEdicao);
    }

    if (formCadastro) {
        formCadastro.addEventListener("submit", async function(e) {
            e.preventDefault();

            const nomeServico = document.getElementById("ser-nome").value.trim().toUpperCase();
            let valorServico = document.getElementById("ser-valor").value;
            
            // Trata a conversão de valores com vírgula para ponto decimal
            valorServico = parseFloat(valorServico.toString().replace(',', '.'));

            if (isNaN(valorServico)) {
                alert("Por favor, insira um valor numérico válido.");
                return;
            }

            const dadosServico = {
                nome: nomeServico,
                valor: valorServico
            };

            // Se tiver ID na URL, envia como UPDATE (PUT), senão envia como CADASTRO novo (POST)
if (servicoIdEdicao) {
    dadosServico.id = parseInt(servicoIdEdicao); // Garante que o ID do serviço vai no JSON
    await executarRequisicao('https://logclinic-backend.onrender.com/api/servicos/atualizar', 'PUT', dadosServico, "Serviço atualizado com sucesso!");
} else {
    await executarRequisicao('https://logclinic-backend.onrender.com/api/servicos/cadastrar', 'POST', dadosServico, "Serviço cadastrado com sucesso!");
}
        });
    }

    // Função auxiliar para preencher os inputs na hora de editar
    async function carregarDadosParaEdicao(id) {
        try {
            const reply = await fetch('https://logclinic-backend.onrender.com/api/servicos/listar');
            if (reply.ok) {
                const servicos = await reply.json();
                // Encontra o serviço específico na lista pelo ID
                const servico = servicos.find(s => s.id == id);
                
                if (servico) {
                    document.getElementById("ser-nome").value = servico.nome;
                    document.getElementById("ser-valor").value = servico.valor;
                    
                    // Altera o texto do botão para o usuário saber que está atualizando
                    const botaoSubmit = formCadastro.querySelector("button[type='submit']");
                    if (botaoSubmit) botaoSubmit.textContent = "Atualizar Serviço";
                }
            }
        } catch (erro) {
            console.error("Erro ao carregar dados para edição:", erro);
        }
    }

    // CORREÇÃO: Função unificada e com o nome idêntico ao chamado na linha 39 e 41
    async function executarRequisicao(url, metodo, dados, mensagemSucesso) {
        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (resposta.ok) {
                alert(mensagemSucesso);
                window.location.href = "servicos.html"; // Redireciona para a tabela
            } else {
                const erro = await resposta.text();
                alert("Erro na operação: " + erro);
            }
        } catch (erro) {
            console.error("Erro de rede:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    }
});