String.prototype.capitalizeInitial = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function test () {
    console.log("Hello, Wilson!")
}

function createNotesList (io) {

    const socket = io()
    socket.emit('db_query', 'list_alpha');


    socket.on('db_query_result', val => {

        let list = val
        let finalArr = []
        let arr = Object.values(list)

        for (let i=0; i<arr.length; i++) {

            const item = arr[i];

            const heading = `${item.grade.toUpperCase()} ${item.subject.capitalizeInitial()} ${item.name.replace(/_/g, ' ').capitalizeInitial()}`

            finalArr.push(`<a href='/notes/${item.id.replace(/_/g, '/')}' class='notes'>${heading}</a>`)

            // Another way using DOM append.

            // const anchor = document.createElement('a');
            // anchor.setAttribute('href', `/notes/${item.id.replace(/_/g, '/')}`)
            // anchor.setAttribute('class', 'notes')
            // anchor.textContent = heading
            // document.getElementById('all_notes').appendChild(anchor);

        }

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

        const heading = `${data.grade.toUpperCase()} ${data.subject.capitalizeInitial()} ${data.name.replace(/_/g, ' ').capitalizeInitial()}`

        document.getElementById('page_heading').innerHTML = heading;

        const anchors = [];

        data.images.forEach((img, index) => {
            anchors.push(`<img src="${img}" class="notes_image" alt="Resource image ${index}">`)
        });

        anchors.push(`<a href="${data.url}" class="credits_link">Source</a>`)

        document.getElementById('notes_container').innerHTML = anchors.join('\n');
    });

}