const PROTO_PATH = "./chat.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const Interpreter = require("./app.js");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const bd = {
  usuario: [
    {
      username: "Hilton",
      senha: "1234",
      admin: true,
    },
    {
      username: "Pablo",
      senha: "1234",
      admin: false,
    },
  ],
  online: [],
  sala: [],
};

const interpreter = new Interpreter(bd);

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).chat;
const messageChat = protoDescriptor.MessageChat;
const server = new grpc.Server();

server.addService(messageChat.service, {
  Ban: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const adminUser = dados.adminUser;
    const roomName = dados.roomName;

    const searchedUser = interpreter.searchLoggedUser(user);
    const searchedAdminUser = interpreter.searchLoggedUser(adminUser);
    const searchedRoom = interpreter.searchRoom(roomName);

    if (
      searchedUser !== false &&
      searchedAdminUser !== false &&
      searchedRoom !== false
    ) {
      if (searchedAdminUser[0].user.admin) {
        const response = interpreter.ban(searchedUser[0], searchedRoom[1]);
        callback(null, response);
      } else {
        const response = {
          status: 404,
          msg: `Você precisa de permissão de administrador para realizar esse comando`,
        };
        callback(null, response);
      }
    } else {
      const response = {
        status: 404,
        msg: `Não foi possível concluir a solicitação`,
      };
      callback(null, response);
    }
  },

  CreateAccount: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const senha = dados.senha;
    const index = interpreter.searchUser(user);

    if (index == false) {
      interpreter.createAccount(user, senha);
      const response = {
        status: 200,
        msg: `Usuário cadastrado com sucesso`,
      };
      callback(null, response);
    } else {
      const response = {
        status: 404,
        msg: `Usuário não cadastrado`,
      };
      callback(null, response);
    }
  },

  CreateRoom: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const roomName = dados.roomName;
    const searchedUser = interpreter.searchLoggedUser(user);
    const searchedRoom = interpreter.searchRoom(roomName);

    if (
      searchedUser !== false &&
      searchedUser[0].user.admin == true &&
      searchedRoom == false
    ) {
      interpreter.createRoom(roomName);
      const response = {
        status: 200,
        msg: `Sala criada com sucesso`,
      };
      callback(null, response);
    } else {
      const response = {
        status: 404,
        msg: `Sala não criada`,
      };
      callback(null, response);
    }
  },

  GetMessage: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const searchedUser = interpreter.searchLoggedUser(user);

    if (searchedUser !== false) {
      if (searchedUser[0].room !== undefined) {
        const messages = interpreter.getMessages(searchedUser[0]);
        callback(null, { mensagens: messages });
      }
    }
  },

  Help: function (call, callback) {
    const response = {
      msg: `
    /ban *usuario* *sala*
    /createaccount *usuario* *senha*
    /createroom *nome da sala*
    /joinroom *nome da sala*
    /kick *usuario* *sala*
    /login *usuario* *senha*
    /promotetoadmin *codigo de administrador*
    /showroom`,
      status: 200,
    };
    callback(null, response);
  },

  Joinroom: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const roomName = dados.roomName;

    const searchedUser = interpreter.searchLoggedUser(user);
    const searchedRoom = interpreter.searchRoom(roomName);

    if (searchedUser !== false && searchedRoom !== false) {
      if (searchedRoom[0].blacklist.includes(searchedUser[0].user.username)) {
        const response = {
          status: 404,
          msg: `Você está banido dessa sala`,
        };
        callback(null, response);
      } else {
        interpreter.joinroom(searchedUser[0].user, searchedRoom[1]);
        const response = {
          status: 200,
          msg: `Você entrou na sala ${searchedRoom[0].roomName}`,
        };
        callback(null, response);
      }
    } else {
      const response = {
        status: 404,
        msg: `Não foi possível entrar na sala`,
      };
      callback(null, response);
    }
  },

  Kick: function (call, callback) {
    const dados = call.request;
    const user = dados.user;
    const adminUser = dados.adminUser;
    const roomName = dados.roomName;

    const searchedUser = interpreter.searchLoggedUser(user);
    const searchedAdminUser = interpreter.searchLoggedUser(adminUser);
    const searchedRoom = interpreter.searchRoom(roomName);

    if (
      searchedUser !== false &&
      searchedAdminUser !== false &&
      searchedRoom !== false
    ) {
      if (searchedAdminUser[0].user.admin) {
        const response = interpreter.kick(searchedUser[0], searchedRoom[1]);
        callback(null, response);
      } else {
        const response = {
          status: 404,
          msg: `Você precisa de permissão de administrador para realizar esse comando`,
        };
        callback(null, response);
      }
    } else {
      const response = {
        status: 404,
        msg: `Não foi possível concluir a solicitação`,
      };
      callback(null, response);
    }
  },

  Login: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const senha = dados.senha;
    const searchedUser = interpreter.searchUser(user);
    const searchedLoggedUser = interpreter.searchLoggedUser(user);

    if (searchedLoggedUser !== false) {
      const response = {
        status: 200,
        msg: `Usuário ${user} já está logado`,
      };
      callback(null, response);
    } else if (searchedUser !== false && searchedUser[0].senha === senha) {
      interpreter.login(searchedUser[0]);
      const response = {
        status: 200,
        msg: `Usuário ${user} logado com sucesso`,
      };

      callback(null, response);
    } else {
      const response = {
        status: 404,
        msg: `Usuário não logado`,
      };

      callback(null, response);
    }
  },

  PromoteToAdmin: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const senha = dados.senha;
    const index = interpreter.searchUser(user);

    if (senha === "147852369" && index !== false) {
      interpreter.promoteToAdmin(index[1]);
      const response = {
        status: 200,
        msg: `Usuário ${user} promovido para admin com sucesso`,
      };

      callback(null, response);
    } else {
      const response = {
        status: 404,
        msg: `Solicitação não concluída`,
      };

      callback(null, response);
    }
  },

  SendMessage: function (call, callback) {
    const dados = call.request;

    const message = dados.message;
    const user = dados.user;

    const searchedLoggedUser = interpreter.searchLoggedUser(user);

    if (searchedLoggedUser !== false) {
      if (searchedLoggedUser[0].room !== undefined) {
        interpreter.sendMessage(
          searchedLoggedUser[0].user.username,
          message,
          searchedLoggedUser[0].room
        );
      } else {
        const response = {
          status: 404,
          msg: `Você precisa estar em uma sala para enviar mensagens`,
        };
        callback(null, response);
      }
    } else {
      const response = {
        status: 404,
        msg: `Você precisa estar logado para enviar mensagens`,
      };
      callback(null, response);
    }
  },

  ShowRoom: function (call, callback) {
    const response = interpreter.showRoom();
    callback(null, response);
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Servidor gRPC rodando!");
    server.start();
  }
);
