import fs from 'fs';

function writePost (postName, postDescription, postUrl) {
    let final = ` 
    
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style.css">
    <title>Parhle Fail Hojayega</title>
</head>

<body>

<div class="navibar workspace">
    <a href="/home">
        <div class="navBtn">Home</div>
    </a>
    <a href="/all">
        <div class="navBtn">All notes</div>
    </a>
    <a href="/contact">
        <div class="navBtn">Contact</div>
    </a>
    <a href="https://pwfh.ga/bot">
        <div class="navBtn">Bot</div>
    </a>
</div>

<div class="body workspace">
    <div class="introHead">
        <h1>${postName}</h1>
    </div>
    <div class="content">
        <p>${postDescription}</p>
        <div class="contentHead">
            <h2>Pictures</h2>
        </div>
        <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,
            vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </p>
    </div>
</div>
<script src="script.js"></script>
<script src="/socket.io/socket.io.js"></script>
</body>
</html>
    
    `;

    fs.writeFile(`Public/Posts/${postUrl}.html`, final, (err) => {console.log(err)});

}

export default writePost