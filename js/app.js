/***************************************************

FUNCOES QUE PREPARAM UMA PARTIDA

**************************************************/
function criar_botaoJogar() {
    const botao_jogar = document.createElement("button");
    botao_jogar.id = "comecar_partida";
    botao_jogar.textContent = "Jogar";

    //botao criado, agora falta adiciona-lo dinamicamente na nossa pagina html
    //ele ficara dentro da tag main, reservada para ele e o tabuleiro
    const divComecar = document.querySelector(".comecar");
    divComecar.appendChild(botao_jogar);
}

function iniciar_tabuleiro() {
    const botao_jogar = document.querySelector("#comecar_partida");
    const containerTabuleiro = document.querySelector(".container");
    const tabuleiro = document.querySelector(".tabuleiro");

    botao_jogar.addEventListener("click", function (event) {
        containerTabuleiro.style.display = "flex";
        tabuleiro.style.display = "block";
        indicarVez();
        atualizarPlacar();
    });

}

function reiniciarPartida(){
    const botoes_do_tabuleiro = document.querySelectorAll(".tabuleiro button");
    
    //limpando desenhos e ativando botoes novamente
    botoes_do_tabuleiro.forEach(botao => {
        botao.disabled = false;
        botao.style.backgroundImage = '';
    }
    );

    //reiniciando mapeamento
    mapeamento = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    //reiniciando turnos
    contador_turno = 1;

    //definindo vencedor para 0 novamente
    num_jogador_vencedor = 0;

    //apagando o texto que indica vencedor
    const elementoJogadorVencedor = document.querySelector("#abaixo_tabuleiro");
    elementoJogadorVencedor.textContent = "";

    //removendo botao revanche
    botaoRevanche.style.display = "none";

    //removendo finalizar partida
    finalizaPartida.style.display = "none";
}




/***************************************************

EVENTOS DE CLICK DA PRONTIDAO DE JOGADOR 1 E JOGADOR 2

**************************************************/

let nomeJogador1 = "";
let nomeJogador2 = "";
let botao_jogarCriado = false;

const botao_pronto1 = document.querySelector("#pronto1");
const botao_pronto2 = document.querySelector("#pronto2");

const inputJogador1 = document.querySelector("#nomeJogador1");
const inputJogador2 = document.querySelector("#nomeJogador2");


//adicionando um evento ao botao, que ocorrerá atraves do click do mouse
botao_pronto1.addEventListener("click", function (event) {

    event.preventDefault(); //impedir o comportamento padrão de um evento, que seria enviar os dados do formulário para o servidor e recarregar a página.
    //inserindo agora o meu evento personalizado, que será guardar o nome do jogador 1
    if(inputJogador1.value != ""){
        botao_pronto1.style.backgroundImage = "none";
        botao_pronto1.innerText = "";
        botao_pronto1.style.backgroundImage = 'url("img/check.png")';
        botao_pronto1.style.backgroundPosition = "center";
        botao_pronto1.style.backgroundColor = "lightgreen";
        botao_pronto1.style.color = "white";
        nomeJogador1 = inputJogador1.value;
        botao_pronto1.disabled = true;
    }

    //verificando se o jogo ja pode começar
    if (nomeJogador1 !== "" && nomeJogador2 !== "" && !botao_jogarCriado) {
        criar_botaoJogar();
        iniciar_tabuleiro();
        botao_jogarCriado = true;
    }
});

botao_pronto2.addEventListener("click", function (event) {
    
    event.preventDefault(); //impedir o comportamento padrão de um evento, que seria enviar os dados do formulário para o servidor e recarregar a página.
    //inserindo agora o meu evento personalizado, que será guardar o nome do jogador 1
    if(inputJogador2.value != ""){
        botao_pronto2.style.backgroundImage = "none";
        botao_pronto2.innerText = "";
        botao_pronto2.style.backgroundImage = 'url("img/check.png")';
        botao_pronto2.style.backgroundPosition = "center";
        botao_pronto2.style.backgroundColor = "lightgreen";
        botao_pronto2.style.color = "white";
        nomeJogador2 = inputJogador2.value;
        botao_pronto2.disabled = true;
    }

    //verificando se o jogo ja pode começar
    if (nomeJogador1 !== "" && nomeJogador2 !== "" && !botao_jogarCriado) {
        criar_botaoJogar();
        iniciar_tabuleiro();
        botao_jogarCriado = true;
    }
});




/***************************************************

FUNCOES PARA A LOGICA DO JOGO

**************************************************/
function jogadorAtual() {
    return contador_turno % 2 === 1 ? nomeJogador1 : nomeJogador2;
}


function indicarVez() {
    const elementoNomeJogador = document.querySelector("#acima_tabuleiro");
    elementoNomeJogador.textContent = "Turno do(a) " + jogadorAtual();
}


function atualizarMapeamento(coordenadaX, coordenadaY) {

    if (contador_turno % 2 === 1) {
        mapeamento[coordenadaX][coordenadaY] = 1; //jogador 1, ou seja, o X, foi marcado nessa posicao
    } else {
        mapeamento[coordenadaX][coordenadaY] = 2;//se nao, jogador 2, ou seja, o O, foi marcado nessa posicao;
    }
    if (contador_turno >= 5) verificaVencedor(coordenadaX, coordenadaY, mapeamento[coordenadaX][coordenadaY]);

}


function adicionarDesenho(area_clicada) {
    const id_area_clicada = document.getElementById(area_clicada);

    if (contador_turno % 2 === 1) {
        id_area_clicada.style.backgroundImage = 'url("img/x.png")';
    } else {
        id_area_clicada.style.backgroundImage = 'url("img/circulo.png")';
    }


    if (num_jogador_vencedor === 0)
        contador_turno++; //jogador escolheu a area desejada e ninguem ganhou ate agora, então, vez do proximo
}


function verificaVencedor(i, j, numero_jogador) {
    let aux_i = i, aux_j = j;
    let vencedor_encontrado = false;

    
    //verificando vitoria diagonal principal
    if (!vencedor_encontrado){
        for(aux_i = 0, contador_desenho = 0; aux_i < 3 && mapeamento[aux_i][aux_i] === numero_jogador; aux_i++);

        if (aux_i === 3) {
            vencedor_encontrado = true;
            num_jogador_vencedor = numero_jogador;
        }else{
            aux_i = i; aux_j = j;
        }
    }
    //verificando vitoria na diagonal secundaria
    if (!vencedor_encontrado){
        for(aux_i = 0, contador_desenho = 0; aux_i < 3 && mapeamento[aux_i][2-aux_i] === numero_jogador; aux_i++);

        if (aux_i === 3) {
            vencedor_encontrado = true;
            num_jogador_vencedor = numero_jogador;
        }else{
            aux_i = i; aux_j = j;
        }
    }
    //verificando vitoria na linha
    if (!vencedor_encontrado) {
        for (aux_j = 0, contador_desenho = 0; aux_j < 3 && mapeamento[aux_i][aux_j] === numero_jogador; aux_j++);

        if (aux_j === 3){ //achou 3 desenhos iguais, seja X ou O
            vencedor_encontrado = true;
            num_jogador_vencedor = numero_jogador;
        }else{
            aux_i = i; aux_j = j;
        }
    }
    //verificando vitoria na coluna
    if (!vencedor_encontrado) {
        for(aux_i = 0, contador_desenho = 0; aux_i < 3 && mapeamento[aux_i][aux_j] === numero_jogador; aux_i++);

        if (aux_i === 3) {
            vencedor_encontrado = true;
            num_jogador_vencedor = numero_jogador;
        }else{
            aux_i = i; aux_j = j;
        }
    }
}

function indicarVencedor() {
    const elementoJogadorVencedor = document.querySelector("#abaixo_tabuleiro");
    jogadorAtual() == nomeJogador1? contador_vitoriaJ1++ : contador_vitoriaJ2++;
    elementoJogadorVencedor.textContent = "Vencedor: " + jogadorAtual();
}

function indicarEmpate() {
    const elementoEmpate = document.querySelector("#abaixo_tabuleiro");
    contador_vitoriaJ1++; contador_vitoriaJ2++;
    elementoEmpate.textContent = "Deu Velha";
}

function desabilitarBotoes(){
    const botoes_do_tabuleiro = document.querySelectorAll(".tabuleiro button");

    botoes_do_tabuleiro.forEach(botao => {
        botao.disabled = true;
    }
    );
}

function criar_botaoRevanche(){
    botaoRevanche.style.display = "flex";
    finalizaPartida.style.display = "flex";
}

function atualizarPlacar(){
    const elementoPlacar = document.querySelector("#placar");
    elementoPlacar.textContent = nomeJogador1 + " " + contador_vitoriaJ1 + " X " + contador_vitoriaJ2 + " " + nomeJogador2;
}




/***************************************************

EVENTOS DE CLICK DURANTE A PARTIDA, QUANDO USUARIO CLICA NO TABULEIRO

**************************************************/

let contador_turno = 1;
let contador_vitoriaJ1 = 0;
let contador_vitoriaJ2 = 0;

let mapeamento = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let num_jogador_vencedor = 0;

const tabuleiro = document.querySelector(".tabuleiro");
const botaoRevanche = document.querySelector("#comecar_revanche");
const finalizaPartida = document.querySelector(".exibe_finalizar a");

tabuleiro.addEventListener("click", function (event) {
    //event.target - se refere ao elemento HTML que foi clicado
    if (event.target.tagName === "BUTTON") {
        // O ID do botão clicado será algo como "areaXY"
        const id = event.target.id;

        const [x, y] = id.split("area").pop().split("");
        //com o split estou dividindo a string em duas partes, delimitando a partir de area, exemplo: ["area", "21"]
        //nesse array resultante, o pop permite remover o primeiro elemento, restando: ["21"]
        //então, split com "" no parametro indica que quero separar cada caracter individualmente
        //portanto, meu array de string resultante seria ["2", "1"], e, agora isso é valido para [x, y] 

        //Como filtrei essa string ate ter as coordenadas isoladas, posso saber qual quadro foi clicado
        event.target.disabled = true;
        atualizarMapeamento(x, y);
        adicionarDesenho(event.target.id);

        if (num_jogador_vencedor === 0)
            indicarVez();
        else {
            indicarVencedor();
            atualizarPlacar();
            desabilitarBotoes();
            criar_botaoRevanche();
        }
        if(contador_turno === 10 && num_jogador_vencedor === 0){
            indicarEmpate();
            atualizarPlacar();
            criar_botaoRevanche();
        }
    }
});


const revanche = document.querySelector(".exibe_revanche");

revanche.addEventListener("click", function(event){

    reiniciarPartida();
    indicarVez();

});
