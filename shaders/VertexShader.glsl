  // an attribute will receive data from a buffer
  attribute vec3 a_position;
  attribute vec2 a_textureCoord;
  attribute vec3 a_Normal;
  uniform mat4 transform;
  uniform mat4 view;
  uniform mat4 projection;
  uniform mat4 normaltransform;

  varying vec2 TexCoords;
  varying vec3 Normal;
  varying vec3 FragPos;
 
  // all shaders have a main function
  void main() {
    FragPos = vec3(transform* vec4(a_position,1));
    Normal = mat3(normaltransform)*a_Normal;
    gl_Position = projection * view * transform * vec4(a_position, 1);
    TexCoords = a_textureCoord;
  }