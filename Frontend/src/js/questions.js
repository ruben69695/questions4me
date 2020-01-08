var questionList = [];

window.onload = (event) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (xhttp.responseText !== '') {
                const htmlElementToWrite = document.getElementById("question-list");
                questionList = JSON.parse(xhttp.responseText);
                questionList.forEach(element => {
                    var htmlData = `<div class="card p-3 question-item"><blockquote class="blockquote mb-0 card-body"><p>${element.content}</p><footer class="blockquote-footer"><small class="text-muted">${element.created_by}</small></footer></blockquote></div>`;
                    htmlElementToWrite.innerHTML += htmlData;
                });
            }
        }
    };
    xhttp.open("GET", "http://127.0.0.1:8000/questions/", true);
    xhttp.send();
};