var message=document.getElementById('message');
var content=document.querySelector('.content');
var sentBtn=document.getElementById('send');
message.onkeydown=function(e){//enter
    if(e.keyCode==13){
        //如果按下的是enter键，则发送信息
        var value=message.value; 
            if(value){
                renderMessage('mine',value);
                this.value='';
                sendMessage(value);
            }
    }
}
sentBtn.onclick=function(){//点击发送
    var value=message.value;
    renderMessage('mine',value);
    this.value='';
    sendMessage(value) 
}
function sendMessage(text){
    ajax({
        method:'get',
        url:'https://developer.duyiedu.com/edu/turing/chat',
        data:'text='+text,
        success:function(data){
            renderMessage('robot',data.text)
        }
    })
}
//渲染信息 who:是谁说的话 text:说了什么
function renderMessage(who,text){
    var dom=document.createElement('div');
    var img=new Image();
    var textDom=document.createElement('div');
    img.className='avator';
    textDom.className='text';
    textDom.innerText=text;

    if(who=='mine'){
        img.src='./img/3.png';
        dom.className='mine';
    }else if(who=='robot'){
        img.src='./img/dog1.jpg';
        dom.className='robot';
    }
    dom.appendChild(img);
    dom.appendChild(textDom);
    content.appendChild(dom);
    content.scrollTo(0,content.scrollHeight-content.clientHeight)
}