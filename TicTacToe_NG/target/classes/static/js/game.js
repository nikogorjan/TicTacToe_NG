//"use strict";





const init = function(e)
{
    //INFORMACIJE PREJETE GLEDE NA GUMB ///////////////////////////////////////////////////////////////////////
    let spn = document.querySelector("#id_of_game");
    let name = localStorage.getItem('game-id');

    spn.innerHTML=name;

    let spn2 = document.querySelector("#oponent");
    let name2 = localStorage.getItem('usr-name');

    spn2.innerHTML=name2;

    let game_type = localStorage.getItem('game-type');
    //alert(game_type);

    let spn3 = document.querySelector("#oponent");
    let name3 = localStorage.getItem('usr-name-2');





    //SOCKETS//////////////////////////////////////////////////////////////////////////////////////////////////
    const url = 'http://localhost:8080';
    let stompClient;
    let gameId;
    let playerType;



    //povezava na id igre, ki je socket
    function connectToSocket(gameId) {

        console.log("connecting to the game");
        let socket = new SockJS(url + "/gameplay");
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log("connected to the frame: " + frame);
            stompClient.subscribe("/topic/game-progress/" + gameId, function (response) {
                let data = JSON.parse(response.body);
                console.log(data);
                displayResponse(data);
            })
        })
    }

    //ustvari igro na /game/start
    function create_game() {
        let login = document.getElementById("oponent").innerHTML;
        //alert(login);
        if (login == null || login === '') {
            alert("Please enter login");
        } else {
            $.ajax({
                url: url + "/game/start",
                type: 'POST',
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "login": login
                }),
                success: function (data) {
                    gameId = data.gameId;
                    playerType = 'X';
                    reset();
                    connectToSocket(gameId);    //gameid je vtičnica za prenos podatkov na katero se povežemo
                    alert("You created a game. Game id is: " + data.gameId);

                    let spn = document.querySelector("#id_of_game");
                    spn.innerHTML=data.gameId;

                    gameOn = true;
                },
                error: function (error) {
                    alert("failed to create a game.");
                    console.log(error);
                }
            })
        }
    }

    //izbere naključno igro
    function connectToRandom() {
        let login = document.getElementById("oponent").innerHTML;
        if (login == null || login === '') {
            alert("Please enter login");
        } else {
            $.ajax({
                url: url + "/game/connect/random",
                type: 'POST',
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "login": login
                }),
                success: function (data) {
                    gameId = data.gameId;
                    playerType = 'O';
                    reset();
                    connectToSocket(gameId);
                    alert("Congrats you're playing with: " + data.player1.login);


                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    }

    //povezava na določeno igro
    function connectToSpecificGame() {
        //alert("name3 :" + name3);
        let login = name3;//document.getElementById("oponent").innerHTML;
        //alert(login);
        if (login == null || login === '') {
            alert("Please enter login");
        } else {
            let gameId = name;//document.getElementById("changeid").innerHTML;
            //alert("game id: " + gameId);
            if (gameId == null || gameId === '') {
                alert("Please enter game id");
            }
            $.ajax({
                url: url + "/game/connect",
                type: 'POST',
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "player": {
                        "login": login
                    },
                    "gameId": gameId
                }),
                success: function (data) {
                    gameId = data.gameId;
                    playerType = 'O';
                    reset();
                    connectToSocket(gameId);
                    alert("Congrats you're playing with: " + data.player1.login);

                    let spn = document.querySelector("#id_of_game");
                    spn.innerHTML=data.gameId;

                    let spn2 = document.querySelector("#oponent");
                    spn2.innerHTML=login;
                },
                error: function (error) {
                    alert("failed to connect to: " + gameId);
                    console.log(error);
                }
            })
        }
    }


    //glede na kliknjeni gumb //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(game_type=="create")
    {
        create_game();
    }
    else if(game_type=="random")
    {
        connectToRandom();
    }
    else if(game_type=="connect")
    {
        //alert("connecting");
        connectToSpecificGame();
    }
    else if(game_type=="computer")
    {
        alert("playing against computer");
    }

};



document.addEventListener('DOMContentLoaded', function(){
    init();});



