  // an attribute will receive data from a buffer
  attribute vec3 a_position;
  attribute vec2 a_textureCoord;
  uniform mat4 transform;
  uniform mat4 view;
  uniform mat4 projection;

  varying vec2 v_texturecoord;

 
  // all shaders have a main function
  void main() {
    gl_Position = projection * view * transform * vec4(a_position, 1);
    v_texturecoord = a_textureCoord;
  }