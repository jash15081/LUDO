function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
var turn = 1;
var dice = document.getElementById("dice_face");
var x;
var piece_index = 1;
var pics = document.getElementsByClassName("pieces");
var killed = false;
var time = 200;
var wins = 0;
var winners = [];


var dice_sound = new Audio('sounds/dice 2.mp3');
var move_sound = new Audio('sounds/move2.wav');
var death_sound = new Audio('sounds/dead.mp3');
var success_sound = new Audio('sounds/success.mp3');
var win_sound = new Audio('sounds/winner.wav');
var gameover_sound = new Audio('sounds/gameover.mp3');


function create_piece(id,player,colour,vunerable,position,home,won,direction,left,top,origindir){
    this.id = id;
    this.player = player
    this.colour = colour;
    this.vunerable = vunerable;
    this.position = position;
    this.home = home;
    this.won = won;
    this.direction = direction;
    this.origindir = origindir;
    this.maxsteps = 6;
    this.totalSteps = 0;
    this.to_home = false;
    this.left = left;
    this.top = top;
    this.curr_left;
    this.curr_right;
    this.joint_position = 0;
}
function player(color,name){
    this.color = color;
    this.name  = name;
    this.won = false;
    this.ingame = true;
    this.allin = false;
}


var players = [4];
players[0] = new player('blue','player1');
players[1] = new player('red','player2');
players[2] = new player('green','player3');
players[3] = new player('yellow','player4');

var pieces = [16];
pieces[0] = new create_piece('blue1',1,'blue',true,0,true,false,'L',78.6,70.1,'L');
pieces[1] = new create_piece('blue2',1,'blue',true,0,true,false,'L',72,76.8,'L');
pieces[2] = new create_piece('blue3',1,'blue',true,0,true,false,'L',85.3,76.8,'L');
pieces[3] = new create_piece('blue4',1,'blue',true,0,true,false,'L',78.6,83.6,'L');

pieces[4] = new create_piece('red1',2,'red',true,0,true,false,'D',78.3,9.8,'D');
pieces[5] = new create_piece('red2',2,'red',true,0,true,false,'D',71.8,16.6,'D');
pieces[6] = new create_piece('red3',2,'red',true,0,true,false,'D',85,16.6,'D');
pieces[7] = new create_piece('red4',2,'red',true,0,true,false,'D',78.3,23.3,'D');

pieces[8] = new create_piece('green1',3,'green',true,0,true,false,'R',18.8,10.4,'R');
pieces[9] = new create_piece('green2',3,'green',true,0,true,false,'R',12.2,17,'R');
pieces[10] = new create_piece('green3',3,'green',true,0,true,false,'R',25.4,17,'R');
pieces[11] = new create_piece('green4',3,'green',true,0,true,false,'R',18.8,23.6,'R');

pieces[12] = new create_piece('yellow1',4,'yellow',true,0,true,false,'U',18.8,70.1,'U');
pieces[13] = new create_piece('yellow1',4,'yellow',true,0,true,false,'U',12.2,76.8,'U');
pieces[14] = new create_piece('yellow1',4,'yellow',true,0,true,false,'U',25.4,76.8,'U');
pieces[15] = new create_piece('yellow1',4,'yellow',true,0,true,false,'U',18.8,83.6,'U');



async function roll_dice(y = Math.floor(Math.random()*6)+1){
     
    dice_sound.play();
    x = y;
    setTimeout(() => {dice.setAttribute("src","DICE/3.jpg");},60);
    setTimeout(() => {dice.setAttribute("src","DICE/5.jpg");},120);
    setTimeout(() => {dice.setAttribute("src","DICE/1.jpg");},180);
    setTimeout(() => {dice.setAttribute("src","DICE/6.jpg");},240);
    setTimeout(() => {dice.setAttribute("src","DICE/4.jpg");},300);
    setTimeout(() => {dice.setAttribute("src","DICE/2.jpg");},360);
    let path = "DICE/"+x+".jpg";
    
    setTimeout(() => {dice.setAttribute("src",path);},420);
    if(turn == 1){
        piece_index = 0;
    }
    else if(turn == 2){
        piece_index = 4;
    }
    else if(turn == 3){
        piece_index = 8;
    }
    else if(turn == 4){
        piece_index = 12;
    }
    dice.style.pointerEvents = "none";
    console.log("dice rolled");
    
    player_move()
    return x;
}
function move_from_home(id){
    move_sound.play();

    var piece_element = pics[piece_index + id - 1];

    var piece_properties = pieces[piece_index + id -1];
    switch(turn){
        case 1:
            piece_properties.position = 1;
            piece_element.style.left ="88.6%";
            piece_element.style.top = "53.7%";

            break;
        case 2:
            piece_properties.position = 40;
            piece_element.style.left ="55.1%";
            piece_element.style.top = "6.5%";

            break;
        case 3:
            piece_properties.position = 27;
            piece_element.style.left ="8.8%";
            piece_element.style.top = "40.4%";
            break;
        case 4:
            piece_properties.position = 14;
            piece_element.style.left ="42.1%";
            piece_element.style.top = "87%";
            break;
    }
    piece_properties.home = false;
}
function change_dir(id){
    var piece_element = pics[piece_index + id - 1];
    var piece_properties = pieces[piece_index + id -1];
    var curr_left = parseFloat(piece_element.style.left);
    var curr_top = parseFloat(piece_element.style.top);
    var curr_position = piece_properties.position;
    if(piece_properties.totalSteps == 50){
        switch(turn){
            case 1:
                piece_properties.direction = 'L';
                break;
            case 2:
                piece_properties.direction = 'D';
                break;
            case 3:
                piece_properties.direction = 'R';
                break;
            case 4:
                piece_properties.direction = 'U';
                break;
        }
    }
    else{
        if(curr_position == 39 || curr_position == 50 || curr_position == 5){
            console.log("pos changed to D");
            piece_properties.direction = 'D';
        }
        else if(curr_position == 18 || curr_position == 11 || curr_position == 52){
            console.log("pos changed to L");

            piece_properties.direction = 'L';
        }
        else if(curr_position == 26 || curr_position == 37 || curr_position == 44){
            console.log("pos changed to R");

            piece_properties.direction = 'R';
        }
        else if(curr_position == 13 || curr_position == 24 || curr_position == 31){
            console.log("pos changed to U");

            piece_properties.direction = 'U';
        }
        
    }
}
function detect_corner(id){
    var piece_element = pics[piece_index + id - 1];
    var piece_properties = pieces[piece_index + id -1];
    var curr_left = parseFloat(piece_element.style.left);
    var curr_top = parseFloat(piece_element.style.top);
    curr_position = piece_properties.position;
    switch(curr_position){
        case 5:
            piece_element.style.left = curr_left - 6.6666666 + "%";
            break;
        case 18:
            piece_element.style.top = curr_top - 6.6666666 + "%";
            break;
        case 31:
            piece_element.style.left = curr_left + 6.6666666 + "%";
            break;
        case 44:
            piece_element.style.top = curr_top + 6.6666666 + "%";

            break;
    }
}
async function single_move(id){
    var piece_element = pics[piece_index + id - 1];
    var piece_properties = pieces[piece_index + id -1];
    var curr_left = parseFloat(piece_element.style.left);
    var curr_top = parseFloat(piece_element.style.top);
    let prevpos = piece_properties.position;
    detect_corner(id);
    move_sound.play();
    piece_properties.totalSteps ++;
    if(piece_properties.totalSteps == 51){
        piece_properties.to_home = true;
        piece_properties.maxsteps = 5;
        switch(turn){
            case 1:
                piece_properties.position = 101;
                break;
            case 2:
                piece_properties.position = 201;
                break;
            case 3:
                piece_properties.position = 301;
                break;
            case 4:
                piece_properties.position = 401;
                break;
        }
    }
    piece_properties.position ++;
    check_joint(prevpos);
    console.log("new pos = " + piece_properties.position);
    if(piece_properties.position == 53){
        piece_properties.position = 1;
    }
    switch(piece_properties.direction){
        case 'R':
            setTimeout(piece_element.style.left = curr_left + 6.6666666 + "%",1000);
            break;
        case 'L':
            setTimeout(piece_element.style.left = curr_left - 6.6666666 + "%",1000);
            break;
        case 'U':
            setTimeout(piece_element.style.top = curr_top - 6.6666666 + "%",1000);
            break;
        case 'D':
            setTimeout(piece_element.style.top = curr_top + 6.6666666 + "%",1000);
            break;
    }
    change_dir(id);
    check_joint(piece_properties.position);


}
function move_in_home(id){
    move_sound.play();
    var piece_element = pics[piece_index + id - 1];
    var piece_properties = pieces[piece_index + id -1];
    var curr_left = parseFloat(piece_element.style.left);
    var curr_top = parseFloat(piece_element.style.top);
    switch(piece_properties.direction){
        case 'R':
            setTimeout(piece_element.style.left = curr_left + 6.6666666 + "%",1000);
            break;
        case 'L':
            setTimeout(piece_element.style.left = curr_left - 6.6666666 + "%",1000);
            break;
        case 'U':
            setTimeout(piece_element.style.top = curr_top - 6.6666666 + "%",1000);
            break;
        case 'D':
            setTimeout(piece_element.style.top = curr_top + 6.6666666 + "%",1000);
            break;
    }
    piece_properties.maxsteps--;
    piece_properties.totalSteps++;
    check_joint(piece_properties.position);
    piece_properties.position++;
    if(piece_properties.totalSteps == 56){
        success_sound.play();
        piece_properties.won = true;
    }
    check_joint(piece_properties.position);

}
async function check_joint(pos){
    let count = 0;
    let pcs = [];
    
    for(let i=0;i<16;i++){
        if(pieces[i].position == pos){
            pcs[count] = i;
            count++;
        }
    }
    console.log(count + "joint");
    for(let i=0;i<count;i++){
        switch(pieces[pcs[i]].joint_position){
            case -1: 
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case 1:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case -2:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.2 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case 2:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.2 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case 3.1:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 0.9 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case 3.2:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.8 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case -3.1:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 0.9 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case -3.2:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.8 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case 3:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 0.6 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case -3:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 0.6 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case -6.1:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.2 + "%";
                pieces[pcs[i]].joint_position = 0;
                pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) - 0.7 + "%";
                break;
            case -6:
                pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) - 0.7 + "%";
                pieces[pcs[i]].joint_position = 0;
                break;
            case 6.1:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.2 + "%";
                pieces[pcs[i]].joint_position = 0;
                pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) - 0.7 + "%";
                break;
            case -6.2:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.2 + "%";
                pieces[pcs[i]].joint_position = 0;
                pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) + 0.7 + "%";
                break;
            case 6:
                pieces[pcs[i]].joint_position = 0;
                pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) + 0.7 + "%";
                break;
            case 6.2:
                pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.2 + "%";
                pieces[pcs[i]].joint_position = 0;
                pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) + 0.7 + "%";
                break;
        }
        switch(count){
            case 1:
                break;
            case 2:
                switch(i){
                    case 0:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1 + "%";
                        pieces[pcs[i]].joint_position = -1;
                        break;
                    case 1:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1 + "%";
                        pieces[pcs[i]].joint_position = 1;
                        break;
                }
                break;
            case 3:
                switch(i){
                    case 0:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.2 + "%";
                        pieces[pcs[i]].joint_position = -2;
                        break;
                    case 1:
                        break;
                    case 2:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.2 + "%";
                        pieces[pcs[i]].joint_position = 2;
                        break;
                }
                break;
            case 4:
                switch(i){
                    case 0:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.8 + "%";
                        pieces[pcs[i]].joint_position = -3.2;
                        break;
                    case 1:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 0.6 + "%";
                        pieces[pcs[i]].joint_position = -3;
                        break;
                    case 2:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 0.6 + "%";
                        pieces[pcs[i]].joint_position = 3;
                        break;
                    case 3:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.8 + "%";
                        pieces[pcs[i]].joint_position = 3.2;
                        break;
                }
                break;
            case 5:
                switch(i){
                    case 0:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.8 + "%";
                        pieces[pcs[i]].joint_position = -3.2;
                        break;
                    case 1:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 0.9 + "%";
                        pieces[pcs[i]].joint_position = -3.1;
                        break;
                    case 3:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 0.9 + "%";
                        pieces[pcs[i]].joint_position = 3.1;
                        break;
                    case 4:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.8 + "%";
                        pieces[pcs[i]].joint_position = 3.2;
                        break;
                }
                break;
            case 6:
                switch(i){
                    case 3:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.2 + "%";
                        pieces[pcs[i]].joint_position = -6.1;
                        pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) + 0.7 + "%";
                        break;
                    case 4:
                        pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) + 0.7 + "%";
                        pieces[pcs[i]].joint_position = -6;
                        break;
                    case 5:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.2 + "%";
                        pieces[pcs[i]].joint_position = 6.1;
                        pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) + 0.7 + "%";
                        break;
                    case 0:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) - 1.2 + "%";
                        pieces[pcs[i]].joint_position = -6.2;
                        pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) - 0.7 + "%";
                        break;
                    case 1:
                        pieces[pcs[i]].joint_position = 6;
                        pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) - 0.7 + "%";
                        break;
                    case 2:
                        pics[pcs[i]].style.left = parseFloat(pics[pcs[i]].style.left) + 1.2 + "%";
                        pieces[pcs[i]].joint_position = 6.2;
                        pics[pcs[i]].style.top = parseFloat(pics[pcs[i]].style.top) - 0.7 + "%";
                        break;
                }
                break;
            case 7:
                break;
        }
    }
    
}
async function kill(property,elm){
    await sleep(100);
    killed = true;
    death_sound.play();
    console.log("kill it");
    elm.style.left = property.left +"%";
    elm.style.top = property.top + "%";
    property.position = 0;
    property.direction = property.origindir;
    property.totalSteps = 0;
    property.maxsteps = 6;
    property.home = true;
    property.joint_position = 0;
}    
function check_kill(id){
    var piece_element = pics[piece_index + id - 1];
    var piece_properties = pieces[piece_index + id -1];
    var ind = piece_index + id -1;
    if(piece_properties.vunerable == false){
        return;
    }
    for(var k=0;k<16;k++){
        if(k == ind || pieces[k].player == turn || pieces[k].to_home == true || pieces[k].home == true){
            continue;
        }
        else if(pieces[k].position == piece_properties.position){
            kill(pieces[k],pics[k]);
        }
    }   
}
function change_dice_colour(){
    switch(turn){
        case 1:
            dice.style.left = "101.6%";
            dice.style.top = "77.8%";
            break;
        case 2:
            dice.style.left = "101.6%";
            dice.style.top = "0.5%"
            break;
        case 3:
            dice.style.left = "-21.8%";
            dice.style.top = "0.5%";
            break;[]
        case 4:
            dice.style.left = "-21.8%";
            dice.style.top = "77.8%";
            break;
    }
}
function check_gameover(){
    let countt = 0;
    for(let l=0;l<4;l++){
        if(players[l].won == true){
            countt++;
        }
    }
    console.log(countt);
    if(countt == 3){
        console.log("game over");
        document.getElementById('gov').innerHTML = "Game Over";
        document.getElementById('gov_slide').style.display = "block";
        document.getElementById('win1').innerHTML = "1st Player "+winners[0];
        document.getElementById('win2').innerHTML = "2nd Player "+winners[1];
        document.getElementById('win3').innerHTML = "3rd Player "+winners[2];
        document.getElementById('gov_slide').style.display = "block";
        dice.pointerEvents = "none";
        gameover_sound.play();
    }
}
async function piece_move(id){
    killed = false;
    var piece_element = pics[piece_index + id - 1];
    var piece_properties = pieces[piece_index + id -1];
    for(let i=piece_index;i<piece_index+4;i++){
        pics[i].style.pointerEvents = "none";
        pics[i].classList.remove("blink");
    }
    if(piece_properties.home == true){
        move_from_home(id);
    }
    else{
        for(var j=0;j<x;j++){
           
            if(piece_properties.to_home == true){
                move_in_home(id);
                await sleep(time);

            }
            else{
                single_move(id);
                await sleep(time);

            }            
        }
    }
    if(piece_properties.position == 1 || piece_properties.position == 14 || piece_properties.position == 27 || piece_properties.position == 40){
        piece_properties.vunerable = false;
    }
    else{
        piece_properties.vunerable = true;
    }
    piece_properties.curr_left = piece_element.style.left;
    piece_properties.curr_top = piece_element.style.top;
     check_kill(id);
     console.log("joint check");
     await sleep(300);
    check_joint(piece_properties.position);
    
    if(pieces[piece_index].won == true && pieces[piece_index+1].won==true && pieces[piece_index+2].won==true && pieces[piece_index+3].won==true){
        players[turn-1].won = true;
        console.log("player won");
        winners[wins] = turn;
        wins++;
        win_sound.play();
        var crown_name = "crown"+turn;
        document.getElementById(crown_name).style.display = "block";
        check_gameover();
    }
    if(pieces[piece_index].to_home == true && pieces[piece_index+1].to_home == true && pieces[piece_index+2].to_home == true && pieces[piece_index+3].to_home == true){
        players[turn-1].allin = true;
    }
    if((x==6 || piece_properties.won == true || killed == true) && players[turn-1].won == false){
        dice.style.pointerEvents = "auto";
        change_dice_colour();
    }
    else{
        turn = turn+1;
        if(turn == 5){
            turn = 1;
        }
        while(players[turn-1].won == true){
            turn = turn+1;
            if(turn == 5){
                turn = 1;
            }
        }

        dice.style.pointerEvents = "auto";
        change_dice_colour();

        document.getElementById('backg').classList.add('blink');

    }

}
async function player_move(){
    let count = 0;
    
    if(x==6 && players[turn-1].allin == false){
        let p=0;
        let c_element = -1;
        for(let i=piece_index;i<piece_index + 4;i++){
            if(pieces[i].maxsteps == 6){
                pics[i].style.pointerEvents = "auto";
                setTimeout(()=>{pics[i].classList.add("blink")},500);
                p++;
                c_element = i;
            }
            
        }
        if(p==1){
            pics[c_element].classList.remove('blink');
            await sleep(500);
            pics[c_element].click();
        }
    }
    else{
        var any = false;
        let p=0;
        let c_element = -1;

        for(let i=piece_index;i<piece_index+4;i++){
            if(pieces[i].home == false && pieces[i].maxsteps >= x && pieces[i].won == false){
                pics[i].style.pointerEvents = "auto";
                pics[i].classList.add("blink");
                any = true;
                console.log("hellow " + i)
                p++;
                c_element = i;

            }
        }
        if(p==1){
            pics[c_element].classList.remove('blink');
            await sleep(500);
            pics[c_element].click();
        }
        if(any == false){
            turn = turn+1;
            if(turn == 5){
                turn = 1;
            }
            while(players[turn-1].won == true){
                turn = turn+1;
                if(turn == 5){
                        turn = 1;
                }
            }
            await sleep(700);
            dice.style.pointerEvents = "auto";
            check_gameover();
            change_dice_colour();

        }
    }

}



//win();
//1 - blue
//2 - red
//3 - green
//4 - yellow

async function case1_kill(){
    roll_dice(6);
    await sleep(600);
    piece_move(1);
    await sleep(500);
    roll_dice(2);
    await sleep(1500);
    roll_dice(6);
    await sleep(600);
    piece_move(1);
    await sleep(700);
    roll_dice(6);
    await sleep(500);
    piece_move(1);
    await sleep(1500);
    roll_dice(6);
    await sleep(500);
    piece_move(1);
    await sleep(1500);
    roll_dice(3);
    await sleep(1000);

}
async function case2_joint(){
    roll_dice(6);
    await sleep(600);
    piece_move(1);
    await sleep(600);
    roll_dice(6);
    await sleep(600);
    piece_move(2);
    await sleep(600);
    roll_dice(6);
    await sleep(600);
    piece_move(3);
    await sleep(600);
    roll_dice(6);
    await sleep(600);
    piece_move(4);
    await sleep(600);
    roll_dice(2);
    await sleep(600);
    piece_move(1);
    await sleep(1500);


    roll_dice(6);
    await sleep(600);
    piece_move(1);
    await sleep(600);
    roll_dice(6);
    await sleep(600);
    piece_move(2);
    await sleep(600);
    roll_dice(6);
    await sleep(600);
    piece_move(3);
    await sleep(600);
    roll_dice(6);
    await sleep(600);
    piece_move(1);
    await sleep(1500);
    roll_dice(6);
    await sleep(600);
    piece_move(2);
    await sleep(1500);
    roll_dice(6);
    await sleep(600);
    piece_move(3);
    await sleep(1500);
    roll_dice(6);
    await sleep(600);
    piece_move(1);
    await sleep(1500);
    roll_dice(6);
    await sleep(600);
    piece_move(2);
    await sleep(1500);
    roll_dice(6);
    await sleep(600);
    piece_move(3);
    await sleep(1500);

    roll_dice(1);
    await sleep(600);
    piece_move(1);
    await sleep(1500);
    roll_dice(1);
    await sleep(600);
    roll_dice(1);
    await sleep(600);
    roll_dice(1);
    await sleep(600);
    piece_move(1);
    await sleep(1500);

    roll_dice(1);
    await sleep(600);
    piece_move(2);
    await sleep(1500);
    roll_dice(1);
    await sleep(600);
    roll_dice(1);
    await sleep(600);
    roll_dice(1);
    await sleep(600);
    piece_move(1);
    await sleep(1500);
    roll_dice(1);
    await sleep(600);
    piece_move(3);
    await sleep(1500);
    
    


}
async function win(){
    for(let j=0;j<4;j++){
        for(let i=0;i<9;i++){
            roll_dice(6);
            await sleep(500);
            piece_move(1);
            await sleep(1500);
            roll_dice(6);
            await sleep(500);
            piece_move(2);
            await sleep(1500);roll_dice(6);
            await sleep(500);
            piece_move(3);
            await sleep(1500);
            roll_dice(6);
            await sleep(500);
            piece_move(4);
            await sleep(1500);
        }
            roll_dice(6);
            await sleep(500);
            piece_move(1);
            await sleep(1500);
            roll_dice(6);
            await sleep(500);
            piece_move(2);
            await sleep(1500);
            roll_dice(6);
            await sleep(500);
            piece_move(3);
            await sleep(1500);
            roll_dice(6);
            await sleep(4000);
            roll_dice(6);
            await sleep(1500);
    }
    

}
//case1_kill();
//case3_win();
//case2_joint();