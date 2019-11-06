/// <reference path="./shaders.d.ts" />
import * as regl from 'regl';
import fg from './JFA.frag';
import prepShader from './prep.frag';
type vec4 = [number, number, number, number];
interface JFAConstructorOptions {
  reglInstance: regl.Regl;
  canvasWidth?: number;
  canvasHeight?: number;
  sourceBackground?: vec4;
}
type JFAprops = {
  inputTexture: regl.Texture2D;
  jumpDistance: number;
  output: regl.Framebuffer2D | null;
};
export class JFAProgram {
  //#region setup
  private reglInstance: regl.Regl;
  private canvasWidth: number;
  private canvasHeight: number;
  private bgColor: [number, number, number, number];
  frontBuffer: regl.Framebuffer2D;
  frontTexture: regl.Texture2D;
  backBuffer: regl.Framebuffer2D;
  backTexture: regl.Texture2D;
  radius: number;
  vertexSetup: regl.DrawCommand<regl.DefaultContext, {}>;
  private sourceTexture?: regl.Texture2D;
  resultTexture: regl.Texture2D;
  outputTexture: regl.Texture2D;
  prepFunction: regl.DrawCommand<regl.DefaultContext, {}>;
  JFAFunction: regl.DrawCommand<any, JFAprops>;
  /**
   * Create a new JFA Program
   * @param param0 JFAContructorOptions
   */
  constructor({
    reglInstance,
    canvasWidth: width = 500,
    canvasHeight: height = 500,
    sourceBackground = [0, 0, 0, 0],
  }: JFAConstructorOptions) {
    this.reglInstance = reglInstance;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.bgColor = sourceBackground;
    const front = this.newFramebuffer(width, height);
    this.frontBuffer = front[0];
    this.frontTexture = front[1];
    const back = this.newFramebuffer(width, height);
    this.backBuffer = back[0];
    this.backTexture = back[1];
    this.radius = Math.max(
      this.canvasWidth,
      this.canvasHeight
    );
    const { reglInstance: gl } = this;
    const startingTime = Date.now();
    this.vertexSetup = gl({
      vert: `precision mediump float;
      attribute vec2 position;
      varying vec2 uv;
      void main(){
        uv=position;
        gl_Position=vec4(2.*position-1.,0,1);
      }`,
      attributes: {
        position: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
      },
      count: 6,
      viewport: {
        x: 0,
        y: 0,
        width,
        height,
      },
      uniforms: {
        t: () => Date.now() - startingTime,
        res: () => [this.canvasWidth, this.canvasHeight],
        bgColor: () => this.bgColor,
      },
      frag: `precision mediump float;
      varying vec2 uv;
      uniform float t;
      uniform vec4 bgColor;
      void main(){
        gl_FragColor = bgColor;
      }`,
    });
    this.prepFunction = gl({
      frag: prepShader,
      uniforms: {
        inputTexture: () => this.sourceTexture,
      },
      framebuffer: () => this.frontBuffer,
    });
    this.JFAFunction = gl({
      frag: fg,
      uniforms: {
        inputTexture: (c, p) => p.inputTexture,
        jumpDistance: (c, p) => p.jumpDistance,
      },
      framebuffer: (c, p) => p.output,
    });
    this.resultTexture = gl.texture({
      shape: [width, height],
    });
    this.outputTexture = gl.texture({
      shape: [width, height],
    });
    gl.clear({ color: this.bgColor });
    const rd = () => {
      this.vertexSetup();
      window.requestAnimationFrame(rd);
    };
    rd();
  }
  //#endregion
  //#region publicFunctions
  public set inputTexture(
    input: regl.Texture2DOptions | regl.TextureImageData
  ) {
    if (this.sourceTexture) {
      this.sourceTexture(input as any);
    } else {
      this.sourceTexture = this.reglInstance.texture(
        input as any
      );
    }
  }
  public runJFA() {
    if (!this.sourceTexture)
      throw new Error('Source Texture not Set');
    this.radius = Math.max(
      this.canvasWidth,
      this.canvasHeight
    );
    const totalSteps =
      Math.floor(Math.log2(this.radius)) + 1;
    this.vertexSetup(context => {
      this.prepFunction();
      const textureAccess = [
        this.backTexture,
        this.frontTexture,
      ];
      const writeAccess = [
        this.frontBuffer,
        this.backBuffer,
      ];
      for (let i = 0; i < totalSteps; i++) {
        const fb = writeAccess[i % 2];
        const iTex = textureAccess[i % 2];
        const jumpDistance = Math.pow(
          2,
          totalSteps - i - 1
        );
        this.JFAFunction({
          inputTexture: iTex,
          jumpDistance,
          output: fb,
        });
      }
      this.JFAFunction(
        {
          output: writeAccess[totalSteps % 2],
        },
        () =>
          this.resultTexture({
            copy: true,
            shape: [this.canvasWidth, this.canvasHeight],
          })
      );
    });
  }
  //#endregion
  //#region privateFunctions
  private newFramebuffer(width = 500, height = 500) {
    const { reglInstance: gl } = this;
    const tx = gl.texture({
      height,
      width,
      wrap: 'clamp',
      data: new Array(width * height * 4).map(
        (v, i) => this.bgColor[i % 4]
      ),
    });
    const fb = gl.framebuffer({
      width,
      height,
      color: tx,
      depth: false,
    });
    gl.clear({
      framebuffer: fb,
      color: this.bgColor,
    });
    return [fb, tx] as [regl.Framebuffer2D, regl.Texture2D];
  }
  //#endregion
}
