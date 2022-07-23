---
layout: page
title:  "Recommend Me a Book"
permalink: /bookshelf/recommend-me/
---

<html>
    <head>
        <script>
            function myFunction() {
                let bookName = document.getElementById("book-name").value
                let email = document.getElementById("your-email").value
                document.getElementById("demo").innerHTML = "thanks for suggesting " + bookName + " :)";
                document.getElementById("entire-form").remove();
                let http = new XMLHttpRequest();
                http.open(
                    'POST',
                    'https://witch-game-zn7nb.ondigitalocean.app/witch/send_ngozi_a_book_rec',
                    true
                );
                http.setRequestHeader('Content-type', 'application/json');
                let thing = {
                    "email": email,
                    "book": bookName
                }
                http.send(JSON.stringify(thing));
            }
        </script>
    </head>
    <p id="demo">Recommend a book (or article)</p>
    <div id="entire-form">
        Book/Article: <input type="text" id="book-name"><br/>
        Your Email: <input type="text" id="your-email"><br/>
        <button type="button" onclick="myFunction()">Suggest!</button><br/>
    </div>
</html>
