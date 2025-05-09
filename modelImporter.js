import { DirectioanalLight, PointLight, SpotLight } from "./Lights.js";
import { StaticMesh } from "./Mesh.js";
import { parseOBJ, importImage } from "./MeshUtils.js";
import { toRadian } from "./gl-matrix/common.js";
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
        this.UpdateLightInfoPanel();
        this.ImportTexture();
        this.intensity =1;
        this.color = vec3.fromValues(1,1,1);

        




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
                this.UpdateLightInfoPanel();

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

        spotlightbutton.addEventListener("click", async() => {
            console.log("Spotlight button clicked");

            const lighttexture = await importImage(this.gl,"resources/orange.png");
            const spotlightmesh = new StaticMesh(this.gl,parseOBJ(await (await fetch('./resources/spotLight.obj?v=1')).text()),this.unlitprogram,lighttexture);
            const spotlight = new SpotLight(this.gl,spotlightmesh);
            spotlightmesh.light = spotlight;
            spotlightmesh.name = "spotLight";
            mat4.translate(spotlightmesh.transform,spotlightmesh.transform,vec3.fromValues(0,15,25));
            mat4.rotateX(spotlightmesh.transform,spotlightmesh.transform,toRadian(135));
            this.world.AddLight(spotlight);
            this.UpdateOutliner(this.gl,this.world,this.program,this.texture,this.gizmo);
            spotlight.diffuse = vec3.fromValues(15,15,15);
        });

        directionallightbutton.addEventListener("click", async () => {
            console.log("Directional light button clicked");

            const lighttexture = await importImage(this.gl,"resources/orange.png");
            const directionallightmesh = new StaticMesh(this.gl,parseOBJ(await (await fetch('./resources/directionalLight.obj?v=1')).text()),this.unlitprogram,lighttexture);
            const directionallight = new DirectioanalLight (this.gl,directionallightmesh);
            directionallightmesh.light = directionallight;
            directionallightmesh.name = "directionalLight";
            mat4.translate(directionallightmesh.transform,directionallightmesh.transform,vec3.fromValues(0,8,1));
            mat4.rotateX(directionallightmesh.transform,directionallightmesh.transform,toRadian(60));
            this.world.AddLight(directionallight);
            this.UpdateOutliner(this.gl,this.world,this.program,this.texture,this.gizmo);
            directionallight.diffuse = vec3.fromValues (0.2,0.2,0.2);
        });

        pointlightbutton.addEventListener("click", async() => {
            console.log("Point light button clicked");
            const lighttexture = await importImage(this.gl,"resources/orange.png");
            const lightmesh = new StaticMesh(this.gl,parseOBJ(await (await fetch('./resources/pointLight.obj?v=1')).text()),this.unlitprogram,lighttexture);
            const light = new PointLight (this.gl,lightmesh);
            lightmesh.light = light;
            lightmesh.name = "pointLight";
            mat4.translate(lightmesh.transform,lightmesh.transform,vec3.fromValues(3,3,3));
            mat4.rotateX(lightmesh.transform,lightmesh.transform,toRadian(60));
            this.world.AddLight(light);
            this.UpdateOutliner(this.gl,this.world,this.program,this.texture,this.gizmo);
        });

    }

    UpdateLightInfoPanel() {
        const lightInfoPanel = document.querySelector(".light-info-group").parentElement; // Get the Light Info section
        const lightColorInput = document.getElementById("light-color");
        const lightIntensityInput = document.getElementById("light-intensity");

        // Ensure a light is selected before updating
        if (!this.selectedobject || !(this.selectedobject.name === "spotLight" || this.selectedobject.name === "directionalLight" ||this.selectedobject.name == "pointLight")) {
            console.warn("No light object selected or selected object is not a light.");
            lightInfoPanel.style.display = "none"; // Hide the Light Info section
            console.log("OH NOO");
            return;
        }

        lightInfoPanel.style.display = "block"; // Show the Light Info section

        const selectedLight = this.selectedobject.parentLight; // Access the parent light (if applicable)

        // Set initial values in the panel based on the selected light
        lightColorInput.value = selectedLight?.color || "#ffffff";
        lightIntensityInput.value = selectedLight?.intensity || 1;

        // Update light color
        lightColorInput.addEventListener("input", (event) => {
            const color = event.target.value;
            if (this.selectedobject.light) {
                this.color = this.HexToVec3(color);
                this.selectedobject.light.diffuse = vec3.fromValues(this.color[0]*this.intensity,this.color[1]*this.intensity,this.color[2]*this.intensity) ; // Update the light's color property
                console.log(`Updated light color to: ${this.selectedobject.light.diffuse}`);
            }
        });

        // Update light intensity
        lightIntensityInput.addEventListener("input", (event) => {
            const intensity = parseFloat(event.target.value);
            if (this.selectedobject.light) {
                this.intensity = intensity;
                var currentColor = this.color;
                currentColor = vec3.fromValues(currentColor[0]*intensity,currentColor[1]*intensity,currentColor[2]*intensity);
                this.selectedobject.light.diffuse = currentColor;
                console.log(`Updated light intensity to: ${intensity}`);
            }
        });
    }
    ImportTexture() {
        const textureInput = document.getElementById('texture-import');
        const texturePreview = document.getElementById('texture-preview');

        // Add an event listener for texture import
        textureInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageSrc = e.target.result;

                // Update the texture preview
                texturePreview.style.backgroundImage = `url(${imageSrc})`;

                // Import the texture using the importImage function
                const texture = await importImage(this.gl, imageSrc);

                // Apply the texture to the selected object
                if (this.selectedobject) {
                    this.selectedobject.texture = texture;
                    console.log(`Texture applied to object: ${this.selectedobject.name}`);
                } else {
                    console.warn("No object selected to apply the texture.");
                }
            };

            reader.readAsDataURL(file);
        });
    }
















    
    HexToVec3(hexColor) {
        // Remove the hash at the start if it's there
        hexColor = hexColor.replace(/^#/, '');

        // Parse the hex color into RGB components
        const r = parseInt(hexColor.substring(0, 2), 16) / 255;
        const g = parseInt(hexColor.substring(2, 4), 16) / 255;
        const b = parseInt(hexColor.substring(4, 6), 16) / 255;

        // Return as a vec3
        return vec3.fromValues(r, g, b);
    }

    Vec3ToHex(vec) {
        // Convert each component to a 2-digit hex string
        const r = Math.round(vec[0] * 255).toString(16).padStart(2, '0');
        const g = Math.round(vec[1] * 255).toString(16).padStart(2, '0');
        const b = Math.round(vec[2] * 255).toString(16).padStart(2, '0');

        // Combine into a hex color string
        return `#${r}${g}${b}`;
    }
}

