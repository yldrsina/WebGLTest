// fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;


uniform sampler2D screenTexture;



  varying vec2 TexCoords;

 


  
  void main() {
    vec3 color =texture2D(screenTexture,TexCoords).rgb;
    gl_FragColor =  vec4(color,1.0);

  }