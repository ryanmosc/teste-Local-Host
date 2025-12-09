feather.replace();

    const API = "http://186.249.34.150:8080/api/dashboard";
    const token = localStorage.getItem("token");
    let formularioSelecionado = {};

    if (!token) {
      alert("Você não está logado.");
      window.location.href = "https://voluntariosdasaude.com.br/login.html";
    }

    async function carregarFormularios() {
      const lista = document.getElementById("lista");
      lista.innerHTML = `<div class="loading"><i data-feather="loader"></i><p>Carregando formulários...</p></div>`;
      feather.replace();

      try {
        const res = await fetch(`${API}/formularios`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const dados = await res.json();

        lista.innerHTML = "";
        montarSecao("Seja Voluntário", "briefcase", dados.voluntarios);
        montarSecao("Doação Mensal", "heart", dados.doancoesMensais);
        montarSecao("Fale Conosco", "message-square", dados.faleConosco);

      } catch (err) {
        lista.innerHTML = `<p class="error-msg">Erro ao carregar os dados.</p>`;
        console.error(err);
      }
    }

    function montarSecao(titulo, icone, data) {
      const container = document.getElementById("lista");
      const section = document.createElement("div");
      section.className = "form-section";

      const count = data ? data.length : 0;
      section.innerHTML = `
        <h2 class="section-title">
          <i data-feather="${icone}"></i> ${titulo}
          <span class="badge">${count} registro${count !== 1 ? 's' : ''}</span>
        </h2>
        <div class="cards-grid"></div>
      `;
      container.appendChild(section);
      const grid = section.querySelector(".cards-grid");

      if (!data || data.length === 0) {
        grid.innerHTML = `<p class="empty-message">Nenhum registro encontrado.</p>`;
        feather.replace();
        return;
      }

      data.forEach(item => {
        const nome = item.nome || item.nomeCompleto || item.nome_completo || "-";
        const email = item.email || item.e_mail || "-";
        const telefone = item.telefone || item.whatsapp || "-";
        const mensagem = item.mensagem || item.obs || "-";

        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => {
          formularioSelecionado = { nome, email, telefone, mensagemOriginal: mensagem, nomeFormulario: titulo };
          document.getElementById("emailDestino").value = email;
          document.getElementById("emailDestino").focus();
          alert("Formulário carregado e pronto para responder!");
        };

        card.innerHTML = `
          <div class="card-header">
            <h3>${nome}</h3>
            <i data-feather="user"></i>
          </div>
          <div class="card-body">
            <div class="info-line"><i data-feather="mail"></i><span class="email-chip">${email}</span></div>
            <div class="info-line"><i data-feather="phone"></i><span>${telefone}</span></div>
            <div class="info-line message"><i data-feather="message-circle"></i><p>${mensagem.substring(0, 120)}${mensagem.length > 120 ? '...' : ''}</p></div>
          </div>
        `;
        grid.appendChild(card);
      });

      feather.replace();
    }

    async function enviarEmail() {
      const email = document.getElementById("emailDestino").value.trim();
      const assunto = document.getElementById("assunto").value.trim();
      const mensagem = document.getElementById("mensagem").value.trim();

      if (!email || !assunto || !mensagem) {
        alert("Preencha todos os campos!");
        return;
      }

      try {
        const res = await fetch(`${API}/email`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email, assunto, mensagem,
            nomeFormulario: formularioSelecionado.nomeFormulario,
            nome: formularioSelecionado.nome,
            telefone: formularioSelecionado.telefone,
            mensagemOriginal: formularioSelecionado.mensagemOriginal
          })
        });

        if (!res.ok) throw new Error("Erro na API");
        alert("E-mail enviado com sucesso!");
        document.getElementById("assunto").value = "";
        document.getElementById("mensagem").value = "";

      } catch (err) {
        alert("Erro ao enviar o e-mail.");
        console.error(err);
      }
    }

    // Carrega ao abrir a página
    carregarFormularios();