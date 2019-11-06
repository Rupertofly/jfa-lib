precision mediump float;
attribute vec2 position;
varying vec2 uv;
void main(){
  uv=position;
  gl_Position=vec4(2.*position-1.,0,1);
  /* Easing Circular In equation */
  /* Adapted from Robert Penner easing equations */
  /* Easing Back In equation */
  /* Adapted from Robert Penner easing equations */
  /* Easing Bounce In equation */
  /* Adapted from Robert Penner easing equations */
  float easeBounceOut(float t){
    if(t<(1./2.75)){
      return(7.5625*t*t);
    }else if(t<(2./2.75)){
      return(7.5625*(t-=(1.5/2.75))*t+.75);
    }else if(t<(2.5/2.75)){
      return(7.5625*(t-=(2.25/2.75))*t+.9375);
    }else{
      return(7.5625*(t-=(2.625/2.75))*t+.984375);
    }
  }
  float easeBounceIn(float t){
    return 1.-easeBounceOut(1.-t);
  }
  
}