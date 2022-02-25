class Tri
{
  constructor()
  {
    this.shape = 'triangle';
    this.position = [0.0, 0.0,0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 10;
    this.segments = 4;
  }
}

function draw3DTriangle(vertices) 
{
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}