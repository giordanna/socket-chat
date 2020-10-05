let socket = null;
let usuario = null;
let idSala = null;
let carregandoDom = null;
let sucessoDom = null;
let erroDom = null;
let listaMensagens = null;
let listaPessoas = null;
let nomeSala = null;

init = () => {
  carregandoDom = document.getElementById("carregando");
  sucessoDom = document.getElementById("sucesso");
  erroDom = document.getElementById("erro");
  listaMensagens = document.getElementById("lista-mensagens");
  listaPessoas = document.getElementById("lista-pessoas");
  nomeSala = document.getElementById("nome-sala");

  let pathName = window.location.pathname.split("/");
  idSala = pathName[pathName.length - 1];

  nomeSala.innerText = " - Sala ID#" + idSala;

  usuario = consultarUsuario();

  const sala = usuario.salas.find((sala) => sala.id === idSala);

  if (sala) {
    try {
      socket = io({
        transports: ["websocket"],
        query: {
          usuario: usuario.nick,
          sala: sala.id,
          senha: sala.hash,
        },
      });

      socket.on("connect", () => {
        carregandoDom.classList.add("hidden");
        sucessoDom.classList.remove("hidden");
        adicionarListeners();
        socket.emit("user-login", idSala, usuario.nick);
      });

      socket.on("error", (error) => {
        carregandoDom.classList.add("hidden");
        erroDom.innerText = error;
        erroDom.classList.remove("hidden");
        console.error(error);
        socket.disconnect(true);
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    carregandoDom.classList.add("hidden");
    erroDom.innerText = "Seu usuário não possui informação desta sala.";
    erroDom.classList.remove("hidden");
  }
};

adicionarListeners = () => {
  socket.on("mensagem", (mensagem, usuarioNick) => {
    listaMensagens.innerHTML +=
      "<li><div>" + usuarioNick + " diz:</div>" + mensagem + "</li>";

    listaMensagens.scrollTop = listaMensagens.scrollHeight;
  });

  socket.on("user-login", (usuarioNick, roster) => {
    listaMensagens.innerHTML +=
      "<li class='aviso'>" + usuarioNick + " entrou na sala" + "</li>";
    atualizarLista(roster);
  });

  socket.on("user-logout", (usuarioNick, roster) => {
    listaMensagens.innerHTML +=
      "<li class='aviso'>" + usuarioNick + " saiu na sala" + "</li>";
    atualizarLista(roster);
  });

  window.addEventListener("beforeunload", (event) => {
    socket.emit("user-logout", idSala, usuario.nick);
  });
};

enviarMensagem = (event) => {
  const formularioElementos = event.target.elements;

  socket.emit(
    "mensagem",
    idSala,
    formularioElementos["mensagem"].value,
    usuario.nick
  );

  listaMensagens.innerHTML +=
    "<li class='propria-mensagem'>" + "<div>Você diz:</div>" + formularioElementos["mensagem"].value + "</li>";

  listaMensagens.scrollTop = listaMensagens.scrollHeight;

  formularioElementos["mensagem"].value = "";
};

atualizarLista = (usuarios) => {
  listaPessoas.innerHTML = "";
  usuarios.map((usuarioNick) => {
    if (usuario.nick === usuarioNick) {
      listaPessoas.innerHTML += "<li>" + usuarioNick + " (você)</li>";
    } else {
      listaPessoas.innerHTML += "<li>" + usuarioNick + "</li>";
    }
  });
};

sair = () => {
  window.open(window.location.origin, "_self");
};

limparChat = () => {
  listaMensagens.innerHTML = "";
};
