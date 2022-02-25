class Cube{
    constructor()
    {
        this.type="cube";
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        
    }
    render()
    {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //front
        draw3DTriangle([0,0,0, 1,1,0, 1,0,0]);
        draw3DTriangle([0,0,0, 0,1,0, 1,1,0]);
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3])

        //back
        draw3DTriangle([0,0,1, 1,1,1, 1,0,1]);
        draw3DTriangle([0,0,1, 0,1,1, 1,1,1]);
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3])

        //top
        draw3DTriangle([0,1,0, 0,1,1, 1,1,1]);
        draw3DTriangle([0,1,0, 1,1,1, 1,1,0]);
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3])

        //bottom
        draw3DTriangle([0,0,0, 0,0,1, 1,0,1]);
        draw3DTriangle([0,0,0, 1,0,1, 1,0,0]);
        gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3])

        //left
        draw3DTriangle([0,0,0, 0,1,1, 0,1,0]);
        draw3DTriangle([0,0,0, 0,1,1, 0,0,1]);
        gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3])

        //right
        draw3DTriangle([1,0,0, 1,1,1, 1,1,0]);
        draw3DTriangle([1,0,0, 1,1,1, 1,0,1]);
        gl.uniform4f(u_FragColor, rgba[0]*0.4, rgba[1]*0.4, rgba[2]*0.4, rgba[3])


        

        // make top, bottom, left, right, back sides later!
    }

    cone()
    {
        let angleStep = 360/10;
        var d = 0.5
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        draw3DTriangle([0,0,0, 0.3,0,0, 0,1,0,]);// trinagle 1
        gl.uniform4f(u_FragColor, rgba[0]*=0.1, rgba[1]*=0.8, rgba[2]*=0.9, rgba[3])
        draw3DTriangle([0,0,0, 0,0,0.3, 0,1,0,]);// triangle 2
        gl.uniform4f(u_FragColor, rgba[0]*=0.1, rgba[1]*=0.8, rgba[2]*=0.9, rgba[3])
        draw3DTriangle([0.3,0,0, 0,0,0.3, 0,1,0,]);// triangle 3
        gl.uniform4f(u_FragColor, rgba[0]*=0.1, rgba[1]*=0.8, rgba[2]*=0.9, rgba[3])
    }
}