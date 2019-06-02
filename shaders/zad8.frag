#version 300 es

precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_cutoff;
uniform float u_color;

uniform vec3 u_lookAt;
uniform vec3 u_cam;
uniform float u_fov;
uniform float u_zNear;
uniform float u_zFar;
uniform float u_aspect;

uniform vec3 u_light_location;
uniform vec3 u_light_ambient;
uniform vec3 u_light_difusion;
uniform vec3 u_light_reflection;

uniform vec3 u_object_color;
uniform vec3 u_object_difusionColor;
uniform vec3 u_object_reflectionColor;

// in vec3 curV;
in vec3 nor;
in vec3 pos;

out vec4 color;

void main() {
    vec3 lightDir = normalize(u_light_location - pos);
    float dir = max(dot(nor, lightDir), 0.0);

    vec3 reflec = 2.0*dot(lightDir, nor)*nor - lightDir;
    vec3 ev = normalize(u_cam - pos);
    vec3 le = normalize(u_light_location - pos);
    float refc = dir < 0.0 ? 0.0 : dot(reflec, ev);
    vec3 ref = refc > 0.0 ? u_object_reflectionColor * pow(refc, 2.0) : vec3(0.0, 0.0, 0.0);
    vec3 tmpColor = vec3(0.0, 0.0, 0.0);
    tmpColor += u_light_ambient * u_object_color * 0.2;
    tmpColor += u_light_difusion * u_object_difusionColor * dir;
    tmpColor += ref;

    color = vec4(clamp(tmpColor, 0.0, 1.0), 1.0);
}