 #version 300 es
precision highp float;
struct Material {
    sampler2D diffuse;

    float shininess;
};

uniform Material material;

in vec2 TexCoords;
in vec3 Normal;
in vec3 FragPos;

layout (location =0) out vec4 fragColor;

float near = 0.1;
float far = 100.0;

void main() {
    float bccolor= material.shininess;
    float bccolorclamped= clamp(bccolor,1.0,1.0);

    fragColor = vec4(bccolorclamped, 0.5, 0.3, 1);

}