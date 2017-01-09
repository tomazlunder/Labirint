
/// <reference path="/scripts/babylon.js" />

function Mapa(filePath) {
    this.reader = new XMLHttpRequest() //|| new ActiveXObject('MSXML2.XMLHTTP');
    this.txt = filePath;
    this.map = [];
    this.sirina;
    this.visina;
    this.startpoint;
    this.end;
    this.door = null;
    this.key = null;

    loadFileX = function() {
        this.reader.open('GET', this.txt);
        this.reader.onreadystatechange = displayContents;
        this.reader.send(null);
    }

    this.parseMap = function (data) {
        var prva = true;
        var lines = data.split("\n");
        for (l in lines) {
            line = lines[l].split("");
            //line = line.slice(0, line.length - 1);
            elementi = [];
            if (prva) {
                this.visina = lines.length;
            }
            for (el in line) {
                if (prva) {
                    this.sirina = line.length;
                    prva = false;
                }
                if (parseInt(line[el]) == 6) { //KLJUC
                    this.key = [el, l];
                } else {
                    gradnik = new Gradnik(parseInt(line[el]), el, l);
                    if (parseInt(line[el]) == 3) {
                        this.startpoint = new BABYLON.Vector3((3 / 2) + (el * 3), 3, (3 / 2) + (l * 3));
                        camera.position = this.startpoint;
                    }
                    if (parseInt(line[el]) == 5) {
                        this.end = gradnik;
                        BABYLON.Tools.Log("End dodeljen");
                    }
                    if (parseInt(line[el]) == 7) {
                        this.door = gradnik;
                        BABYLON.Tools.Log("Door dodeljen");
                    }
                    elementi.push(gradnik);
                }
                this.map.push(elementi);
            }
        }
        BABYLON.Tools.Log("v: " + this.visina);
        BABYLON.Tools.Log("s: " + this.sirina);

        //TLA
        var mCount = 4;

        var sirina = this.sirina * 3;
        var visina = this.visina * 3;
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.emissiveTexture = new BABYLON.Texture("textures/trava.jpg", scene);
        groundMaterial.emissiveTexture.uScale = this.sirina;
        groundMaterial.emissiveTexture.vScale = this.visina;
        groundMaterial.bumpTexture = new BABYLON.Texture("textures/trava.jpg", scene);
        groundMaterial.bumpTexture.uScale = this.sirina;
        groundMaterial.bumpTexture.vScale = this.visina;
        groundMaterial.specularTexture = new BABYLON.Texture("textures/trava.jpg", scene);
        groundMaterial.specularTexture.uScale = this.sirina;
        groundMaterial.specularTexture.vScale = this.visina;

        var ground = new BABYLON.Mesh.CreateGround("ground", sirina, visina, 0, scene);
        ground.position = new BABYLON.Vector3((sirina / 2), 0, (visina / 2));
        ground.material = groundMaterial;
        ground.checkCollisions = true

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/textures/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        //Luci
        //light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        //Infromativen izris kocke za pozicioniranje luci - potem izbrisi
        var sonX = 60;
        var sonY = 170;
        var sonZ = -80;
        var soncePos = new BABYLON.Mesh.CreateBox("soncePos", 2, scene);
        soncePos.position = new BABYLON.Vector3(sonX, sonY, sonZ);
        var sonce = new BABYLON.PointLight("sonce", new BABYLON.Vector3(sonX, sonY, sonZ), scene);
    }

    this.loadFile = function () {
        var request = this.reader;
        var myState = this;
        request.open("GET", this.txt);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                console.log("loadFile");
                myState.parseMap(request.responseText);              
            }}  
        request.send();
    }
    this.loadFile();
}

