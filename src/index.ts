/// <reference path="./shaders.d.ts" />
import * as regl from 'regl';
import fg from './JFA.frag';
type vec4 = [number, number, number, number];
interface JFAConstructorOptions {
  reglInstance: regl.Regl;
  canvasWidth?: number;
  canvasHeight?: number;
  sourceBackground?: vec4;
}

export class JFAProgram {
  private reglInstance: regl.Regl;
  private canvasWidth: number;
  private canvasHeight: number;
  private bgColor: [number, number, number, number];
  frontBuffer: regl.Framebuffer2D;
  frontTexture: regl.Texture2D;
  backBuffer: regl.Framebuffer2D;
  backTexture: regl.Texture2D;
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
  }
  private newFramebuffer(width = 500, height = 500) {
    const { reglInstance: gl } = this;
    const tx = gl.texture({
      height,
      width,
      wrap: 'clamp',
      data: new Array(width * height * 4).fill(0),
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
}
