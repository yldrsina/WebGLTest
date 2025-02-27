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
        0.5, 0.5, 0.0, 1.0, 1.0, // top right
        0.5, -0.5, 0.0, 1.0, 0.0, // bottom right
        -0.5, -0.5, 0.0, 0.0, 0.0, // bottom left
        -0.5, 0.5, 0.0, 0.0, 1.0  // top left 
    ]);
    var indicies = new Uint16Array([
        0, 3, 1,//first triangle
        1, 3, 2  //second triangle
    ]);
    const texture = await importImage(gl, "resources/texturesampleuv.jpg");
    const sm = new StaticMesh(gl, positions, indicies, program, (view, projection) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
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
    var currentgeometry;

    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];
    const objVertexData = [objPositions, objTexcoords, objNormals,];
    let totaltriangles = 0;
    let totalvertices = 0;

    const keywords = {

        f(parts) {
            currentgeometry.trianglecount++;
            var parsedindices = [];
            parts.forEach(element => {
                parsedindices.push(element.split("/")[0]);
            });
            currentgeometry.vertexindices.push(...parsedindices.map(parseFloat));
        },
        o(parts) {
            currentgeometry = new Geometry();
            geometries.push(currentgeometry);
            currentgeometry.name = parts;

        },
        vt(parts) {
            currentgeometry.texturecoords.push(...parts.map(parseFloat));

        },
        v(parts) {
            currentgeometry.vertexcount++;
            currentgeometry.vertexposition.push(...parts.map(parseFloat));

        },
        vn(parts) {
            currentgeometry.vertexnormals.push(...parts.map(parseFloat));
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
        console.log("isim: " + value.name + " vertices: " + value.vertexcount + " triangles: " + value.trianglecount);
        totaltriangles += value.trianglecount;
        totalvertices += value.vertexcount;
        console.debug({
            vertexposition: value.vertexposition,
            texturecoords: value.texturecoords,
            vertexindices: value.vertexindices
        });


    });
    console.log("triangles: " + totaltriangles + " vertices: " + totalvertices);

    return geometries ;
}












class Geometry {
    name;
    vertexcount = 0;
    trianglecount = 0;

    vertexposition = [];
    vertexnormals = [];
    texturecoords = [];
    vertexindices = [];
}