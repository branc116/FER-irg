#version 300 es

precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_cam;
uniform float u_time;
uniform float u_cutoff;
uniform float u_color;
uniform float u_aspect;

uniform vec3 u_light_location;

uniform vec3 u_light_ambientIntesitiy;
uniform vec3 u_light_difusionIntensity;
uniform vec3 u_light_reflectionIntesity;

uniform vec3 u_light_ambientColor;
uniform vec3 u_light_difusionColor;
uniform vec3 u_light_reflectionColor;

out vec4 color;

const int ITERATIONS = 210;
const float piover2 = 1.57079632679;

int mandelbrot(vec2 position) {
	vec2 z = vec2(0.0, 0.0);
	for (int i = 0; i < ITERATIONS; ++i) {
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + position;
		if (length(z) >= 2.0)
			return i + 1;
	}
	return 0;
}

void main( void ) {
    vec2 center = u_cam.xy;
	float x_low = center.x - u_cam.z, x_high = center.x + u_cam.z;
	float y_low = center.y - (x_high - x_low)*u_aspect/2.0, y_high = center.y + (x_high - x_low)*u_aspect/2.0 ;

	vec2 position = vec2((x_high - x_low) * gl_FragCoord.x / u_resolution.x + x_low, (y_high - y_low) * gl_FragCoord.y / u_resolution.y + y_low);
	
	float iterations = float(mandelbrot(position)) / float(ITERATIONS) * piover2;
    color = vec4(sin(1.0 - iterations), abs(cos((1.0 - iterations)*2.0)), 0.0, 1.0);
	
}