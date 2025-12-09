const apiUrl = "http://186.249.34.150:8080/api/gerencia/eventos";
const loginUrl = "index.html"; // ou "login.html" se preferir

// ====================== VERIFICAÇÃO DE TOKEN E ADMIN ======================
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = loginUrl;
} else {
  try {
    function parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    }

    const decoded = parseJwt(token);
    const now = Date.now() / 1000;

    if (!decoded.exp || decoded.exp < now) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = loginUrl;
    }

    if (!decoded.role || decoded.role !== "ADMIN") {
      alert("Acesso negado. Somente administradores podem acessar esta página.");
      window.location.href = loginUrl;
    }
  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem("token");
    window.location.href = loginUrl;
  }
}

// ====================== ELEMENTOS DO FORMULÁRIO ======================
const form = document.getElementById("eventoForm");
const btnText = document.getElementById("btnText");
const cancelBtn = document.getElementById("cancelEdit");

// ====================== ENVIO DO FORMULÁRIO ======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.texto.value.trim()) {
    alert("O campo texto é obrigatório.");
    return;
  }

  const formData = new FormData();
  formData.append("texto", form.texto.value);
  if (form["file-1"].files[0]) {
    formData.append("file-1", form["file-1"].files[0]);
  } else if (!form.dataset.id) {
    alert("Por favor, selecione uma imagem para criar um novo evento.");
    return;
  }

  const id = form.dataset.id;
  const method = id ? "PUT" : "POST";
  const url = id ? `${apiUrl}/${id}` : apiUrl;

  btnText.textContent = id ? "Atualizando..." : "Salvando...";
  cancelBtn.style.display = "none";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    if (response.ok) {
      alert(id ? "Evento atualizado com sucesso!" : "Evento salvo com sucesso!");
      form.reset();
      delete form.dataset.id;
      btnText.textContent = "Salvar Evento";
      cancelBtn.style.display = "none";
      carregarEventos();
    } else {
      const error = await response.text();
      alert(`Erro: ${response.status} - ${error || 'Acesso negado'}`);
      if (response.status === 401 || response.status === 403) {
        window.location.href = loginUrl;
      }
    }
  } catch (error) {
    alert("Erro na requisição: " + error.message);
  } finally {
    btnText.textContent = id ? "Atualizar Evento" : "Salvar Evento";
    cancelBtn.style.display = form.dataset.id ? "inline-flex" : "none";
  }
});

cancelBtn.addEventListener("click", () => {
  form.reset();
  delete form.dataset.id;
  btnText.textContent = "Salvar Evento";
  cancelBtn.style.display = "none";
});

// ====================== CARREGAR EVENTOS ======================
async function carregarEventos() {
  const div = document.getElementById("eventos");
  div.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando eventos...</p></div>';

  try {
    const response = await fetch(apiUrl);
    const eventos = await response.json();

    if (!eventos || eventos.length === 0) {
      div.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>Nenhum evento cadastrado ainda.</p>
          <small>Adicione o primeiro evento acima!</small>
        </div>
      `;
      return;
    }

    div.innerHTML = '<div class="events-grid"></div>';
    const grid = div.querySelector('.events-grid');

    eventos.forEach(ev => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <img src="${ev.imagem}" alt="Imagem do evento" class="event-image" 
             onerror="this.src='https://via.placeholder.com/280x180?text=Imagem+N%C3%A3o+Encontrada';">
        <div class="event-content">
          <p class="event-text">${ev.texto}</p>
          <div class="btn-group">
            <button onclick="editarEvento(${ev.id}, '${ev.texto.replace(/'/g, "\\'")}')" class="btn btn-edit">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button onclick="deletarEvento(${ev.id})" class="btn btn-danger">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </div>
        </div>
        <hr>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    div.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar eventos.</p></div>`;
  }
}

// ====================== FUNÇÕES GLOBAIS ======================
function editarEvento(id, texto) {
  form.texto.value = texto;
  form.dataset.id = id;
  btnText.textContent = "Atualizar Evento";
  cancelBtn.style.display = "inline-flex";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deletarEvento(id) {
  if (!confirm("Tem certeza que deseja excluir este evento?")) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      alert("Evento deletado com sucesso!");
      carregarEventos();
    } else {
      const error = await response.text();
      alert(`Erro: ${error || 'Acesso negado'}`);
      if (response.status === 401 || response.status === 403) {
        window.location.href = loginUrl;
      }
    }
  } catch (error) {
    alert("Erro na exclusão: " + error.message);
  }
}

// Inicializa a página
carregarEventos();