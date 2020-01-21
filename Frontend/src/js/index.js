const nameFormElement = document.getElementById('questionName');
const contentFormElement = document.getElementById('questionContent');
const saveButton = document.getElementById('btnSaveQuestion');
const alertMessage = document.getElementById('alertMessage');

const saveQuestion = (questionAuthor, questionContent) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = (event) => {
        if (xhttp.readyState === 4 && xhttp.status === 201) {
            alertMessage.style.opacity = 1;
            alertMessage.className = 'alert alert-success';
            alertMessage.innerHTML = '&#129395 Thank you, the question has been saved correctly! &#129395';
        }
        else if (xhttp.readyState === 4 && xhttp.status === 0) {
            alertMessage.style.opacity = 1;
            alertMessage.className = 'alert alert-danger';
            alertMessage.innerHTML = '&#128561 Error, no connection with the remote server, status code: ' + xhttp.status + ' &#128561';
        }
    };
    const jsonBody = JSON.stringify({
        "created_by": questionAuthor,
        "content": questionContent
    });
    xhttp.open("POST", "https://q4me-apirest.azurewebsites.net/api/questions/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(jsonBody);
}

saveButton.onclick = (event) => {
    var questionAuthor = nameFormElement.value;
    var questionContent = contentFormElement.value;

    if (questionContent == undefined || questionContent == null || questionContent == '') {
        alertMessage.style.opacity = 1;
        alertMessage.className = 'alert alert-warning';
        alertMessage.innerHTML = '&#128548 Warning, first you need to write the question. &#128548';
    }
    else {
        saveQuestion(questionAuthor, questionContent);
    }

    return false;
}

contentFormElement.onkeydown = (event) => {
    alertMessage.style.opacity = 0;
}