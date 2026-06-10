/* ==========================================================================
   LÓGICA DE CADASTRO DE AGENDAMENTO - LOG CLINIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async function() {

    const campoData = document.getElementById("agen-data");
    if (campoData) {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        campoData.value = `${ano}-${mes}-${dia}`;
    }

    await carregarSelectPacientes();
    await carregarSelectServicos();

    const formAgendamento = document.getElementById("form-cadastro-agendamento");

    if (formAgendamento) {
        formAgendamento.addEventListener("submit", async function(e) {
            e.preventDefault();

            const pacienteId = parseInt(document.getElementById("agen-paciente").value);
            const servicoId = parseInt(document.getElementById("agen-servico").value);

            if (!pacienteId) { alert("Por favor, selecione um paciente."); return; }
            if (!servicoId) { alert("Por favor, selecione um serviço/procedimento."); return; }

            const convenioId = await obterConvenioDoPaciente(pacienteId);

            // CORRIGIDO: servico_id no singular para bater com o Java
            const dadosConsulta = {
                paciente_id: pacienteId,
                servicos_id: servicoId, 
                convenio_id: convenioId,
                data_consulta: document.getElementById("agen-data").value,
                hora_consulta: document.getElementById("agen-horario").value
            };

            try {
                const resposta = await fetch('https://logclinic-backend.onrender.com/api/consultas/agendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosConsulta)
                });

                if (resposta.ok) {
                    alert("Consulta agendada com sucesso!");
                    window.location.href = "agenda.html"; 
                } else {
                    const msgErro = await resposta.text();
                    alert("Erro ao agendar: " + msgErro);
                }
            } catch (erro) {
                console.error("Erro na requisição:", erro);
                alert("Não foi possível conectar ao servidor.");
            }
        });
    }

    async function carregarSelectPacientes() {
        const selectPaciente = document.getElementById("agen-paciente");
        if (!selectPaciente) return;
        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/pacientes/listar');
            if (resposta.ok) {
                const pacientes = await resposta.json();
                selectPaciente.innerHTML = '<option value="">Selecione um paciente cadastrado...</option>';
                pacientes.forEach(paciente => {
                    const opcao = document.createElement("option");
                    opcao.value = paciente.id;
                    opcao.textContent = `${paciente.nome} (CPF: ${paciente.cpf})`;
                    selectPaciente.appendChild(opcao);
                });
            }
        } catch (erro) { console.error("Erro ao listar pacientes:", erro); }
    }

    async function carregarSelectServicos() {
        const selectServico = document.getElementById("agen-servico");
        if (!selectServico) return;
        try {
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/servicos/listar');
            if (resposta.ok) {
                const servicos = await resposta.json();
                selectServico.innerHTML = '<option value="">Selecione um procedimento...</option>';
                servicos.forEach(servico => {
                    const opcao = document.createElement("option");
                    opcao.value = servico.id;
                    const valorFormatado = servico.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    opcao.textContent = `${servico.nome} (${valorFormatado})`;
                    selectServico.appendChild(opcao);
                });
            }
        } catch (erro) { console.error("Erro ao listar serviços:", erro); }
    }

    async function obterConvenioDoPaciente(pacienteId) {
        try {
            const resposta = await fetch(`https://logclinic-backend.onrender.com/api/pacientes/buscar/${pacienteId}`);
            if (resposta.ok) {
                const paciente = await resposta.json();
                return paciente.convenioId || 1; 
            }
        } catch (erro) { console.error("Erro ao capturar convênio:", erro); }
        return 1; 
    } 
});