const htmlElementToWrite = document.getElementById("question-list");
const audios = [new Audio('audio/argh.mp3'), new Audio('audio/cuek.mp3')];

var audioIndex = 0;
var questionList = [];
var errorConnecting = false;

window.onload = (event) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (xhttp.responseText !== '') {
                questionList = JSON.parse(xhttp.responseText).filter((element) => element.answered_at == null);
                questionList.forEach(question => {
                    var htmlElement = getQuestionElement(question);
                    htmlElementToWrite.innerHTML += htmlElement;
                });
            }
        }
        else if (xhttp.readyState === 4 && xhttp.status === 0) {
            htmlElementToWrite.innerHTML = "Error connecting to the server, can't load questions";
            errorConnecting = true;
        }
        else if (xhttp.readyState === 0) {
            htmlElementToWrite.innerHTML = 'Loading data...';
        }
    };
    xhttp.open("GET", "https://q4me-apirest.azurewebsites.net/api/questions/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
};


const refreshQuestions = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            if (xhttp.responseText !== '') {
                const newQuestions = JSON.parse(xhttp.responseText).filter((element) => element.answered_at == null);
                if (errorConnecting) {
                    htmlElementToWrite.innerHTML = "";
                    errorConnecting = false;
                }
                deleteAnsweredQuestions(newQuestions);
                // Añadir nuevas preguntas a la lista actual
                let playAudio = false;
                newQuestions.forEach(question => {
                    if (!existQuestionInList(question, questionList)) {
                        var htmlData = getQuestionElement(question);
                        htmlElementToWrite.innerHTML += htmlData;
                        questionList.push(question);
                        
                        if (!playAudio) playAudio = true;
                    }
                });

                if (playAudio) 
                {
                    audios[audioIndex].play();
                    if (audioIndex == 0) {
                        audioIndex = 1;
                    }
                    else {
                        audioIndex = 0;
                    }
                }
            }
        }
    };
    xhttp.open("GET", "https://q4me-apirest.azurewebsites.net/api/questions/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
};

const deleteAnsweredQuestions = (newQuestions) => {
    let oldQuestions = questionList;
    let oldQuestion = null;
    let questionsToRemove = [];

    for (let index = 0; index < oldQuestions.length; index++) {
        oldQuestion = oldQuestions[index];
        
        if (!existQuestionInList(oldQuestion, newQuestions)) {
            // Añadir a la lista y eliminar después de recorrer el bucle
            questionsToRemove.push(oldQuestion);
        }
    }

    // Eliminar los elementos pendientes
    questionsToRemove.forEach(element => {

        // Eliminar etiqueta html
        var docElement = document.getElementById(element.id);

        if (docElement != null) {
            docElement.remove();
            
            // Eliminar de la current list
            questionList = questionList.filter((xitem) => xitem.id != element.id);
        }
    });


};

const isQuestionAnswered = (question) => (question.answered_at !== null || question.answered_at !== '');

const getQuestionElement = (question) => {
    if (question.created_by === '' || question.created_by === null) {
        question.created_by = "Anonymous";
    }
    return `<div id="${question.id}" class="card p-3 question-item"><blockquote class="blockquote mb-0 card-body"><p style="color:black;">${question.content}</p><footer class="blockquote-footer"><small class="text-muted">${question.created_by}</small></footer></blockquote></div>`;
};

const existQuestionInList = (question, questions) => {
    let exist = false;
    let index = 0;

    while(index < questions.length && !exist) {
        if (questions[index].id === question.id) {
            exist = true;
        }
        index++;
    }

    return exist;
};

window.setInterval(refreshQuestions, 5000);
