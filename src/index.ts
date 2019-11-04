/// <reference path="./shaders.d.ts" />
import * as regl from 'regl';
import fg from './JFA.frag';
import { timeout } from 'q';
type vec4 = [number, number, number, number];
interface JFAConstructorOptions {
  reglInstance: regl.Regl;
  canvasWidth?: number;
  canvasHeight?: number;
  sourceBackground?: vec4;
}

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
  vertexSetup: regl.DrawCommand<regl.DefaultContext, {}>;
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
        float r = uv.x;
        float g = uv.y;
        gl_FragColor = bgColor;
      }`,
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
  public runJFA() {}
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
