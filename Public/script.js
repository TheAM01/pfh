function test () {
    console.log("Hello, Wilson!")
}

function createNotesList (io) {

    const socket = io()
    socket.emit('db_query', 'notes_metadata');


    socket.on('db_query_result', val => {

        let physArr = val

        let finalArr = []

        Array.from(physArr).forEach((item) => {

            finalArr.push(`${item.index}. <a href='/${item.href}' class='notes'>${item.name}</a>`)

            // Another way using DOM append.

            // const anchor = document.createElement('a');
            // anchor.setAttribute('href', `/${item.href}`)
            // anchor.setAttribute('class', 'notes')
            // anchor.textContent = item.name;
            // document.getElementById('all_notes').appendChild(anchor);

        });

        document.getElementById('all_notes').innerHTML = finalArr.join('<br>');

    });
}

function validatePerson (io) {

    const socket = io();

    socket.emit('user_validation', {});

    socket.on('user_validation', (session) => {
        if (session) {
            document.getElementById('login_button').style.display = 'none';
            document.getElementById('register_button').setAttribute('href', '/profile')
            document.getElementById('user_option').innerHTML = "Profile"
        }
    });

}

function checkUrlParams(param, errorMessage) {

    const params = new URLSearchParams(window.location.search);
    const alertBox = document.getElementById('warning')

    if (params.has(param)) {
        alertBox.style.display = 'block';
        return alertBox.innerHTML = errorMessage
    }

}

function getFiles(io) {

    const socket = io();

    socket.emit('request_file');
    socket.on('request_file', (data) => {

        document.getElementById('page_heading').innerHTML = data.name;

        const anchors = [];

        data.images.forEach((img, index) => {
            anchors.push(`<img src="${img}" class="notes_image" alt="Resource image ${index}">`)
        });

        document.getElementById('notes_container').innerHTML = anchors.join('\n');
    });

}