var formname="forms[0]";
var tsrval=-1;
function select_radio(_1,_2){
var _3=eval("document."+formname+"."+_1);
if(_3.length){
for(var i=0;i<_3.length;++i){
if(_3[i].value==_2){
_3[i].checked=true;
}
}
}else{
if(_3.value==_2){
_3.checked=true;
}
}
};
function select_option(_4,_5){
var _6=eval("document."+formname+"."+_4);
if(_6.options.length){
for(var i=0;i<_6.options.length;++i){
if(_6.options[i].value==_5){
_6.selectedIndex=i;
}
}
}
};
function undo_textbox_uncheck(_7,_8){
if(_7&&!_7.checked){
if(document.f1&&_8&&document.f1.elements[_8]){
document.f1.elements[_8].value="";
}
}
};
function undo_textbox(){
for(i=0;i<undo_textbox.arguments.length;i++){
target_element=eval("document.f1."+undo_textbox.arguments[i]);
target_temp=eval("document.f1.tmp_"+undo_textbox.arguments[i]);
if(target_element.value.length>0){
target_temp.value=target_element.value;
target_element.value="";
}
}
};
function redo_textbox(_9){
if(tsrval!=1){
target_element=eval("document.f1."+_9);
target_temp=eval("document.f1.tmp_"+_9);
if(target_temp.value.length>0&&target_element.value.length<1){
target_element.value=target_temp.value;
target_temp.value="";
}
}
};
function textlimit(_a,_b,_c){
if(_a.value.length>_c){
_a.value=_a.value.substring(0,_c);
return false;
}
};
function ucb(_d,_e){
var _f;
var _10;
var _11;
for(var i=0;i<_d.length;i++){
if(_d[i]!=_e){
_10=_d[i].substr(2,_d[i].length);
_11=document.forms.f1[_d[i]].type;
if(_11!="text"){
if(_11=="checkbox"){
var obj=eval("document.f1."+_d[i]);
if(typeof obj!="undefined"){
obj.checked=false;
}
}else{
if(typeof document.images["iv_"+_10+"_1"]!="undefined"){
if(document.forms[0]["v_"+_10].value==1){
iswap(1,_10);
}
}else{
if(typeof document.images["v_"+_10+"_1"]!="undefined"){
var _12=1;
if(document.forms[0]["v_"+_10].value==1){
if(typeof cimg[_10]!="undefined"){
_f=cimg[_10];
}else{
_f=cdef[0];
}
for(var j=0;j<5;j++){
document.images["v_"+_10+"_"+_12].src=baseurl+_f;
}
var ctr=0;
while(!document.images["v_"+_10+"_"+_12].complete&&ctr++<1000){
}
document.images["v_"+_10+"_"+_12].width=document.images["v_"+_10+"_"+_12].width;
for(var z=0;z<15;z++){
document.images["v_"+_10+"_"+_12].zindex=1;
}
document.forms[0]["v_"+_10].value=0;
}
}else{
alert("NOT SUPPORTED");
}
}
}
}
}
}
};
function ucb2(){
var _13;
for(var i=0;i<ucb2.arguments.length;i++){
if(typeof document.images["i"+ucb2.arguments[i]+"_1"]!="undefined"){
var _14=ucb2.arguments[i].substr(2,ucb2.arguments[i].length);
if((typeof it[_14]!="undefined")&&document.forms[0]["v_"+_14].value==1){
iswap(1,_14);
}
}else{
if(typeof cdef!="undefined"){
var _15=1;
var _14=ucb2.arguments[i].substr(2,ucb2.arguments[i].length);
if(typeof cimg[_14]!="undefined"){
_13=cimg[_14];
}else{
_13=cdef[0];
}
for(var j=0;j<20;j++){
document.images["v_"+_14+"_"+_15].src=baseurl+_13;
}
var ctr=0;
while(!document.images["v_"+_14+"_"+_15].complete&&ctr++<1000){
}
document.images["v_"+_14+"_"+_15].width=document.images["v_"+_14+"_"+_15].width;
for(var z=0;z<15;z++){
document.images["v_"+_14+"_"+_15].zindex=1;
}
document.forms[0]["v_"+_14].value=0;
}else{
for(var i=0;i<ucb2.arguments.length;i++){
dont_know_box=eval("document.f1."+ucb2.arguments[i]);
dont_know_box.checked=false;
}
}
}
}
};
function getlongname(_16){
if(isNaN(_16)){
return _16;
}else{
return "v_"+_16;
}
};
function auto_sub_main_form(){
if(document.forms["f1"]){
document.forms["f1"].submit();
}
};
function show_sub_btn(){
if(document.forms["f1"]&&document.forms["f1"].elements["submit_button"]){
document.forms["f1"].elements["submit_button"].style.visibility="visible";
}else{
if(document.getElementById("os")){
document.getElementById("os").style.visibility="visible";
}
}
if(document.forms["f1"]&&document.forms["f1"].elements["back"]){
document.forms["f1"].elements["back"].style.visibility="visible";
}else{
if(document.getElementById("bb")){
document.getElementById("bb").style.visibility="visible";
}
}
};
function init_sub_btn(_17){
setTimeout("show_sub_btn();",_17*1000);
};
function do_auto_post(){
if(document.forms["f1"]){
document.forms["f1"].submit();
}
};
function init_auto_post(_18){
if(_18==0){
setTimeout("do_auto_post();",50);
}else{
setTimeout("do_auto_post();",_18*1000);
}
};
