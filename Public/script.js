String.prototype.capitalizeInitial = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


function test () {
    console.log("Hello, Wilson!")
    setCookie("user_cookie_consent", "idk", 1)
}

function openNav() {

    document.getElementById("navi_bar").style.width = "250px";

    setTimeout(() => {
        let collection = document.getElementsByClassName("nav_btn");
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.display = "block";
        }
    }, 500)

}

function closeNav() {
    const collection = document.getElementsByClassName("nav_btn");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.display = "none";
    }
    document.getElementById("navi_bar").style.width = "0";
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

    socket.emit('db_query', 'list_theta');

    socket.on('db_query_result', val => {

        let list = val
        let finalArr = []
        let arr = Object.values(list)

        for (let i=0; i<arr.length; i++) {

            const item = arr[i];
            // console.log(item)

            const heading = `${item.grade.toUpperCase()} ${item.subject.capitalizeInitial()} ${item.index}`

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

        console.log(includes)

        if (includes === true) {

            saveButton.setAttribute('onclick', 'unsavePost(socket)')
            saveButton.setAttribute('class', 'saved_button')
            saveButton.innerHTML = "Saved!"

        } else if (includes === false) {

            console.log('xd')

            saveButton.setAttribute('onclick', 'savePost(socket)')
            saveButton.setAttribute('class', 'save_button')
            saveButton.innerHTML = "Save"

        }



    });

}

function getRandomNotes(socket) {

    const consent = getCookie('random_notes');
    if (consent == 0) collapseRandomNotes()

    socket.emit('random_notes');

    socket.on('random_notes', (data) => {

        const button = document.getElementById('close_random_notes')
        const wrapper = document.getElementById('random_notes_wrapper');
        const children = [];

        for (let i = 0; i < data.length; i++) {

            const item = data[i];

            children.push(
                `<div class="random_notes">
                    <a href="${item.url}" class="random_notes_link">${item.grade} ${item.subject} ${item.name}: ${item.index}</a>
                    <div class="random_notes_images_wrapper">
                        ${forImgPush(item.images)}
                    </div>
                </div>

                `
            )


        }

        wrapper.innerHTML = children.join('\n')
        button.setAttribute('onclick', 'collapseRandomNotes()')
        button.style.display = 'inline'

    })

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
            saveButton.setAttribute('class', 'saved_button')
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

function forImgPush(images) {
    let arr = []
    images.forEach((img, index) => {
        arr.push(`<img src="${img}" class="random_notes_thumbnail_individual" id="slide-${index + 1}">`);
    })
    return arr.join('\n')
}

function collapseRandomNotes() {

    const division = document.getElementById('random_notes_wrapper');
    division.style.display = 'none';

    const button = document.getElementById('close_random_notes')
    button.style.display = 'inline'
    button.innerHTML = 'Show random notes'
    button.setAttribute('onclick', 'openRandomNotes()')

    setCookie('random_notes', 0, 7)

}

function openRandomNotes() {

    const division = document.getElementById('random_notes_wrapper');
    division.style.display = 'inline';

    const button = document.getElementById('close_random_notes')
    button.style.display = 'inline'
    button.innerHTML = 'Collapse'
    button.setAttribute('onclick', 'collapseRandomNotes()')

    setCookie('random_notes', 1, 7)

}