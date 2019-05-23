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
out vec3 curV;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform vec3 u_globalRotation;
uniform mat4 u_worldTransfrom;
uniform mat4 u_objectTransform;

void main() {
    gl_Position = u_worldTransfrom * u_objectTransform * vec4(coordinates, 1.0);
    curV = vec3(abs(sin(coordinates.x)), abs(sin(coordinates.y)), abs(sin(coordinates.z)));
    gl_PointSize = 10.0;
    // gl_Position = vec4(coordinates, 1.0);
}