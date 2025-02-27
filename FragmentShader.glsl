// fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;
  uniform vec3 lightColor;
  uniform sampler2D u_image;

  varying vec2 v_texturecoord;
 
  void main() {
    // gl_FragColor is a special variable a fragment shader
    gl_FragColor = vec4(lightColor,1)* texture2D(u_image,v_texturecoord);
  }