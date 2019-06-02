#version 300 es
precision highp float;

in vec3 coordinates;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform vec3 u_globalRotation;
uniform mat4 u_worldTransfrom;
uniform mat4 u_objectTransform;



void main() {
    // gl_Position = u_worldTransfrom * u_objectTransform * vec4(coordinates, 1.0);
    // curV = vec3(abs(sin(coordinates.x)), abs(sin(coordinates.y)), abs(sin(coordinates.z)));
    gl_PointSize = 10.0;
    gl_Position = vec4(coordinates.x*20.0, coordinates.y, 0.0, 1.0);
}