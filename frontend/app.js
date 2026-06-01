const API_URL = "https://bandaragamik-mysite-backend.hf.space";


const form = document.getElementById("message-form");
const nameInput = document.getElementById("name")
const contentInput = document.getElementById("content")
const messagesList = document.getElementById("messages")


async function loadMessages() {
    const response = await fetch(`${API_URL}/messages`);
    const messages = await response.json();


    messagesList.innerHTML = "";
    for (const message of messages){
        const li = document.createElement("li");
        li.textContent = `${message.name}: ${message.content}`;
        messagesList.appendChild(li);
    }
}


async function handleSubmit(event) {
    event.preventDefault();


    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: nameInput.value,
            content: contentInput.value,
        }),
    });

    if (!response.ok) {
        alert("Failed to post message");
        return;
    }


    form.reset();
    loadMessages();
}



form.addEventListener("submit", handleSubmit);
loadMessages();