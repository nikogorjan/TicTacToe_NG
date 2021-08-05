"use strict";

const init = function(e)
{
    let spn = document.querySelector("#client_name");
    let name = localStorage.getItem('usr-name');

    spn.innerHTML=name;

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

        window.document.location = './game.html';
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

        window.document.location = './game.html';
    });

    //BUTTON CONNECT
    let connect_btn = document.querySelector("#connect_btn");

    connect_btn.addEventListener('click', function()
    {
        var game_id = document.getElementById("game_id").value; //document.getElementById("usr").value;
        localStorage.setItem('game-id', game_id);

        var game_type = "connect";
        localStorage.setItem('game-type', game_type);

        var name = document.getElementById("client_name").innerHTML;
        localStorage.setItem('usr-name-2', name);

        window.document.location = './game.html';
    });

};



document.addEventListener('DOMContentLoaded', function(){
    init();});