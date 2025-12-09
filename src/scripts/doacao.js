document.addEventListener('DOMContentLoaded', () => {
    // ============ ANIMAÇÕES (mantidas intactas) ============
    gsap.to(".decor-sun", { duration: 8, y: 20, rotation: 360, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".decor-heart", { duration: 3, scale: 1.1, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to(".decor-moon", { duration: 10, y: -15, x: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });

    gsap.from(".donation-wrapper h1", { duration: 1, y: 40, opacity: 0, ease: "back.out(1.2)" });
    gsap.from(".nurse-image", { duration: 1.2, x: -50, opacity: 0, ease: "power3.out" });
    gsap.from(".donation-description", { duration: 0.8, y: 30, opacity: 0, delay: 0.3, ease: "power2.out" });

    const formElements = document.querySelectorAll(".donation-form *:not(button)");
    gsap.from(".donation-form", { scrollTrigger: { trigger: ".donation-form", start: "top 70%" }, duration: 0.5, opacity: 0, ease: "power2.inOut" });
    gsap.from(".donation-options button", { scrollTrigger: { trigger: ".donation-options", start: "top 75%" }, duration: 0.6, y: 30, opacity: 0, stagger: 0.1, ease: "back.out(1.5)" });

    document.querySelectorAll(".donation-options button, .donate-other").forEach(button => {
        button.addEventListener("mouseenter", () => {
            gsap.to(button, { duration: 0.2, scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", ease: "power2.out" });
        });
        button.addEventListener("mouseleave", () => {
            gsap.to(button, { duration: 0.2, scale: 1, boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", ease: "power2.out" });
        });
    });

    gsap.from(formElements, { scrollTrigger: { trigger: ".donation-form", start: "top 60%" }, duration: 0.8, y: 20, opacity: 0, stagger: 0.05, ease: "power2.out" });
    gsap.from(".footer-container", { scrollTrigger: { trigger: ".site-footer", start: "top 90%" }, duration: 1, y: 40, opacity: 0, ease: "power2.out" });

    // ============ QR CODE (Doação Única) ============
    const frequencySelect = document.getElementById('frequency');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrcodeImg = document.getElementById('qrcode-img');
    const miniForm = document.getElementById('mini-form');
    let qrCodeEventsActive = true;

    function toggleQRCodeEvents(active) {
        qrCodeEventsActive = active;
        if (!active) qrcodeDiv.style.display = 'none';
    }

    function showQRCode(button) {
        if (qrCodeEventsActive) {
            const value = button.getAttribute('data-value');
            qrcodeImg.src = `adicionais/pix/pix${value === 'custom' ? 'outro' : value}.png`;
            qrcodeDiv.style.display = 'block';
        }
    }

    function hideQRCode() {
        if (qrCodeEventsActive) qrcodeDiv.style.display = 'none';
    }

    document.querySelectorAll('.donation-options button, .donate-other').forEach(button => {
        button.addEventListener('mouseover', () => showQRCode(button));
        button.addEventListener('mouseout', hideQRCode);
    });

    // ============ CONTROLE DE FREQUÊNCIA ============
    frequencySelect.addEventListener('change', () => {
        const selected = frequencySelect.value;
        if (selected === 'mensal') {
            toggleQRCodeEvents(false);
            miniForm.style.display = 'block';
            qrcodeDiv.style.display = 'none';
        } else {
            toggleQRCodeEvents(true);
            miniForm.style.display = 'none';
        }
    });

    // ============ ENVIO PARA API JAVA (Doação Mensal) ============
    const form = document.getElementById('donation-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (frequencySelect.value !== 'mensal') return;

        const formulario = {
            nomeCompleto: document.getElementById('full-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            mensagem: document.getElementById('text').value.trim(),
        };

        try {
            const response = await fetch('http://186.249.34.150:8080/api/doacao_mensal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formulario)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Mensagem enviada com sucesso!");
                form.reset();
                miniForm.style.display = 'none';
                frequencySelect.value = 'unica';
                toggleQRCodeEvents(true);
            } else {
                alert(result.message || "Erro ao enviar mensagem.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro de conexão. Tente novamente mais tarde.");
        }
    });
});
