# chat-node-grpc
Projeto desenvolvido para a cadeira de Sistemas Distribuidos com o intuito de modelar um chat utilizando a tecnologia gRPC e NodeJs

## Requisitos
* node 
* gRPC

## Instalação
* executar npm install dentro do diretório principal da aplicação

## Iniciando a aplicação
Iniciando o servidor:
* node server.js
Iniciando o cliente:
* node client.js

**ATENÇÃO: Para criar salas é necessário entrar como administrador** <br>
**Se promover para admin: /promotetoadmin 147852369 ou o usuário admin já cadastrado usuario: Hilton, senha: 1234**

## Comandos
* Listar comandos: /help
* Criar conta: /createaccount nome_de-usuario senha (ex: /createaccount Rafael 12345)
* Login: /login nome_de_usuario senha (ex: /login Rafael 12345)
* Promover-se a administrador: /promotetoadmin 147852369  
* Criar salas: /createroom nome_da_sala (ex:/createroom SistemasDistribuidos)
* Mostrar salas: /showroom
* Entrar em sala: /joinroom nome_da_sala (ex: /joinroom SistemasDistribuidos)
* Remover usuário da sala: /kick nome_do_usuario nome_da_sala (ex: kick Hilton SistemasDistribuidos)
* Banir usuário da sala: /ban nome_do_usuario nome_da_sala (ex: /ban Hilton SistemasDistribuidos)

**ATENÇÃO para o recebimento de novas mensagens deve se enviar o texto vazio para atualização de mensgaens não recebidas**<br>
Pela limitação do terminal, teve-se que optar pelo recebimento de mensagens via requisição do cliente manualmente.
