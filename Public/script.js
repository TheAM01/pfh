String.prototype.capitalizeInitial = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function test () {
    console.log("Hello, Wilson!")
}

function createNotesList (socket) {

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

function validatePerson (socket) {

    // const socket = io();

    socket.emit('user_validation');

    socket.on('user_validation', (session) => {

        if (session.authenticated) {

            document.getElementById('primary_button').setAttribute('href', '/profile');
            document.getElementById('primary_option').innerHTML = "Profile";
            document.getElementById('secondary_button').setAttribute('href', '/logout')
            document.getElementById('secondary_option').innerHTML = "Log out";

            const comment = document.getElementById('comment_section_intro');
            const commentForm = document.getElementById('comment_form')
            if (comment) comment.innerHTML = "Join the discussion by typing a comment!"
            if(commentForm) commentForm.setAttribute('style', 'display: inline;')

        }

    });

}

function loadProfile (socket) {

    socket.emit('user_validation');
    socket.emit('load_profile');


    socket.on('user_validation', (session) => {
        if (session) {
            document.getElementById('login_button').style.display = 'none';
            document.getElementById('register_button').setAttribute('href', '/profile')
            document.getElementById('user_option').innerHTML = "Profile"
        }
    });

    socket.on('load_profile', (userData) => {
        console.log('load_profile fired')

        document.getElementById('user_avatar').innerHTML = `<img src='${userData.avatarUrl}' class="avatar_img">`
        document.getElementById('username').innerHTML = userData.username;

        const saves = document.getElementById('saves');
        let rawSaves = [];

        if (!userData.savedUrls[0]) return saves.innerHTML = "No saved pages. The pages that you save will show up here."

        userData.savedUrls.forEach(item => {
            rawSaves.push(`<a href="${item.url}">${item.title}</a>`)
        });

        saves.innerHTML = rawSaves.join('<br>\n')
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

function getFiles(socket) {

    // const socket = io();

    const path = window.location.pathname.substring(1)
    const args = path.split('/');

    socket.emit('request_file',
        {
            grade: args[1],
            subject: args[2],
            index:args[3]
        }
    );

    socket.on('request_file', (data) => {

        const {item, includes} = data;
        const heading = `${item.grade.toUpperCase()} ${item.subject.capitalizeInitial()} ${item.name.replace(/_/g, ' ').capitalizeInitial()}`
        const anchors = [];
        const comments = []

        item.images.forEach((img, index) => {
            anchors.push(`<img src="${img}" class="notes_image" alt="Resource image ${index + 1}">`)
        });
        anchors.push(`<a href="${item.url}" class="credits_link">Source</a>`)

        if(!item.comments) item.comments = []

        item.comments.forEach((comment) => {
            comments.push(
                `
                    <div class="comment">
                        <div class="comment_thumbnail">
                            <img src="${comment.thumbnail}" class="comment_thumbnail_img">
                            <span class="comment_username">${comment.user}</span>
                            <span class="stray">•</span>
                            <span class="comment_timestamp">${comment.timestamp}</span>
                            <div class="comment_content">${comment.comment}</div>
                        </div>
                    </div>
                `
            )
        })

        document.getElementById('page_heading').innerHTML = heading;
        document.getElementById('notes_container').innerHTML = anchors.join('\n');
        document.getElementById('comments').innerHTML = comments.join('\n')

        document.getElementById('grade').setAttribute('value', item.grade)
        document.getElementById('subject').setAttribute('value', item.subject)
        document.getElementById('index').setAttribute('value', item.name.toLowerCase().replace('chapter', '').replace(/_/g, '').replace(/\s/, ''))


        document.title = `${heading} - Parhle Fail Hojayega`;

        let saveButton = document.getElementById('save_button');
        if (includes) {

            saveButton.setAttribute('onclick', 'unsavePost(socket)')
            saveButton.setAttribute('class', 'save_button')
            saveButton.innerHTML = "Saved!"

        } else if (includes === false) {

            saveButton.setAttribute('onclick', 'savePost(socket)')
            saveButton.setAttribute('class', 'save_button')
            saveButton.innerHTML = "Save"

        }



    });

}

function savePost(socket) {

    const path = new URL(window.location.href).pathname
    const title = document.getElementById('page_heading').textContent

    socket.emit('save_post', ({title: title, url: path}));

    socket.on('save_post', (status) => {
        const alertBox = document.getElementById('warning')
        if (status === 400) {
            alertBox.style.display = 'block';
            return alertBox.innerHTML = 'Couldn\'t save post :('
        } else if (status === 200) {
            let saveButton = document.getElementById('save_button');
            saveButton.setAttribute('onclick', 'unsavePost(socket)')
            saveButton.setAttribute('class', 'save_button')
            saveButton.innerHTML = "Saved!"
        } else {

        }
    })

}

function unsavePost(socket) {

    const path = new URL(window.location.href).pathname
    const title = document.getElementById('page_heading').textContent

    socket.emit('unsave_post', ({title: title, url: path}));

    socket.on('unsave_post', (status) => {
        const alertBox = document.getElementById('warning')
        if (status === 400) {
            alertBox.style.display = 'block';
            return alertBox.innerHTML = 'Couldn\'t un-save post :('
        } else if (status === 200) {
            let saveButton = document.getElementById('save_button');
            saveButton.setAttribute('onclick', 'savePost(socket)')
            saveButton.setAttribute('class', 'save_button')
            saveButton.innerHTML = "Save"
        } else {

        }
    })

}

// function addComment(socket) {
//     console.log('Test')
//
//     const comment = document.getElementById('add_comment');
//     console.log(comment)
//
//     if (!comment) return;
//
//     socket.emit('add_comment', comment)
// }