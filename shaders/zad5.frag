#version 300 es

precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_cutoff;
uniform float u_color;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

/* Coordinate and unit utils */
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    // correct aspect ratio
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    // centering
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
vec2 invY(in vec2 point) {
    vec2 real;
    real.x = point.x;
    real.y = u_resolution.y - point.y;
    return real;
}
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(invY(gl_FragCoord.xy))
#define mx coord(u_mouse)

in vec3 curV;

out vec4 color;
void main() {
    // if (u_color == 2.0) { //not cw && not ccw
    //     color = vec4(0.0, 0.0, 1.0, 1.0);
    // }
    // if (u_color == 6.0) { //cw
    //     color = vec4(0.0, 1.0, 0.0, 1.0);
    // }
    // if (u_color == 10.0) { //ccw
    //     color = vec4(1.0, 0.0, 0.0, 1.0);
    // }
    // if (u_color == 14.0) { //cw & ccw ??
    //     color = vec4(0.0, 0.5, 1.0, 1.0);
    // }
    // if (u_color == 0.0) { //undeffined
    //     color = vec4(0.0, 0.0, 0.0, 1.0);
    // }
    color = vec4(sin(u_color), abs(cos(gl_FragCoord.z)), abs(sin(gl_FragCoord.z)), 1.0);
    color = vec4(curV, 1.0);
    // if (curV >= 1.2 || gl_FragCoord.y < u_resolution.y*u_cutoff) {
    //     color = vec4(0.0,0.0,1.0, 1.0);
    // } else {
    //     color = vec4(0.0,0.0,1.0/curV, 1.0);
    // }
}