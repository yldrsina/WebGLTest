  // an attribute will receive data from a buffer
  attribute vec3 a_position;
  uniform mat4 model;
  uniform mat4 view;
  uniform mat4 projection;

 
  // all shaders have a main function
  void main() {
    gl_Position = projection * view * model * vec4(a_position, 1);
    
  }