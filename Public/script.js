console.log("Hello, Wilson!")


function test () {
    console.log("Hello, Wilson!")
}

function createNotesList (io) {
    const socket = io()
    socket.emit('db_query', 'notes_metadata');

    socket.on('db_query', val => {
        console.log(val)
        let physArr = val

        let finalArr = []

        Array.from(physArr).forEach((item) => {
            finalArr.push(`${item.index}. <a href='./${item.href}' class='notes'>${item.name}</a>`)
        });

        document.getElementById('allnotes').innerHTML = finalArr.join('<br>');
    });
}

function validatePerson (io) {

    const socket = io();
    socket.emit('user_validation', '');

    socket.on('user_validation', (data) => {
        console.log('validated!')
    })
}