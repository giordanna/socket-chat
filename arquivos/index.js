let usuario = null;

init = () => {
  usuario = consultarUsuario();
};

tentarEntrarChat = async (event) => {
  const formularioElementos = event.target.elements;

  defineDisabled(formularioElementos, true);

  fetch("/privado/" + formularioElementos["id"].value, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senha: btoa(formularioElementos["senha"].value) }),
  })
    .then((resp) => {
      defineDisabled(formularioElementos, false);

      if (resp.status === 200) {
        usuario = consultarUsuario();

        const index = usuario.salas.findIndex(
          (sala) => sala.id == formularioElementos["id"].value
        );
        if (index === -1) {
          usuario.salas.push({
            id: formularioElementos["id"].value,
            hash: btoa(formularioElementos["senha"].value),
          });
        } else {
          usuario.salas[index] = {
            id: formularioElementos["id"].value,
            hash: btoa(formularioElementos["senha"].value),
          };
        }

        editarUsuario(usuario);

        window.open("/privado/" + formularioElementos["id"].value, "_self");
      } else {
        mostrarErro(resp.statusText);
      }
    })
    .catch((error) => {
      defineDisabled(formularioElementos, false);
      mostrarErro(error.message);
    });
};

criarSalaPrivada = (event) => {
  const formularioElementos = event.target.elements;
  const sala = gerarId(5);

  defineDisabled(formularioElementos, true);

  fetch("/privado", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: sala,
      senha: btoa(formularioElementos["senha"].value),
    }),
  })
    .then((resp) => {
      defineDisabled(formularioElementos, false);

      if (resp.status === 200) {
        let usuario = JSON.parse(localStorage.getItem("usuario"));

        if (usuario) {
          usuario.salas.push({
            id: sala,
            hash: btoa(formularioElementos["senha"].value),
          });
        } else {
          usuario = {
            nick: "anonimo_" + gerarId(5),
            salas: [
              {
                id: sala,
                hash: btoa(formularioElementos["senha"].value),
              },
            ],
          };
        }

        editarUsuario(usuario);

        window.open("/privado/" + sala, "_self");
      } else {
        mostrarErro(resp.statusText);
      }
    })
    .catch((error) => {
      defineDisabled(formularioElementos, false);

      mostrarErro(error.message);
    });
};

validarCampo = (event, id) => {
  const dom = document.getElementById(id);

  if (event.target.value === "") {
    dom.innerText = "* Campo Obrigatório";
  } else {
    dom.innerHTML = "&nbsp;";
  }
};

fecharToast = () => {
  const toastDom = document.getElementById("toast-aviso");

  toastDom.classList.remove("aparecer");
};

mostrarErro = (mensagem) => {
  const toastDom = document.getElementById("toast-aviso");
  const toastTextDom = document.getElementById("toast-aviso-texto");

  toastTextDom.innerText = mensagem;
  toastDom.classList.add("aparecer");

  setTimeout(() => {
    toastDom.classList.remove("aparecer");
  }, 5000);
};

defineDisabled = (elements, disabled) => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = disabled;
  }
};
