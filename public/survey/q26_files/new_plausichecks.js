var error_text="";
var state=0;
function checkchanged(_1){
if(eval("document.forms.f1."+_1).length&&!eval("document.forms.f1."+_1).type){
for(i=0;i<eval("document.forms.f1."+_1).length;i++){
if(eval("document.forms.f1."+_1)[i].checked){
return true;
}
}
}else{
if(eval("document.forms.f1."+_1).type=="text"){
if(eval("document.forms.f1."+_1).value.length!=0){
return true;
}else{
return false;
}
}else{
if(eval("document.forms.f1."+_1).selectedIndex!=0){
return true;
}else{
return false;
}
}
}
};
function checkselected(_2,_3){
var _4=_3.split("|");
for(i=0;i<_4.length;i++){
if(eval("document.forms.f1."+_2).length&&!eval("document.forms.f1."+_2).type){
for(j=0;j<eval("document.forms.f1."+_2).length;j++){
if(eval("document.forms.f1."+_2)[j].checked&&eval("document.forms.f1."+_2)[j].value==_4[i]){
return true;
}
}
}else{
if(eval("document.forms.f1."+_2).selectedIndex==_4[i]){
return true;
}
}
}
return false;
};
function checklogic(_5,_6,_7,_8,_9,_a){
if(!checkselected(_7,_8)&&(checkchanged(_5)||(_9&&checkchanged(_9)))){
return false;
}else{
return true;
}
};
function checkcross(_b,_c,_d,_e,_f){
if(!checkvalue(_c,"==",_d)&&checkchanged(_b)){
return false;
}else{
return true;
}
};
function checkmisc(_10,_11,_12,_13,_14){
if(!checkselected(_12,_13)&&checkchanged(_10)){
return false;
}else{
return true;
}
};
function checkrange(_15,_16,_17){
if(!checkobject(_15)){
return false;
}
if(!isNaN(Number(getvalue(_15)))&&(Number(getvalue(_15))>=Number(_16)&&Number(getvalue(_15))<=Number(_17))){
return true;
}else{
return false;
}
};
function checkformat(_18,_19){
if(!checkobject(_18)){
return false;
}
var _1a=getstrvalue(_18);
var _1b=eval("/^["+_19+"]*$/");
if(!_1b.test(_1a)){
return true;
}else{
return false;
}
};
function matches_regex(_1c,_1d){
if(!checkobject(_1c)){
return false;
}
var _1e=getstrvalue(_1c);
var _1f=eval(make_format(_1d));
if(_1f.test(_1e)){
return true;
}else{
return false;
}
};
function not_matches(_20,_21){
if(!checkobject(_20)){
return false;
}
var _22=getstrvalue(_20);
var _23=eval(make_format(_21));
if(!_23.test(_22)){
return true;
}else{
return false;
}
};
function not_only_numbers(_24){
if(!checkobject(_24)){
return false;
}
regx=/^\s*[0-9]+\s*[.,]*\s*[0-9]*\s*$/;
var _25=getstrvalue(_24);
if(_25.search(regx)==-1){
return true;
}else{
return false;
}
};
function checkemail(_26,_27,_28){
if(!checkobject(_26)){
return false;
}
var _29=/^([a-z0-9\._-]*)@([a-z0-9\.-]{2,66})\.([a-z]{2,6})$/i;
var _2a=getstrvalue(_26);
if(_29.test(_2a)){
return false;
}else{
return true;
}
};
function checknumbox(_2b,_2c,dir,num,_2d){
if(eval("document.forms.f1."+_2b)[0].type=="checkbox"){
var i=0;
for(j=0;j<eval("document.forms.f1."+_2b).length;j++){
if(eval("document.forms.f1."+_2b)[j].checked){
i++;
}
}
if(!eval("i "+dir+" num")){
return false;
}else{
return true;
}
}else{
alert("wrong field type");
}
};
function make_format(_2e){
var _2f=/^\/.*\/i?$/;
if(!_2f.test(_2e)){
_2e="/"+_2e+"/";
}
return _2e;
};
function checkvalue(_30,_31,_32){
var arr=_32.split("|");
for(i=0;i<arr.length;i++){
if(eval("document.forms.f1."+_30).length&&!eval("document.forms.f1."+_30).type){
for(j=0;j<eval("document.forms.f1."+_30).length;j++){
if(isNaN(arr[i])||arr[i]==""){
if(eval("document.forms.f1."+_30)[j].checked&&eval("document.forms.f1."+_30+"["+j+"].value "+_31+" '"+arr[i]+"'")){
return true;
}
}else{
if(eval("document.forms.f1."+_30)[j].checked&&eval("document.forms.f1."+_30+"["+j+"].value "+_31+" "+arr[i]+"")){
return true;
}
}
}
}else{
if(eval("document.forms.f1."+_30).type=="text"||eval("document.forms.f1."+_30).type=="hidden"){
if(_31.indexOf("regx")!=-1){
if(_31=="onlyregx"){
var _33=eval("document.forms.f1."+_30).value;
var _34=eval("/^"+arr[i]+"$/;");
if(!_34.test(_33)){
return true;
}
}else{
if(_31=="noregx"){
var _33=eval("document.forms.f1."+_30).value;
var _34=eval("/"+arr[i]+"/;");
if(_34.test(_33)){
return true;
}
}else{
if(_31=="regx"){
var _33=eval("document.forms.f1."+_30).value;
var _34=eval("/"+arr[i]+"/;");
if(!_34.test(_33)){
return true;
}
}
}
}
}else{
if(isNaN(arr[i])||arr[i]==""){
if(eval("document.forms.f1."+_30+".value "+_31+" '"+arr[i]+"'")){
return true;
}
}else{
if(eval("document.forms.f1."+_30+".value "+_31+" "+arr[i]+"")){
return true;
}
}
}
}else{
if(eval("document.forms.f1."+_30+".selectedIndex "+_31+" "+arr[i]+"")){
return true;
}
}
}
}
return false;
};
function textfocus(fe){
var _35=0;
if(fe!=1){
var fe=0;
}
var _36=document.forms.f1.length;
if(_36==0){
return;
}
while((document.forms.f1[_35])&&(document.forms.f1[_35].type=="hidden")&&(_35<_36)){
if((document.forms.f1[_35]!="undefined")){
_35++;
}
if((document.forms.f1[_35]=="undefined")){
break;
}
}
if((document.forms.f1[_35]!="undefined")&&(fe!=1)){
if((document.forms.f1[_35])&&((document.forms.f1[_35].type=="text")||(document.forms.f1[_35].type=="textarea"))){
document.forms.f1[_35].focus();
}
}
};
function checkobject(_37){
var _38=eval("document.forms.f1."+_37);
if(typeof _38=="undefined"){
return false;
}
return true;
};
function ishidden(_39){
if(_39=="v_hidden"){
return 1;
}else{
return 0;
}
};
function getvalue(_3a){
if(_3a=="v_hidden"){
return 0;
}
if(!checkobject(_3a)){
return false;
}
var _3b="";
var obj=eval("document.forms.f1."+_3a);
if(!obj){
return 0;
}
var _3c=false;
if(obj.type=="text"||obj.type=="textarea"||obj.type=="hidden"){
_3b=obj.value;
_3c=true;
}else{
if(obj.length>0&&!obj.type){
for(j=0;j<obj.length;j++){
if(obj[j].checked){
_3b=eval("document.forms.f1."+_3a+"["+j+"].value");
break;
}
}
}else{
if(obj.type=="checkbox"||obj.type=="radio"){
if(obj.checked){
_3b=obj.value;
}else{
_3b=0;
}
}else{
if(document.forms["f1"].elements[_3a].selectedIndex==-1){
_3b=0;
}else{
_3b=eval("document.forms[0]."+_3a+".options[document.forms[0]."+_3a+".selectedIndex].value");
}
}
}
}
var _3d=/^\s*[\'|\\\"]?([ 0-9,]*)[\'|\\\"]?\s*$/i;
if(_3d.test(_3b)&&_3b!==0){
_3b=_3b.replace(/,/,".");
}
if(_3b===""){
return "";
}else{
if(isNaN(_3b)){
return _3b;
}else{
return Number(_3b);
}
}
};
function getstrvalue(_3e){
if(_3e=="v_hidden"){
return 0;
}
if(!checkobject(_3e)){
return false;
}
var _3f="";
var obj=eval("document.forms.f1."+_3e);
if(!obj){
return 0;
}
if(obj.type=="text"||obj.type=="textarea"||obj.type=="hidden"){
_3f=obj.value;
}else{
if(obj.length>0&&!obj.type){
for(j=0;j<obj.length;j++){
if(obj[j].checked){
_3f=eval("document.forms.f1."+_3e+"["+j+"].value");
break;
}
}
}else{
if(obj.type=="checkbox"){
if(obj.checked){
_3f=obj.value;
}else{
_3f=0;
}
}else{
_3f=eval("document.forms[0]."+_3e+".options[document.forms[0]."+_3e+".selectedIndex].value");
}
}
}
return _3f+"";
};
function checkrange_old(_40,_41,_42,_43,_44){
if(isNaN(eval("document.forms.f1."+_40).value)||(Number(_41)>eval("document.forms.f1."+_40).value||Number(_42)<eval("document.forms.f1."+_40).value)){
if(_44==0){
state=1;
}
error_text+=_43+"<br>\n";
}
};
function checkemail_old(_45,_46,_47){
var _48=/^([a-z0-9\._-]*)@([a-z0-9\.-]{2,66})\.([a-z]{2,6})$/i;
if(eval("document.forms.f1."+_45).value.search(_48)==-1){
if(_47==0){
state=1;
}
error_text+=_46+"<br>\n";
}
};
function checkcross_old(_49,_4a,_4b,_4c,_4d){
if(!checkvalue(_4a,"==",_4b)&&checkchanged(_49)){
if(_4d==0){
state=1;
}
error_text+=_4c+"<br>\n";
}
};
function checkformat_old(_4e,_4f,_50,_51){
var _52=eval("document.forms.f1."+_4e).value;
var _53=eval("/^["+_4f+"]*$/;");
if(!_53.test(_52)||!_52){
if(_51==0){
state=1;
}
error_text+=_50+"<br>\n";
}
};
function pow(_54,exp){
return Math.pow(_54,exp);
};
function sqr(_55){
return _55*_55;
};
function sqrt(_56){
return _56>0?Math.sqrt(_56):0;
};
function round(_57){
return Math.round(_57);
};
function floor(_58){
return Math.floor(_58);
};
function ceil(_59){
return Math.ceil(_59);
};
function truncate(_5a){
return _5a<0?ceil(_5a):floor(_5a);
};
function setval(_5b){
if(_5b<1){
return 0;
}
return 1;
};
function abs(_5c){
return Math.abs(_5c);
};
function pos(_5d){
return (_5d<0?0:_5d);
};
function neg(_5e){
return (_5e>0?0:_5e);
};
function sgn(_5f){
return (_5f>0?1:(_5f<0?-1:0));
};
function min(_60,_61){
return Math.min(_60,_61);
};
function max(_62,_63){
return Math.max(_62,_63);
};
function isodd(_64){
return truncate(_64)%2!=0;
};
function iseven(_65){
return (truncate(_65)%2==0);
};
function ispositive(_66){
return (_66>0);
};
function isnegative(_67){
return (_67<0);
};
function iszero(_68){
return (_68==0);
};
function issamestring(_69,_6a){
return (trim(lowercase(_69))==trim(lowercase(_6a)));
};
function trim(_6b){
return new String(_6b).replace(/(^\s+|\s+$)/g,"");
};
function lowercase(_6c){
return new String(_6c).toLowerCase();
};
function uppercase(_6d){
return new String(_6d).toUpperCase();
};
function netstringlength(_6e){
return new String(_6e).replace(/\s+/g,"").length;
};
function stringlength(_6f){
return new String(_6f).length;
};
function isblank(_70){
return netstringlength(_70)==0;
};
function isnumber(_71){
return new String(_71).match(/^-?\d+(\.\d+)?$/g);
};
function isint(_72){
return new String(_72).match(/^-?\d+$/g);
};
function isalpha(_73){
return new String(_73).match(/^[a-z]+$/ig);
};
function isalphanumeric(_74){
return new String(_74).match(/^[a-z0-9]+$/ig);
};
function isalpha_de(_75){
return new String(_75).match(/^[a-zäöüßÄÖÜ]+$/ig);
};
function isalphanumeric_de(_76){
return new String(_76).match(/^[a-z0-9äöüßÄÖÜ]+$/ig);
};
function isvaliddate(_77){
return new String(_77).match(/^((((((0)?[1-9])|(1\d)|(2[0-8]))(\.|\/|-\s*)(((0)?[1-9])|(1[0-2])))|((31(\.|\/|-\s*)(((0)?[13578])|(1[02])))|((29|30)(\.|\/|-\s*)(((0)?[1,3-9])|(1[0-2])))))(\.|\/|-\s*)((((19|20))?[0-9][0-9]))|(29(\.|\/|-\s*)(0)?2(\.|\/|-\s*)((19|20))?(([02468][048])|([13579][26]))))$/g);
};
function ismissing(_78){
return (_78=="-77"||_78=="-66"||_78==-77||_78==-66||_78===0||_78==="0"||_78==""||_78===null);
};
function isinrange(_79,min,max){
if(min>max){
return _79<=min&&_79>=max;
}else{
return _79>=min&&_79<=max;
}
};
function accessval(val){
return getvalue(val);
};
function getmonthdiff(_7a,_7b){
_7a=Number(_7a);
_7b=Number(_7b);
return (_7a-new Date().getFullYear())*12+(_7b-new Date().getMonth());
};
