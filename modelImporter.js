import { DirectioanalLight } from "./Lights.js";
import { StaticMesh } from "./Mesh.js";
import { parseOBJ, importImage } from "./MeshUtils.js";
import { mat4,vec3 } from "./gl-matrix/index.js";


export class ModelImporter {

    constructor(gl, world, program, texture,gizmo,unlitprogram) {
        this.gl = gl;
        this.gizmo =gizmo;
        this.unlitprogram =unlitprogram;
        this.world =world;
       this.texture = texture;
        this.ImplementImporter(gl, world, program, texture,gizmo);
        this.UpdateOutliner(gl, world, program, texture,gizmo);
        this.selectedobject;
        this.ImplementDetailsPanel();
        this.ImplementLightsPanel();

        




    }

    ImplementImporter(gl, world, program, texture,gizmo) {
        document.getElementById('obj-input').addEventListener('change', async event=> {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e=> {
                const objText = e.target.result;

              
                const parsedgeometry = parseOBJ(objText);
                this.createdmesh = new StaticMesh(gl, parsedgeometry, program, texture);
                this.createdmesh.name = file.name;
                world.AddStaticMesh(this.createdmesh);
                this.UpdateOutliner(gl, world, program, texture,gizmo);


                console.log("Mesh oluşturuldu:", this.createdmeshmesh);
                // Mesh'i sahneye ekleyebilirsin
            };

            reader.readAsText(file);
        });
    }

    UpdateOutliner(gl, world, program, texture,gizmo) {
        const list = document.getElementById("outliner-list");
        console.log (list);
        list.innerHTML = ""; // eski içerikleri temizle
        world.drawables.forEach(obj => {
            if(obj.name !== "Nameless Object"){
            const li = document.createElement("li");
            li.textContent = obj.name;
            li.dataset.objectId = obj.name;


           
            li.addEventListener("click", (event) => {
                event.preventDefault();
                console.log("Seçilen nesne:", obj);
                this.selectedobject = obj;
                var location_l = vec3.create();
                location_l = mat4.getTranslation(location_l, obj.transform);                
                // Set Gizmo Properties
                gizmo.SetLocation(location_l);
                if (this.selectedobject == null) {
                    gizmo.MakeHidden();
                } else {
                    gizmo.MakeVisible();
                }

                // Update details panel with the selected object's transform
                const position = mat4.getTranslation(vec3.create(), obj.transform);
                const rotation = vec3.create();
                const scale = vec3.create();

                // Extract rotation (in degrees) and scale from the transform matrix
                mat4.getScaling(scale, obj.transform);

                const rotationMatrix = mat4.clone(obj.transform);
                const scaleMatrix = mat4.fromScaling(mat4.create(), scale);
                mat4.multiply(rotationMatrix, rotationMatrix, mat4.invert(scaleMatrix, scaleMatrix));

                const eulerAngles = vec3.create();
                eulerAngles[0] = Math.atan2(rotationMatrix[6], rotationMatrix[10]) * (180 / Math.PI); // X-axis rotation
                eulerAngles[1] = Math.atan2(-rotationMatrix[2], Math.sqrt(rotationMatrix[0] ** 2 + rotationMatrix[1] ** 2)) * (180 / Math.PI); // Y-axis rotation
                eulerAngles[2] = Math.atan2(rotationMatrix[1], rotationMatrix[0]) * (180 / Math.PI); // Z-axis rotation

                vec3.copy(rotation, eulerAngles);

                this.positionInputs.x.value = position[0];
                this.positionInputs.y.value = position[1];
                this.positionInputs.z.value = position[2];

               
                this.rotationInputs.x.value = rotation[0];
                this.rotationInputs.y.value = rotation[1];
                this.rotationInputs.z.value = rotation[2];

                this.scaleInputs.x.value = scale[0];
                this.scaleInputs.y.value = scale[1];
                this.scaleInputs.z.value = scale[2];
            });

            list.appendChild(li);
        }

        });

       
        

    }
    ImplementDetailsPanel(){
        this.positionInputs = {
            x: document.getElementById("position-x"),
            y: document.getElementById("position-y"),
            z: document.getElementById("position-z"),
        };
        
        this.rotationInputs = {
            x: document.getElementById("rotation-x"),
            y: document.getElementById("rotation-y"),
            z: document.getElementById("rotation-z"),
        };
        
        this.scaleInputs = {
            x: document.getElementById("scale-x"),
            y: document.getElementById("scale-y"),
            z: document.getElementById("scale-z"),
        };

        Object.values(this.positionInputs).forEach(input => 
input.addEventListener("input", this.UpdateTransform.bind(this))
);
        Object.values(this.rotationInputs).forEach(input => 
input.addEventListener("input", this.UpdateTransform.bind(this))
);
        Object.values(this.scaleInputs).forEach(input => 
input.addEventListener("input", this.UpdateTransform.bind(this))
);
    }
    UpdateTransform(){
        const position = vec3.fromValues(
            parseFloat(this.positionInputs.x.value),
            parseFloat(this.positionInputs.y.value),
            parseFloat(this.positionInputs.z.value)
        );
    
        const rotation = vec3.fromValues(
            parseFloat(this.rotationInputs.x.value),
            parseFloat(this.rotationInputs.y.value),
            parseFloat(this.rotationInputs.z.value)
        );
    
        const scale = vec3.fromValues(
            parseFloat(this.scaleInputs.x.value),
            parseFloat(this.scaleInputs.y.value),
            parseFloat(this.scaleInputs.z.value)
        );
        this.selectedobject.updateTransformFromDetailsPanel(position,rotation,scale);
        this.gizmo.SetLocation(mat4.getTranslation(vec3.create(),this.selectedobject.transform));
    }
    ImplementLightsPanel(){
        const spotlightbutton = document.getElementById("spotlight-btn");
        const directionallightbutton = document.getElementById("directional-light-btn");
        const pointlightbutton = document.getElementById("pointlight-btn");

        spotlightbutton.addEventListener("click", () => {
            console.log("Spotlight button clicked");
        });

        directionallightbutton.addEventListener("click", async () => {
            console.log("Directional light button clicked");
            const lighttexture = await importImage(this.gl,"resources/orange.png");
            const directionallightmesh = new StaticMesh(this.gl,parseOBJ(await (await fetch('./resources/directionalLight.obj?v=1')).text()),this.unlitprogram,lighttexture);
            const directionallight = new DirectioanalLight (this.gl,directionallightmesh);
            directionallightmesh.name = "directionalLight";
            this.world.AddLight(directionallight);
            this.UpdateOutliner(this.gl,this.world,this.program,this.texture,this.gizmo);
        });

        pointlightbutton.addEventListener("click", () => {
            console.log("Point light button clicked");
        });

    }
}

        