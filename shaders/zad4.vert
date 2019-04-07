#version 300 es
precision highp float;
precision highp int;
in vec2 coordinates;
uniform vec2 u_resolution;

vec2 invY(in vec2 point) {
    vec2 real;
    real.x = point.x;
    real.y = u_resolution.y - point.y;
    return real;
}
vec2 coord(in vec2 p) {
    // p = p / u_resolution.xy;
    // // correct aspect ratio
    // if (u_resolution.x > u_resolution.y) {
    //     p.x *= u_resolution.x / u_resolution.y;
    //     p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    // } else {
    //     p.y *= u_resolution.y / u_resolution.x;
    //     p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    // }
    // p *= 2.0;
    // // centering
    // p -= 0.5;
    // p *= vec2(1.0, -1.0);
    // return p;
    vec2 real;
    real.x = (coordinates.x / u_resolution.x)*2.0 - 1.0;
    real.y = - (coordinates.y / u_resolution.y)*2.0 + 1.0;
    return real;
}
out vec4 glPosition;
out float curV;
void main(void) {
    vec2 real = coord(coordinates);
    curV = float(gl_InstanceID) / float(gl_VertexID);

    gl_Position = vec4(real, 0.0, 1.0);
    gl_PointSize = 10.0;
}