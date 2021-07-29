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

bd = {
  usuario: [
    {
      username: "Hilton",
      senha: "1234",
      admin: true,
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

  Joinroom: function (call, callback) {
    const dados = call.request;

    const user = dados.user;
    const roomName = dados.roomName;
    const searchedUser = interpreter.searchLoggedUser(user);
    const searchedRoom = interpreter.searchRoom(roomName);

    if (searchedUser !== false && searchedRoom !== false) {
      interpreter.joinroom(searchedUser[0].user, searchedRoom[1]);
      const response = {
        status: 200,
        msg: `Você entrou na sala ${searchedRoom[0].roomName}`,
      };
      callback(null, response);
    } else {
      const response = {
        status: 404,
        msg: `Não foi possível entrar na sala`,
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
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Servidor gRPC rodando!");
    server.start();
  }
);
