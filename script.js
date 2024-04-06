var makina;
var shpejtesia;
var color;
var newX = 225; //fillimi
var newY = 255; // fillimi
var starting_angle = 0;
var keep_angle = 0;

var backgroundImg = new Image();
backgroundImg.src = 'city.png';

//pjesa e dukshme e qytetit ne canva 
var visibleArea = {
    x: 0,
    y: 0,
    width: 1200,
    height: 550
};

function drawBackground() {
    parking.context.drawImage(
        backgroundImg,
        visibleArea.x,
        visibleArea.y,
        visibleArea.width,
        visibleArea.height,
        0,
        0,
        parking.canvas.width,
        parking.canvas.height
    );
}

function update_input() {
    shpejtesia = parseInt(document.getElementById("slider").value);//shpejtesia
    color = document.getElementById("add_color").value; //ngjyra e makenes
    starting_angle = keep_angle * Math.PI / 180;
    makina = new component(60, 100, color, newX, newY, starting_angle);
}

function startGame() {
    makina = new component(60, 100, color, newX, newY, starting_angle);
    parking.start();
    shpejtesia = parseInt(document.getElementById("slider").value);
}

var parking = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1200;
        this.canvas.height = 550;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // Insert canvas ne html
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20); // updatohet cdo 20 milisekonda
        window.addEventListener('keydown', function (e) { // eventlistner per keydowsn
            e.preventDefault(); // heq veprimin default te keydown
            parking.keys = (parking.keys || []);
            parking.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) { // event listner per keyup
            parking.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop: function () {
        clearInterval(this.interval); // ndalon lojen
    },
    clear: function () { // pastron canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    // krijon komponentet e lojes 
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = parking.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        // pozicioni i ri i makines
        this.angle += this.moveAngle * Math.PI / 180; // kendi i makines
        newX = this.x + this.speed * Math.sin(this.angle);
        newY = this.y - this.speed * Math.cos(this.angle);

        // mos dali jashte kufinjve te canvas
        if (newX - this.width / 2 >= 0 && //cepi i majte i makines brenda 0 cepi i majte i canvas
            newX + this.width / 2 <= parking.canvas.width && //cepi i djathte te jete brenda canvas se djthte
            newY - this.height / 2 >= 0 &&  // cepi lart te jete brenda
            newY + this.height / 2 <= parking.canvas.height) { //cepi poshte te jete brenda
            this.x = newX;
            this.y = newY;
        }
    }
}

function updateGameArea() {
    //update loja ne cdo frame
    parking.clear();

    // camera leviz kur arrihet ne qender te canvas
    visibleArea.x = newX - (parking.canvas.width / 2);
    visibleArea.y = newY - (parking.canvas.height / 2);

/*
    // Define a buffer around the car's position to expand the visible area
    var bufferX = 100; // Adjust as needed
    var bufferY = 100; // Adjust as needed
     // Expand the visible area using the buffer
     visibleArea.x -= bufferX;
     visibleArea.y -= bufferY;
     visibleArea.width += 2 * bufferX;
     visibleArea.height += 2 * bufferY;
     // Ensure that the visible area stays within the bounds of the city image
    if (visibleArea.x < 0) {
        visibleArea.x = 0;
    }
    if (visibleArea.y < 0) {
        visibleArea.y = 0;
    }
    if (visibleArea.x + visibleArea.width > backgroundImg.width) {
        visibleArea.x = backgroundImg.width - visibleArea.width;
    }
    if (visibleArea.y + visibleArea.height > backgroundImg.height) {
        visibleArea.y = backgroundImg.height - visibleArea.height;
    }
   */

    drawBackground();

    makina.moveAngle = 0; 
    makina.speed = 0; 
    // shikon nese shigjetat jane shtypur
    if (parking.keys && parking.keys[37]) {
        makina.moveAngle = -2;
        keep_angle += makina.moveAngle;
    }
    if (parking.keys && parking.keys[39]) {
        makina.moveAngle = 2;
        keep_angle += makina.moveAngle;
    }
    if (parking.keys && parking.keys[38]) {
        makina.speed = shpejtesia;
    } else {
        //nuk ecen nese nuk shtypet asnje buton
        makina.speed = 0;
    }
    if (parking.keys && parking.keys[40]) {
        makina.speed = -2;
    }

    // rrotullim vetem nese po ecet
    if (makina.speed !== 0) {
        makina.newPos(); 
    }

    makina.update(); 
}
