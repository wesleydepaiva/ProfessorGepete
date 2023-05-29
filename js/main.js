import OPENAI_API_KEY from "./apikey.js"

const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");
const buttonSend = document.getElementById("botao__send");

inputQuestion.addEventListener("keypress", (e) => {
  if (inputQuestion.value && e.key === "Enter") SendQuestion();
});

inputQuestion.addEventListener("click", (e) => {
    if (inputQuestion.value && buttonSend.onclick) SendQuestion();
})

function SendQuestion() {
    var sQuestion = inputQuestion.value;

    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [ {
            role: "system",
            content: "Você é um sistema chamado Professor Gepetê que ajuda pessoas nos estudos."
        },
        {
            role: "system",
            content: "Reforce sempre que possível sobre a pessoa confirmar a fonte das informações, não confiar cegamente na inteligência artificial."
        },
        {
            role: "user",
            content: sQuestion}],
        max_tokens: 2048, // tamanho da resposta
        temperature: 0.5, // criatividade na resposta
    }),
    })
    .then((response) => response.json())
    .then((json) => {
        if (result.value) result.value += "\n";

        if (json.error?.message) {
        result.value += `Error: ${json.error.message}`;
        } else if (json.choices?.[0].message.content) {
        var text = json.choices[0].message.content || "Sem resposta";

        result.value += "\nProfessor Gepetê: " + text;
        }

        result.scrollTop = result.scrollHeight;
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
        inputQuestion.value = "";
        inputQuestion.disabled = false;
        inputQuestion.focus();
    });

    if (result.value) result.value += "\n\n\n";

    result.value += `Eu: ${sQuestion}`;
    inputQuestion.value = "Carregando...";
    inputQuestion.disabled = true;

    result.scrollTop = result.scrollHeight;
}

buttonSend.onclick = SendQuestion;