document.addEventListener('DOMContentLoaded', () => {
    // ============ 1. ANIMAÇÃO DA IMAGEM PRINCIPAL ============
    gsap.from(".contact-image img", {
        duration: 1.2,
        x: -100,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3
    });

    // ============ 2. ANIMAÇÃO DO FORMULÁRIO ============
    gsap.from(".contact-form-area h1", {
        duration: 0.8,
        y: 40,
        opacity: 0,
        ease: "back.out(1.2)"
    });

    const formGroups = document.querySelectorAll(".form-group");
    formGroups.forEach((group, index) => {
        gsap.from(group, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            delay: index * 0.15,
            ease: "power2.out"
        });
    });

    gsap.from(".btn-formulario", {
        duration: 0.8,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });

    const botao = document.querySelector(".btn-formulario");
    if (botao) {
        botao.addEventListener("mouseenter", () => {
            gsap.to(botao, {
                duration: 0.3,
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                ease: "power2.out"
            });
        });

        botao.addEventListener("mouseleave", () => {
            gsap.to(botao, {
                duration: 0.3,
                scale: 1,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                ease: "power2.out"
            });
        });
    }

    // ============ 3. ANIMAÇÃO DAS INFORMAÇÕES DE CONTATO ============
    gsap.from(".contact-info", {
        scrollTrigger: {
            trigger: ".contact-info",
            start: "top 80%"
        },
        duration: 1,
        x: 50,
        opacity: 0,
        ease: "power2.out"
    });

    const socialIcons = document.querySelectorAll(".contact-info .social-icons a");
    socialIcons.forEach((icon, index) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: ".contact-info",
                start: "top 70%"
            },
            duration: 0.6,
            y: 30,
            opacity: 0,
            delay: index * 0.1,
            ease: "back.out(1.5)"
        });
    });

    // ============ 4. ANIMAÇÃO DO CONTAINER PRINCIPAL ============
    gsap.from(".contact-container", {
        duration: 0.5,
        opacity: 0,
        ease: "power1.inOut"
    });

    // ============ 5. ENVIO DO FORMULÁRIO ============
    const form = document.getElementById('fale-conosco-form');
    const submitButton = form.querySelector('.btn-formulario');
    const API_URL = 'http://186.249.34.150:8080/api/fale_conosco';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Estado de carregamento
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const formData = new FormData(form);
        const data = {
            nomeCompleto: formData.get('nomeCompleto').trim(),
            email: formData.get('email').trim(),
            mensagem: formData.get('mensagem').trim()
        };

        // Validações no front-end
        if (!data.nomeCompleto || data.nomeCompleto.length < 2 || data.nomeCompleto.length > 100) {
            showFeedback('Nome completo deve ter entre 2 e 100 caracteres.', 'error');
            resetButton();
            return;
        }
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showFeedback('Por favor, insira um e-mail válido.', 'error');
            resetButton();
            return;
        }
        if (!data.mensagem || data.mensagem.length < 10 || data.mensagem.length > 500) {
            showFeedback('Mensagem deve ter entre 10 e 500 caracteres.', 'error');
            resetButton();
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                showFeedback(result.message || 'Mensagem enviada com sucesso!', 'success');
                form.reset();
            } else {
                const errorData = await response.text();
                console.error('Erro da API:', errorData);
                showFeedback('Erro ao enviar. Tente novamente mais tarde.', 'error');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            showFeedback('Sem conexão com o servidor. Verifique sua internet.', 'error');
        } finally {
            resetButton();
        }
    });

    // ============ FUNÇÃO DE FEEDBACK VISUAL ============
    function showFeedback(message, type) {
        // Remove feedback anterior
        const existing = form.querySelector('.feedback-message');
        if (existing) existing.remove();

        const feedback = document.createElement('div');
        feedback.className = `feedback-message feedback-${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            margin-top: 15px;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            font-weight: 600;
            animation: fadeIn 0.4s ease-out;
        `;

        if (type === 'success') {
            feedback.style.backgroundColor = '#d4edda';
            feedback.style.color = '#155724';
            feedback.style.border = '1px solid #c3e6cb';
        } else {
            feedback.style.backgroundColor = '#f8d7da';
            feedback.style.color = '#721c24';
            feedback.style.border = '1px solid #f5c6cb';
        }

        form.appendChild(feedback);

        // Remove após 5 segundos
        setTimeout(() => {
            if (feedback && feedback.parentElement) {
                gsap.to(feedback, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    onComplete: () => feedback.remove()
                });
            }
        }, 5000);
    }

    function resetButton() {
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Nos Contate';
        }, 300);
    }

    // Animação de entrada do feedback
    gsap.set('.feedback-message', { opacity: 0, y: 10 });
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);



     
        document.addEventListener("DOMContentLoaded", () => {
            const form = document.getElementById("fale-conosco-form");
            const submitButton = form.querySelector(".btn-formulario");
            const API_URL = "http://186.249.34.150:8080/api/fale_conosco";

            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                // Estado de carregamento
                submitButton.disabled = true;
                submitButton.textContent = "Enviando...";

                const data = {
                    nomeCompleto: form.nomeCompleto.value.trim(),
                    email: form.email.value.trim(),
                    mensagem: form.mensagem.value.trim()
                };

                // Validações básicas
                if (!data.nomeCompleto || data.nomeCompleto.length < 2) {
                    showFeedback("Nome deve ter pelo menos 2 caracteres.", "error");
                    resetButton();
                    return;
                }
                if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    showFeedback("E-mail inválido.", "error");
                    resetButton();
                    return;
                }
                if (!data.mensagem || data.mensagem.length < 10) {
                    showFeedback("Mensagem deve ter pelo menos 10 caracteres.", "error");
                    resetButton();
                    return;
                }

                try {
                    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        showFeedback(result.message || "Mensagem enviada com sucesso!", "success");
                        form.reset();
                    } else {
                        const errorText = await response.text();
                        console.error("Erro da API:", errorText);
                        showFeedback("Erro ao enviar. Tente novamente.", "error");
                    }
                } catch (error) {
                    console.error("Erro de conexão:", error);
                    showFeedback("Sem internet ou servidor indisponível.", "error");
                } finally {
                    resetButton();
                }
            });

            function showFeedback(message, type) {
                const old = form.querySelector(".feedback");
                if (old) old.remove();

                const feedback = document.createElement("div");
                feedback.className = `feedback feedback-${type}`;
                feedback.textContent = message;
                feedback.style.cssText = `
                    margin-top: 15px;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    text-align: center;
                    font-weight: 600;
                    animation: fadeIn 0.4s ease-out;
                `;

                feedback.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
                feedback.style.color = type === "success" ? "#155724" : "#721c24";
                feedback.style.border = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;

                form.appendChild(feedback);

                setTimeout(() => {
                    if (feedback.parentElement) {
                        feedback.style.transition = "opacity 0.3s, transform 0.3s";
                        feedback.style.opacity = "0";
                        feedback.style.transform = "translateY(-10px)";
                        setTimeout(() => feedback.remove(), 300);
                    }
                }, 5000);
            }

            function resetButton() {
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = "Nos Contate";
                }, 300);
            }

            const style = document.createElement("style");
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        });

});

