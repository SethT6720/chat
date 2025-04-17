let counter = 0;

const socket = io("https://chat-sel3.onrender.com",{
    auth: {
        serverOffset: '0'
    },
    ackTimeout: 10000,
    retries: 3,
});

const form = document.querySelector('#form');
const input = document.querySelector('#input');
const messages = document.querySelector('#messages');
const toggleButton = document.querySelector('#toggle-btn');


function addMessage(msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}


form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        const clientOffset = `${socket.id}-${counter++}`;
        socket.emit('chat message', input.value, clientOffset);
        input.value = '';
    }
});

socket.on('chat message', (msg, serverOffset) => {
    addMessage(msg);
    socket.auth.serverOffset = serverOffset;
});

socket.on('connect', () => {
    toggleButton.innerText = 'Disconnect';
    addMessage('*connected*');
});

socket.on('disconnect', () => {
    toggleButton.innerText = 'Connect';
    addMessage('*disconnected*');
});

toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (socket.connected) {
        toggleButton.innerText = 'Connect';
        socket.disconnect();
    } else {
        toggleButton.innerText = 'Disconnect';
        socket.connect();
    }
});