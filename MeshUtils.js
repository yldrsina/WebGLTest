import { StaticMesh } from "./Mesh.js";
import { mat4, glMatrix, vec3 } from "./gl-matrix/index.js";

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Number} program 
 * @returns {StaticMesh}
 */
export async function createBasicTestMesh(gl, program) {
    var positions = new Float32Array([
        // positions          // texture coords
        0.5, 0.5, 0.0, // top right
        0.5, -0.5, 0.0, // bottom right
        -0.5, -0.5, 0.0, // bottom left
        -0.5, 0.5, 0.0, // top left 
    ]);
    const texCoords = [
        1.0, 1.0,
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0
    ]
    var indicies = new Uint16Array([
        0, 3, 1,//first triangle
        1, 3, 2  //second triangle
    ]);
    const geom = new Geometry();
    geom.setup(positions, [], texCoords, indicies, "basictestmesh");

    
    const sm = new StaticMesh(gl, [geom], program, (view, projection) => {
        
    });
    mat4.rotate(sm.transform, sm.transform, glMatrix.toRadian(-55.0), vec3.fromValues(1, 0, 0));
    mat4.translate(sm.transform, sm.transform, vec3.fromValues(0, 0, 0));
    return sm;
}
/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {string} imagesource 
 * @returns 
 */
export async function importImage(gl, imagesource) {
    var image = new Image();
    image.src = imagesource;
    return new Promise((resolve, reject) => {
        image.onload = () => {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
            resolve(texture);
        }
        image.onerror = (err) => reject(err);
    })
}



export function parseOBJ(text) {

    const geometries = [];
    var currentGeometry;
    let totalTriangles = 0;
    let totalVertices = 0;

    const keywords = {

        f(parts) {
            currentGeometry.facePositions.push(parts);
            var parsedIndices = [];
            parts.forEach(element => {
                parsedIndices.push(element.split("/")[0]);
               currentGeometry.vertexIndices.push(currentGeometry.counter);
               currentGeometry.counter++;
            });
            //currentGeometry.vertexIndices.push(...parsedIndices.map((str) => parseFloat(str)-1));
        },
        o(parts) {
            currentGeometry = new Geometry();
            geometries.push(currentGeometry);
            currentGeometry.name = parts;

        },
        vt(parts) {
            currentGeometry.textureCoords.push(parts.map(parseFloat));

        },
        v(parts) {

            currentGeometry.vertexPosition.push(parts.map(parseFloat));

        },
        vn(parts) {
            currentGeometry.vertexNormals.push(parts.map(parseFloat));
        },
        s(parts) {

        },
    };

    const keywordRE = /(\w*)(?: )*(.*)/;  // REGEX: satırın başındaki kelimeyi ve geri kalan kısmı ayır.
    const lines = text.split('\n');  //Texti satırlara bölüp bir arraye at.
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {  //Tüm satırlar tek tek işlenir.
        const line = lines[lineNo].trim(); // bir satırın başındaki ve sonundaki boşluklar silinir.
        if (line === '' || line.startsWith('#')) {  // eğer yorum satırı veya boş bir satır varsa bu satırlar atlanır.
            continue;
        }
        const m = keywordRE.exec(line);  // satırı regexe göre işle ve geri kalan kısmı al.
        if (!m) { //Eğer Regex eşleme bulunmazsa o satırı atla.
            continue;
        }
        const [, keyword, unparsedArgs] = m; //regex sonuçlarını ayır: keyword ve kalan args.
        const parts = line.split(/\s+/).slice(1); //satırı boşluklara göre ayır. ilk öge komut olduğu için kalan argümanları al.
        const handler = keywords[keyword];
        // Eğer komut için bir işleyici yoksa, bilinmeyen komut olarak uyarı ver ve devam et
        if (!handler) {
            console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
            continue;
        }
        handler(parts, unparsedArgs);

    }
    geometries.forEach((value) => {
        console.log("isim:", value.name, "vertices:", value.vertexPosition.length, "triangles:", value.facePositions.length, "textureCoords:", value.textureCoords.length);
        value.triangleCount = value.vertexIndices.length;
        value.vertexCount = value.vertexPosition.length;
        totalTriangles += value.triangleCount;
        totalVertices += value.vertexCount;

        console.debug({
            vertexposition: value.vertexPosition,
            texturecoords: value.textureCoords,
            vertexindices: value.vertexIndices,
            facePositions: value.facePositions,
            finalattributes: value.attributes,
        });
        value.createAttributeArray();

    });
    console.log("triangles: " + totalTriangles + " vertices: " + totalVertices);

    return geometries;
}






class Geometry {

    name;
    vertexCount = 0;
    //UNRELIABLE.
    triangleCount = 0;

    counter=0;

    vertexPosition = [];
    vertexNormals = [];
    textureCoords = [];
    vertexIndices = [];
    facePositions = [];




    attributes = [];


    setup(vPositions, vNormals, tCoords, vIndices, name) {
        this.vertexPosition = vPositions;
        this.vertexNormals = vNormals;
        this.textureCoords = tCoords;
        this.vertexIndices = vIndices;
        this.name = name;
        this.vertexCount = this.vertexPosition.length;

        this.createAttributeArray();
    }

    createAttributeArray() {
        let newvertices = [];
        let newvertex = [];
        let newtexcoords = [];
        let newnormals =[];
        this.facePositions.forEach(face => {      // tüm f satırlarını tara
            for (var i = 0; i < face.length; i++) { //her bir f satırı için :
                newvertices = face[i].split("/");  // 1/1/1 i bir arraya [1,1,1] olarak at.

                newvertex = this.vertexPosition[+newvertices[0]-1]; //ilk elemanı vertex positions arrayinden al ve aşağıda pushla
                if (!newvertex) {
                    console.error("newvertex is invalid, context:", { newvertices, newvertex, vp: this.vertexPosition, nv: +newvertices[0]-1});
                }
                this.attributes.push(...newvertex);

                newtexcoords = this.textureCoords[+newvertices[1] - 1]; //2. elemanı texcoords arrayından al ve pushla
                if (!newtexcoords) {
                    console.error("newtexcoords is invalid, context:", { newvertices, newvertex, newtexcoords, nv: +newvertices[1]-1});
                }
                this.attributes.push(...newtexcoords);

                newnormals = this.vertexNormals[+newvertices[2]-1]; //3. elemanı al ve vertex normal olarak ayarla
                this.attributes.push(...newnormals);

            }

        });
    }
}