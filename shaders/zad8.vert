#version 300 es
precision highp float;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586
#define PI_OVER_360     0.008726646259971648
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)
#define EPSILON 0.0001

in vec3 coordinates;
in vec3 normals;

// out vec3 curV;
out vec3 nor;
out vec3 pos;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform vec3 u_globalRotation;
uniform mat4 u_worldTransfrom;
uniform mat4 u_objectTransform;

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

// uniform vec3 u_object_color;

void main() {
    pos = vec3(u_objectTransform*vec4(coordinates, 1.0));
    nor = normalize(mat3(transpose(inverse(u_objectTransform))) * normals);
    
    gl_Position = u_worldTransfrom * u_objectTransform * vec4(coordinates, 1.0); // vec4(pos, 1.0);
    // curV = clamp(tmpColor, 0.0, 1.0);
    gl_PointSize = 10.0;
    // gl_Position = vec4(coordinates, 1.0);
}