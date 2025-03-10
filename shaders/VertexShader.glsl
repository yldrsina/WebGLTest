   #version 300 es
   precision highp float;
  // an attribute will receive data from a buffer
  layout(location = 0) in vec3 a_position;
  layout(location = 1) in vec2 a_textureCoord;
  layout(location = 2) in vec3 a_Normal;
  uniform mat4 transform;
  uniform mat4 view;
  uniform mat4 projection;
  uniform mat4 normaltransform;

  out vec2 TexCoords;
  out vec3 Normal;
  out vec3 FragPos;
 
  // all shaders have a main function
  void main() {
    FragPos = vec3(transform* vec4(a_position,1));
    Normal = mat3(normaltransform)*a_Normal;
    gl_Position = projection * view * transform * vec4(a_position, 1);
    TexCoords = a_textureCoord;
  }