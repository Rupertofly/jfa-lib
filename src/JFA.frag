precision mediump float;
uniform vec2 res;
uniform vec4 bgColor;
uniform float jumpDistance;
uniform sampler2D inputTexture;
// #region helperfunctions
const float EPSILON=.005;
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
float bitwiseANd(float a,float b){
  float result=0.;
  float n=1.;
  for(int i=0;i<4080;i++){
    if((mod(a,2.)==1.)&&(mod(b,2.)==1.))result+=n;
    a=a/2.;
    b=b/2.;
    n=n/2.;
  }
  return result;
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

float sqDist(vec2 a,vec2 b){
  return abs(pow((a.x-b.x),2.)+pow((a.y-b.y),2.));
}
vec2 cell_closestSeed(const vec4 obj_){
  vec4 obj=obj_*255.;
  float x=decodeScreenCoordinate(obj.rg);
  float y=decodeScreenCoordinate(obj.ba);
  return vec2(x,y)+vec2(.5);
}
vec4 createCell(const vec2 screenCoordinate_){
  vec2 screenCoordinate=floor(screenCoordinate_);
  vec2 rg=encodeScreenCoordinate(screenCoordinate.x);
  vec2 ba=encodeScreenCoordinate(screenCoordinate.y);
  return vec4(rg,ba)/255.;
}
// Return true if `a` and `b` are at most EPSILON apart
// in any dimension
vec4 createInvalidCell(){
  return createCell(vec2(5000.,5000.));
}
vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
//============================================================

// #endregion
void main(){
  vec2 fragPos=gl_FragCoord.xy;
  float bestDistance=100000.;
  vec4 bestCell=createInvalidCell();
  vec2 pixelSize=1./res;
  for(float xOffset=-1.;xOffset<=1.;xOffset++){
    for(float yOffset=-1.;yOffset<=1.;yOffset++){
      vec2 offset=jumpDistance*vec2(xOffset,yOffset);
      vec2 testPos=fragPos+offset;
      vec2 testUV=testPos/res;
      if(!validUv(testUV))continue;
      vec4 testCell=texture2D(inputTexture,testUV);
      vec2 seedPostion=cell_closestSeed(testCell);
      float seedDistance=distance(seedPostion,fragPos);
      if(seedDistance<bestDistance){
        bestDistance=seedDistance;
        bestCell=testCell;
      }
    }
  }
  gl_FragColor=bestCell;
  
}