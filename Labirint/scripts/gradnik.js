/// <reference path="/scripts/babylon.js" />

function Gradnik(tip, posX, posY) {
    this.tip = tip;
    this.posX = posX;
    this.posY = posY;
    this.ime = posX+"_"+posY;
    this.mat = new BABYLON.StandardMaterial("mat" + this.ime, scene);
    this.sirina = 3;
    this.mesh;

    if (tip == 1) {
        var g = new BABYLON.Mesh.CreateBox("zid" + this.ime, this.sirina, scene);
        g.position = new BABYLON.Vector3(this.sirina / 2 + this.posX * this.sirina, this.sirina / 2, this.sirina / 2 + this.posY * this.sirina);
        //g.material = this.mat;
        g.checkCollisions = true;
        //this.mat.diffuseColor = new BABYLON.Color3.Red();
        //this.mat.specularColor = new BABYLON.Color3.Black();

        var cubeTopMaterial = new BABYLON.StandardMaterial("cubeTop", scene);
        cubeTopMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.15);

        var cubeWallMaterial = new BABYLON.StandardMaterial("cubeWalls", scene);
        cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/masonry-wall-texture.jpg", scene);
        cubeWallMaterial.bumpTexture = new BABYLON.Texture("textures/masonry-wall-bump-map.jpg", scene);
        cubeWallMaterial.specularTexture = new BABYLON.Texture("textures/masonry-wall-normal-map.jpg", scene);

        var cubeMultiMat = new BABYLON.MultiMaterial("cubeMulti", scene);
        cubeMultiMat.subMaterials.push(cubeTopMaterial);
        cubeMultiMat.subMaterials.push(cubeWallMaterial);

        g.material = cubeWallMaterial;
        g.scaling = new BABYLON.Vector3(1, 1.8, 1);
        this.mesh = g;
    }
    
    //START POINT
    if (tip == 3) { 
        var g = new BABYLON.Mesh.CreateBox("start", this.sirina, scene);
        g.scaling = new BABYLON.Vector3(0.5, 0.1, 0.5);
        g.position = new BABYLON.Vector3(this.sirina / 2 + this.posX * this.sirina, (this.sirina * 0.1) / 2, this.sirina / 2 + this.posY * this.sirina);
        //camera.position = new BABYLON.Vector3(this.sirina / 2 + this.posX * this.sirina, 3, this.sirina / 2 + this.posY * this.sirina);

        g.checkCollisions = false;


        var startMaterial = new BABYLON.StandardMaterial("start", scene);
        startMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        startMaterial.specularColor = new BABYLON.Color3(0, 0, 1);


        g.material = startMaterial;

        //camera.position = startpoint;
        this.mesh = g;
    }

    //END POINT
    if (tip == 5) {
        var g = new BABYLON.Mesh.CreateBox("end", this.sirina, scene);
        g.scaling = new BABYLON.Vector3(0.5, 8, 0.5);
        g.position = new BABYLON.Vector3(this.sirina / 2 + this.posX * this.sirina, (8) / 2, this.sirina / 2 + this.posY * this.sirina);
        camera.position = new BABYLON.Vector3(this.sirina / 2 + this.posX * this.sirina, 3, this.sirina / 2 + this.posY * this.sirina);

        g.checkCollisions = false;


        var endMaterial = new BABYLON.StandardMaterial("start", scene);
        endMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        endMaterial.specularColor = new BABYLON.Color3(1, 0, 0);
        endMaterial.alpha = 0.8;

        g.material = endMaterial;
        this.mesh = g;
    }
    

    if (tip == 7) {//VRATA
        var g = new BABYLON.Mesh.CreateBox("door", this.sirina, scene);
        g.position = new BABYLON.Vector3(this.sirina / 2 + this.posX * this.sirina, this.sirina / 2, this.sirina / 2 + this.posY * this.sirina);
        g.checkCollisions = true;

        var doorMaterial = new BABYLON.StandardMaterial("doorMaterial", scene);
        //doorMaterial.emissiveColor = new BABYLON.Color3(0.545, 0.271, 0.075);
        //doorMaterial.specularColor = new BABYLON.Color3(0.545, 0.271, 0.075);
        doorMaterial.emissiveTexture = new BABYLON.Texture("textures/door.jpg", scene);
        doorMaterial.specularTexture = new BABYLON.Texture("textures/door-normal.png", scene);
        doorMaterial.bumpTexture = new BABYLON.Texture("textures/door-displacement.png", scene);

        g.material = doorMaterial;
        g.scaling = new BABYLON.Vector3(1, 1.8, 1);
        this.mesh = g;
    }
}