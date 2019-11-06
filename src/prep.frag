precision highp float;

uniform sampler2D inputTexture;
uniform vec4 bgColor;
varying vec2 uv;

// 0.005 * 255 is roughly 1.2, so this will match colors
// one digit away from each other.
const float EPSILON=.005;

// Return true if `a` and `b` are at most EPSILON apart
// in any dimension
bool approxEqual(const vec4 a,const vec4 b){
  return all(
    lessThan(abs(a-b),vec4(EPSILON))
  );
}

bool approxEqual(const vec2 a,const vec2 b){
  return all(
    lessThan(abs(a-b),vec2(EPSILON))
  );
}

bool between(const vec2 value,const vec2 bottom,const vec2 top){
  return(
    all(greaterThan(value,bottom))&&
    all(lessThan(value,top))
  );
}

bool validUv(const vec2 uv){
  return between(
    uv,
    vec2(0.,0.),
    vec2(1.,1.)
  );
}
vec2 encodeScreenCoordinate(const float value_){
  float value=value_;
  return vec2(
    floor(value/100.),
    mod(value,100.)
  );
}

float decodeScreenCoordinate(const vec2 channels){
  return channels.x*100.+channels.y;
}

vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
vec4 createCell(const vec2 screenCoordinate_){
  vec2 screenCoordinate=floor(screenCoordinate_);
  vec2 rg=encodeScreenCoordinate(screenCoordinate.x);
  vec2 ba=encodeScreenCoordinate(screenCoordinate.y);
  return vec4(rg,ba)/255.;
}
vec4 createInvalidCell(){
  return createCell(vec2(5000.,5000.));
}
void main(){
  vec4 outputFrag;
  vec4 inputFrag=texture2D(inputTexture,uv);
  if(!approxEqual(bgColor,inputFrag)){
    outputFrag=createCell(gl_FragCoord.xy);
  }else{
    outputFrag=createInvalidCell();
  }
  gl_FragColor=outputFrag;
}
