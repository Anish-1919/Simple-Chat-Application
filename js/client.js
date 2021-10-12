function script()
{
    const socket=io('http://localhost:8000');
    
    //get DOM elements in respective Js variables
    
    const formData= document.getElementById('send-container')
    const messageInput = document.getElementById('messageInp')
    const messageContainer = document.querySelector(".container")

    //audio that will play on receiving message
    var audio=new Audio('Ding.mp3');

    //function which will append event info to the container
    const append=(message,position)=>{
        const messageElement=document.createElement('div');

        messageElement.innerHTML=message+"<br><sub>"+DisplayCurrentTime()+"</sub>";
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        
        messageContainer.append(messageElement);
        if (position == 'left')
        {
            audio.play();
        }
    }

    //asks new user for his name and let the server know
    const name = prompt("Enter your name to join");
    socket.emit('new-user-joined',name)

    //if a new user joins, receive the event from the server
    socket.on('user-joined',name=>{
        append(`${name} joined the chat`,'right')
    })

    //if server sends a message, receive it
    socket.on('receive',data=> {
        append(`${data.name}:${data.message}`,'left')
    })

    //if a user leaves the chat, append the info to the container
    socket.on('left',name=>{
        append(`${name} left the chat`,'right')
    })

    formData.addEventListener('submit',(e)=>{
        e.preventDefault();
        const message =messageInput.value;
        $("#messageInp + div").html("");
        append(`You:${message} `,'right');
        socket.emit('send',message);      
        // messageInput.value='';
    })
    
}

function DisplayCurrentTime() {
    var date = new Date();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    time = hours + ":" + minutes ;
    return time
};
