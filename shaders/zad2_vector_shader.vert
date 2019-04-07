#ifdef GL_ES
    precision mediump float;
#endif

attribute vec2 coordinates;
uniform vec2 u_resolution;

vec2 coord(in vec2 point) {
    vec2 real;
    real.x = (coordinates.x / u_resolution.x)*2.0 - 1.0;
    real.y = - (coordinates.y / u_resolution.y)*2.0 + 1.0;
    return real;
}
void main(void) {
    vec2 real = coord(coordinates);
    gl_Position = vec4(real, 0.0, 1.0);
    gl_PointSize = 7.0;
}
