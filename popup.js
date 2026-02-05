// Mapeamento de cores para tipos de O.S
const colorMap = {
  "rgb(33, 150, 243)": "Instalação",
  "rgb(190, 56, 243)": "Troca de Endereço",
  "rgb(240, 5, 9)": "Sem conexão",
  "rgb(0, 255, 0)": "Suporte",
  "rgb(61, 17, 223)": "Oscilação",
  "rgb(255, 234, 72)": "Retirada de equipamento",
  "rgb(255, 228, 168)": "Retirada de equipamento 2",
  "rgb(39, 92, 111)": "Cabeamento de equipamento",
  "rgb(172, 162, 124)": "Instalação de equipamentos",
  "rgb(230, 245, 15)": "Troca de equipamentos",
  "rgb(117, 217, 231)": "Alteração na instalação",
  "rgb(155, 248, 217)": "Reparo Físico",
  "rgb(4, 255, 0)": "vistoria CQ",
  "rgb(204, 232, 181)": "Visita Técnica",
  "rgb(0, 0, 0)": "O.S sem padrão de cor",
  "rgb(255, 147, 0)": "Retirada por inadimplência",
  "rgb(252, 219, 235)": "Verificação de sinal",
};

let turnoAtual = "todos";

function update() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getColors", turno: turnoAtual },
      resp => {
        const out = document.getElementById("out");
        if (!resp) {
          out.innerHTML = "<span style='color:red'>Sem acesso ao calendário.</span>";
          return;
        }

        // Mapeia as cores para os tipos de O.S
        const mapped = {};
        let total = 0;

        Object.entries(resp).forEach(([color, count]) => {
          const type = colorMap[color] || `Cor desconhecida (${color})`;
          mapped[type] = (mapped[type] || 0) + count;
          total += count;
        });

        // Exibe os resultados
        let html = Object.entries(mapped)
          .map(([type, count]) => `<div><b>${type}</b>: ${count}</div>`)
          .join("");

        // Adiciona total
        html += `<div style="margin-top:10px; padding-top:10px; border-top:2px solid #ccc;"><b>Total</b>: ${total}</div>`;

        out.innerHTML = html || "<div>Nenhuma O.S encontrada neste turno.</div>";
      }
    );
  });
}

// Gerencia a seleção de turno
document.querySelectorAll(".turno-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    // Remove active de todos
    document.querySelectorAll(".turno-btn").forEach(b => b.classList.remove("active"));
    // Adiciona active no clicado
    this.classList.add("active");
    // Atualiza o turno atual
    turnoAtual = this.getAttribute("data-turno");
    // Atualiza os dados
    update();
  });
});

document.getElementById("btn").onclick = update;
update();