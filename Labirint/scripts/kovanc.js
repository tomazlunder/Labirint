/// <reference path="/scripts/babylon.js" />

function Kovanc(tip, posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.ime = posX + "_" + posY;
    this.mat = new BABYLON.StandardMaterial("mat" + this.ime, scene);
    this.sirina = 3;
    this.mesh;
    var g = new BABYLON.Mesh.CreateCylinder("cylinder" + this.ime, 3, 3, 3, 20, 3, scene, false);
    g.scaling = new BABYLON.Vector3(0.3, 0.03, 0.3);
    g.rotation.x = 1.5;
    g.position = new BABYLON.Vector3(this.sirina / 2 + this.posX * this.sirina, 2, this.sirina / 2 + this.posY * this.sirina);
    g.checkCollisions = false;
    var endMaterial = new BABYLON.StandardMaterial("start", scene);
    endMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
    endMaterial.specularColor = new BABYLON.Color3(1, 1, 0);
    //endMaterial.alpha = 0.8;
    g.material = endMaterial;
    this.mesh = g;

    this.rotate = function () {
        this.mesh.rotation.y += 0.05;
    }
}