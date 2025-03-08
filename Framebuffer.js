export class Framebuffer {

    /**
     * @param gl {WebGL2RenderingContext}
     */
    constructor(gl) {
        // framebuffer ayarlama
        this.framebuffer= gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer);

        //rengin ekleneceği texture ayarlama
        this.colorBufferTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,this.colorBufferTexture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.canvas.width,gl.canvas.height,0,gl.RGB,gl.UNSIGNED_BYTE,null);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.colorBufferTexture,0);

        
        //gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH24_STENCIL8,gl.canvas.width,gl.canvas.height,0,gl.DEPTH_STENCIL,gl.UNSIGNED_INT_24_8,null);
        //gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.TEXTURE_2D,this.colorBufferTexture,0);

        //creating renderbuffer object
        this.rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER,this.rbo);
        gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH24_STENCIL8,gl.canvas.width,gl.canvas.height);    
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.RENDERBUFFER,this.rbo);
        // framebuffera eklentilerimizi yaptık ve tamamlandımı diye kontrol edeceğiz:
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE){
            console.error("FRAMEBUFFER oluşturulamadı");
        }
        gl.bindFramebuffer (gl.FRAMEBUFFER,null);
    }
}