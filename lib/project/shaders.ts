// GLSL for the sculptural "image holder" object.
// A high-density icosphere is displaced by layered 3D simplex noise. Normals
// are recomputed from displaced neighbour samples (finite differences) so the
// soft plaster/ceramic surface catches studio light correctly.

const SIMPLEX = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

export const vertexShader = /* glsl */ `
${SIMPLEX}

uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uWarp;
uniform vec2  uMouse;

varying vec3 vNormal;
varying vec3 vPos;
varying float vDisp;

// layered noise field driving displacement along the surface normal
float field(vec3 p){
  float t = uTime * 0.18;
  vec3 q = p * uFreq;
  float n  = snoise(q + vec3(0.0, 0.0, t));
  n += 0.5  * snoise(q * 2.03 + vec3(t * 1.3, 0.0, 0.0));
  n += 0.25 * snoise(q * 4.11 - vec3(0.0, t * 0.9, 0.0));
  // slow breathing warp reacts subtly to the pointer
  float warp = snoise(p * uWarp + vec3(uMouse * 1.2, t * 0.5));
  return (n + 0.6 * warp) * uAmp;
}

vec3 displaced(vec3 pos, vec3 nrm){
  return pos + nrm * field(pos);
}

void main(){
  vec3 nrm = normalize(normal);
  vec3 dpos = displaced(position, nrm);

  // recompute normal from two nearby displaced samples
  float e = 0.035;
  vec3 tangent = normalize(cross(nrm, vec3(0.0, 1.0, 0.0) + 0.001));
  vec3 bitangent = normalize(cross(nrm, tangent));
  vec3 pa = displaced(position + tangent * e, normalize(normal + tangent * e));
  vec3 pb = displaced(position + bitangent * e, normalize(normal + bitangent * e));
  vec3 newNormal = normalize(cross(pa - dpos, pb - dpos));
  if (dot(newNormal, nrm) < 0.0) newNormal = -newNormal;

  vDisp = length(dpos - position);
  vNormal = normalize(normalMatrix * newNormal);
  vec4 mv = modelViewMatrix * vec4(dpos, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

export const fragmentShader = /* glsl */ `
precision highp float;

uniform float uDarkness;
uniform float uTime;
uniform vec3  uLightDir;

varying vec3 vNormal;
varying vec3 vPos;
varying float vDisp;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vPos);
  vec3 L = normalize(uLightDir);

  // soft studio key + fill
  float key = clamp(dot(N, L), 0.0, 1.0);
  key = pow(key, 0.85);
  float fill = clamp(dot(N, normalize(vec3(-0.6, -0.2, 0.7))), 0.0, 1.0) * 0.35;
  float ambient = 0.42;

  // rim / fresnel for that ceramic edge glow
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);

  // base plaster tone shifts from light grey to charcoal with darkness
  vec3 light = vec3(0.905);   // ~ #E8E8E8
  vec3 dark  = vec3(0.06);    // ~ #101010
  vec3 base = mix(light, dark, uDarkness);

  float shade = ambient + key * 0.72 + fill;
  vec3 col = base * shade;

  // crevices from displacement read slightly darker (ambient occlusion feel)
  col *= 1.0 - smoothstep(0.15, 0.55, vDisp) * 0.18;

  // rim light: subtle dark, brighter in dark environment
  vec3 rimCol = mix(vec3(1.0), vec3(0.8), uDarkness);
  col += fres * mix(0.06, 0.5, uDarkness) * rimCol;

  gl_FragColor = vec4(col, 1.0);
}
`
