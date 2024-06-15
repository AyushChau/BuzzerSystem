
let pname = "basic";

function getTeamName(){
    const new_val = document.getElementById("teamname").value;
    localStorage.setItem("pname",new_val);
    localStorage.setItem('safety',3);
    localStorage.setItem('gamble',1);
    localStorage.setItem('block',1);
}

function setpname(value){
    pname = value;
}
function getpname(){
    return pname;
}

window.function = {getTeamName,getpname};



