// HelloTriangle_FragCoord.js (c) 2012 matsuda
// Vertex shader program
"use strict";
const loc_aPosition = 3;
const VSHADER_SOURCE =
`#version 300 es
layout(location=${loc_aPosition}) in vec4 aPosition;
void main() {
  gl_Position = aPosition;
}`;

// Fragment shader program
const FSHADER_SOURCE =
`#version 300 es
precision mediump float;
uniform float uWidth;
uniform float uHeight;
out vec4 fColor;
void main() {
  fColor = vec4(gl_FragCoord.x/uWidth, 0.0, gl_FragCoord.y/uHeight, 1.0);
}`;

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  let {vao, n} = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindVertexArray(vao);
  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  gl.bindVertexArray(null);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  const n = 3; // The number of vertices

  // Create a buffer object
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.vertexAttribPointer(loc_aPosition, 2, gl.FLOAT, false, 0, 0);

  const loc_uWidth = gl.getUniformLocation(gl.program, 'uWidth');
  if (!loc_uWidth) {
    console.log('Failed to get the storage location of uWidth');
    return;
  }

  const loc_uHeight = gl.getUniformLocation(gl.program, 'uHeight');
  if (!loc_uHeight) {
    console.log('Failed to get the storage location of uHeight');
    return;
  }

  // Pass the width and hight of the <canvas>
  gl.uniform1f(loc_uWidth, gl.drawingBufferWidth);
  gl.uniform1f(loc_uHeight, gl.drawingBufferHeight);

  // Enable the generic vertex attribute array
  gl.enableVertexAttribArray(loc_aPosition);

  gl.bindVertexArray(null);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return {vao, n};
}
