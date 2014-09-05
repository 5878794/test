var phonegap={};

//检查网络   （phonegap）
phonegap.checkConnection=function() {
	var networkState = navigator.network.connection.type;
	
	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet';
	states[Connection.WIFI]     = 'WiFi';
	states[Connection.CELL_2G]  = '2G';
	states[Connection.CELL_3G]  = '3G';
	states[Connection.CELL_4G]  = '4G';
	states[Connection.NONE]     = false;
	
	return states[networkState];

};

//======================================================================================

//目录文件操作。
phonegap.files={
    //创建一组目录，并返回各个对象。
    //（注意之前的局部变量不可用）
    createAndGetDir:function(datas){
        var dir = datas.dir,    //dir: object;     null时创建sdcard或指定目录下的一组目录。 为目录对象时创建该对象下的一组目录。
            data = datas.data,   //data: array;     需要创建的目录数组。  eg:["temp","data"]
            successfn = datas.success,    //successfn: function;  成功回调，返回创建的目录对象。 resust={目录名：该目录对象, 。。。}
            errorfn = datas.error;   //errorfn: function;   失败回调。


        if(!$.isArray(data)){
            if( typeof(errorfn) == "function" ){
                errorfn();
            }
            return;
        }

        var resust = {};
        var thisdir = null;
        var thisdata = null;

        var fail = function(){
            if( typeof(errorfn) == "function" ){
                errorfn();
            }
        };

        var successone = function(Parent){
            resust[thisdata] = Parent;
            setdir();
        };

        var setdir = function(){
            if(data.length != 0 ){
                thisdata = data.shift();
                thisdir.getDirectory(thisdata, {create: true, exclusive: false}, successone , fail);
            }else{
                if( typeof(successfn) == "function" ){
                    successfn(resust);
                }
            }
        };

        if(typeof(dir)=="object" && dir){
            thisdir = dir;
            setdir();
        }else{
            var getdir = function(fileSystem){
                thisdir = fileSystem.root;
                resust.workspace = thisdir;
                setdir();
            };
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getdir, fail);
        }
    },

    //获取一个文件对象
    //success:function  成功回调 返回文件对象
    //error:function    失败回调
    //dir:obj           文件夹对象
    //filename:str      文件名
    getFileObj:function(datas){
        var successfn = datas.success,
            errorfn = datas.error,
            dir = datas.dir,
            filename = datas.filename;

        successfn = ( typeof(successfn) == "function" ) ? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" ) ? errorfn : function(){};
        if( typeof(dir)=="object" && dir){}else{errorfn();return;}
        if(!filename){errorfn();return;}

        dir.getFile(filename, {create: false, exclusive: false}, successfn, errorfn);
    },

    //删除一个文件夹
    //（注意之前的局部变量不可用）
    delDir:function(datas){
        var dir = datas.dir,           //dir:object 要删除的文件夹对象
            successfn = datas.success,  //successfn: function;  成功回调
            errorfn = datas.error;      //errorfn: function;   失败回调。

        successfn = ( typeof(successfn) == "function" ) ? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" ) ? errorfn : function(){};
        if( typeof(dir)=="object" && dir){}else{errorfn();return;}

        dir.removeRecursively(successfn, errorfn);
    },

    //获取文件夹对象中的文件夹对象
    getDir:function(datas){
        var dir = datas.dir,            //dir:object 要删除的文件夹对象
            dirname = datas.dirName,    //dirName:要获取的对象名
            success = datas.success,    //successfn: function;  成功回调
            error = datas.error;        //errorfn: function;   失败回调。

        success = ( typeof(success) == "function" ) ? success : function(){};
        error = ( typeof(error) == "function" ) ? error : function(){};
        if( typeof(dir)=="object" && dir){}else{error();return;}
        if( !dirname ){error();return;}

        var successfn = function(dirobj){
            success(dirobj);
        };

        dir.getDirectory(dirname, {create: false, exclusive: false}, successfn , error);
    },

    //获取文件夹内容    （判断具体是否是文件使用  obj.isFile 返回true，false）
    //（注意之前的局部变量不可用）
    getAllFromDir:function(datas){
        var dir = datas.dir,    //dir:object 要获取的文件夹对象
            successfn = datas.success,  //successfn（array）: function;  成功回调，返回 文件及文件夹数组对象
            errorfn = datas.error;   //errorfn: function;   失败回调。

        successfn = ( typeof(successfn) == "function" ) ? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" ) ? errorfn : function(){};
        if( typeof(dir)=="object" && dir){}else{errorfn();return;}


        var directoryReader = dir.createReader();
        directoryReader.readEntries(successfn,errorfn);
    },


    //读取文件内容
    //（注意之前的局部变量不可用）
    readFile:function(datas){
        var dir = datas.dir,        //dir:object 要获取的文件夹对象
            filename = datas.file,      //filename:string 要获取的文件名
            successfn = datas.success,     //successfn（array）: function;  成功回调，返回文件内容
            errorfn = datas.error;      //errorfn: function;   失败回调。

        successfn = ( typeof(successfn) == "function" )? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if(!filename){errorfn();return;}
        if( typeof(dir) == "object" && dir ){}else{errorfn();return;}

        var openfile=function(file){
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                successfn(evt.target.result);
            };
            reader.onerror = function(){
                errorfn();
            };
            reader.readAsText(file);
        };

        var findfile=function(fileEntry){
            fileEntry.file(openfile, errorfn);
        };

        dir.getFile(filename, {create: false, exclusive: false}, findfile, errorfn);
    },


    //写入文件内容（文件不存在会自动创建）
    //（注意之前的局部变量不可用）
    writeFile:function(datas){
        var dir = datas.dir,        //dir:object 要写入的文件夹对象
            filename = datas.file,  //filename:string 要写入的文件名
            data = datas.data,    //data:string 要写入的内容
            successfn = datas.success,      //successfn（array）: function;  成功回调,成功返回文件地址。
            errorfn = datas.error;     //errorfn: function;   失败回调。  （写入失败可能会创建一个空文件）

        successfn = ( typeof(successfn) == "function" )? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if(!filename){errorfn();return;}
        if( typeof(dir) == "object" && dir ){}else{errorfn();return;}

        var tempfile = null;

        var openfile=function(writer){
            writer.onwrite = function() {
                successfn(tempfile.fullPath);
            };
            writer.onerror=function(){
                errorfn();
            };
            writer.write(data);
        };


        var findfile=function(fileEntry){
            tempfile=fileEntry;
            fileEntry.createWriter(openfile, errorfn);
        };

        dir.getFile(filename, {create: true, exclusive: false}, findfile, errorfn);
    },


    //删除文件
    //（注意之前的局部变量不可用）
    delFile:function(datas){
        var dir = datas.dir,        //dir:object 要删除的文件夹对象
            filename = datas.file,      //filename:string 要删除的文件名
            successfn = datas.success,      //successfn（array）: function;  成功回调。
            errorfn = datas.error;      //errorfn: function;   失败回调。  （可能文件不存在）

        successfn = ( typeof(successfn) == "function" )? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if(!filename){errorfn();return;}
        if( typeof(dir) == "object" && dir ){}else{errorfn();return;}


        var findfile=function(fileEntry){
            fileEntry.remove(successfn, errorfn);
        };

        dir.getFile(filename, {create: false, exclusive: false}, findfile, errorfn);
    },


    //下载文件到workspace（xface独有）
    //开始下载： start();
    //取消下载：cancel()   //有问题，无法执行  无法解决就在下载文件地址上加时间戳
    superDownloadFile:{
        obj:null,
        start:function(datas){
            var urls = datas.urls, //urls:array   {url:, id: }             下载地址数组。
                dir = datas.dir,    //dir:obj                  下载到本地的文件夹对象
                progressfn = datas.progress, //progressfn:function      进度处理函数。返回（ l：总文件数, n：当前下载文件,id, localFileName：文件名, pre：下载百分比）
                onestartfn = datas.start,   //onestartfn:function      单一文件开始下载执行。返回 （id）
                onesuccessfn = datas.success,   //onesuccessfn:function    单一文件下载成功执行。返回 （id，文件对象）
                completefn = datas.complete,    //completefn:function      所有文件执行完毕执行，不管是否有下载失败的。
                errorfn = datas.error;     //errorfn:function         下载失败执行。返回（id）

            progressfn = ( typeof(progressfn) == "function" )? progressfn : function(){};
            onesuccessfn = ( typeof(onesuccessfn) == "function" )? onesuccessfn : function(){};
            errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
            completefn = ( typeof(completefn) == "function" )? completefn : function(){};
            onestartfn = ( typeof(onestartfn) == "function" )? onestartfn : function(){};
            if( !$.isArray(urls) ){ errorfn(); return; }
            if( urls.length == 0 ){ errorfn(); return; }
            if( typeof(dir) == "object" && dir ){}else{ errorfn(); return;}


            var length = urls.length;
            var number = 0;

            var go = function(url,id,progressfn,successfns,onestartfn,onesuccessfn,errorfn,l,n){
                var localFileName = url.substring(url.lastIndexOf('/')+1);
                var localFileUrl = dir.fullPath+"\/"+localFileName;

                onestartfn(id);

                phonegap.files.superDownloadFile.obj = new xFace.AdvancedFileTransfer(url,localFileUrl);

                phonegap.files.superDownloadFile.obj.onprogress = function(evt){
                    progressfn(l, n, id, localFileName, evt.loaded / evt.total * 100);
                };

                var errorfns = function(){
                    errorfn(id);
                    successfns();
                };

                var success = function(fileenter){
                    onesuccessfn(id,fileenter);
                    successfns();
                };

                phonegap.files.superDownloadFile.obj.download(success, errorfns);

            };
            var successfns = function(){
                if(urls.length == 0 ){
                    phonegap.files.superDownloadFile.obj = null;
                    completefn();
                }else{
                    number++;
                    var thisdata = urls.shift(),
                        thisurl = thisdata.url,
                        thisid = thisdata.id;

                    go(thisurl,thisid,progressfn,successfns,onestartfn,onesuccessfn,errorfn,length,number)
                }


            };
            successfns();
        },
        cancel:function(){
            if(phonegap.files.superDownloadFile.obj){
                phonegap.files.superDownloadFile.obj.cancel();
            }
        }
    },


    //普通下载
    downloads:function(datas){
        var srcs = datas.src,
            dir = datas.dir,
            successfn = datas.success,
            errorfn = datas.error;

        successfn = ( typeof(successfn) == "function" )? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function")? errorfn : function(){};
        if($.isArray(srcs)){}else{ errorfn(); return;}
        if( typeof(dir) == "object" && dir ){}else{errorfn();return;}

        var go = function(src,dir,successfn,errorfn){
            var localFileName = src.substring(src.lastIndexOf('/')+1);
            var localFileUrl = dir.fullPath+"\/"+localFileName;
            var fileTransfer = new FileTransfer();
            fileTransfer.download (src,localFileUrl,successfn,errorfn);
        };

        var continuess = function(){
            if(srcs.length == 0){
                successfn();
            }else{
                var thissrc = srcs.shift();
                if($.isArray(thissrc) || $.isObject(thissrc)){
                    //忽略
                    //var temp_show_str = JSON.stringify(thissrc);
                    //alert("资源图片地址"+temp_show_str+"错误,忽略！");
                    continuess();
                }else{
                    go(thissrc,dir,continuess,errorfn);
                }
            }
        };
        continuess();

    },





    //上传文件
    uploadFile:function(){


    },


    //移动文件(文件是对象)
    //文件对象移动到新的文件夹对象
    moveFileObjTo:function(datas){
        var fileenter = datas.fileenter,        //fileenter:obj         文件对象
            newdir = datas.newdir,     //newdir:obj            要移动到的文件夹对象
            successfn = datas.success,    //successfn:function    成功回调返回文件对象
            errorfn = datas.error;    //errorfn:function      失败回调

        successfn = ( typeof(successfn) == "function" )? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if( typeof(fileenter) == "object" && fileenter ){}else{errorfn();return;}
        if( typeof(newdir) == "object" && newdir ){}else{errorfn();return;}
        var newname = fileenter.name;

        fileenter.moveTo(newdir, newname, successfn, errorfn);
    }
};

//======================================================================================

//媒体采集 (xface)
phonegap.capture={
    //调用照相功能  成功返回文件地址
    camera:function(datas){
        var success = datas.success,
            error = datas.error,
            data = datas.data;

        success = (typeof(success) == "function") ? success : function(){};
        error = (typeof(error) == "function") ? error : function(){};




        var errorfn = function(errorcode){
            errorcode = parseInt(errorcode);
            if(errorcode ==  5){    //TODO  验证返回代码

            }else{
                error();
            }
        };

        var successfn = function(rs){
            var backdata = [];
            for(var i= 0,l=rs.length;i<l;i++){
                var thisdata = rs[i].fullPath;
                backdata.push(thisdata);
            }
            success(backdata);
        };

        xFace.CMBC.CMBCCapture.captureImage(successfn, errorfn,data);

    },
    //调用系统文件选取功能  成功返回文件地址
    getMedilFile:function(datas){
        var success = datas.success,
            error = datas.error;

        success = (typeof(success) == "function") ? success : function(){};
        error = (typeof(error) == "function") ? error : function(){};
        var errorfn = function(errorcode){
            errorcode = errorcode.toLowerCase();
            if(errorcode.indexOf("cancelled")>-1){

            }else{
                error();
            }
        };
        navigator.camera.getPicture(success, errorfn, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    },
    //录制语音 成功返回文件地址(调用非系统的 xface?) 前后会掉大约1秒的内容
    getaudio:{
        mediaRec:null,
        callback:null,
        filename:null,
        //开始录音
        //成功返回文件名   xface只能保存在workspace下
        start:function(datas){
            var success = datas.success,
                error = datas.error,
                filename = new Date().getTime()+".mp3";

            success = (typeof(success) == "function") ? success : function(){};
            error = (typeof(error) == "function") ? error : function(){};

            phonegap.capture.audio.callback = success;
            phonegap.capture.audio.filename = filename;

            phonegap.capture.audio.mediaRec = new Media(filename, function(){},  error);
            phonegap.capture.audio.mediaRec.startRecord();
        },
        //结束录音
        stop:function(){
            if(phonegap.capture.audio.mediaRec){
                phonegap.capture.audio.mediaRec.stopRecord();
                phonegap.capture.audio.callback(phonegap.capture.audio.filename);
                phonegap.capture.audio.callback = null;
                phonegap.capture.audio.filename = null;
                phonegap.capture.audio.mediaRec = null;
            }
        }
    },
    //录制语音 成功返回文件地址 调用系统录音机
    audio:function(datas){
        var success =  datas.success,       //成功回调 返回文件绝对地址
            error = datas.error;            //失败回调

        success = (typeof(success) == "function") ? success : function(){};
        error = (typeof(error) == "function") ? error : function(){};

        var successfn = function(data){
            var srcs = data[0],
                src = srcs.fullPath;

            success(src);
        };

        var errorfn = function(errorcode){
            errorcode = errorcode.toLowerCase();
            if(errorcode.indexOf("cancelled")>-1){

            }else{
                error();
            }
        };


        //android 限制不到最大时间
        navigator.device.capture.captureAudio(successfn, errorfn, {duration: 100});



    },
    //录制视频
    video:function(datas){
        var success =  datas.success,       //成功回调 返回文件绝对地址
            error = datas.error,            //失败回调
            times = parseInt(datas.times) ;        //录制最长时间 可以为空

        success = (typeof(success) == "function") ? success : function(){};
        error = (typeof(error) == "function") ? error : function(){};

        var successfn = function(data){
            var srcs = data[0],
                src = srcs.fullPath;

            //拷贝文件到指定位置  //临时添加
            DATAINTERFACE.file.copyToResource({
                srcs:[src],
                success:function(srcs){
                    if(!$.isArray(srcs)){error();return; }
                    if(srcs.length == 0){error();return; }
                    success(srcs[0]);

                },
                error:function(){
                    error();
                }
            });
        };

        var errorfn = function(errorcode){
            errorcode = errorcode.toLowerCase();
            if(errorcode.indexOf("cancelled")>-1){

            }else{
                error();
            }
        };

        if(times){
            navigator.device.capture.captureVideo(successfn, errorfn, {duration: times});
        }else{
            navigator.device.capture.captureVideo(successfn, errorfn);
        }

    },

    //录制视频 启用前置 并显示文字
    superVideo:function(datas){
        var success =  datas.success,       //成功回调 返回文件绝对地址
            error = datas.error,            //失败回调
            params = datas.newparams ;             //录制参数

        success = (typeof(success) == "function") ? success : function(){};
        error = (typeof(error) == "function") ? error : function(){};

        var successfn = function(data){
                var srcs = data[0],
                    src = srcs.fileUrl;
                success(src);
            },
            errorfn = function(err){
                if(parseInt(err) == 5){

                }else{
                    error();
                }
            };

        xFace.CMBC.CMBCCapture.captureVideo(successfn,errorfn,params);
    }
};


//媒体播放
phonegap.media={
   //播放,停止 声音文件   xface    //目前 error不执行
    audio:{
        obj:null,
        //播放声音文件
        //src:str     声音文件地址
        //error:function     打开文件失败   貌似不执行....
        //success:function   播放完毕
        //playing:function   播放中
        play:function(datas){
            var src = datas.src,
                error = datas.error,
                playing = datas.playing,
                success = datas.success;

            error = (typeof(error) == "function")? error : function(){};
            playing = (typeof(playing) == "function")? playing : function(){};
            success = (typeof(success) == "function")? success : function(){};
            if(!src){error();return;}

            var onstatechange = function(value){
                  var a = Media.MEDIA_MSG[value];
                  if(a.toLowerCase() == "stopped"){
                      success();
                      phonegap.media.audio.stop();
                  }else{
                      playing(a)
                  }
            };
            //error 不执行???
            phonegap.media.audio.obj = new Media(src, function(){}, error , onstatechange);
            phonegap.media.audio.obj.play();
        },
        //停止播放音频
        stop:function(){
            if (phonegap.media.audio.obj != null) {
                phonegap.media.audio.obj.stop();
                phonegap.media.audio.obj.release();
                phonegap.media.audio.obj = null;
            }
        }
    },
    video:{
        //播放视频文件
        //src:视频文件绝对地址
        play:function(src){
            var paths = src;
            var videomp4 = new Video(paths, function(){}, function(){});
            videomp4.play();
        },
        play1:function(src){
            //播放完了看不到控件了，只能控制控件宽度不能控制视频大小  不建议使用该方法
            $("body").append("<video id='clip' width='300'  controls='' src='"+src+"'></video>")
            document.getElementById("clip").play();
        }
    }
};

//======================================================================================
//alert,confirm
phonegap.alert = function(datas){
    var message = datas.message,
        callback = datas.callback,
        title = datas.title,
        button = datas.button;

    callback = ( typeof(callback) == "function")? callback : function(){};
    title = title || "系统提示";
    message = message || " ";
    button = button || "好的";

    navigator.notification.alert(message,callback,title,button);
};
phonegap.confirm = function(datas){
    var success = datas.success,
        error = datas.error,
        title = datas.title,
        message = datas.message,
        yesbutton = datas.yesButton,
        nobutton = datas.noButton;

    success = ( typeof(success) == "function")? success : function(){};
    error = ( typeof(error) == "function")? error : function(){};
    title = title || "系统提示";
    message = message || " ";
    yesbutton = yesbutton || "好的";
    nobutton = nobutton || "不，谢谢";


    navigator.notification.confirm(message,function(button){
        if(button == 1){
            success();
        }
        if(button == 2){
            error();
        }
    },title,yesbutton+","+nobutton);

};

//======================================================================================
//文件zip unzip (xface)
phonegap.zip = function(datas){
    var src = datas.srcs,          //array 压缩文件全路径
        tosrc = datas.targetSrc,        //生成路径+文件名
        success = datas.success,        //无返回
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};
    if(!tosrc){error("缺少参数！");return;}
    if(!$.isArray(src)){error("缺少参数！");return;}
    if(src.length == 0){error("缺少参数！");return;}

    xFace.Zip.zipFiles(src, tosrc, success, error);

};
phonegap.unzip = function(datas){
    var src = datas.src,                //压缩文件全路径
        tosrc = datas.targetSrc,        //需要解压的位置
        success = datas.success,        //无返回
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};
    tosrc = (tosrc) ? tosrc : "";
    if(!src){error("缺少参数！");return;}

    xFace.Zip.unzip(src, tosrc, success, error);

};


//退出程序(cmbc修改过)
phonegap.exit = function(){
    var deldir1 = function(){
        DATAINTERFACE.directory.del({
            dir:"temp",
            success:function(){
                deldir2();
            },
            error:function(){
                deldir2();
            }
        });
    };

    var deldir2 = function(){
        DATAINTERFACE.directory.del({
            dir:"tempfile",
            success:function(){
                writesyslog();
            },
            error:function(){
                writesyslog();
            }
        });
    };

    var writesyslog = function(){

        if(DATAINTERFACE.sqlite.db){
            DATAINTERFACE.datas.addSysLog({
                success:function(){
                    navigator.app.exitApp();
                },
                error:function(){
                    navigator.app.exitApp();
                },
                title:CMBC_MESSAGE.sysLogtype.t15,
                info:CMBC_MESSAGE.sysLogtype.m15(),
                group:CMBC_MESSAGE.sysLogGroup.g1,
                other:{}
            });
        }else{
            navigator.app.exitApp();
        }
    };

    deldir1();
};



//防止wifi休眠
phonegap.setWifiNotSleep = function(datas){
    var wifi_sleep_policy = "wifi_sleep_policy_never",
        success = datas.success,
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};

    navigator.app.setWifiSleepPolicy(wifi_sleep_policy,success,error);
};


//安装应用  (xface)
phonegap.installApp = function(datas){
    var src = datas.appSrc,   //本地地址
        success = datas.success,
        error = datas.error;

    success = (typeof(success) == "function") ?  success : function(){};
    error = (typeof(error) == "function") ?  error : function(){};
    var temp_name = src.substring(src.lastIndexOf(".")+1);
    if(temp_name != "apk"){ error("安装文件格式错误！");return;}

    navigator.app.install(src, success, error);

    setTimeout(function(){
        navigator.app.exitApp();
    },500);


};

//开其他网址或文件
phonegap.openUrl = function(datas){
    var url = datas.url,
        success = datas.success,
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};
    if(!url){error("缺少参数！");return;}

    var successfn = function(){
        success("");
    };
    var errorfn = function(){
        error("");
    };

    var temp_url = url.toLowerCase();
    if(temp_url.indexOf("http:\/\/") > -1){
        //是网址 直接打开
        navigator.app.openUrl(url,successfn,errorfn);
    }else{
        //是文件 解密文件

        var filename = datas.fileName,
            timess = new Date().getTime(),
            newsrc = DATAINTERFACE.directory.tempfile.fullPath+"/"+timess+"_"+filename;

        if(!MYSET.productDecrypt){
            navigator.app.openUrl(url,successfn,errorfn);
        }else{
            phonegap.SecurityCard.decryptFile({
                src:url,
                newsrc:newsrc,
                success:function(){
                    navigator.app.openUrl(newsrc,successfn,errorfn);
                },
                error:function(){
                    errorfn("打开文件失败");
                }
            });
        }
    }
};


//======================================================================================
//tf卡操作  (cmbc项目特有)
phonegap.SecurityCard = {};

//tf卡错误 错误代码见myset.js文件
phonegap.SecurityCard.error = function(code){
    var showmessage = "";
    if(CMBC_MESSAGE.SecurityCard[code]){
        showmessage = CMBC_MESSAGE.SecurityCard[code];
    }else{
        showmessage = CMBC_MESSAGE.SecurityCard.other;
    }

    code = parseInt(code);
    if(code == 5 || code == 7 || code == 10 || code == 11 || code == 12 || code == 14 || code == 15 || code == 16 || code == 17 || code == 18 || code == 20 || code == 21){
        phone.info.show(showmessage,false);
    }else{
        DATAINTERFACE.alert({
            title:CMBC_MESSAGE.system.title,
            message:showmessage,
            callback:function(){
                phonegap.exit();
            }
        })
    }

};

//获取卡状态
phonegap.SecurityCard.attr = function(datas){
    var success = datas.success;

    success = (typeof(success) == "function")? success : function(){};

    xFace.CMBC.SecurityCard.getAttribute(success,phonegap.SecurityCard.error);
};

//登陆
phonegap.SecurityCard.login = function(datas){
    var password = datas.password,
        success = datas.success;

    success = (typeof(success) == "function")? success : function(){};
    if(!password){phonegap.SecurityCard.error(2);return;}

    xFace.CMBC.SecurityCard.login(password,success,phonegap.SecurityCard.error);
};

//修改密码
phonegap.SecurityCard.changePassword = function(datas){
    var newpassword = datas.newPassword,
        oldpassword = datas.oldPassword,
        success = datas.success;

    success = (typeof(success) == "function")? success : function(){};
    if(!newpassword){phonegap.SecurityCard.error(2);return;}
    if(!oldpassword){phonegap.SecurityCard.error(2);return;}

    var errorfn = function(){
        var errorff = datas.error;
        if(typeof(errorff) == "function"){
            errorff();
        }else{
            phonegap.SecurityCard.error();
        }
    };

    xFace.CMBC.SecurityCard.changePin(oldpassword,newpassword,success,errorfn);
};

//解锁(解锁后密码会回归初始密码，状态回归未激活)
phonegap.SecurityCard.unLock = function(datas){
    var code = datas.code,
        success = datas.success;

    success = (typeof(success) == "function")? success : function(){};
    if(!code){phonegap.SecurityCard.error(2);return;}

    xFace.CMBC.SecurityCard.unlock(code,success,phonegap.SecurityCard.error);
};

//加解密
// type为：encrypt，decrypt，privateEncrypt，privateDecrypt
phonegap.SecurityCard.md5 = function(datas){
    var str = datas.str,
        type = datas.type,
        success = datas.success,
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};

    if(str || str == 0 ){}else{error();return;}
    if(!type ){error();return;}

    if(type == "encrypt"){
        xFace.CMBC.SecurityCard.encrypt(str,success,error);
    }
    if(type == "decrypt"){
        xFace.CMBC.SecurityCard.decrypt(str,success,error);
    }
    if(type == "privateEncrypt"){
        xFace.CMBC.SecurityCard.privateEncrypt(str,success,error);
    }
    if(type == "privateDecrypt"){
        xFace.CMBC.SecurityCard.privateDecrypt(str,success,error);
    }
};


phonegap.SecurityCard.encryptFile = function(datas){
    var sourceFilePath = datas.src,
        targetFilePath = datas.newsrc,
        success = datas.success,
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};

    if(!sourceFilePath || !targetFilePath){error("参数错误！");return;}

    xFace.CMBC.SecurityCard.encryptFile (sourceFilePath, targetFilePath,success, error);
};

phonegap.SecurityCard.decryptFile = function(datas){
    var sourceFilePath = datas.src,
        targetFilePath = datas.newsrc,
        success = datas.success,
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};

    if(!sourceFilePath || !targetFilePath){error("参数错误！");return;}

    xFace.CMBC.SecurityCard.decryptFile (sourceFilePath, targetFilePath,success, error)
};





//检查用户名
phonegap.SecurityCard.checkUsername = function(datas){
    var success = datas.success,
        username = datas.username;

    success = (typeof(success) == "function")? success : function(){};
    if(!username){phonegap.SecurityCard.error("9999");return;}

    xFace.CMBC.SecurityCard.checkMatchingUserId(username,success,phonegap.SecurityCard.error);


};

//检查设备imei
phonegap.SecurityCard.checkIMEI = function(datas){
    var success = datas.success,
        imei = datas.imei;

    success = (typeof(success) == "function")? success : function(){};
    if(!imei){phonegap.SecurityCard.error(2);return;}

    xFace.CMBC.SecurityCard.checkMatchDeviceId(imei,success,phonegap.SecurityCard.error);


};

//获取设备ip
phonegap.getIp = function(datas){
    var success = datas.success;

    success = (typeof(success) == "function")? success : function(){};

    var successfn = function(){
        var backdata = [];
        success(backdata);
    };

    xFace.CMBC.LocalIp.getLocalIpAddress(success,successfn);
};



//获取身份证识别器返回值(xface)
phonegap.getIdcardCode = function(datas){
    var success = datas.success,
        error = datas.error,
        mac = MYSET.idcardDeviceMac;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};

    if(xFace.CMBC.IDCardScanner){
        xFace.CMBC.IDCardScanner.capture(mac,success,error);
    }else{
        error("该功能还未开放！");
    }
};


//获取当前地址坐标
phonegap.getMyAddressPoint = function(){
    if(phonegap.getJWD.data){
        return JSON.stringify(phonegap.getJWD.data);
    }else{
        return "";
    }
};
phonegap.getJWD = {
    data:null,
    id:null,
    init:function(){
        var _this = this;
        _this.id = navigator.geolocation.watchPosition(function(data){
            _this.data = data;
        },function(r){
            if(r.code == 3){
                navigator.geolocation.clearWatch(_this.id);
                _this.id = null;
                _this.init();
            }
        }, { maximumAge: MYSET.getJWDTime ,timeout:MYSET.getJWDTime,enableHighAccuracy:false});
    }
};





