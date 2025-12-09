const apiUrl = "http://186.249.34.150:8080/api/gerencia/atualizacoes";
const loginUrl = "index.html"; // ou "login.html"

// Verifica login
if (!localStorage.getItem("token")) {
  window.location.href = loginUrl;
}

const form = document.getElementById("atualizacaoForm");
const btnText = document.getElementById("btnText");
const cancelBtn = document.getElementById("cancelEdit");
const lista = document.getElementById("atualizacoes");

// Enviar (criar ou atualizar)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("texto", form.texto.value.trim());

  if (form["file-1"].files[0]) {
    formData.append("file-1", form["file-1"].files[0]);
  }

  const id = form.dataset.id;
  const method = id ? "PUT" : "POST";
  const url = id ? `${apiUrl}/${id}` : apiUrl;

  btnText.textContent = id ? "Atualizando..." : "Publicando...";
  cancelBtn.style.display = "none";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    if (response.ok) {
      alert(id ? "Atualização editada com sucesso!" : "Atualização publicada com sucesso!");
      form.reset();
      delete form.dataset.id;
      btnText.textContent = "Publicar Atualização";
      cancelBtn.style.display = "none";
      carregarAtualizacoes();
    } else {
      const erro = await response.text();
      alert("Erro: " + (erro || "Permissão negada"));
      if (response.status === 401 || response.status === 403) {
        window.location.href = loginUrl;
      }
    }
  } catch (err) {
    alert("Erro de conexão: " + err.message);
  }
});

cancelBtn.addEventListener("click", () => {
  form.reset();
  delete form.dataset.id;
  btnText.textContent = "Publicar Atualização";
  cancelBtn.style.display = "none";
});

// Carregar lista
async function carregarAtualizacoes() {
  lista.innerHTML = `<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>`;

  try {
    const res = await fetch(apiUrl);
    const dados = await res.json();

    if (!dados || dados.length === 0) {
      lista.innerHTML = `
        <div class="empty-state">
          <p>Nenhuma atualização cadastrada</p>
          <small>Use o formulário ao lado para publicar a primeira!</small>
        </div>
      `;
      return;
    }

    lista.innerHTML = "";
    lista.style.display = "grid";
    lista.style.gap = "20px";
    lista.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))"; // Responsivo e bonito

    dados.forEach(item => {
      const card = document.createElement("div");
      card.className = "qr-card"; // nova classe mais adequada

      card.innerHTML = `
        <div class="qr-container">
          ${item.imagem ? `<img src="${item.imagem}" alt="QR Code" class="qr-image">` : '<div class="qr-placeholder">Sem imagem</div>'}
        </div>
        <p class="qr-title">${item.texto || "Sem título"}</p>
        <div class="qr-actions">
          <button class="btn-editar" onclick="editar(${item.id}, '${item.texto.replace(/'/g, "\\'")}')">
            Editar
          </button>
          <button class="btn-excluir" onclick="deletar(${item.id})">
            Excluir
          </button>
        </div>
      `;

      lista.appendChild(card);
    });
  } catch (err) {
    lista.innerHTML = `<div class="empty-state"><p>Erro ao carregar atualizações</p></div>`;
  }
}

// Funções globais
function editar(id, texto) {
  form.texto.value = texto;
  form.dataset.id = id;
  btnText.textContent = "Salvar Alterações";
  cancelBtn.style.display = "inline-flex";
  form.scrollIntoView({ behavior: "smooth" });
}

async function deletar(id) {
  if (!confirm("Excluir esta atualização permanentemente?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (res.ok) {
      alert("Atualização excluída!");
      carregarAtualizacoes();
    } else {
      alert("Erro ao excluir");
      if (res.status === 401) window.location.href = loginUrl;
    }
  } catch (err) {
    alert("Erro: " + err.message);
  }
}

// Inicia
carregarAtualizacoes();