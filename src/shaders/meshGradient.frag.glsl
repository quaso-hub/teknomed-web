uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;
varying float vElevation;

void main() {
  // Hitung color mixing berdasarkan elevasi Y (yang digerakkan oleh noise) dan koordinat UV
  float mixFactor = (vElevation + 0.4) * 0.5 + vUv.y * 0.3;
  mixFactor = clamp(mixFactor, 0.0, 1.0);
  
  // Mix color A -> B -> C
  vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.5, mixFactor));
  color = mix(color, uColorC, smoothstep(0.5, 1.0, mixFactor));
  
  // Menggunakan sedikit alpha supaya background belakang (bila ada) atau blur effect terlihat
  gl_FragColor = vec4(color, 0.85);
}
