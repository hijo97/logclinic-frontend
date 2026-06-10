document.addEventListener("DOMContentLoaded", function() {
    const formMedico = document.getElementById("form-cadastro-medico");

    if (formMedico) {
        formMedico.addEventListener("submit", async function(event) {
            event.preventDefault(); // Impede a página de recarregar

            // Monta o pacote de dados capturando as caixas de texto com os IDs novos
            const dadosMedico = {
                nome: document.getElementById("med-nome").value.toUpperCase(),
                crm: document.getElementById("med-crm").value,
                crm_uf: document.getElementById("med-uf").value,
                especialidade: document.getElementById("med-especialidade").value.toUpperCase(),
                telefone: document.getElementById("med-telefone").value
            };

            try {
                // Envia para a rota exata que você criou no WebController
                const resposta = await fetch('https://logclinic-backend.onrender.com/api/medicos/cadastrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosMedico)
                });

                if (resposta.ok) {
                    alert("Médico cadastrado com sucesso!");
                    formMedico.reset(); // Limpa o formulário
                } else {
                    const msgErro = await resposta.text();
                    alert("Falha ao cadastrar: " + msgErro);
                }
            } catch (erro) {
                console.error("Erro na rede:", erro);
                alert("Erro ao conectar com o servidor. Verifique se o Java está rodando.");
            }
        });
    }
});