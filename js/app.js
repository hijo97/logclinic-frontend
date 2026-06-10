/* ==========================================================================
   LÓGICA COMPLETA DE AUTENTICAÇÃO, FLUXO E TRAVAS (LOG CLINIC)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {
    
    // Captura os dados guardados na memória
    const perfilAtual = localStorage.getItem("usu-perfil");
    const nomeUsuario = localStorage.getItem("usuarioLogado");
    
    // Descobre em qual página o utilizador está atualmente (em minúsculo)
    const URLCompleta = window.location.href.toLowerCase();

    // === 1. TRAVA DE ACESSO GERAL ===
    // Se não estiver logado e tentar aceder a qualquer página que NÃO seja o login, expulsa
   if (!perfilAtual && !URLCompleta.includes("login.html")) {
     window.location.href = "login.html";
       return; // Para a execução do código aqui
    }

    // === 2. EXIBIÇÃO DINÂMICA DO NOME NO TOPO ===
    const labelUsuario = document.getElementById("nome-usuario-logado");
    if (labelUsuario && nomeUsuario) {
        labelUsuario.textContent = nomeUsuario; // Vai mudar dinamicamente para o nome vindo do banco
    }

    // === 3. APLICAÇÃO DAS TRAVAS PARA O PERFIL RECEPÇÃO ===
    if (perfilAtual === "RECEPCAO") {
        
        // Trava A: Esconder os menus visuais da barra lateral
        const linksMenu = document.querySelectorAll(".sidebar nav ul li a");
        linksMenu.forEach(link => {
            const href = link.getAttribute("href");
            if (href === "usuario.html" ||href === "financeiro.html" || href === "estoque.html" ||  href === "relatorios.html" || href === "configuracoes.html") { 
                // Seleciona o elemento pai (<li>) e oculta-o por completo
                const itemLista = link.closest("li");
                if (itemLista) {
                    itemLista.style.display = "none";
                }
            }
    });

        // Trava B: Expulsar se o utilizador tentar aceder digitando o link à mão
        if (URLCompleta.includes("usuario.html") || URLCompleta.includes("financeiro.html") || URLCompleta.includes("estoque.html") || URLCompleta.includes("relatorios.html") || 
            URLCompleta.includes("configuracoes.html") || URLCompleta.includes("servicos.html")|| URLCompleta.includes("convenios.html") || 
            URLCompleta.includes("cadastro-medico.html") || URLCompleta.includes("usuarios.html") || URLCompleta.includes("cadastro-operador") || 
            URLCompleta.includes("cadastro-servico.html")){
            alert("Acesso Negado! O seu perfil de Recepção não tem permissão para aceder a esta área.");
            window.location.href = "index.html";
            return;
        }
    }

    // === 4. COMPORTAMENTO DO FORMULÁRIO DE LOGIN (INTEGRADO AO BACKEND) ===
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", async function(e) {
            e.preventDefault();

            // Captura os IDs corretos do seu login.html ('login-usuario' e 'login-senha')
            const usuario = document.getElementById("login-usuario").value.trim().toLowerCase();
            const senha = document.getElementById("login-senha").value;

            // Chama a função assíncrona que faz o fetch para a API Spring Boot
            await enviarLogin(usuario, senha);
        });
    }

    // === 5. COMPORTAMENTO DO BOTÃO SAIR ===
    const btnSair = document.getElementById("btn-sair");
    if (btnSair) {
        btnSair.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.clear(); // Limpa totalmente a memória
            sessionStorage.clear(); // Limpa a sessão (caso tenha usado para algo)
            // Limpa os cookies da aplicação
            document.cookie.split(";").forEach(function(c) {
            document.cookie = c.trim().split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            });
            // Redireciona para a página de login
            //window.location.href = "login.html";
            window.location.replace("login.html"); // Substitui a página atual, impedindo voltar com o "Voltar" do navegador
        });
    }

    // === 6. FUNÇÃO DE CONEXÃO REAL COM O BACKEND SPRING BOOT ===
    async function enviarLogin(loginDigitado, senhaDigitada) {
        try {
            // Faz a requisição POST enviando o JSON com login e senha para o Java
            const resposta = await fetch('https://logclinic-backend.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login: loginDigitado, senha: senhaDigitada })
            });

            if (resposta.ok) {
                // O Spring Boot encontrou o operador e retornou o JSON dele
                const operador = await resposta.json();
                console.log("Bem-vindo: " + operador.nome);
                
                // Guarda na memória do navegador os dados reais vindos do MySQL
                localStorage.setItem("usuarioLogado", operador.nome);       // Guarda o Nome do operador
                localStorage.setItem("usu-perfil", operador.perfil.toUpperCase()); // Guarda o Perfil (ADMIN ou RECEPCAO)

                // Redireciona o usuário para a página principal após o sucesso
                window.location.href = "index.html"; 
            } else {
                // Se o Java retornar status de erro (como 401), exibe o aviso
                alert("Usuário ou senha inválidos!");
            }
        } catch (erro) {
            // Caso o servidor do Spring Boot esteja desligado ou dê erro de rede
            console.error("Erro ao conectar com o backend:", erro);
            alert("Não foi possível conectar ao servidor backend. Certifique-se de que o Spring Boot está rodando.");
        }
    }

//RESTRIÇÃO PARA ABRIR APENAS UMA ABA DO SISTEMA
    // Cria um canal de comunicação único para a sua aplicação
const channel = new BroadcastChannel('app_channel');

// Envia uma mensagem para checar se já existe outra aba aberta
channel.postMessage('check_active');

// Escuta mensagens vindas de outras abas
channel.onmessage = (event) => {
    if (event.data === 'check_active') {
        // Se outra aba já estiver aberta, avisa que esta é a principal
        channel.postMessage('i_am_active');
    }

    if (event.data === 'i_am_active') {
        // Bloqueia o uso ou redireciona se uma aba ativa for encontrada
        document.body.innerHTML = '<h1>Acesso restrito: O sistema já está aberto em outra aba!</h1>';
        alert('Você só pode usar uma aba por vez.');
    }
};

}); // Fechamento do DOMContentLoaded