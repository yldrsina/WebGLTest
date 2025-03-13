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
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.colorBufferTexture,0);
        
       this.depthbufferTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,this.depthbufferTexture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.canvas.width,gl.canvas.height,0,gl.RGB,gl.UNSIGNED_BYTE,null);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT1,gl.TEXTURE_2D,this.depthbufferTexture,0);
        this.drawbuffers = [gl.COLOR_ATTACHMENT0,gl.COLOR_ATTACHMENT1];
        gl.drawBuffers(this.drawbuffers);

        //creating renderbuffer object
        this.rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER,this.rbo);
        gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT32F,gl.canvas.width,gl.canvas.height);    
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,this.rbo);
        // framebuffera eklentilerimizi yaptık ve tamamlandımı diye kontrol edeceğiz:
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE){
            console.error("FRAMEBUFFER oluşturulamadı");
        }
        gl.bindFramebuffer (gl.FRAMEBUFFER,null);
    }
}