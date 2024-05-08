import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form= document.querySelector('form');
const chatContainer = document.querySelector("#chat_container")

let loadInterval;

function loader(element){
    element.textContent="..."

    loadInterval= setInterval(() => {
        element.textContent += '.';
        if (element.textContent === "...."){
            element.textContent="";
        }
    }, 300);
}

function typeText(element,text){
    let index =0;
    let interval = setInterval(() => {
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        }
        else{
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueId(){
    const timestamp = Date.now();
    return timestamp;
}

function chatStripe (isAi, value, uniquId){
    return(
        `
        <div class="wrapper $(isAi && 'ai'}">
            <div class= "chat">
                <div class= "profile">
                    <img 
                        src="${isAi ? bot : user}"
                        alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                <div class="message" id= ${uniquId}>${value}</div>
            </div>
        </div>
        `
    )
}

const handleSubmit= async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    // user chatstripe
    chatContainer.innerHTML += chatStripe(false,data.get('prompt'));
    form.reset();

    const uniquId = generateUniqueId();
    chatContainer.innerHTML +=chatStripe(true, " ", uniquId);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniquId);


    loader(messageDiv);

    // fetch data from server

	const request = require('request');

const options = {
  method: 'POST',
  url: 'https://chatgpt-api8.p.rapidapi.com/',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': 'b1af9eb107msh66828772b903b03p18112cjsn28cd1c095891',
    'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
  },
  body: [
    {
      content: 'Hello! I\'m an AI assistant bot based on ChatGPT 3. How may I help you?',
      role: 'system'
    },
    {
      content: 'who won the super bowl 2019?',
      role: 'user'
    }
  ],
  json: true
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});

    // end

    // const response = await fetch('https://friday-am6k.onrender.com',{
    //     method: 'POST',
    //     headers: {
    //         'Content-Type':'application/json'
    //     },
    //     body: JSON.stringify({
    //         prompt: data.get('prompt')
    //     })
    // })
    clearInterval(loadInterval);
    messageDiv.innerHTML= " ";
    if(response.ok){
        const data = await response.json();
        const parsedData= data.bot.trim();

        typeText(messageDiv,parsedData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML= "Something went wrong";

        alert(err);
    }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup" , (e) =>{
    if(e.keyCode === 13) {
        handleSubmit(e);
    }
})
