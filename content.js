// Evita múltiplas injeções do script
if (!window.osCounterInjected) {
  window.osCounterInjected = true;

  function collectColors(turno = "todos") {
    const events = document.querySelectorAll("a.fc-time-grid-event");
    const result = {};

    events.forEach(ev => {
      // Tenta pegar o horário do evento
      const timeElement = ev.querySelector(".fc-time");
      if (timeElement) {
        const timeText = timeElement.getAttribute("data-full") || timeElement.textContent;
        const hourMatch = timeText.match(/(\d{1,2}):(\d{2})/);

        if (hourMatch) {
          const hour = parseInt(hourMatch[1]);

          // Filtra por turno
          if (turno === "manha" && (hour < 0 || hour >= 13)) {
            return; // Pula este evento
          }
          if (turno === "tarde" && (hour < 14 || hour > 23)) {
            return; // Pula este evento
          }
        }
      }

      const style = window.getComputedStyle(ev);
      const color = style.borderColor || style.backgroundColor || "desconhecido";
      result[color] = (result[color] || 0) + 1;
    });

    return result;
  }

  chrome.runtime.onMessage.addListener((msg, sender, send) => {
    if (msg.action === "getColors") {
      try {
        const colors = collectColors(msg.turno);
        send(colors);
      } catch (error) {
        console.error('Erro ao coletar cores:', error);
        send(null);
      }
    }
    return true; // Mantém o canal de mensagem aberto para resposta assíncrona
  });
}