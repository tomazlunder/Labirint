/// <reference path="/scripts/babylon.js" />

"use strict";

var canvas;
var menucanvas;
var overlaycanvas;
var engine;
var scene;
var camera;
var mesh;
var light;
var keys;
var startpoint;
var end;
var map;
var menu = true; //TRUE - in menu, FALSE - in game
var menu_number = 0; //0 - Main menu
var debuglayer = false;
var paused = false;
var check_e = false;
var end = false;
var map_init = false;
var map_parse = false;
var music;


var selectedmap = "./mape/mapa1.txt";

//2D Canvas - MENU

var grey = "#9b9b9b";
var white = "#ffffff";

var black = "#000000";
var blue = "#0077ff";
var red = "#ff0000";
var green = "#25b50c";
var yellow = "#fff71e";
var violet = "#961eff";

var main_menu_img = document.getElementById("menu_main");
var key_img = document.getElementById("key_texture");



//2D canvas init
menucanvas = document.getElementById('menuCanvas');
var context = menucanvas.getContext('2d');

//2D Overlay canvas init
overlaycanvas = document.getElementById('overlayCanvas');
var context2 = overlaycanvas.getContext('2d');
context2.font = "15px Arial";


//3D canvas init
canvas = document.getElementById("renderCanvas");

menucanvas.width = window.innerWidth;
menucanvas.height = window.innerHeight;

var w_unit = menucanvas.width /10;
var h_unit = menucanvas.height /10;

var ready;
document.addEventListener("DOMContentLoaded", ready = true, false);

mainMenu();



function mainMenu() {
    menu = true;
    menu_number = 0;

    canvas.style.display = 'none';
    overlaycanvas.style.display = 'none';
    menucanvas.style.display = 'inline';

    context.beginPath();
    context.rect(0, 0, menucanvas.width, menucanvas.height);
    context.fillStyle = white;
    context.fillRect(0, 0, menucanvas.width, menucanvas.height);
    context.drawImage(main_menu_img, 0, 0, menucanvas.width, menucanvas.height);

    context.font = "15px Arial";
    context.fillStyle = black;
    context.fillText(selectedmap, 2.7*w_unit, 3.7*h_unit);
}



//startBabylonJS();

function startBabylonJS() {
    if (BABYLON.Engine.isSupported()) {
        var time = 0;
        var iskey = false; //Obstaja kljuc?
        var haskey = false; //Igralec ima kljuc?
        var usedkey = false;
        map_init = false;
        map_parse = false;

        menucanvas.style.display = 'none';
        canvas.style.display = 'inline';
        overlaycanvas.style.display = 'inline';
        menu = false;
        paused = false;

        //Rendering canvas
        //canvas.style.display = 'none';
        engine = new BABYLON.Engine(canvas, true);

        //Scena
        scene = new BABYLON.Scene(engine);
        scene.debugLayer.show(true, camera);
        scene.debugLayer.hide();
        scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
        scene.collisionsEnabled = true;

        //Kamera (Karakter)
        camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(5, 5, 5), scene);

        camera.attachControl(canvas, true);
        camera.checkCollisions = true;
        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(0.8, 1.5, 0.8);

        camera.attachControl(canvas, true);

        camera.keysUp = [87]; // W
        camera.keysDown = [83]; // S
        camera.keysLeft = [65]; // A
        camera.keysRight = [68]; // D
        camera.rotation.y = Math.PI;
        camera.speed = 1;
        camera.inertia = 0.8;
        camera.angularSensibility = 1000;

        camera.layerMask = 2;

        scene.activeCamera = camera;
        

        //Mapa
        //var map = new Mapa("./mape/mapa1.txt");
        map = new Mapa(selectedmap);

        //Key manager
        var spriteManagerKey = new BABYLON.SpriteManager("keyManager", "textures/key_sprite/key_sprite.png", 1, 64, scene);


        setInterval(function () {
            time+=0.1;
        }, 100);

        //SOUNDS
        music = new BABYLON.Sound("Music", "sounds/ambient.wav", scene, null, { loop: true, autoplay: true });
        var door_sound = new BABYLON.Sound("DoorSound", "sounds/creaky_door_4.wav", scene,
             function () {
                 // Sound has been downloaded & decoded
             }
            );
        

        //RENDER-LOOP -----------------------------------------------------------------------------------------
        // Once the scene is loaded, just register a render loop to render it
        var wait = 100;
        engine.runRenderLoop(function () {
            //IZRIS OVERLAYA
            context2.clearRect(0, 0, canvas.width, canvas.height);
            context2.fillText("TIME:", 30, 20);
            context2.fillText(Math.round(time).toString(), 80, 20);

            if (check_e && haskey && !usedkey) {
                //BABYLON.Tools.Log(Math.sqrt(Math.pow((map.door.mesh.position.x - camera.position.x), 2) + Math.pow((map.door.mesh.position.z - camera.position.z), 2)));
                if (map.door !== null) {
                    if (Math.sqrt(Math.pow((map.door.mesh.position.x - camera.position.x), 2) + Math.pow((map.door.mesh.position.z - camera.position.z), 2)) < 4) {
                        //HAS KEY, DOOR is not open
                        usedkey = true;
                        haskey = false;
                        BABYLON.Tools.Log("aaaaaand Opeeeen");;
                        door_sound.play();
                    }
                }
                check_e = false;
            }

            if (haskey && !usedkey) {
                context2.drawImage(key_img, 100, 50, 80, 40);
            }

            if (usedkey && map.door.mesh.position.y > -3) {
                map.door.mesh.position.y -= 0.05;
            }



            engine.clear(new BABYLON.Color3(0.5, 0.5, 0.5), true);
            scene.render();

            //Počaka (wait) frame-ov, da se vse stvari inicializirajo
            //if (wait > 0) { wait--; }
            
            //else {
            if (map_init && map_parse && map.end !== 'undefined' && typeof map.end !== 'undefined') {
                //Ce map.key obstaja in v svetu se ni kljuca
                if (map.key !== null & !iskey) {
                    var key = new BABYLON.Sprite("key", spriteManagerKey);
                    key.position.x = map.key[0] * 3 + 1.5;
                    key.position.z = map.key[1] * 3 + 1.5;
                    key.position.y = 1;
                    key.playAnimation(0, 9, true, 100);
                    iskey = true;
                }

                //Ce kljuc obstaja, ni pobran
                if (iskey & !haskey) {
                    var player_co = getCameraXZ();
                    if (player_co[0] == map.key[0] & player_co[1] == map.key[1]) {
                        haskey = true;
                        spriteManagerKey.dispose();
                    }
                }

                //END block se vrti
                map.end.mesh.rotation.y += 0.1;

                //Ce je igralec na koncu
                var player_co = getCameraXZ();
                if (player_co[0] == map.end.posX && player_co[1] == map.end.posY) {
                    BABYLON.Tools.Log("KONEC");
                    music.stop();
                    end = true;
                    engine.stopRenderLoop();
                    context2.clearRect(0, 0, canvas.width, canvas.height);
                    context2.fillStyle = grey;
                    context2.fillRect(0, 0, canvas.width, 80);
                    context2.fillStyle = red;
                    context2.fillText("Congratulations!", 30, 20);
                    context2.fillStyle = black;
                    context2.fillText("FINAL TIME:", 30, 40);
                    context2.fillText(Math.round(time).toString() + "s", 150, 40);
                    context2.fillText("Click ESC two times", 30, 60);

                }
            }
        });
        //END RENDER LOOP -------------------------------------------------------------------------------------------------


        //Helper function - returns the [x,z] of tile player (camera) is in;
        //Used in render loop
        function getCameraXZ() {
            return [Math.floor(camera.position.x / 3), Math.floor(camera.position.z / 3)];
        }
    }
}

//MOUSE LISTENER
document.addEventListener("click", function (evt) {
    var x = evt.clientX;
    var y = evt.clientY;
    BABYLON.Tools.Log("Click: " + x + " " + y);;
    if (menu) {
        if (menu_number == 0) { //main menu
            if (x > 0 && x < 4 * w_unit) { //Possible main (left) bar
                if (y > 3 * h_unit && y < 4 * h_unit) { //Map selection
                    BABYLON.Tools.Log("map selection");
                    var f = document.getElementById("mapInput");
                    f.click();
                }
                else if (y > 5 * h_unit && y < 6 * h_unit) { //Style
                    BABYLON.Tools.Log("style");
                }
                else if (y > 7 * h_unit && y < 8 * h_unit) { //Play
                    BABYLON.Tools.Log("play");
                    if (ready) {
                        startBabylonJS();
                    }
                }
            } else if (x > 7 * w_unit && x < menucanvas.width) { //Possible secondary (right) bar
                if (y > 7 * h_unit && y < 8 * h_unit) { //Scores
                    BABYLON.Tools.Log("scores");
                }

            }
        }
    } else {
        canvas.requestPointerLock();
    }
});


//KEY LISTENERS
document.addEventListener("keydown", handleKeyDown, false);

function handleKeyDown(evt) {
    //Only if game is running
    if (!menu){
        if (evt.keyCode == "67") { //C - noclip (for testing)
            BABYLON.Tools.Log("C detected");
            changeCamera();
        }
        if (evt.keyCode == "69") { //E - for opening doors
            BABYLON.Tools.Log("E detected");
            check_e = true;
        }
    } else { //Only if in menu
        BABYLON.Tools.Log("C detected x");
    }

    //Always
    if (evt.keyCode == "27") { //ESC - Pause game
        BABYLON.Tools.Log("ESC detected");
        if (!menu) {
            engine.stopRenderLoop();
            music.stop();
            mainMenu();
        }

    }
    if (evt.keyCode == "86") { //V - Debug layer
        BABYLON.Tools.Log("V detected");
        //toggleDebugLayer();
        //startBabylonJS();
    }

}

//NO CLIP MODE
function changeCamera() {
    camera.applyGravity = !camera.applyGravity;
    scene.collisionsEnabled = !scene.collisionsEnabled;
    if (camera.speed == 1) {
        camera.speed = 2
    } else { camera.speed = 1 };
}

//SWTICH TO MENU
function swapCanvases() {
    if (canvas.style.display == 'none') {
        canvas.style.display = 'inline';
        menucanvas.style.display = 'none';
        menu = false;
    } else {
        canvas.style.display = 'none';
        menucanvas.style.display = 'inline';
        menu = true;
        //context.beginPath();
        //context.rect(0, 0, menucanvas.width, menucanvas.height);
        //context.fillStyle = blue;
        //context.fill;
    }
}

//TOGGLEDEBUGLAYER - not working
function toggleDebugLayer() {
    if (debuglayer) {
        scene.debugLayer.hide();
    } else {
        scene.debugLayer.show();
    }
    debuglayer = !debuglayer;
}

document.getElementById('mapInput').onchange = function () {
    var str = this.value;
    var name = str.split("\\").pop();
    BABYLON.Tools.Log(name);
    selectedmap = "./mape/" + name;
    mainMenu();
};