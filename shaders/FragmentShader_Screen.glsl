 #version 300 es
  precision highp float;


uniform sampler2D screenTexture;
uniform sampler2D depthTexture;
uniform int framebufferselector;
uniform sampler2D unlitTexture;



  in vec2 TexCoords;

  float near = 0.1;
  float far =100.0;

  layout (location =0) out vec4 FragColor;
  
  float LinearizeDepth (float depth);

  void main() {
    float zdepth = LinearizeDepth(texture(depthTexture,TexCoords).r) / far;
    float normalizedzdepth = pow(zdepth,125.0);
    vec3 color =texture(screenTexture,TexCoords).rgb;
    if (framebufferselector ==0)
    color = texture(screenTexture,TexCoords).rgb;
    if (framebufferselector==1)
    color = texture(depthTexture,TexCoords).rgb;
    if(framebufferselector==2)
    color = texture(unlitTexture,TexCoords).rgb;
    
    FragColor =  vec4(color,1.0);

  }
// DEPTH CALCULATION
float LinearizeDepth (float depth){
    float z = depth *2.0 - 1.0;
    return ((2.0 * near* far) / (far+near - z*(far - near)));
}

