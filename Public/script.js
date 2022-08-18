String.prototype.capitalizeInitial = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function test () {
    console.log("Hello, Wilson!")
    setCookie("user_cookie_consent", "idk", 1)
}

function createNotesTable (socket) {

    document.getElementById('type_all_notes').innerHTML = `<img id='buffer' src="/cdn/buffering.png" alt="buffer">`

    socket.emit('create_notes');

    socket.on('create_notes', (data) => {
        const table = document.getElementById('type_all_notes')
        table.innerHTML = `<table id="links_table">${data.join('\n')}</table>`
        document.getElementById('change_view_type').setAttribute("onclick", "createNotesList(socket)")
        document.getElementById('change_view_type').innerHTML = "Show list"
    });

}

function createNotesList (socket) {

    document.getElementById('type_all_notes').innerHTML = `<img id='buffer' src="/cdn/buffering.png" alt="buffer">`

    socket.emit('db_query', 'list_gamma');

    socket.on('db_query_result', val => {

        let list = val
        let finalArr = []
        let arr = Object.values(list)

        for (let i=0; i<arr.length; i++) {

            const item = arr[i];
            console.log(item)

            const heading = `${item.grade.toUpperCase()} ${item.subject.capitalizeInitial()} ${item.name.capitalizeInitial()}`

            finalArr.push(`<a href='/notes/${item.id.replace(/_/g, '/')}' class='notes'>${heading}</a>`)

            // Another way using DOM append.

            // const anchor = document.createElement('a');
            // anchor.setAttribute('href', `/notes/${item.id.replace(/_/g, '/')}`)
            // anchor.setAttribute('class', 'notes')
            // anchor.textContent = heading
            // document.getElementById('all_notes').appendChild(anchor);

        }

        document.getElementById('type_all_notes').innerHTML = finalArr.join('<br>');
        document.getElementById('change_view_type').setAttribute("onclick", "createNotesTable(socket)");
        document.getElementById('change_view_type').innerHTML = "Show table"

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

        const consent = !!getCookie("user_cookie_consent");
        const cookieBox = document.getElementById("cookie_consent_box");

        if (!cookieBox) return;

        if (consent) {
             cookieBox.style.display = "none";
        } else {
             cookieBox.style.display = "inline";
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
        let iDontKnowWhatThisIsCalled;

        if (item.subject.toLowerCase() === 'mathematics') iDontKnowWhatThisIsCalled = ' Exercise '
        else iDontKnowWhatThisIsCalled = ' '

        const heading = `${item.grade.toUpperCase()} ${item.subject.capitalizeInitial()} ${parseInt(item.index)}`
        const description = `${item.subject.capitalizeInitial()}${iDontKnowWhatThisIsCalled}${item.name.replace(/_/g, ' ').capitalizeInitial()}`
        const meta = new URL(window.location.href).pathname.substring(1).split('/')
        const anchors = [];
        const comments = []

        item.images.forEach((img, index) => {
            anchors.push(`<img src="${img}" class="notes_image" alt="Resource image ${index + 1}">`)
        });
        anchors.push(`<a href="${item.source}" class="credits_link">Source</a>`)

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
        document.getElementById('page_description').innerHTML = description;
        document.getElementById('notes_container').innerHTML = anchors.join('\n');
        document.getElementById('comments').innerHTML = comments.join('\n')

        document.getElementById('grade').setAttribute('value', meta[1])
        document.getElementById('subject').setAttribute('value', meta[2])
        document.getElementById('index').setAttribute('value', meta[3])

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

function getSourcesList(socket) {

    socket.emit('request_sources');

    socket.on('request_sources', (data) => {
        const table = document.getElementById('sources_table')
        table.innerHTML = data.join('\n')
    });

}

function acceptCookies(element) {

    deleteCookie('user_cookie_consent');
    setCookie('user_cookie_consent', 'true', 1);
    element.parentElement.style.display = "none";

}

function setCookie(cookieName, cookieValue, expirationDays) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays*24*60*60*1000));
    let expires = date.toUTCString();
    document.cookie = `${cookieName}=${cookieValue}; expires=${expires}; path=/`
}

function deleteCookie(cookieName) {
    const date = new Date();
    date.setTime(date.getTime() + (24*60*60*1000));
    let expires = date.toUTCString();
    document.cookie = `${cookieName}=; expires=${expires}; path=/`
}

function getCookie(cookieName) {
    let name = `${cookieName}=`;
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for(let i = 0; i <cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}