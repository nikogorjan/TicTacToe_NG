"use strict";

const init = function(e)
{
    let btn = document.querySelector("#login_btn");

    btn.addEventListener('click', function()
    {
        var name = document.getElementById("usr").value;
        localStorage.setItem('usr-name', name);
        document.getElementById("body1").innerHTML = "<div class=\"center_lobby\" >\n" +
            "            <div id=\"welcome\"><span>Welcome </span><span id=\"client_name\"></span></div>\n" +
            "            <button type=\"button\" class=\"btn btn-default\" id=\"create_btn\">Create lobby</button>\n" +
            "            <button type=\"button\" class=\"btn btn-default\" id=\"play_btn\" >Play vs computer</button>\n" +
            "            <button type=\"button\" class=\"btn btn-default\" id=\"connect_random_btn\" >Connect to random</button>\n" +
            "\n" +
            "\n" +
            "            <div class=\"form-group\" id=\"input\">\n" +
            "                <label for=\"game_id\">Game ID:</label>\n" +
            "                <input type=\"text\" class=\"form-control\" id=\"game_id\">\n" +
            "                <button type=\"button\" class=\"btn btn-default\" id=\"connect_btn\" >Connect</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "\n" +
            "        <script src=\"js/lobby.js\"></script>\n" +
            "        <script src=\"js/script.js\"></script>\n" +
            "        <script src=\"js/socket_js.js\"></script>";

        let spn = document.querySelector("#client_name");
        let name1 = localStorage.getItem('usr-name');

        spn.innerHTML=name1;


        //BUTTON CREATE
        let create_btn = document.querySelector("#create_btn");

        create_btn.addEventListener('click', function()
        {
            var game_id = "game id"; //document.getElementById("usr").value;
            localStorage.setItem('game-id', game_id);

            var name = document.getElementById("client_name").innerHTML;
            localStorage.setItem('usr-name', name);

            var game_type = "create";
            localStorage.setItem('game-type', game_type);

            document.getElementById("body1").innerHTML = "<div class=\"center_game\" >\n" +
                "\n" +
                "            <div class=\"board\">\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_0_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_0_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_0_2\"></div>\n" +
                "            </div>\n" +
                "\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_1_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_1_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_1_2\"></div>\n" +
                "            </div>\n" +
                "\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_2_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_2_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_2_2\"></div>\n" +
                "            </div>\n" +
                "            </div>\n" +
                "                    \n" +
                "                \n" +
                "            \n" +
                "        </div>\n" +
                "\n" +
                "        <div class=\"id_of_game\" id=\"id_of_game\"><span id=\"changeid\">Game ID: </span></div>\n" +
                "        <div class=\"oponent\"><span id=\"oponent\"></span></div>\n" +
                "\n" +
                "\n" +
                "        <script src=\"js/script.js\"></script>\n" +
                "        <script src=\"js/socket_js.js\"></script>\n" +
                "        <script src=\"js/game.js\"></script>";

            //INFORMACIJE PREJETE GLEDE NA GUMB ///////////////////////////////////////////////////////////////////////
            let spn = document.querySelector("#id_of_game");
            let name4 = localStorage.getItem('game-id');

            spn.innerHTML=name4;

            let spn2 = document.querySelector("#oponent");
            let name2 = localStorage.getItem('usr-name');

            spn2.innerHTML=name2;



            //let spn3 = document.querySelector("#oponent");
            //let name3 = localStorage.getItem('usr-name-2');

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

            create_game();

            var turns = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
            var turn = "";
            var gameOn = false;

            function playerTurn(turn, id) {
                if (gameOn) {
                    var spotTaken = $("#" + id).text();
                    if (spotTaken === " ") {
                        makeAMove(playerType, id.split("_")[1], id.split("_")[2]);
                    }
                }
            }

            function makeAMove(type, xCoordinate, yCoordinate) {
                $.ajax({
                    url: url + "/game/gameplay",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "type": type,
                        "coordinateX": xCoordinate,
                        "coordinateY": yCoordinate,
                        "gameId": gameId
                    }),
                    success: function (data) {
                        gameOn = false;
                        displayResponse(data);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            }

            function displayResponse(data) {
                let board = data.board;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 1) {
                            turns[i][j] = 'X'
                        } else if (board[i][j] === 2) {
                            turns[i][j] = 'O';
                        }
                        let id = "f_" + i + "_" + j;
                        $("#" + id).text(turns[i][j]);
                    }
                }
                if (data.winner != null) {
                    alert("Winner is " + data.winner);
                }
                gameOn = true;
            }

            $(".field").click(function () {
                var slot = $(this).attr('id');
                playerTurn(turn, slot);
            });

            function reset() {
                turns = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
                $(".field").text(" ");
            }

            $("#reset").click(function () {
                reset();
            });
        });



        //BUTTON PLAY VS COMPUTER

        let play_btn = document.querySelector("#play_btn");

        play_btn.addEventListener('click', function()
        {
            var game_id = "playing against computer"; //document.getElementById("usr").value;
            localStorage.setItem('game-id', game_id);

            var name = document.getElementById("client_name").innerHTML;
            localStorage.setItem('usr-name', name);

            var game_type = "computer";
            localStorage.setItem('game-type', game_type);
            window.document.location = './game.html';
            //alert("start game");

            //BEGIN implementation

            //END implementation
            //startGame();
        });




        //BUTTON CONNECT TO RANDOM
        let connect_random_btn = document.querySelector("#connect_random_btn");

        connect_random_btn.addEventListener('click', function()
        {
            var game_id = "connected to random game"; //document.getElementById("usr").value;
            localStorage.setItem('game-id', game_id);

            var name = document.getElementById("client_name").innerHTML;
            localStorage.setItem('usr-name', name);

            var game_type = "random";
            localStorage.setItem('game-type', game_type);

            document.getElementById("body1").innerHTML = "<div class=\"center_game\" >\n" +
                "\n" +
                "            <div class=\"board\">\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_0_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_0_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_0_2\"></div>\n" +
                "            </div>\n" +
                "\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_1_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_1_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_1_2\"></div>\n" +
                "            </div>\n" +
                "\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_2_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_2_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_2_2\"></div>\n" +
                "            </div>\n" +
                "            </div>\n" +
                "                    \n" +
                "                \n" +
                "            \n" +
                "        </div>\n" +
                "\n" +
                "        <div class=\"id_of_game\" id=\"id_of_game\"><span id=\"changeid\">Game ID: </span></div>\n" +
                "        <div class=\"oponent\"><span id=\"oponent\"></span></div>\n" +
                "\n" +
                "\n" +
                "        <script src=\"js/script.js\"></script>\n" +
                "        <script src=\"js/socket_js.js\"></script>\n" +
                "        <script src=\"js/game.js\"></script>";

            //INFORMACIJE PREJETE GLEDE NA GUMB ///////////////////////////////////////////////////////////////////////
            let spn = document.querySelector("#id_of_game");
            let name4 = localStorage.getItem('game-id');

            spn.innerHTML=name4;

            let spn2 = document.querySelector("#oponent");
            let name2 = localStorage.getItem('usr-name');

            spn2.innerHTML=name2;



            //let spn3 = document.querySelector("#oponent");
            //let name3 = localStorage.getItem('usr-name-2');

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
            connectToRandom();

            var turns = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
            var turn = "";
            var gameOn = false;

            function playerTurn(turn, id) {
                if (gameOn) {
                    var spotTaken = $("#" + id).text();
                    if (spotTaken === " ") {
                        makeAMove(playerType, id.split("_")[1], id.split("_")[2]);
                    }
                }
            }

            function makeAMove(type, xCoordinate, yCoordinate) {
                $.ajax({
                    url: url + "/game/gameplay",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "type": type,
                        "coordinateX": xCoordinate,
                        "coordinateY": yCoordinate,
                        "gameId": gameId
                    }),
                    success: function (data) {
                        gameOn = false;
                        displayResponse(data);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            }

            function displayResponse(data) {
                let board = data.board;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 1) {
                            turns[i][j] = 'X'
                        } else if (board[i][j] === 2) {
                            turns[i][j] = 'O';
                        }
                        let id = "f_" + i + "_" + j;
                        $("#" + id).text(turns[i][j]);
                    }
                }
                if (data.winner != null) {
                    alert("Winner is " + data.winner);
                }
                gameOn = true;
            }

            $(".field").click(function () {
                var slot = $(this).attr('id');
                playerTurn(turn, slot);
            });

            function reset() {
                turns = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
                $(".field").text(" ");
            }

            $("#reset").click(function () {
                reset();
            });

        });



        //BUTTON CONNECT
        let connect_btn = document.querySelector("#connect_btn");

        connect_btn.addEventListener('click', function()
        {
            var game_id = document.getElementById("game_id").value; //document.getElementById("usr").value;
            localStorage.setItem('game-id', game_id);

            var game_type = "connect";
            localStorage.setItem('game-type', game_type);

            //var name = document.getElementById("client_name").innerHTML;
            //localStorage.setItem('usr-name-2', name);

            document.getElementById("body1").innerHTML = "<div class=\"center_game\" >\n" +
                "\n" +
                "            <div class=\"board\">\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_0_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_0_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_0_2\"></div>\n" +
                "            </div>\n" +
                "\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_1_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_1_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_1_2\"></div>\n" +
                "            </div>\n" +
                "\n" +
                "            <div class=\"block_container\">\n" +
                "                <div class=\"field\" id=\"f_2_0\"></div>\n" +
                "                <div class=\"field\" id=\"f_2_1\"></div>\n" +
                "                <div class=\"field\" id=\"f_2_2\"></div>\n" +
                "            </div>\n" +
                "            </div>\n" +
                "                    \n" +
                "                \n" +
                "            \n" +
                "        </div>\n" +
                "\n" +
                "        <div class=\"id_of_game\" id=\"id_of_game\"><span id=\"changeid\">Game ID: </span></div>\n" +
                "        <div class=\"oponent\"><span id=\"oponent\"></span></div>\n" +
                "\n" +
                "\n" +
                "        <script src=\"js/script.js\"></script>\n" +
                "        <script src=\"js/socket_js.js\"></script>\n" +
                "        <script src=\"js/game.js\"></script>";

            //INFORMACIJE PREJETE GLEDE NA GUMB ///////////////////////////////////////////////////////////////////////
            let spn = document.querySelector("#id_of_game");
            let name4 = localStorage.getItem('game-id');

            spn.innerHTML=name4;

            let spn2 = document.querySelector("#oponent");
            let name2 = localStorage.getItem('usr-name');

            spn2.innerHTML=name2;



            let spn3 = document.querySelector("#oponent");
            let name3 = localStorage.getItem('usr-name-2');

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

            //povezava na določeno igro
            function connectToSpecificGame() {
                //alert("name3 :" + name3);
                let spn3 = document.querySelector("#oponent");
                let login = document.getElementById("oponent").innerHTML;
                //alert(login);
                if (login == null || login === '') {
                    alert("Please enter login");
                } else {
                    let gameId = name4;//document.getElementById("changeid").innerHTML;
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

            connectToSpecificGame();

            var turns = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
            var turn = "";
            var gameOn = false;

            function playerTurn(turn, id) {
                if (gameOn) {
                    var spotTaken = $("#" + id).text();
                    if (spotTaken === " ") {
                        makeAMove(playerType, id.split("_")[1], id.split("_")[2]);
                    }
                }
            }

            function makeAMove(type, xCoordinate, yCoordinate) {
                $.ajax({
                    url: url + "/game/gameplay",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "type": type,
                        "coordinateX": xCoordinate,
                        "coordinateY": yCoordinate,
                        "gameId": name4//gameId
                    }),
                    success: function (data) {
                        gameOn = false;
                        displayResponse(data);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            }

            function displayResponse(data) {
                let board = data.board;
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] === 1) {
                            turns[i][j] = 'X'
                        } else if (board[i][j] === 2) {
                            turns[i][j] = 'O';
                        }
                        let id = "f_" + i + "_" + j;
                        $("#" + id).text(turns[i][j]);
                    }
                }
                if (data.winner != null) {
                    alert("Winner is " + data.winner);
                }
                gameOn = true;
            }

            $(".field").click(function () {
                var slot = $(this).attr('id');
                playerTurn(turn, slot);
            });

            function reset() {
                turns = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
                $(".field").text(" ");
            }

            $("#reset").click(function () {
                reset();
            });
        });





    });



};



document.addEventListener('DOMContentLoaded', function(){
    init();
});