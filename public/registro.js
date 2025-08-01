// Função para atualizar o conteúdo da tela com animação
function updateContent(newContent, animationClass, formType) {
    const container = document.querySelector('.container'); // Seleciona o contêiner

    container.classList.remove('fade-in', 'slide-in');
    container.classList.add('fade-out', 'slide-out');

    // Adiciona um listener de evento para quando a transição terminar
    container.addEventListener('transitionend', function () {
        container.innerHTML = newContent; // Atualiza o conteúdo do contêiner
        container.classList.remove('fade-out', 'slide-out');
        container.classList.add(animationClass);

        // Reconfigura os formulários com base no tipo
        if (formType == 'registro') {
            setupRegistroForm();
            formata();
        } else if (formType === 'presenca') {
            setupFormPresenca();
        }

    }, { once: true }); // O evento será acionado apenas uma vez
}

function setupFormPresenca() {
    const formPresenca = document.getElementById('FormPresenca');
    if (formPresenca) {
        formPresenca.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission behavior

            const idConfirm = document.getElementById('idConfirm').value; // Get the ID from the input field

            // Send a POST request to confirm presence
            fetch('/confirm-presenca', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: idConfirm }), // Send the ID as JSON
            })
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                if (data.success) {
                    // Show success notification if presence is confirmed
                    showToast('Presença confirmada com sucesso', '#44ef44');
                } else {
                    // Show error notification if something goes wrong
                    showToast('Erro ao confirmar presença: ' + data.message, '#ef4444');
                }
            })
            .catch(error => console.error('Error:', error)); // Handle any errors
        });
    }
}


// Função para configurar o formulário de registro
function setupRegistroForm() {
    const formRegistro = document.getElementById('FormRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function (event) {
            event.preventDefault();

            // Coleta os dados do formulário
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const celular = document.getElementById('celular').value;

            // Envia os dados
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, celular }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Registrado com Sucesso', '#44ef44');
                    formRegistro.reset(); // Limpa os campos do formulário
                } else {
                    showToast('Registro Falhou: ' + data.message, '#ef4444');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
}

function selectButton(buttonId) {
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('selected'); // Remove "selected" class from all buttons
    });
    document.getElementById(buttonId).classList.add('selected'); // Add "selected" class to the clicked button
}


// Selecionar registro ao carregar pagina
document.addEventListener('DOMContentLoaded', () => {
    selectButton('btn-tela-Registro');
    setupRegistroForm(); // Configura o formulário de registro na carga inicial
});

// Evento de clique para o botão "Registro"
document.getElementById('btn-tela-Registro').addEventListener('click', function () {
    selectButton('btn-tela-Registro');
    updateContent(
        `<h2>Registro do Aluno</h2>
        <form id="FormRegistro">
            <div class="input-box">
                <input type="text" placeholder="Nome completo:" id="nome" required>
            </div>
            <div class="input-box">
                <input type="text" placeholder="E-mail:" id="email" required>
            </div>
            <div class="input-box">
                <input type="text" id="celular" placeholder="Celular:" required>
            </div>
            <div class="input-box">
                <button type="submit" class="button">Registrar</button>
            </div>
        </form>`,
        'fade-in',
        'registro'
    ); 

    location.replace(location.href);
}); 

// Evento de clique para o botão "Presença"
document.getElementById('btn-tela-Presenca').addEventListener('click', function () {
    selectButton('btn-tela-Presenca');
    updateContent(
        `<h2>Presença</h2>
        <form id="FormPresenca">
            <div class="input-box">
                <input type="text" id="idConfirm" placeholder="ID:" required>
            </div>
            <div class="input-box">
                <button type="submit" class="button">Confirmar Presença</button>
            </div>
        </form>`,
        'fade-in',
        'presenca'
    );
});

// mensagem do toastfy
function showToast(message, backgroundColor) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: backgroundColor,
        },
        onClick: function () { }
    }).showToast();
}