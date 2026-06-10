/* ==========================================================================
   LÓGICA DE CAPTURA, CARREGAMENTO DE CONVÊNIOS E SALVAMENTO DE PACIENTES
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async function() {

    // 1. Carrega os convênios primeiro
    await carregarSelectConvenios();

    // 2. Verifica se veio algum ID de paciente na URL (Modo Edição)
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteIdEdicao = urlParams.get('id');

    if (pacienteIdEdicao) {
        console.log("Modo Edição ativado para o Paciente ID:", pacienteIdEdicao);
        // Altera o título da página ou do botão se quiser dar um charme visual
        const botaoSalvar = document.querySelector("#form-cadastro-paciente button[type='submit']");
        if (botaoSalvar) botaoSalvar.textContent = "Atualizar Paciente";
        
        // Busca os dados do paciente e preenche o formulário
        await carregarDadosPacienteParaEdicao(pacienteIdEdicao);
    }

    const formCadastro = document.getElementById("form-cadastro-paciente");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async function(e) {
            e.preventDefault();

            const dadosPaciente = {
                nome: document.getElementById("cad-nome").value.trim(),
                dataNascimento: document.getElementById("cad-data-nascimento").value.trim(),
                genero: document.getElementById("cad-genero").value, 
                cpf: document.getElementById("cad-cpf").value.trim(),
                telefone: document.getElementById("cad-telefone").value.trim(),
                email: document.getElementById("cad-email").value.trim(),
                empresa: document.getElementById("cad-empresa").value.trim(),
                logradouro: document.getElementById("cad-logradouro").value.trim(),
                bairro: document.getElementById("cad-bairro").value.trim(),
                cidade: document.getElementById("cad-cidade").value.trim(), 
                numero: document.getElementById("cad-numero").value.trim(),
                complemento: document.getElementById("cad-complemento").value.trim(),
                cep: document.getElementById("cad-cep").value.trim(),
                uf: document.getElementById("cad-uf").value.trim(),         
                convenioId: parseInt(document.getElementById("cad-convenio").value) || 0
            };

            // Se for edição, precisamos enviar o ID junto
            if (pacienteIdEdicao) {
                dadosPaciente.id = parseInt(pacienteIdEdicao);
                await enviarAtualizacao(dadosPaciente);
            } else {
                await enviarCadastro(dadosPaciente);
            }
        });
    }

    // === FUNÇÃO PARA TRAZER OS DADOS DO JAVA E PREENCHER OS CAMPOS ===
    async function carregarDadosPacienteParaEdicao(id) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/pacientes/buscar/${id}`);
            if (resposta.ok) {
                const paciente = await resposta.json();
                
                // Coloca os dados recebidos dentro de cada input do HTML
                document.getElementById("cad-nome").value = paciente.nome || '';
                document.getElementById("cad-data-nascimento").value = paciente.dataNascimento || '';
                document.getElementById("cad-genero").value = paciente.genero || '';
                document.getElementById("cad-cpf").value = paciente.cpf || '';
                document.getElementById("cad-telefone").value = paciente.telefone || '';
                document.getElementById("cad-email").value = paciente.email || '';
                document.getElementById("cad-empresa").value = paciente.empresa || '';
                document.getElementById("cad-logradouro").value = paciente.logradouro || '';
                document.getElementById("cad-bairro").value = paciente.bairro || '';
                document.getElementById("cad-cidade").value = paciente.cidade || '';
                document.getElementById("cad-numero").value = paciente.numero || '';
                document.getElementById("cad-complemento").value = paciente.complemento || '';
                document.getElementById("cad-cep").value = paciente.cep || '';
                document.getElementById("cad-uf").value = paciente.uf || '';
                document.getElementById("cad-convenio").value = paciente.convenioId || '';
            } else {
                alert("Erro ao carregar dados do paciente.");
            }
        } catch (erro) {
            console.error("Erro ao buscar dados do paciente:", erro);
        }
    }

    // === FUNÇÃO PARA BUSCAR OS CONVÊNIOS DO BANCO ===
    async function carregarSelectConvenios() {
        const selectConvenio = document.getElementById("cad-convenio");
        if (!selectConvenio) return;

        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/convenios/listar');
            if (resposta.ok) {
                const convenios = await resposta.json();
                selectConvenio.innerHTML = '<option value="">Selecione um Convênio...</option>';
                convenios.forEach(convenio => {
                    const opcao = document.createElement("option");
                    opcao.value = convenio.id;       
                    opcao.textContent = convenio.nome; 
                    selectConvenio.appendChild(opcao);
                });
            }
        } catch (erro) {
            console.error("Erro de rede ao carregar convênios:", erro);
        }
    }

    // === FUNÇÃO PARA ENVIAR O PACIENTE COMPLETO PARA O BANCO ===
    async function enviarCadastro(paciente) {
        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/pacientes/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });

            if (resposta.ok) {
                const msgSucesso = await resposta.text();
                alert(msgSucesso);
                formCadastro.reset(); // Limpa a tela
                carregarSelectConvenios(); // Reseta o select
            } else {
                const msgErro = await resposta.text();
                alert("Erro ao cadastrar: " + msgErro);
            }
        } catch (erro) {
            console.error("Erro ao conectar com o backend:", erro);
            alert("Não foi possível conectar ao servidor backend.");
        }
    }

    async function enviarAtualizacao(paciente) {
    try {
        const resposta = await fetch('https://logclinic-backend.onrender.com/api/pacientes/atualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paciente)
        });

        if (resposta.ok) {
            alert("Paciente atualizado com sucesso!");
            window.location.href = "pacientes.html"; // Voltar para a listagem
        } else {
            const msgErro = await resposta.text();
            alert("Erro ao atualizar: " + msgErro);
        }
    } catch (erro) {
        console.error("Erro ao conectar com o backend:", erro);
    }
}

});// <--- ESTE É O FECHAMENTO DO DOMContentLoaded!