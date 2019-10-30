/// <reference path="../src/shaders.d.ts" />
import * as regl from 'regl';
declare type vec4 = [number, number, number, number];
interface JFAConstructorOptions {
    reglInstance: regl.Regl;
    canvasWidth?: number;
    canvasHeight?: number;
    sourceBackground?: vec4;
}
export declare class JFAProgram {
    private reglInstance;
    private canvasWidth;
    private canvasHeight;
    private bgColor;
    frontBuffer: regl.Framebuffer2D;
    frontTexture: regl.Texture2D;
    backBuffer: regl.Framebuffer2D;
    backTexture: regl.Texture2D;
    constructor({ reglInstance, canvasWidth: width, canvasHeight: height, sourceBackground, }: JFAConstructorOptions);
    private newFramebuffer;
}
export {};
