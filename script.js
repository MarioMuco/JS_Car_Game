var makina;
var shpejtesia;
var color;
var newX = 225;
var newY = 255;
var starting_angle = 0;
var keep_angle = 0;

//function add_car(){}
//fix starting angle

function update_input() {
    shpejtesia = parseInt(document.getElementById("slider").value);
    color = document.getElementById("add_color").value;
    starting_angle = keep_angle * Math.PI / 180;
    makina = new component(60, 100, color, newX, newY, starting_angle);
}

function startGame() {
    makina = new component(60, 100, color, newX, newY, starting_angle);
    parking.start();
    shpejtesia = parseInt(document.getElementById("slider").value);
}

var parking = {
    // Defines an object named 'parking'.
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1200;
        this.canvas.height = 550;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // Inserts the canvas into the document body.
        this.frameNo = 0; // Initializes the frame number to 0.
        this.interval = setInterval(updateGameArea, 20); // 'updateGameArea' every 20 milliseconds.
        window.addEventListener('keydown', function (e) { // Adds an event listener for keydown events.
            e.preventDefault(); // Prevents the default behavior of the keydown event.
            parking.keys = (parking.keys || []); // Initializes the 'keys' property of 'parking' object as an empty array if it doesn't exist.
            parking.keys[e.keyCode] = (e.type == "keydown"); // Updates the value of the 'keys' array based on the pressed key.
        })
        window.addEventListener('keyup', function (e) { // Adds an event listener for keyup events.
            parking.keys[e.keyCode] = (e.type == "keydown"); // Updates the value of the 'keys' array when a key is released.
        })
    },
    stop: function () { // Defines a method named 'stop' for the 'parking' object.
        clearInterval(this.interval); // Stops the game loop by clearing the interval.
    },
    clear: function () { // Defines a method named 'clear' for the 'parking' object.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clears the entire canvas.
    }
}

function component(width, height, color, x, y, type) {
    // Defines a constructor function named 'component' for creating game components.
    // Initializes properties of the component object.
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function () { // Defines a method named 'update' for the component.
        ctx = parking.context; // Gets the 2D rendering context for the canvas.
        ctx.save(); // Saves the current state of the rendering context.
        ctx.translate(this.x, this.y); // Moves the origin of the canvas to the specified position.
        ctx.rotate(this.angle); // Rotates the canvas around the origin.
        ctx.fillStyle = color; // Sets the fill color.
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height); // Draws a filled rectangle at the specified position.
        ctx.restore(); // Restores the most recently saved canvas state.
    }
    this.newPos = function () {
        // Calculate the new position
        this.angle += this.moveAngle * Math.PI / 180; // Updates the angle of rotation.
        newX = this.x + this.speed * Math.sin(this.angle);
        newY = this.y - this.speed * Math.cos(this.angle);

        // Check if the new position is within the boundaries of the parking container
        if (newX - this.width / 2 >= 0 && newX + this.width / 2 <= parking.canvas.width &&
            newY - this.height / 2 >= 0 && newY + this.height / 2 <= parking.canvas.height) {
            // If within boundaries, update the position
            this.x = newX;
            this.y = newY;
        }
    }

}

function updateGameArea() {
    // Updates the game area in each frame.
    parking.clear(); // Clears the canvas.
    makina.moveAngle = 0; // Resets the move angle of 'makina'.
    makina.speed = 0; // Resets the speed of 'makina'.
    // Checks if arrow keys are pressed and updates move angle and speed accordingly.
    if (parking.keys && parking.keys[37]) {
        makina.moveAngle = -2;
        keep_angle += makina.moveAngle ;
    }
    if (parking.keys && parking.keys[39]) {
        makina.moveAngle = 2;
        keep_angle += makina.moveAngle ;
    }
    if (parking.keys && parking.keys[38]) {
        makina.speed = shpejtesia;
    } else {
        // If up arrow key is not pressed, reset the speed to 0 to prevent movement.
        makina.speed = 0;
    }
    if (parking.keys && parking.keys[40]) {
        makina.speed = -2;
    }

    // If the car is moving (speed is non-zero), allow rotation.
    if (makina.speed !== 0) {
        makina.newPos(); // Updates the position of 'makina'.
    }

    makina.update(); // Updates the display of 'makina'.
}
