const socketClient = io();
const mensajePersonalizado = document.getElementById("mensajePersonalizado");
const inputMesg = document.getElementById("inputMesg");
const sendBtn = document.getElementById("sendBtn");
const panelChat = document.getElementById("panelChat");

let user;

Swal.fire({
  title: "Chat",
  text: "Ingresa tu nombre de usuario",
  input: "text",
  inputValidator: (value) => {
    return !value && "Debes ingresar tu usuario";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((inputValue) => {
  /* console.log(inputValue) */
  user = inputValue.value;
  /* console.log(user) */
  mensajePersonalizado.innerHTML = `Hola ${user}, este va a ser tu primer chat`;
  socketClient.emit("userConected", user);
});

/* inputMesg.addEventListener("keydown") */ //Enviar el mensaje con un enter por ejemplo

sendBtn.addEventListener("click", () => {
  const message = { user, message: inputMesg.value };
  socketClient.emit("messageChat", message);
  inputMesg.value = "";
});

socketClient.on("historyChat", (historyChat) => {
  let chatElems = "";
  historyChat.forEach((e) => {
    chatElems += `<p class="mensajes">Usuario: ${e.user} /////// Said: ${e.message}</p>`;
  });
  panelChat.innerHTML = chatElems;
});

//Recibimos el aviso de un nuevo usuario conectado

socketClient.on("newUser", (datanewUser) => {
  if (user) {
    Swal.fire({
      text: datanewUser,
      toast: true,
      position: "top-right",
    });
  }
});
