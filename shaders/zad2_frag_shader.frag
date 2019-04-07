/* Main function, uniforms & utils */
#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

/* Coordinate and unit utils */
vec2 coord(in vec2 point) {
    vec2 real;
    real.x = (point.x / u_resolution.x)*2.0 - 1.0;
    real.y = -(point.y / u_resolution.y)*2.0 + 1.0;
    return real;
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

// out vec4 fragColor;

void main() {
    vec3 color = vec3(
        abs(cos(st.x + mx.x)), 
        abs(sin(st.y + mx.y)), 
        abs(sin(u_time))
    );
    float d = distance(st, mx)*5.0 + 0.01;
    float t = atan(1.0);
    gl_FragColor = vec4(abs(atan(1.0/d))/PI_TWO, abs(cos(st.x + mx.x))/3.0, 0.0, 1.0);
    
}