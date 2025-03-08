  // an attribute will receive data from a buffer
  attribute vec3 a_position;
  attribute vec2 a_textureCoord;

  varying vec2 TexCoords;
 
  // all shaders have a main function
  void main() {
    gl_Position = vec4(a_position.x,a_position.y,0, 1);
    TexCoords = a_textureCoord;
  }