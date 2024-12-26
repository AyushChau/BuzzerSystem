//hard coded for now
var socket_Port = 8338;
var domain = "192.168.1.1";

var socket;
var keepalive;
var sent = 0;
var first_resp = 0;
var connaccepted = 0;
var conndisabled = 0;
var id;
var players = [];
var timeInterval;
var buzzer_on;
var minutes;
var tens_seconds;
var ones_seconds;
var timer;
var used_hint = [];

function start_connection() {
    // var site = "http://" + domain + ":" + socket_Port;
    socket = io();

    socket.on('connect', function() {
        socket.emit('message', JSON.stringify({
            'label': 'host connection',
            'id': id
        }));
    });

    socket.on('disconnect', function() {
        console.log("Disconnected from server");
    });

    socket.on('message', function(data) {
        var msg = JSON.parse(data);
        switch (msg.label) {
            case 'accepted connection host':
                if (msg.id == id) {
                    connaccepted = 1;
                    buzzer_on = false;
                } else {
                    console.log("good connection wrong id");
                }
                ping();
                break;

            case 'connection issue host':
                console.log("connection issue");
                break;

            case 'accepted connection client':
                addConnection(msg.pname);
                socket.emit('message', JSON.stringify({
                    'label': 'set time',
                    'timer': timer
                }));
                break;

            case 'remove client':
                removeFromConnected(msg.pname);
                break;

            case 'buzz order':
                var buzzOrder = msg.order;
                var used_safety = msg.safety;
                var used_gamble = msg.gamble;
                setBuzzOrder(buzzOrder, used_safety, used_gamble);
                break;

            case 'used_hint':
                if (used_hint.indexOf(msg.name) == -1) {
                    used_hint.push(msg.name);
                }
                refreshConnectionDisplay();
                break;

            case 'host_pong':
                pong();
                break;

            default:
                // Nothing
        }
    });
}

function startTimer() {
    timer = 210;
    minutes = 0;
    tens_seconds = 0;
    ones_seconds = 0;
    timeInterval = setInterval(function() {
        if (timer == 0) {
            socket.emit('message', JSON.stringify({
                'label': 'buzz everyone',
                'pname': 'HOST'
            }));
            resetTimer();
        } else {
            minutes = (timer / 60) | 0;
            tens_seconds = ((timer % 60) / 10) | 0;
            ones_seconds = (timer % 60) % 10;
            $('#Timer').html("<h3> 0" + minutes + ":" + tens_seconds + ones_seconds + "</h3>");
        }
        timer--;

    }, 1000);
}

function resetTimer() {
    clearInterval(timeInterval);
    $('#Timer').html("<h3> 00:00 </h3>");
}

function ping() {
    clearTimeout(keepalive);
    socket.emit('message', JSON.stringify({
        'label': 'ping',
        'pname': 'HOST'
    }));
    keepalive = setTimeout(function() {
        console.log("Failed to get PONG");
        socket.disconnect();
    }, 10000);
}

function pong() {
    console.log("Pong Received");
    clearTimeout(keepalive);
    keepalive = setTimeout(function() {
        ping();
    }, 20000);
}

function addConnection(name) {
    players.push(name);
    refreshConnectionDisplay();
}

function removeFromConnected(name) {
    var index = players.indexOf(name);
    if (index > -1) {
        players.splice(index, 1);
    }
    refreshConnectionDisplay();
}

function refreshConnectionDisplay() {
    var content = "<h2>Connected players: </h2>";

    for (var i = 0; i < players.length; i++) {
        if (used_hint.includes(players[i])) {
            content += "<h2><span style='color: green'>" + players[i] + "</span></h2>";
        } else {
            content += "<h2> " + players[i] + "</h2>";
        }
    }
    $("#players").html(content);
}

function enableBuzzer() {
    $('#bstatus').html("<h2 class='enabled'>Buzzers: Enabled</h2>\n<div id='Timer'><h3>00:00</h3></div>");
    $('#rheader').html("<h1>Buzz order:</h1>");
    $('#order').html("<h2> Waiting for buzzers...</h2>");

    if (buzzer_on == false) {
        buzzer_on = true;
        startTimer();
    }
    socket.emit('message', JSON.stringify({
        'id': id,
        'label': 'enable buzz'
    }));
}

function disableBuzzer() {
    if (buzzer_on == true) {
        buzzer_on = false;
        resetTimer();
    }
    $('#bstatus').html("<h2 class='disabled'>Buzzers: Disabled</h2>\n<div id='Timer'><h3>00:00</h3></div>");
    socket.emit('message', JSON.stringify({
        'id': id,
        'label': 'disable buzz'
    }));
}

function toggleConnections() {
    if (conndisabled) {
        conndisabled = 0;
        $('#togbutt').html("Disable Connections");
    } else {
        conndisabled = 1;
        $('#togbutt').html("Enable Connections");
    }
    socket.emit('message', JSON.stringify({
        'id': id,
        'label': 'toggle connections'
    }));
}

function generateID() {
    var time = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        time += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let random = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time / 16);
        return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
    });
}

function setBuzzOrder(order, safety, gamble) {
    var content = "<h1>";
    for (var i = 0; i < order.length; i++) {
        var p = String(order[i]);

        if (safety.includes(p)) {
            content += "<span style='color: green'>" + p + "</span>";
        } else if (gamble.includes(p)) {
            content += "<span style='color: red'>" + p + "</span>";
        } else {
            content += p;
        }

        if (i < order.length - 1) {
            content += " | ";
        }
    }
    content += "</h1>";
    $('#order').html(content);
}

$(function() {
    id = generateID();

    $('#togbutt').on('click', toggleConnections);
    $('#enabutt').on('click', enableBuzzer);
    $('#disbutt').on('click', disableBuzzer);

    start_connection();
});