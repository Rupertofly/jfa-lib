precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

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
vec4 EncodeData(in vec2 coord,in vec3 color)
{
  vec4 ret=vec4(0.);
  ret.xy=coord;
  ret.z=floor(color.x*255.)*256.+floor(color.y*255.);
  ret.w=floor(color.z*255.);
  return ret;
}

//============================================================
void DecodeData(in vec4 data,out vec2 coord,out vec3 color)
{
  coord=data.xy;
  color.x=floor(data.z/256.)/255.;
  color.y=mod(data.z,256.)/255.;
  color.z=mod(data.w,256.)/255.;
}
void main(){
  vec2 uv=-gl_FragCoord.xy/u_resolution;
  gl_FragColor=vec4(mod(max(uv.x,uv.y),.2)*5.,floor(max(uv.x,uv.y)/5.*sin(u_time),.5,1.));
  
}