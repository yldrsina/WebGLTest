  // an attribute will receive data from a buffer
  attribute vec4 a_position;
  uniform mat4 u_matrix;
 
  // all shaders have a main function
  void main() {
 gl_Position = a_position;
    
  }