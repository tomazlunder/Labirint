/// <reference path="/scripts/babylon.js" />

var mesh = null;
var tmpLoaded = false;

var enemy;

function Zilla() {
    console.log("blibli")

    this.loaded = false;
    this.getLoaded = function () {
        return this.loaded;
    }


    this.mesh;
    enemy = this;
    

    this.loadMesh = function () {
        engine.displayLoadingUI();
        BABYLON.SceneLoader.ImportMesh("", "zilla/", "zilla.babylon", scene, function (newMeshes, particleSystems, skeletons) {
            zilla = newMeshes[0];
            //console.log(m);
            //zilla.isVisible = true;

            zilla.position.x = 40;
            zilla.position.y = 10;
            zilla.position.z = 20;
            //zilla.rotation.z = 0.5;
            zilla.rotation.x = 0.0;
            zilla.rotation.y = 1;
            zilla.applyGravity = true;
            //this.mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            enemy.loaded = false;
            console.log("blablabla")
            BABYLON.Tools.Log("bleble")
            console.log(skeletons[0])
            scene.beginAnimation(skeletons[0], 0, 100, true)
            BABYLON.Tools.Log("blublu")
            tmpLoaded = true;
            enemy.mesh = zilla;

            engine.hideLoadingUI();
        });
        //console.log(this.loaded)
        //this.loaded = tmpLoaded;
    }


    this.move = function () {
        if (tmpLoaded) {
            mesh.position.x += 0.3;
        }
    }

    this.postavi = function () {


    }
    
    this.premakni = function () {



    }
    
    this.pereveriKolizijo = function () {


    }

    this.obrat = function () {


    }
}

