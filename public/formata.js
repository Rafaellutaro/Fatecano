
function formata() {

    const celular = document.getElementById('celular');

    
    new Cleave(celular, {
        delimiters: ['(', ')', ' ', '-'],
        blocks: [0, 2, 1, 4, 4],
        numericOnly: true
    });
}

window.formata = formata;



