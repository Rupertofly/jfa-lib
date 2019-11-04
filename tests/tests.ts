import * as jf from '../src/index';
import regl from 'regl';
const b = document.createElement('canvas');
b.width = 1080;
b.height = 1080;
b.setAttribute('style', `border-radius: 12px;margin:30px;`);
document.body.appendChild(b);
console.log(b);
let x = new jf.JFAProgram({
  reglInstance: regl(b),
  sourceBackground: [0.98, 0.97, 0.98, 0.0],
  canvasHeight: b.height,
  canvasWidth: b.width,
});
