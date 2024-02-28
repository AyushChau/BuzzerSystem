
//hard coded for now
var socket_Port = 8338;
var domain = "10.0.0.10";

var socket;
var pid;
var pname = localStorage.getItem("pname");
var id;
var keepalive;
var timeInterval;
var buzzer_status;
var time = 0;
var remaining_safety_usage = localStorage.getItem('safety');
var remaining_hints = localStorage.getItem('hint');
var remaining_blocks = localStorage.getItem('block');
var once = true;


function start_connection(){
    var site = "ws://" + domain + ":" + socket_Port;
    socket = new WebSocket(site);

    socket.onopen = function(event){};
    socket.onclose = function(event){};

    socket.onmessage = function(event){
        var msg = JSON.parse(event.data);
        console.log(msg);
        switch(msg.label){
            case 'accepted connection client':
                if (msg.id == id){
                    pid = msg.pid;
                    $('#player').html("<h1> " + pname + "</h1>");
                    $('#safetyval').text('x' + remaining_safety_usage);
                    if(remaining_safety_usage == 0){
                        $('#safetybutton').attr("src","img/usedsafety.png");
                    }
                    $('#hintval').text('x' + remaining_hints);
                    if(remaining_hints == 0){
                        $('#hintbutton').attr("src","img/usedhint.png");
                    }
                    $('#blockval').text('x' + remaining_blocks);
                    if(remaining_blocks == 0){
                        $('#blockbutton').attr("src","img/usedblock.png");
                    }
                }
                ping();
                buzzer_status = msg.button_status;
                time = parseInt(msg.time_left);

                if (buzzer_status == 1){
                    $("#buzzerbutton").attr("src","img/enabutton.png");
                    $("input").prop('disabled', false);
                }
                else{
                    $("#buzzerbutton").attr("src","img/disbutton.png");
                    $("input").prop('disabled', false);
                }
                
                
                break;

            case 'connection issue':
                if (msg.id == id){
                    console.log("Connection Error");
                }
                break;

            case 'enable buzzer':

                if (buzzer_status != 1){
                    startTimer();
                    enableBuzzer();
                }
                break;

            case 'disable buzzer':

                if (buzzer_status != 2){
                    resetTimer();
                    disableBuzzer();
                }
                break;

            case 'pong':
                pong();
                break;
            
            case 'updateTimer':
                if(buzzer_status == 1){
                    reconnectTimer(parseInt(msg.time_left));
                }
                break;

            case 'other_players':
                populatepopup(msg.players);
                break;

            case 'player_blocked':
                if (pid == msg.blocked_player){
                    blockBuzzer();
                }
            default:
            
        }
        }
        setTimeout(function(){
            socket.send(JSON.stringify({
                'label' : 'client connection',
                'id' : id,
                'pname': pname
            }));
        },500);
    }

function ping(){
    clearTimeout(keepalive);
    socket.send(JSON.stringify({
        'label' : 'ping',
        'pname': pname
    }));
    keepalive = setTimeout(function(){
        $('#player').html("<h1> DISCONNECTED!!!! </h1>");
        localStorage.setItem('safety',remaining_safety_usage);
        localStorage.setItem('hint',remaining_hints);
        localStorage.setItem('block',remaining_blocks);
        socket.close();
    },3000);
}

function pong(){
    clearTimeout(keepalive);
    keepalive = setTimeout(function(){
        ping();
    },10000)
    
}

function reconnectTimer(time_left){
    clearInterval(timeInterval);
    var timer = time_left;
    var minutes;
    var tens_seconds;
    var ones_seconds;
    minutes = (timer/60) | 0
    tens_seconds = ((timer%60)/10) | 0
    ones_seconds = (timer%60)%10
    $('#Timer').html("<h2> 0" + minutes + ":" + tens_seconds + ones_seconds + "</h2>"); 
    
    timeInterval = setInterval(function(){
        if (timer >= 0){
            minutes = (timer/60) | 0
            tens_seconds = ((timer%60)/10) | 0
            ones_seconds = (timer%60)%10
            $('#Timer').html("<h2> 0" + minutes + ":" + tens_seconds + ones_seconds + "</h2>"); 
        } 
        timer--;

	},1000);
}

function startTimer(){
    var timer = 210;
    var minutes;
    var tens_seconds;
    var ones_seconds;
    timeInterval = setInterval(function(){
        if (timer >= 0){
            minutes = (timer/60) | 0
            tens_seconds = ((timer%60)/10) | 0
            ones_seconds = (timer%60)%10
            $('#Timer').html("<h2> 0" + minutes + ":" + tens_seconds + ones_seconds + "</h2>"); 
        } 
        timer--;

	},1000);
}

function resetTimer(){
	clearInterval(timeInterval);
    $('#Timer').html("<h2> 00:00 </h2>");
}

function enableBuzzer() {
    $("#buzzerbutton").attr("src","img/enabutton.png");
    $("input").prop('disabled', false);
    buzzer_status = 1;
}

function disableBuzzer() {
    $("#buzzerbutton").attr("src","img/disbutton.png");
    $("input").prop('disabled', false);
    buzzer_status = 2;
}

function blockBuzzer(){
    $("#buzzerbutton").attr("src","img/blockedbutton.png");
    $("input").prop('disabled', false);
    buzzer_status = 3;
}

function buzzin(){
    console.log(buzzer_status);
    if(buzzer_status == 1){
        socket.send(JSON.stringify({
            'label' : 'buzzed_in',
            'pid' : pid
        }));
    }  
}

function usesafety(){
    remaining_safety_usage -= 1;
    
    if (remaining_safety_usage >= 0){

        if(remaining_safety_usage == 0){
            $('#safetybutton').attr("src","img/usedsafety.png");
        }
        $('#safetyval').text('x' + remaining_safety_usage);
        socket.send(JSON.stringify({
            'label' : 'used_safety',
            'pid' : pid
        })); 
    }
    
}

function usehint(){
    remaining_hints -= 1;
    
    if (remaining_hints >= 0){
        if(remaining_hints == 0){
            $('#hintbutton').attr("src","img/usedhint.png");
        }
        $('#hintval').text('x' + remaining_hints);
        socket.send(JSON.stringify({
            'label' : 'used_hint',
            'pid' : pid
        }));
    }
}


function populatepopup(players){
    
    var content = '<h5>Choose who to block:<h5><ul>'
    for(var i = 0; i < players.length; i++){

        if(players[i] != pname){
            content += '<li><button id="buttons">' + players[i] + '</button></li>';
        } 
    }
    content += '</ul>';
    content += '<button id="cancel">Cancel</button>'
    $("#options").html(content);

    $(document).on('click',handleButtonClick);
}

function handleButtonClick(event){
    if(event.target.id == 'buttons'){
    
        if (once){
            blockplayer(event.target);
            once = false;
        }
    }
    else if(event.target.id == 'cancel'){
        $('#popup').attr("class","hidden");
        $("#options").html('');
    }
}

function blockplayer(target){
    
    $('#popup').attr("class","hidden");
    $("#options").html('');
    
    remaining_blocks -= 1;
    $('#blockval').text('x' + remaining_blocks);
    if(remaining_blocks == 0){
        $('#blockbutton').attr("src","img/usedblock.png")
    }
    
    once = true;
    socket.send(JSON.stringify({
        'label' : 'block_player',
        'name' : target.textContent
    }));
}

function blockoptions(){

    if (remaining_blocks > 0){
        $('#popup').attr("class","visible");
        socket.send(JSON.stringify({
            'label' : 'get_other_players'
        }));
    }  
}

function generateID(){
    var time = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        time += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let random = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time / 16);
        return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
    });
}

$(function() {
    pid = -1;
    id = generateID()
    $("#buzzerbutton").on('click', buzzin);
    $("#safetybutton").on('click',usesafety);
    $("#hintbutton").on('click',usehint);
    $("#blockbutton").on('click',blockoptions);
    start_connection(); 
});


