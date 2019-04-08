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

uniform vec3 u_cam;
uniform vec3 u_center;
uniform vec3 u_up;

uniform vec3 u_globalRotation;

uniform float u_fov;
uniform float u_aspect;
uniform float u_near;
uniform float u_far;

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
    p *= vec2(2.0, -2.0);
    return p;
}


const mat4 projection = mat4(
    vec4( 3.0 / 4.0, 0.0, 0.0, 0.0),
    vec4(     0.0, 1.0, 0.0, 0.0),
    vec4(     0.0, 0.0, 0.5, 0.5),
    vec4(     0.0, 0.0, 0.0, 1.0)
);

mat4 scale = mat4(
    vec4(4.0 / 3.0, 0.0, 0.0, 0.0),
    vec4(     0.0, 1.0, 0.0, 0.0),
    vec4(     0.0, 0.0, 1.0, 0.0),
    vec4(     0.0, 0.0, 0.0, 1.0)
);

mat4 rotationAxis(float angle, vec3 axis) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotateX(vec3 p, float angle) {
    mat4 rmy = rotationAxis(angle, vec3(1.0, 0.0, 0.0));
    return (vec4(p, 1.0) * rmy).xyz;
}

vec3 rotateY_(vec3 p, float angle) {
    mat4 rmy = rotationAxis(angle, vec3(0.0, 1.0, 0.0));
    return (vec4(p, 1.0) * rmy).xyz;
}

vec3 rotateZ(vec3 p, float angle) {
    mat4 rmy = rotationAxis(angle, vec3(0.0, 0.0, 1.0));
    return (vec4(p, 1.0) * rmy).xyz;
}

vec3 rotateY(vec3 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    mat4 r = mat4(
        vec4(c, 0, s, 0),
        vec4(0, 1, 0, 0),
        vec4(-s, 0, c, 0),
        vec4(0, 0, 0, 1)
    );
    return (vec4(p, 1.0) * r).xyz;
}

float hypot(vec3 v) {
    return sqrt(pow(v.x, 2.0) + pow(v.y, 2.0) + pow(v.z, 2.0));
}

mat4 identity() {
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 perspective(float fovy, float aspect,float near,float far) {
    float f = 1.0 / tan(fovy / 2.0);
    float nf = 1.0 / (near - far);
    float m0 = f / aspect;
    float m10 = (far + near) * nf;
    float m14 = (2.0 * far * near) * nf;
    return mat4(
        m0, 0.0, 0.0, 0.0,
        0.0, f, 0.0, 0.0,
        0.0, 0.0, m10, -1.0,
        0.0, 0.0, m14, 0.0
    );
}

mat4 lookAt(vec3 eye, vec3 center, vec3 up) {
    vec3 x, y;
    float len;

    if (abs(eye.x - center.x) < EPSILON &&
        abs(eye.y - center.y) < EPSILON &&
        abs(eye.z - center.z) < EPSILON) {
        return identity();
    }

    vec3 z = eye - center;
    len = 1.0 / hypot(z);
    z *= len;

    x = vec3(
        up.y * z.z - up.z * z.y,
        up.z * z.x - up.x * z.z,
        up.x * z.y - up.y * z.x
    );
    len = hypot(x);
    if (len == 0.0) {
        x = vec3(0.0, 0.0, 0.0);
    } else {
        len = 1.0 / len;
        x *=len;
    }

    y = vec3(
        z.y * x.z - z.z * x.y,
        z.z * x.x - z.x * x.z,
        z.x * x.y - z.y * x.x
    );
    len = hypot(y);
    if (0.0 == len) {
        y = vec3(0.0, 0.0, 0.0);
    } else {
        len = 1.0 / len;
        y*=len;
    }

    return mat4(
        x.x, y.x, z.x, 0.0,
        x.y, y.y, z.y, 0.0,
        x.z, y.z, z.z, 0.0,
        -(x.x * eye.x + x.y * eye.y + x.z * eye.z), 
        -(y.x * eye.x + y.y * eye.y + y.z * eye.z), 
        -(z.x * eye.x + z.y * eye.y + z.z * eye.z), 1.0
    );
}
mat4 rotation (vec3 angles) {
    return rotationAxis(angles.x, vec3(1, 0, 0)) * 
        rotationAxis(angles.y, vec3(0, 1, 0)) *
        rotationAxis(angles.z, vec3(0, 0, 1));
}
void main() {
    gl_Position = perspective(u_fov, u_aspect, u_near, u_far) * lookAt(u_cam, u_center, u_up) * rotation(u_globalRotation) * vec4(coordinates, 1.0);
    curV = vec3(abs(sin(coordinates.x)), abs(sin(coordinates.y)), abs(sin(coordinates.z)));
    gl_PointSize = 10.0;
    // gl_Position = vec4(coordinates, 1.0);
}