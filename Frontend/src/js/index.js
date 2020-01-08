const nameFormElement = document.getElementById('questionName');
const contentFormElement = document.getElementById('questionContent');
const saveButton = document.getElementById('btnSaveQuestion');

const saveQuestion = (questionAuthor, questionContent) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = (event) => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            alert('Pregunta guardada correctamente');
        }
    };
    const jsonBody = JSON.stringify({
        "created_by": questionAuthor,
        "content": questionContent
    });
    xhttp.open("POST", "http://127.0.0.1:8000/questions/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(jsonBody);
}

saveButton.onclick = (event) => {
    var questionAuthor = nameFormElement.value;
    var questionContent = contentFormElement.value;
    
    if (questionContent == undefined || questionContent == null || questionContent == '') {
        alert('Te falta escribir la pregunta');
    }
    else {
        saveQuestion(questionAuthor, questionContent);
    }

    return false;
}