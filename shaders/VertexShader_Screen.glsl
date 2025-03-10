   #version 300 es
   precision highp float;
  // an attribute will receive data from a buffer
  layout(location = 0) in vec3 a_position;
  layout(location = 1) in vec2 a_textureCoord;

  out vec2 TexCoords;
 
  // all shaders have a main function
  void main() {
    gl_Position = vec4(a_position.x,a_position.y,0, 1);
    TexCoords = a_textureCoord;
  }