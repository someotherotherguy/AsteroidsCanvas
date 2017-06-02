// StarCatcher Scripts for the game made by Soft Dev 2015
    // when the web page window loads up, the game scripts will be read
window.onload = function() {
    //load canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d"),
        w = canvas.width = 800,
        h = canvas.height = 500;
    var star = {
        _x: null,
        _y: null,
        _xSpeed: null,
        _ySpeed: null,

        //Create new star object with given starting position and speed
        //class functions exist to set other private variables
        //All inputs are double and function returns a new star
        create: function (x, y, xSpeed, ySpeed, width, height) {
            var obj = Object.create(this);
            obj._x = x;
            obj._y = y;
            obj._xSpeed=xSpeed;
            obj._ySpeed=ySpeed;
            obj._width=60;
            obj._height=60;
            obj._wh= obj._width/2;
            obj._hh= obj._height/2;
            obj._hmhh= h - obj._hh;
            obj._wmwh= w - obj._wh;
            obj._rot= 0;
            obj._img = new Image();
            obj._img.src="images/star.png";
            return obj;
        },

        setImage: function(img){
            this._img.src=img;
        },

        //Update the new x and y of the star based on the speed.
        //drawing functionality is left for calling class
        //no input or return
        update: function () {
            this._x+=this._xSpeed;
            this._y+=this._ySpeed;
        },
        setSize: function(width, height, num) {
            // this._width += 5;
            // this._height += 5;
            // this._wh= this._width/2;
            // this._hh= this._height/2;
            // this._hmhh= h - this._hh;
            // this._wmwh= w - this._wh;
            starCount ++; //could be buggy, consider starCount = starArray.length;
            starArray.push(this.create(starArray[num]._x - starArray[num]._wh, starArray[num]._y - starArray[num]._hh, -1*starArray[num]._xSpeed, -1*starArray[num]._ySpeed, starArray[num]._height/2, starArray[num]._width/2));
            starArray[num] = this.create(starArray[num]._x, starArray[num]._y, starArray[num]._xSpeed, starArray[num]._ySpeed, starArray[num]._height/2, starArray[num]._width/2);
        }
    } //close star

        // our stars are created using a single array with a class of information
    var starCount=4;
    var starArray=[];

    // Create an array of stars
    for (var i = 0; i < starCount; i++) {
        // this assigns each element in the array all the information for the star by 
        // using the 'star' class, pass the starting x,y locations 
        //  and speeds into the array.
        // var neg1 = Math.random(), neg2 = Math.random();
        // if (neg1 > 0.5) {neg1 = 1;} else {neg1 = -1;}
        // if (neg2 > 0.5) {neg2 = 1;} else {neg2 = -1;}

        starArray.push(star.create(-20,i-50,1-Math.random()*2,1-Math.random()*2));
    }

    var ships = {
        p1: {
            _number: 1,
            _img: new Image(),
            _isVisible: true,
            _x: w/2+100,
            _y: h/2,
            _width: 50,
            _height: 50,
            _wh: 30,
            _hh: 30,
            //_hmhh: h - this._hh,
            //_wmwh: w - this._wh,
            _xSpeed: 0,
            _ySpeed: 0,
            _rot: 0,
            _accel: false,
            _score: 0,
            _isInvinc: false,
            _invIncTime: 300,
            _lives: 1,
            _playing: true
        },
        p2: {
            _number: 2,
            _img: new Image(),
            _isVisible: true,
            _x: w/2-100,
            _y: h/2,
            _width: 50,
            _height: 50,
            _wh: 30, //half width
            _hh: 30, //half height
            //_hmhh: h - this._hh, //canvas height minus half  height
            //_wmwh: w - this._wh, //canvas width minus half width
            _xSpeed: 0,
            _ySpeed: 0,
            _rot: 0,
            _accel: false,
            _score: 0,
            _isInvinc: false,
            _invIncTime: 300,
            _lives: 1,
            _playing: true
        }
    } //close ships

    gameOn = gameEnd = false;
    startScreen = true, doStartScreen = true, startScreenCycle = 0;
    gameCounter = 0;

    ships.p1._hmhh = h - ships.p1._hh, ships.p1._wmwh = w - ships.p1._hh, ships.p1._nWtwo = -ships.p1._w/2, ships.p1._nHtwo = -ships.p1._h/2;
    ships.p2._hmhh = h - ships.p2._wh, ships.p2._wmwh = w - ships.p2._wh, ships.p2._nWtwo = -ships.p2._w/2, ships.p2._nHtwo = -ships.p2._h/2;

    ships.p1._img.src="images/spaceship1.png";
    ships.p2._img.src="images/spaceship2.png";

    ships.p1._livesCounter = document.getElementById("p1Lives");
    ships.p2._livesCounter = document.getElementById("p2Lives");    

    // moving stars around the screen and update the players movement
    function starsUpdate () {
        //ctx.drawImage(background,0,0,w,h);
            
        //  draw star on screen only if visible
            for (var i = 0; i < starCount; i++) {
                starArray[i].update();
                drawOver(starArray[i]);
                // if (starArray[i]._x>w || starArray[i]._x<0) {starArray[i]._xSpeed = -starArray[i]._xSpeed}
                // if (starArray[i]._y>h || starArray[i]._y<0) {starArray[i]._ySpeed = -starArray[i]._ySpeed}
                if (gameCounter > 299) {testBoundaries(starArray[i]);}
                playerCollision(starArray[i], i);
            }//endFor

    } //close starsUpdate
    function testBoundaries(objPos) {
                if(objPos._x>w){
                    objPos._x = 0;
                }
                if(objPos._x<0){
                    objPos._x = w;
                }
                if(objPos._y>h){
                    objPos._y = 0;
                }
                if(objPos._y<0){
                    objPos._y = h;
                }
    }

    function playerCollision(star, num) {
        if (Math.abs(ships.p1._x-star._x)<20 && Math.abs(ships.p1._y-star._y)<20 && !ships.p1._isInvinc) {
            //star.setSize(20,20, num);
            endGame(1);
            ships.p1._lives --;
            ships.p1._isInvinc = true;
            ships.p1._livesCounter.innerHTML = "Lives: " + ships.p1._lives;
            ships.p1._x = w/2, ships.p1._y = h/2;
            ships.p1._xSpeed = ships.p1._ySpeed = ships.p1._rot = 0;
        }
        if (Math.abs(ships.p2._x-star._x)<20 && Math.abs(ships.p2._y-star._y)<20 && !ships.p2._isInvinc) {
            //star.setSize(20,20, num);
            endGame(2);
            ships.p2._lives --;
            ships.p2._isInvinc = true;
            ships.p2._livesCounter.innerHTML = "Lives: " + ships.p2._lives;
            ships.p2._x = w/2 - 100, ships.p2._y = h/2;
            ships.p2._xSpeed = ships.p2._ySpeed = ships.p2._rot = 0;
        }
    }

    function invincTimeInc() {
        if (ships.p1._isInvinc && ships.p1._invIncTime > 0) {
            ships.p1._invIncTime --;
            if (ships.p1._invIncTime > 240 && ships.p1._accel) {
                ships.p1._accel = false;
            }
            if (ships.p1._invIncTime < 240) {
                if (ships.p1._invIncTime % 10 == 0) {
                    if (ships.p1._invIncTime % 20 == 0) {
                        ships.p1._isVisible = true;
                    } else {ships.p1._isVisible = false;}
                }
            } else {
                ships.p1._isVisible = false;
            }
        } else if (ships.p1._invIncTime == 0) {
            ships.p1._invIncTime = 300;
            ships.p1._isInvinc = false;
            ships.p1._isVisible = true;
        }
        if (ships.p2._isInvinc && ships.p2._invIncTime > 0) {
            ships.p2._invIncTime --;
            if (ships.p2._invIncTime > 240 && ships.p2._accel) {
                ships.p2._accel = false;
            }
            if (ships.p2._invIncTime < 240) {
                if (ships.p2._invIncTime % 10 == 0) {
                    if (ships.p2._invIncTime % 20 == 0) {
                        ships.p2._isVisible = true;
                    } else {ships.p2._isVisible = false;}
                }
            } else {
                ships.p2._isVisible = false;
            }
        } else if (ships.p2._invIncTime == 0) {
            ships.p2._invIncTime = 300;
            ships.p2._isInvinc = false;
            ships.p2._isVisible = true;
        }
    }
    // draw player  (add a drawImage command here for your player)

    // keep star on the screen (use our tricks from last week to make if statements here)

    // a new array is made to keep track of a button being held down
    var keysDown = [];

    // if the key is held down, the keycode is placed in array
    // then it is deleted upon keyup command.  
    // playerUpdate will now control player movements and use the keysDown array

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    //Listens to app for keyboard actions
    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);
    

    function playerUpdate() {
        // if (13 in keysDown) {
        //     gameOn = !gameOn;
        // }
        //player two hodling down a key using the array keysDown
        if (87 in keysDown) {// P2 holding down the w key
            //ships.p2._y -= 5;
            ships.p2._accel = true;
        }
        if (83 in keysDown) { // P2 holding down (key: s)
            ships.p2._y += 5;
        }
        if (65 in keysDown) { // P2 holding down (key: a)
            //ships.p2._x -= 5;
            ships.p2._rot -= (1/36)*Math.PI;
        }
        if (68 in keysDown) { // P2 holding down (key: d)
            //ships.p2._x += 5;
            ships.p2._rot += (1/36)*Math.PI;
        }
        

        // player one hodling key down
        if (37 in keysDown) { // P2 holding down (key: left arrow)
            //ships.p1._x -= 5;
            ships.p1._rot -= (1/36)*Math.PI;
        }
        if (38 in keysDown) { // P2 holding down (key: up arrow)
            //ships.p1._y -= 5;
            ships.p1._accel = true;
        }
        if (39 in keysDown) { // P2 holding down (key: right arrow)
            //ships.p1._x += 5;
            ships.p1._rot += (1/36)*Math.PI;
        }
        if (40 in keysDown) { // P2 holding down (key: down arrow)
            ships.p1._y += 5;
        }
        //console.log(keysDown);
        //test to see if x/y position should change to other side of screen
        invincTimeInc();

        testBoundaries(ships.p1);
        testBoundaries(ships.p2);

        calcVelocity(ships.p1);
        calcVelocity(ships.p2);
        //drawOver(ships.p1);
        drawRotated(ships.p1);
        drawRotated(ships.p2);
    } //cl

    function calcVelocity(ship) {
        if (ship._accel) {
            ship._xSpeed += Math.sin(ship._rot)/4;
            ship._xSpeed /= 1.02;
            ship._ySpeed += Math.cos(ship._rot)/4;
            ship._ySpeed /= 1.02;
            ship._img.src="images/spaceship" + ship._number + "-fire.png";//DOES NOT WORK WITH OTHER SHIP
            ship._accel = false;
        } else {
            // if (ship._xSpeed <= -0.01) {
            //     ship._xSpeed += Math.abs(Math.sin(ship._rotVel)/40); 
            // } else if (ship._xSpeed >= 0.01) {
            //     ship._xSpeed -= Math.abs(Math.sin(ship._rotVel)/40);
            //     } else {
            //         ship._xSpeed = 0;
            //     }
            // if (ship._ySpeed <= -0.01) {
            //     ship._ySpeed += Math.abs(Math.cos(ship._rotVel)/40); 
            // } else if (ship._ySpeed >= 0.01) {
            //     ship._ySpeed -= Math.abs(Math.cos(ship._rotVel)/40);
            //     } else {
            //         ship._ySpeed = 0;
            //     }
            // if (Math.abs(ship._xSpeed) >= 0.1) {ship._xSpeed -= Math.asin(ship._xSpeed)/40;} else {ship._xSpeed = 0;}
            // if (Math.abs(ship._ySpeed) >= 0.1) {ship._ySpeed -= Math.acos(ship._ySpeed)/40;} else {ship._ySpeed = 0;}
            if (Math.abs(ship._xSpeed) > 0.05) {
                ship._xSpeed /= 1.02;
            } else {ship._xSpeed = 0;}
            if (Math.abs(ship._ySpeed) > 0.05) {
                ship._ySpeed /= 1.02;
            } else {ship._ySpeed = 0;}
            ship._img.src="images/spaceship" + ship._number + ".png";
        }
        ship._y -= ship._ySpeed;
        ship._x += ship._xSpeed;
    }

    function drawOver(obj) {
        //draw images of obj
        //ctx.drawImage(obj._img, obj._x, obj._y, obj._width, obj._height);
        //ctx.rotate(obj._rot*(Math.PI/180));
        //drawRotated(obj);
        // ctx.save();
        // ctx.translate(obj._x,obj._y);
        // ctx.rotate(obj._rot);
        ctx.drawImage(obj._img, obj._x-obj._wh, obj._y-obj._hh, obj._width, obj._height);
        if (obj._x <= obj._wh) {
            ctx.drawImage(obj._img, w + (obj._x - obj._wh), obj._y-obj._hh, obj._width, obj._height);
        } else if (obj._x >= obj._wmwh) {
            ctx.drawImage(obj._img, obj._x - (w + 30), obj._y-obj._hh, obj._width, obj._height);
        }
        if (obj._y <= obj._hh) {
            ctx.drawImage(obj._img, obj._x-obj._wh, h + (obj._y - obj._hh), obj._width, obj._height);
        } else if (obj._y >= obj._hmhh) {
            ctx.drawImage(obj._img, obj._x-obj._wh, obj._y - obj._hmhh - 60, obj._width, obj._height);
        }
        // ctx.restore();
    }

    function drawRotated(obj){
        //context.clearRect(0,0,canvas.width,canvas.height);

        // save the unrotated context of the canvas so we can restore it later
        // the alternative is to untranslate & unrotate after drawing
        if (obj._isVisible) {
        ctx.save();

        // move to the center of the canvas
        ctx.translate(obj._x,obj._y);

        // rotate the canvas to the specified degrees
        ctx.rotate(obj._rot);

        // draw the image
        // since the context is rotated, the image will be rotated also
        //ctx.drawImage(obj._img, -obj._width/2, -obj._height/2, obj._width, obj._height);//obj._x-obj._wh, obj._y-obj._hh, 
        ctx.drawImage(obj._img, -25, -25, obj._width, obj._height);
        // if (obj._x <= obj._wh) {
        //     ctx.drawImage(obj._img, w + (obj._x - obj._wh), obj._y-obj._hh, obj._width, obj._height);
        // } else if (obj._x >= obj._wmwh) {
        //     ctx.drawImage(obj._img, obj._x - (w + 30), obj._y-obj._hh, obj._width, obj._height);
        // }
        // if (obj._y <= obj._hh) {
        //     ctx.drawImage(obj._img, obj._x-obj._wh, h + (obj._y - obj._hh), obj._width, obj._height);
        // } else if (obj._y >= obj._hmhh) {
        //     ctx.drawImage(obj._img, obj._x-obj._wh, obj._y - obj._hmhh - 60, obj._width, obj._height);
        // }

        // we’re done with the rotating so restore the unrotated context
        ctx.restore();
        }
    }

    //Our main function which clears the screens 
    //  and redraws it all again through function updates,
    //  then calls itself out again
    function main(){
        if (gameOn) {
            if (gameCounter < 300) {
                gameCounter ++;
            }
            ctx.clearRect(0,0,w,h);
            starsUpdate();
            playerUpdate();
        } else if (startScreen) {
            if (doStartScreen) {
                ctx.clearRect(0,0,w,h);
                ctx.font = "54px Roboto";
                ctx.fillStyle = "white";
                ctx.fillText("Asteriods", 300, 100);
                ctx.fillStyle = "red";
                ctx.font = "36px Roboto";
                startScreenCycle = 0;
                doStartScreen = false;
            } else {
                if (startScreenCycle == 51) {
                    ctx.fillText("Press Enter to Start", 250, 250);
                } else if (startScreenCycle == 101) {
                    doStartScreen = true;
                }
            }
            if (13 in keysDown) {
                startScreen = false;
                gameOn = true;
            }
            startScreenCycle ++;
        } else if (gameEnd) {
            ctx.font = "54px Roboto";
            ctx.fillText(playerLost, 300, 100);
            ctx.fillStyle = "red";
        }
        requestAnimationFrame(main); //TODO: figure out how to reference main function in toggleGame, then only request Animationframe if gameOn is true.
    }

    function endGame(loser) {
        gameEnd = true;
        gameOn = false;
        playerLost = "Player " + loser + " lost";
    }
    main();
} //initiate end
function toggleGame() {
    gameOn = !gameOn;
    //if (gameOn) {main();}
}
//canvas = document.getElementById("myCanvas");
//canvas.onload = initiate();
var gameOn = false;