console.log("JS carregado");


document.addEventListener("DOMContentLoaded", () => {

    // ============ ANIMAÇÕES ============

    gsap.from(".formulario-titulo", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: 0.3
    });

    const formElements = document.querySelectorAll(".formulario-voluntario *:not(button)");
    gsap.from(formElements, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".formulario-voluntario",
            start: "top 80%"
        }
    });

    gsap.from(".botao-enviar", {
        duration: 1,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: ".botao-enviar",
            start: "top 90%"
        }
    });

    // Hover no botão
    const submitBtn = document.querySelector(".botao-enviar");
    if (submitBtn) {
        submitBtn.addEventListener("mouseenter", () => {
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                ease: "power2.out"
            });
        });

        submitBtn.addEventListener("mouseleave", () => {
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                ease: "power2.out"
            });
        });
    }

    // ============ ENVIO DO FORMULARIO ============

    const form = document.getElementById("form-voluntario");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = {
            nome_completo: document.getElementById("nome-completo").value,
            e_mail: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            disponibilidade: document.getElementById("disponibilidade").value,
            mensagem: document.getElementById("mensagem").value
        };

        try {
            const response = await fetch("http://186.249.34.150:8080/api/seja_voluntario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("Cadastro enviado com sucesso!");
                form.reset();
            } else {
                alert("Erro ao enviar o cadastro.");
                console.error(await response.text());
            }

        } catch (err) {
            console.error("Erro ao conectar com o servidor:", err);
            alert("Não foi possível conectar ao servidor.");
        }
    });

});
