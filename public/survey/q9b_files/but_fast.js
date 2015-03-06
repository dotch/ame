var fe=1;
var reg2=/([vt]_\d*$)/;
function iov(_1,_2,_3,_4){
var _5=getlongname(_2);
if(_3==""){
type=it[_2];
if(type==0){
_3=rdef[1];
}else{
_3=cdef[1];
}
}else{
_3=baseurl+_3;
}
if(document.forms[0][_5].value!=_1){
document.images[_5+"_"+_1].src=_3;
}
window.status=_4;
};
function iou(_6,_7,_8){
var _9=getlongname(_7);
if(_8==""){
type=it[_7];
if(type==0){
_8=rdef[0];
}else{
_8=cdef[0];
}
}else{
_8=baseurl+_8;
}
if(document.forms[0][_9].value!=_6){
document.images[_9+"_"+_6].src=_8;
}
window.status="";
};
function icl(_a,_b,_c,_d){
var _e=getlongname(_b);
if(_c==""){
type=it[_b];
if(type==0){
_c=rdef[2];
}else{
_c=cdef[2];
}
}else{
_c=baseurl+_c;
}
var _f=document.forms[0][_e].value;
var _10=it[_b];
if(_10==1){
if((_f!=0&&_f!=-77)&&(_f!="")){
if(typeof cimg[_b]!="undefined"){
restore_button=cimg[_b];
}else{
restore_button=cdef[0];
}
document.images[_e+"_"+_a].src=baseurl+restore_button;
document.forms[0][_e].value="0";
}else{
document.images[_e+"_"+_a].src=_c;
document.forms[0][_e].value=_a;
}
}else{
if((_f!=0&&_f!=-77)&&(_f!="")){
if(typeof cimg[_b+"_"+_f]!="undefined"){
restore_button=cimg[_b+"_"+_f];
}else{
restore_button=rdef[0];
}
if(document.images[_e+"_"+_f]){
document.images[_e+"_"+_f].src=baseurl+restore_button;
}else{
if(document.images["i"+_e+"_"+_f]){
var _11=get_iflags(_b);
if(_11&1){
document.images["i"+_e+"_"+_f].className="answerimgunchecked";
}
if(_11&2){
document.images["i"+_e+"_"+_f].src=__std_images["i"+_e+"_"+_f];
}
}
}
}
document.images[_e+"_"+_a].src=_c;
document.forms[0][_e].value=_a;
}
};
function preset_buttons(){
var _12;
var _13;
var _14;
var _15;
for(i=0;i<document.forms[0].elements.length;++i){
if(document.forms[0][i].name.search(reg2)!=-1){
_12=document.forms[0].elements[i].name;
if(_12.substr(1,1)=="_"){
shortvar=_12.substr(2,_12.length);
}else{
shortvar=_12;
}
_13=document.forms[0][_12].value;
if(_13>0&&document.images[_12+"_"+_13]){
_15=it[shortvar];
if(_15==0){
if(typeof cimg[shortvar+"_"+_13+"_set"]!="undefined"){
_14=cimg[shortvar+"_"+_13+"_set"];
}else{
_14=rdef[2];
}
}else{
if(typeof cimg[shortvar+"_set"]!="undefined"){
_14=cimg[shortvar+"_set"];
}else{
_14=cdef[2];
}
}
document.images[_12+"_"+_13].src=baseurl+_14;
}
}
}
};
function loadImages(){
var img;
if(document.images){
for(var i=0;i<arguments.length;i++){
img=new Image();
img.src=baseurl+arguments[i];
}
}
};
