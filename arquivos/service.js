gerarId = (tamanho) => {
  let codigo = "";
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const total = caracteres.length;
  for (let i = 0; i < tamanho; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * total));
  }
  return codigo;
};

consultarUsuario = () => {
  let usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    usuario = {
      nick: "anonimo_" + gerarId(5),
      salas: [
        {
          id: "all",
          hash: "",
        },
      ],
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
  }

  return usuario;
};

editarUsuario = (usuario) => {
  localStorage.setItem("usuario", JSON.stringify(usuario));
};
