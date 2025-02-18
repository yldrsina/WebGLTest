async function getShaderSource(path) {
    return await (await (fetch(path))).text();
}



function createShader(gl,type,source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var iscompilesucceed =gl.getShaderParameter(shader,gl.COMPILE_STATUS);
    if(iscompilesucceed){
        return shader;
    }
    //if compile failed:
    console.log(gl.getShaderInfoLog(shader)+ "shader is :\n "+ source);
    gl.deleteShader(shader);
}

export async function createProgram(gl,vertexShader,fragmentShader){
    var generated_vertexShader = createShader(gl,gl.VERTEX_SHADER,await getShaderSource(vertexShader));
    var generated_fragmentShader =createShader(gl,gl.FRAGMENT_SHADER,await getShaderSource(fragmentShader));
    var program = gl.createProgram();
    gl.attachShader(program, generated_vertexShader);
    gl.attachShader(program,generated_fragmentShader);
    gl.linkProgram(program);
    var succeedlink = gl.getProgramParameter(program,gl.LINK_STATUS);
    if(succeedlink){
        return program;

    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

