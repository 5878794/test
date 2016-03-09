var DATAINTERFACE={};

//alert,confirm
//datas={
//      title:str           标题
//      message:str         内容
//      callback:function   点按钮回执，可忽略
//      button：str         按钮文字，可忽略
// }
DATAINTERFACE.alert=function(datas){
    phonegap.alert(datas);
};
//data={
//      title:str           标题
//      message:str         内容
//      success:function    确定按钮回调
//      error:function      取消按钮回调，可忽略
//      yesButton：str      确定按钮文字，可忽略
//      noButton：str       取消按钮文字，可忽略
// }
DATAINTERFACE.confirm=function(datas){
    phonegap.confirm(datas);
};

//文件夹
DATAINTERFACE.directory={
    //创建目录，并创建 this.文件夹名  的目录对象。
    //(写死)默认创建 cmbc-->datas,temp,image,code,cp,resource
    create:function(datas){
        var callback = datas.success,
            errorfn = datas.error;

        this.errorfn = (typeof(errorfn) == "function") ? errorfn : function(){} ;
        this.callback = (typeof(callback) == "function") ? callback : function(){} ;
        this.create1();
    },
    create1:function(){
        var datas = ["cmbc"];
        phonegap.files.createAndGetDir({
            dir:null,
            data:datas,
            success:function(data){
                DATAINTERFACE.directory.cmbc = data.cmbc;
                DATAINTERFACE.directory.workspace = data.workspace;
                DATAINTERFACE.directory.create2();
            },
            error:function(){
                DATAINTERFACE.directory.createError();
            }
        });
    },
    create2:function(){
        var datas = ["image","code","cp","datas","temp","resource","downloadimage","tempfile"];

        phonegap.files.createAndGetDir({
            dir:DATAINTERFACE.directory.cmbc,
            data:datas,
            success:function(data){
                DATAINTERFACE.directory.image = data.image;
                DATAINTERFACE.directory.datas = data.datas;
                DATAINTERFACE.directory.temp = data.temp;
                DATAINTERFACE.directory.code = data.code;
                DATAINTERFACE.directory.cp = data.cp;
                DATAINTERFACE.directory.resource = data.resource;
                DATAINTERFACE.directory.downloadimage = data.downloadimage;
                DATAINTERFACE.directory.tempfile = data.tempfile;

                var temp_fn = DATAINTERFACE.directory.callback;
                DATAINTERFACE.directory.callback = null;
                DATAINTERFACE.directory.errorfn = null;
                temp_fn();
            },
            error:function(){
                DATAINTERFACE.directory.createError();
            }
        });
    },
    createError:function(){
        var a = DATAINTERFACE.directory.errorfn;
        DATAINTERFACE.directory.errorfn = null;
        a();
    },
    //删除一个文件夹
    del:function(datas){
        var callback = datas.success,
            errorfn = datas.error,
            dir = datas.dir;

        if( !DATAINTERFACE.directory[dir] ){
            if(typeof(errorfn) == "function"){
                errorfn();
            }
            return;
        }

        phonegap.files.delDir({
            dir:DATAINTERFACE.directory[dir],
            success:callback,
            error:errorfn
        });
    },
    //删除一个文件夹下的文件夹
    // datas={
    //      dir:str                 要删除的文件夹的上级文件夹名
    //      delNames：array         要删除的文件夹名（多个）
    //      success:function        成功回调
    //      error:function          失败回调
    // }
    delbyname:function(datas){
        var callback = datas.success,
            errorfn = datas.error,
            dir = datas.dir,
            dels = datas.delNames;

        callback = ( typeof(callback) == "function" ) ? callback : function(){};
        errorfn = ( typeof(errorfn) == "function" ) ? errorfn : function(){};
        if(!$.isArray(dels)){errorfn(2);return;}
        if( !DATAINTERFACE.directory[dir] ){ errorfn(1);return;}
        dir = DATAINTERFACE.directory[dir];

        var thisdirname="";



        var deldir = function(obj){
            phonegap.files.delDir({
                dir:obj,
                success:function(){
                    go();
                },
                error:function(){
                    go();
                }
            });
        };


        var geidir = function(dirname){
            phonegap.files.getDir({
                dir:dir,
                dirName:dirname,
                success:function(thisdirobj){
                    deldir(thisdirobj);
                },
                error:function(){
                    go();
                }
            })
        };

        var go = function(){
            if(dels.length == 0){
                callback();
            }else{
                thisdirname = dels.shift();
                geidir(thisdirname);
            }
        };

        go();
    },

    //获取文件夹下所有对象，成功返回数组对象。   判断是否是文件 obj.isFile 返回 true false
    //dir:string 文件名
    //callback:function 成功回调
    getAll:function(datas){
        var dir = datas.dir,
            callback = datas.success,
            errorfn = datas.error;

        if( !DATAINTERFACE.directory[dir] ){
            var data=[];
            callback(data);
        }
        phonegap.files.getAllFromDir({
           dir:DATAINTERFACE.directory[dir],
           success:callback,
           error:errorfn
        });
    }
};

//文件
DATAINTERFACE.file={
    //读取文件内容
    //dir:string   文件夹名
    //filename:string   文件内容
    //success:function   成功回调 返回文件内容
    //error:function    失败回调
    read:function(datas){
        var dir = datas.dir,
            filename = datas.filename,
            callback = datas.success,
            errorfn = datas.error;

        if( !DATAINTERFACE.directory[dir] ){
            if(typeof(errorfn) == "function"){
                errorfn();
            }
            return;
        }

        phonegap.files.readFile({
           dir:DATAINTERFACE.directory[dir],
           file:filename,
           success:callback,
           error:errorfn
        });
    },
    //写入文件内容
    write:function(datas){
        var dir = datas.dir,
            filename = datas.file,
            data = datas.data,
            callback = datas.success,
            errorfn = datas.error;

        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if( !DATAINTERFACE.directory[dir] ){ errorfn();return; }

        phonegap.files.writeFile({
           dir:DATAINTERFACE.directory[dir],
           file:filename,
           data:data,
           success:callback,
           error:errorfn
        });
    },
    //删除一个文件
    del:function(datas){
        var dir = datas.dir,
            filename = datas.file,
            callback = datas.success,
            errorfn = datas.error;

        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if( !filename ){ errorfn(); return; }
        if( !DATAINTERFACE.directory[dir] ){ errorfn(); return; }


        phonegap.files.delFile({
            dir:DATAINTERFACE.directory[dir],
            file:filename,
            success:callback,
            error:errorfn
        })
    },
    //删除多个文件
    //datas={
    //      dir:str                          文件夹名
    //      delNames：array                  要删除的文件名（多个）
    //      success：function                成功回调
    //      error：function                  失败回调
    // }
    dels:function(datas){
        var callback = datas.success,
            errorfn = datas.error,
            dir = datas.dir,
            dels = datas.delNames;

        callback = ( typeof(callback) == "function" ) ? callback : function(){};
        errorfn = ( typeof(errorfn) == "function" ) ? errorfn : function(){};
        if(!$.isArray(dels)){errorfn();return;}
        if( !DATAINTERFACE.directory[dir] ){ errorfn();return;}
        dir = DATAINTERFACE.directory[dir];

        var thisfilename="";



        var delfile = function(filename){
            phonegap.files.delFile({
                dir:dir,
                file:filename,
                success:function(){
                    go();
                },
                error:function(){
                    go();
                }
            });
        };



        var go = function(){
            if(dels.length == 0){
                callback();
            }else{
                thisfilename = dels.shift();
                delfile(thisfilename);
            }
        };

        go();
    },


    //断点下载文件
    //data={};
    //urls:array               下载地址数组。  [{url:***,id:***},...]
    //dir:string               下载到的文件夹
    //progress:function      进度处理函数。返回（ l：总文件数, n：当前下载文件, id:传入id, localFileName：文件名, pre：下载百分比）
    //start:function      单一文件开始下载执行。返回 （id）
    //success:function    单一文件下载成功执行。返回 （id,文件对象）
    //complete:function    所有文件执行完毕执行，不管是否有下载失败的。
    //error:function         下载失败执行。返回（id）

    //data=="stop"  取消下载  现在接口提供的方法有问题
    downloads:function(data){

        if( data == "stop"){
            phonegap.files.superDownloadFile.cancel();
            return;
        }

        var urls = data.urls,
            progressfn = data.progress,
            onestartfn = data.start,
            onesuccess = data.success,
            callback = data.complete,
            errorfn = data.error,
            dir = data.dir;

        progressfn = ( typeof(progressfn) == "function" )? progressfn : function(){};
        callback = ( typeof(callback) == "function" )? callback : function(){};
        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        onesuccess = ( typeof(onesuccess) == "function" )? onesuccess : function(){};
        onestartfn = ( typeof(onestartfn) == "function" )? onestartfn : function(){};
        if( !$.isArray(urls) ){ errorfn();return; }
        if( urls.length == 0 ){ errorfn();return; }
        if( !DATAINTERFACE.directory[dir] ){ errorfn();return; }
        dir = DATAINTERFACE.directory[dir];

        phonegap.files.superDownloadFile.start({
            urls:urls,
            dir:dir,
            progress:progressfn,
            start:onestartfn,
            success:onesuccess,
            complete:callback,
            error:errorfn
        });
    },



    //移动文件
    //data={};
    //fileobj:obj   文件对象。
    //dir:string    移动到的文件夹名字。
    //success:function 成功回调。
    //error:function 失败回调。
    moveTo:function(data){
        var fileenter = data.fileobj,
            dir = data.dir,
            successfn = data.success,
            errorfn = data.error;

        successfn = ( typeof(successfn) == "function" )? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if( typeof(fileenter) == "object" && fileenter ){}else{errorfn();return;}
        if( !DATAINTERFACE.directory[dir] ){ errorfn();return; }

        phonegap.files.moveFileObjTo({
            fileenter:fileenter,
            newdir:DATAINTERFACE.directory[dir],
            success:successfn,
            error:errorfn
        });
    },

    //拷贝文件到资源文件夹
    //datas={
    //      success:function
    //      error:function
    //      srcs:array    eg:["a.jpg","file//mnt/aaa/dfsdf.js"]
    // }
    copyToResource:function(datas){
        var srcs = datas.srcs,
            successfn = datas.success,
            errorfn = datas.error;

        successfn = ( typeof(successfn) == "function" )? successfn : function(){};
        errorfn = ( typeof(errorfn) == "function" )? errorfn : function(){};
        if(!$.isArray(srcs)){  errorfn("参数错误！");return;}

        var backdata = [],
            fileuuid = null;

        var go = function(){
            if(srcs.length == 0){
                //完成
                successfn(backdata);
            }else{
                var thissrc = srcs.shift();
                copyfile(thissrc);
            }
        };
        var copyfile = function(src){
            if(!fileuuid){
                fileuuid = DATAHANDLER.fileuuid1();
            }else{
                var len = fileuuid.length,
                    time = fileuuid.substr(len-13),
                    newtime = parseInt(time) + 1;
                fileuuid = fileuuid.substr(0,len-13) + newtime.toString();
            }

            var backfilename = fileuuid+src.substr(src.lastIndexOf(".")),
                filennewsrc = DATAINTERFACE.directory.resource.fullPath+"/"+backfilename;

            backdata.push(backfilename);

            xFace.CMBC.file.copyFileToXApp(src,filennewsrc,function(){
                //成功
                go();
            },function(){
                //失败
                errorfn("保存图片失败");
            });
        };

        go();
    },

    //打开网址
    //datas={
    //      success:function
    //      error:function
    // }
    openUrl:function(datas){
        datas.url = MYSET.outLinkUrl;

        phonegap.openUrl(datas);
    },


    //datas={
    //      fileName:str   文件名
    //      productId：str 产品id
    //      success：function
    //      error:function
    // }
    openOfficeFile:function(datas){
        var filename = datas.fileName,
            productid = datas.productId,
            url = null;

        url = DATAINTERFACE.directory.cp.fullPath+"/"+productid+"/"+filename;
        datas.url = url;
        phonegap.openUrl(datas);
    }

};

//媒体部分
DATAINTERFACE.media={
    //开始拍照
    //success:function     成功回调返回照片地址
    //error: function      失败回调
    getImageFromCamera:function(datas){
        var success = datas.success,
            error = datas.error,
            data = datas.param,
            filename = DATAHANDLER.fileuuid1(),
            getnewFilename = function(){   //TODO
                var len = filename.length,
                    time = filename.substr(len-13),
                    newtime = parseInt(time) + 1;
                filename = filename.substr(0,len-13) + newtime.toString() + ".jpg";
                return filename;
            },
            postdata = new CMBCCaptureImageOptions(),
            hasnumber = datas.hasNumber;


        postdata.aspectRatio = parseInt(MYSET.winHeight)/parseInt(MYSET.winWidth);
        postdata.marginsRatio = 0;
        postdata.continuous = 1;
        postdata.continuousMode = postdata.SINGLE_SHOOTING;     //需要手动触发连拍
        postdata.quality = 60;           //照片的质量(0-100)
        postdata.encodingType = "JPEG";   //照片存储的格式(JPEG或者PNG)
        postdata.savePath = [];






        success = (typeof(success) == "function") ? success : function(){};
        error = (typeof(error) == "function") ? error : function(){};

        data = ($.isObject(data))?  data : {};
        data = ($.isObject(data.CONF_INIT_VALUE))? data.CONF_INIT_VALUE : data;

        //处理拍照显示框参数
        var picpar = data.FMT;
        if(picpar && picpar.indexOf(",")>-1){
            //有参数
            var picpars = picpar.split(",");
            if(picpars.length == 3){
                var height = picpars[0],
                    width = picpars[1],
                    per = picpars[2];

                if(height && width && per){
                    postdata.aspectRatio = parseInt(height)/parseInt(width);
                    postdata.marginsRatio = (100 - per)/2;
                }
            }
        }

        //处理连拍数
        if(data.LMT){
            var temp_a = parseInt(data.LMT) - hasnumber;
            if(temp_a <= 0){
                error("已达到拍照的最大上限！");
                return;
            }
            postdata.continuous = temp_a;
        }
        //处理照片名
        for(var i= 0,l=postdata.continuous;i<l;i++){
            var thisfilename = getnewFilename();
            postdata.savePath.push("/cmbc/resource/" + thisfilename);
        }

        //执行
        phonegap.capture.camera({success:success,error:error,data:postdata});
    },
    //从图库或文件夹管理器中选择文件   (类型根据返回文件的绝对地址判断)
    //success:function    成功回调返回文件地址
    //error:function      失败执行
    getFile:function(datas){
        var success = datas.success,
            error = datas.error;

        phonegap.capture.getMedilFile({success:success,error:error})
    },
    //开始录音 调用系统程序
    //datas={
    //      success:function     成功回调返回文件绝对地址
    //      error:function       失败回调
    // }
    getAudioFromSystem:function(datas){
        phonegap.capture.audio(datas);

    },
    //开始录制视频 调用系统程序  可以限制录制长度
    // datas={
    //      success:function     成功回调返回文件绝对地址
    //      error:function       失败回调
    //      times:number         录制视频的最大长度，可以忽略此参数
    // }
    getVideoFromSystem:function(datas){
        var success = datas.success,
            error = datas.error,
            data = datas.param,
            time = datas.times,
            newparams = new CMBCCaptureVideoOptions(),
            filename = DATAHANDLER.fileuuid1();

        success = (typeof(success) == "function") ? success : function(){};
        error = (typeof(error) == "function") ? error : function(){};

        data = ($.isObject(data))?  data : {};
        data = ($.isObject(data.CONF_INIT_VALUE))? data.CONF_INIT_VALUE : data;

        newparams.text = data.PMT;
        newparams.duration = parseInt(time);
        newparams.savePath = ["/cmbc/resource/" + filename + ".mp4"];

        if(newparams.text){
            //强制使用前置摄像加显示文字
            phonegap.capture.superVideo({
                success:success,
                error:error,
                newparams:newparams
            });
        }else{
            //使用原来的方式
            phonegap.capture.video(datas);
        }
    },



    //播放声音文件
    //  datas={
    //      src:str                 声音文件地址
    //      success:function        播放完成执行
    //      error:function          加载失败执行  引擎问题现在error不执行
    //      playind:function        播放中执行
    // }
    playAudio:function(datas){
        phonegap.media.audio.stop();
        phonegap.media.audio.play(datas);
    },
    //停止播放声音文件
    stopAudio:function(){
        phonegap.media.audio.stop();
    },
    //播放视频
    //说明：播放视频会全屏播放，调用系统控件进行控制，停止或结束关闭（停止后，可能需要按backbutton）
    //src:str    视频文件的地址
    playVideo:function(src){
        phonegap.media.video.play(src);
    }



};

//数据库
DATAINTERFACE.sqlite={
    db:null,
    //初始化 库名：cmbc  大小：50M
    initialize:function(){
        this.db = new phone.db("cmbc",50);

        //创建表
        //this.createTable();
        //删除表
        //this.dropTable()
        //批量插入数据
        //this.insertValue()
        //单个查询执行
        //this.exec();
        //单个执行
        //this.insertRowBackId()
        //多个执行
        //this.execs()
    },
    //创建表
    createTable:function(callback){
        var _this = this;
        //个人用户信息放内存
        //产品结构树存文件
        //products产品表： p_id：产品id，p_info：具体信息json对象字符串，p_business_id：对应业务id，p_ver：版本，p_state：是否下载中,p_isnew:是否新产品

        //businesss业务表：b_id：业务id, b_name:业务名，b_template_obj:对应模板id和是否是必填的json对象字符串

        //templates模板表：t_id：模板id，t_name：模板名，t_info：模板信息json对象字符串，t_ver:模板版本号

        //mytemplages任务创建时关联的末班表： m_id:id，m_name：模板名，m_info：模板信息json对象字符串，
        //                                  m_ver:模板版本号,m_task_id:对应任务id,m_clues_id:对应线索id，m_busines_id:对应业务id,m_ismust:是否必填

        //tasks任务表：    t_id:任务id，t_type：任务类型（1精任务，2范任务），t_state:任务状态，t_info：任务信息json对象字符串,
        //                t_clients_id:对应客户数组，t_clues_id：对应线索数组，t_businesss_id:对应业务数组，t_sums_id:对应任务总结数组,
        //                 t_edit:增量标示

        //clues线索表：    c_id:线索id，c_type：线索状态（1自建线索，2任务线索），c_state:线索状态（1有意向，2办理中，3办结，4无意义，5废止），
        //                 c_business_id:对应业务id，c_client_id:对应客户id，c_note_id:对应线索笔记id，
        //                 c_summs_id:对应线索报告id, c_title:线索标题，c_desc：线索描述，
        //                 c_starttime：开始时间，c_endtime: 结束时间，c_edit:是否新增或编辑过,增量上传标示，c_isupdate：是否同步到服务器

        //summaries报告表： s_id,s_content,s_type(类型1任务总结，2线索笔记，3线索总结),s_time:时间,s_edit:增量更新标示,s_isupdate:是否同步到服务器

        //clients客户表：  c_id:客户id，c_info：客户信息json，c_type:类型（行，自，家属），
        //                 c_families_id：家属id数组（家属与客户表中是平级的），c_edit:增量更新标示（只对自建客户）,c_del:删除标示,c_isupdate：是否同步到服务器

        //notices通告，广告表： n_id:id,n_type:类型（1通告，2广告）,n_info:具体信息json对象字符串



        //templagerdata模板数据表：t_id,t_name,t_info,t_ver,t_datatime,t_clues_id:对应线索id,t_busines_id对应业务id,
        //                          t_task_id:对应任务id，t_edit,t_del:删除标示，t_ismust:是否必填，t_iscomplete:是否完成,t_isupdate:是否同步到服务器

        //更新记录表
        //updatatime更新时间戳记录表：u_id,u_name,u_timestamp

        //message实时信息，客户需求表：  m_id:id,m_creater:创建人,m_data：创建时间，m_type:类型（1实时信息，2客户需求），
        //                             m_sendto：接收团队或机构id（在用户个人资料表中），m_info:对话记录，m_edit：增量更新标示




        //文件资源表
        //resources资源表：       r_uuid:模板的uuid，r_id:模板中字段id,r_filename:文件名,r_datatime:时间，r_busines_id:业务id，
        //                        r_clues_id:线索id，r_templager_id:模板id,r_del:是否删除,r_size:资源大小


        //产品对应业务表：
        //productvsbusines：     p_id:产品id，p_name：产品名，b_id：业务id，b_name：业务名


        //任务转发
        //tasktranspond   :    taskid,usercd

        //发送邮件
        //email :     e_id,e_email：邮件地址,e_product_id：产品id,e_other:备用字段


        //创建本地表及字段，字段用默认匹配自适应方式。
        this.db.createTable({
            tableName:["products","businesss","templates","mytemplages","tasks","clues","summaries","clients","notices","templagerdata","updatatime","message","resources","productvsbusines","tasktranspond","email","cache","mylog","searchonlineinfo"],
            fields:[
                //products产品表
                ["p_id","p_name","p_url","p_size","p_no","p_business_id","p_ver","p_state","p_isnew","p_other"],
                //businesss业务表
                ["b_id","b_name","b_template_obj","b_other"],
                //templates模板表
                ["t_id","t_name","t_info","t_ver","t_other"],
                //mytemplages任务创建时关联的末班表
                ["m_id","m_name","m_info","m_ver","m_task_id","m_clues_id","m_busines_id","m_ismust","m_other"],
                //tasks任务表
                ["t_id","t_type","t_state","t_info","t_clients_id","t_clues_id","t_businesss_id","t_sums_id","t_edit","t_other"],
                //clues线索表
                ["c_id","c_type","c_state","c_business_id","c_client_id","c_note_id","c_summs_id","c_title","c_desc","c_starttime","c_endtime","c_edit","c_isupdate","c_del","c_other"],
                //summaries报告表
                ["s_id","s_content","s_type","s_time","s_edit","s_isupdate","s_other"],
                //clients客户表
                ["c_id","c_cd","c_info","c_type","c_families_id","c_edit","c_del","c_isupdate","c_other"],
                //notices通告，广告表
                ["n_id","n_type","n_data","n_info","n_other","n_isreaded"],
                //templagerdata模板数据表
                ["t_uuid","t_id","t_name","t_myname","t_info","t_ver","t_datatime","t_ismust","t_iscomplete","t_clues_id","t_busines_id","t_task_id","t_edit","t_del","t_isupdate","t_other"],
                //updatatime更新时间戳记录表
                ["u_id","u_name","u_timestamp","u_other"],
                //message实时信息，客户需求表
                ["m_id","m_creater","m_data","m_type","m_client_id","m_sendto","m_info","m_edit","m_other","m_isreaded","m_notupno"],
                //resources资源表
                ["r_uuid","r_id","r_filename","r_datatime","r_busines_id","r_clues_id","r_templager_id","r_del","r_size","r_isupdate","r_other"],
                //产品对应业务表
                ["p_id","p_name","b_id","b_other"],
                //任务转发
                ["taskid","usercd","t_other"],
                //邮件发送
                ["e_id","e_email","e_product_id","e_other"],
                //缓存表
                ["c_id","c_data","c_other"],
                //日志表
                ["c_date","c_address","c_content","c_title","c_type","c_state","c_group","c_isupdate","c_edit","c_isdel","c_other"],
                //客户在线信息查询记录表
                ["s_uuid","s_time","s_info","s_title","s_image","s_clientid","s_clienttype","s_issuccess","s_edit","s_del","s_other"]
            ],
            success:function(){
                if(callback){callback();}


            },
            error:function(err){

                DATAINTERFACE.alert({
                    title:CMBC_MESSAGE.sql.title,
                    message:CMBC_MESSAGE.sql.create_table_err
                });

            }
        })
    },
    //删除表
    dropTable:function(callback){
        var _this = this;
        this.db.dropTable({
            tableName:["products","businesss","templates","mytemplages","tasks","clues","summaries","clients","notices","templagerdata","updatatime","message","resources","productvsbusines","tasktranspond","email","cache","mylog"],
            success:function(){
               if(callback){callback();}
            },
            error:function(err){
                alert(err)
            }
        })
    },
    //批量插入
    insertValue:function(datas){
        var _this = this;
        this.db.insertRow({
            tableName:datas.table,      //"d1"
            fields:datas.fields,         //["name","password"]
            values:datas.values,    //[["aa","123"],["bb","222"],["cc","333"]]
            success:function(){
                if(datas.success){
                    datas.success();
                }
            },
            error:function(err){
                if(datas.error){
                    datas.error();
                }
            }
        })
    },
    insertRowBackId:function(datas){
        var _this = this;
        this.db.insertRowBackId({
            tableName:datas.tableName,      //字符
            fields:datas.fields,            //数组
            values:datas.values,            //数组
            success:function(id){
                datas.success(id);
            },
            error:function(err){
                datas.error(err);
            }
        })
    },
    //单个查询用
    //datas={
    //      sql:sql语句,一句。
    //      success：成功回调，返回查询结果
    //      error：失败回调
    // }
    exec:function(datas){
        var _this = this;
        this.db.exec({
            sql:datas.sql,
            success:datas.success,
            /*
            success:function(re){

                for(var i=0;i<re.rows.length;i++){

                }
            },
            error:function(err){
                alert(err)
            }
            */
            error:datas.error
        })
    },
    //多语句 事务里面（不带查询类语句）
    //datas={
    //      sql:array               sql语句，数组形式
    //      success：function       成功回调
    //      error:function          失败回调
    // }
    execs:function(datas){
        var _this = this;
        this.db.execs({
            sql:datas.sql,
            success:datas.success,
            error:datas.error
        })
    }
};

//数据加解密
//// type为：encrypt，decrypt，privateEncrypt，privateDecrypt
DATAINTERFACE.md5 = function(datas){
    var str = datas.str,
        type = datas.type,
        success = datas.success,
        error = datas.error;

    success = (typeof(success) == "function")? success : function(){};
    error = (typeof(error) == "function")? error : function(){};

    if(!$.isArray(str)){error();return;}
    if(!type) {error();return;}


    var newarray = [];

    var go = function(){
        if(str.length == 0){
            success(newarray);
        }else{
            var temp_str = str.shift();
            if(temp_str || temp_str == 0){
                doencode(temp_str);
            }else{
                newarray.push(temp_str);
                go();
            }

        }
    };

    var doencode = function(temp_str){
        var isobject = $.isObject(temp_str),
            thisstr = null;

        if(isobject){
            thisstr = JSON.stringify(temp_str);
        }else{
            thisstr = temp_str;
        }

        phonegap.SecurityCard.md5({
            str:thisstr,
            type:type,
            success:function(rs){
                if(isobject){
                    temp_str.md5 = trim(rs);   //是对象就增加 md5 的 key
                    newarray.push(temp_str);
                }else{
                    newarray.push(trim(rs));
                }
                go();
            },
            error:function(){
                error();
            }
        })
    };
    go();
};

//ajax部分
DATAINTERFACE.ajax={
    handlerData:function(data,successfn,errorfn){
        data = data[0];


        if(parseInt(data.ACTION_RETURN_CODE)==0){
            //success
            if(typeof(successfn)=="function"){
                //json_log(data)
                successfn(data.ACTION_INFO,data.TIMESTAMP);

            }
            //phone.loading.hide()
        }else{
            //error
            if(typeof(errorfn)=="function"){
                errorfn(data.ACTION_RETURN_MESSAGE,data.TIMESTAMP)
            }
            //phone.loading.hide()
        }
    },
    checkNetwork:function(){
        //return (phonegap.checkConnection() && POLYVI.loginstate);
    },
    //检查项目Native安装包更新
    checkAPK:function(datas,successfn,errorfn){
        //phone.loading.show("loading...")
        var _this=this;
        AJAXS("CHECK_PROJ_UPDATE",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })

    },
    //任务指派（转给其他人）
    changeTaskOwner:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("TASK_APPOINT",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    //产品类数据接口
    getProductList:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("PROD_CATEGORY",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    taskDataDownload:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("DOWNLOAD_TASK",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    UserDataDownload:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("DOWNLOAD_USER",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    ClientDataDownload:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("DOWNLOAD_CUST_LIST",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    infoDataDownload:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("DOWNLOAD_NOTICE_LIST",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    checkCode:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("APP_FILE_LIST",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    changePassword:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("USER_INFO",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    downloadResourceFile:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("DOWNLOAD_FILE",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    getServerTime:function(successfn,errorfn){
        var _this=this;
        AJAXTIME(function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    downloadDicInfo:function(datas,successfn,errorfn){
        var _this=this;
        AJAXS("DOWNLOAD_TMPL_DICT",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    onlineSearchUserInfo:function(datas,successfn,errorfn){
        var _this=this;

        AJAXS("CUSTOMER_INFO_SERVICES",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    cluteAudit:function(datas,successfn,errorfn){
        var _this=this;

        AJAXS("DOWNLOAD_CLUT_AUDIT",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    },
    queryCredit:function(datas,successfn,errorfn){
        var _this=this;

        AJAXS("QUERY_CREDIT",datas,function(data){
            _this.handlerData(data,successfn,errorfn);
        })
    }
};

//本地调用数据存取接口
DATAINTERFACE.datas={
    //客户部分==========================================================================
    //获取客户列表
    getClientList:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            type = datas.type,
            back_datas = [];

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        type = type || "2";

        var sql=null;

        if(parseInt(type) ==  1){
            sql = "select *  from clients where c_type != '3' and c_del ISNULL  ";
        }else if(parseInt(type) ==  3){
            sql = "select *  from clients where c_type == '1' and c_del ISNULL  ";
        }else{
            sql = "select *  from clients where c_type == '2' and c_del ISNULL  ";
        }



        DATAINTERFACE.sqlite.exec({
            sql:sql,
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var temp_a = (rs.rows.item(i).c_info)? eval('('+rs.rows.item(i).c_info+')') : {};
                    back_datas.push(temp_a);
                }

                success1(back_datas);

            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })

    },
    //获取客户表单模板
    getClientFrom:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            filename = "s_CUSTSYS.txt";

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        var getindex = function(){
            DATAINTERFACE.file.read({
                dir:"datas",
                filename:filename,
                success:function(data){
                    var backdata = (data)? eval('('+data+')') : {};
                    if(backdata.CUSTINFO){
                        backdata = backdata.CUSTINFO;
                        success1(backdata);
                    }else{
                        error1("客户表单数据格式错误！");
                    }
                },
                error:function(){
                    error1("读取客户表单数据失败！");
                }
            })
        };

        getindex();
    },
    //获取客户详细信息
    getClientInfo:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            ids = datas.clientId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!ids){alert("参数错误！");error1();return;}

        var familyids = null,
            client = null,              //客户信息 输出
            familyinfo = [];            //家庭成员 输出

        //获取客户信息
        var getclinetinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id  = '"+ids+"' and c_del ISNULL  ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("未找到客户信息！");return;}
                    familyids = (rs.rows.item(0).c_families_id)? eval('('+rs.rows.item(0).c_families_id+')') : [];
                    client = (rs.rows.item(0).c_info)? eval('('+rs.rows.item(0).c_info+')') : {};

                    getfamilyinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取家庭成员信息
        var getfamilyinfo = function(){
            var temp_family_ids = "'"+familyids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id  in ("+temp_family_ids+") and c_del ISNULL  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var temp_a = (rs.rows.item(i).c_info)?  eval('('+rs.rows.item(i).c_info+')') : {};
                        familyinfo.push(temp_a);
                    }
                    datahandler();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //输出对象
        var datahandler = function(){
            var backdata = {};
            backdata.client = client;
            backdata.family = familyinfo;
            success1(backdata);
        };

        getclinetinfo();

    },
    //新建，修改用户信息
    saveClientinfo:function(datas){
        var clientinfo = datas.client,
            familyinfo = datas.family,
            success1 = datas.success,
            error1 = datas.error,
            checkfamily = true;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!$.isObject(clientinfo)){alert("参数错误！");error1();return;}
        if(!$.isArray(familyinfo)){alert("参数错误！");error1();return;}
        if(!clientinfo.CUST_NAME){error1(CMBC_MESSAGE.sql.save_client_name_isnull);return;}
        if(! parseInt(clientinfo.TYPE) == 2 ){error1(CMBC_MESSAGE.sql.save_client_name_isnull);return;}
        if(familyinfo.length!=0){
            for(var i= 0,l=familyinfo.length;i<l;i++){
                if(!familyinfo[i].CUST_NAME || parseInt(familyinfo[i].TYPE) != 3 ){
                    checkfamily = false;
                    break;
                }
            }
        }
        if(!checkfamily){error1(CMBC_MESSAGE.sql.save_client_name_isnull);return;}

        var newfamilys = [],
            useuuid = null,
            useuuid_last = null;

        //获取最大的uuid
        var getmaxclientid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(c_id) as cid from clients",
                success:function(rs){
                    var maxuuid = (rs.rows.item(0).cid)? rs.rows.item(0).cid : "10000000000000000000" ;
                    var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                        max_uuid = parseInt(maxuuid.substr(7)),
                        this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

                    if(this_uuid<=max_uuid){ this_uuid = max_uuid; }
                    useuuid_last = this_uuid_last;
                    useuuid = this_uuid;

                    go();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            });
        };



        var go = function(){
           if(familyinfo.length == 0){
               //插入客户信息
                insterclientdata();
           }else{
              //插入家属信息
               var thisfamilydata = familyinfo.shift();
                insertfamilydata(thisfamilydata);
           }
        };


        var insertfamilydata = function(data){
            var thisid = null,
                thistype = '3',
                thisinfo = data,
                thisedit = '1';

            useuuid += 1;
            thisid = useuuid_last+useuuid.toString();
            thisinfo.CUST_ID = thisid;
            thisinfo = JSON.stringify(thisinfo);
            //数据插入

            DATAINTERFACE.sqlite.exec({
                sql:"insert into clients(c_id,c_info,c_type,c_edit) values('"+thisid+"','"+thisinfo+"','"+thistype+"','"+thisedit+"')",
                success:function(){
                    newfamilys.push(thisid);
                    go();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            });
        };

        var insterclientdata = function(){
            var c_id=null,
                c_lx=null,
                c_type = "2",
                c_families_id = newfamilys,
                c_edit = '1',
                c_info = clientinfo;
            if(clientinfo.CUST_ID){
                c_lx = true;
                c_id = clientinfo.CUST_ID;
            }else{
                useuuid += 1;
                c_lx = false;
                c_id = useuuid_last+useuuid.toString();
            }
            c_info.FAMILIES = newfamilys;
            c_info.CUST_ID = c_id;
            var temp_add_name = c_info.CUST_NAME;
            c_info = JSON.stringify(c_info);
            c_families_id = JSON.stringify(c_families_id);

            if(c_lx){
                //获取老的家属ids
                var getoladfamilys = function(){
                    DATAINTERFACE.sqlite.exec({
                        sql:"select * from clients where c_id = '"+c_id+"' ",
                        success:function(rs){
                            if(rs.rows.length == 0){error1("数据为空！");return;}
                            if(parseInt(rs.rows.item(0).c_type) != 2){error1("非自建客户信息不能修改！");return;}

                            var oldfamiles = (rs.rows.item(0).c_families_id)?  eval('('+rs.rows.item(0).c_families_id+')') : [];
                            updatenewclient(oldfamiles);
                        },
                        error:function(){
                            error1(CMBC_MESSAGE.sql.select_err);
                        }
                    });
                };

                //更新客户信息  删除不用的老的家属
                var updatenewclient = function(old){
                    var sqls=[];
                    sqls.push("update clients set c_info='"+c_info+"',c_type='"+c_type+"',c_families_id='"+c_families_id+"',c_edit='"+c_edit+"' where c_id = '"+c_id+"' ");

                    for(var i= 0,l=old.length;i<l;i++){
                        sqls.push("update clients set c_del ='1' where c_id = '"+old[i]+"'  ")
                    }
                    DATAINTERFACE.sqlite.execs({
                        sql:sqls,
                        success:function(){
                            success1(c_id);
                        },
                        error:function(){
                            error1(CMBC_MESSAGE.sql.select_err);
                        }
                    });
                };

                getoladfamilys();

            }else{
                //新增客户
                var t_sql = [];
                t_sql.push("insert into clients(c_id,c_info,c_type,c_families_id,c_edit) values('"+c_id+"','"+c_info+"','"+c_type+"','"+c_families_id+"','"+c_edit+"')");

                //写日志
                var log_title = CMBC_MESSAGE.sysLogtype.t3,
                    log_data = {
                        clientid:c_id,
                        clientname:temp_add_name,
                        typename:CMBC_MESSAGE.sysLogtype.t3
                    },
                    log_group = CMBC_MESSAGE.sysLogGroup.g6,
                    log_info = CMBC_MESSAGE.sysLogtype.m3({username:temp_add_name}),
                    nowtime = new Date().getTime(),
                    address = phonegap.getMyAddressPoint(),
                    log_other = JSON.stringify(log_data);

                t_sql.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+nowtime+"','"+address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );

                DATAINTERFACE.sqlite.execs({
                    sql:t_sql,
                    success:function(){
                        success1(c_id);
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                });
            }
        };

        getmaxclientid();

    },
    //获取客户办理业务清单
    getBusinesForClient:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clientid = datas.clientId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clientid){alert("参数错误！");error1();return;}

        var cluesobj = [],   //temp 线索--业务
            busineids = [],     //temp 业务ids
            productobj = {},    //temp 产品
            cluesids = [],      //temp 线索ids
            templateobj = {},   //temp 数据
            businesobj = {};    //temp 业务


        //获取业务ids，线索ids
        var getbusinesids = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_client_id  = '"+clientid+"'  ",
                success:function(rs){
                    if(rs.rows.length == 0){
                        success1([]);
                    }else{
                        for(var i= 0,l=rs.rows.length;i<l;i++){
                            var business = (rs.rows.item(i).c_business_id)? eval('('+rs.rows.item(i).c_business_id+')') : [],
                                clueid = rs.rows.item(i).c_id;

                            cluesids.push(clueid);
                            if(!cluesobj[clueid]){cluesobj[clueid]={}}
                            for(var z= 0,zl=business.length;z<zl;z++ ){
                                cluesobj[clueid][business[z]] = business[z];
                                busineids.push(business[z]);
                            }
                        }
                        getproductinfo();
                    }

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取产品信息
        var getproductinfo = function(){
            var temp_b_ids = "'"+busineids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from productvsbusines where b_id in ("+temp_b_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var temp_b_id = rs.rows.item(i).b_id,
                            temp_p_name = rs.rows.item(i).p_name;

                        productobj[temp_b_id] = temp_p_name;
                    }

                    gettemplatedata();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取模板数据填写情况
        var gettemplatedata = function(){
            var temp_c_ids = "'"+cluesids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from templagerdata where t_clues_id in ("+temp_c_ids+") and t_del is null  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisiscomplate = rs.rows.item(i).t_iscomplete,
                            thisclueid = rs.rows.item(i).t_clues_id,
                            thisbusinesid = rs.rows.item(i).t_busines_id;

                        if(!templateobj[thisclueid]){
                            templateobj[thisclueid]={};
                        }
                        if(!templateobj[thisclueid][thisbusinesid]){
                            templateobj[thisclueid][thisbusinesid] = "1";
                        }
                        if(thisiscomplate == '0'){
                            templateobj[thisclueid][thisbusinesid] = "0";
                        }

                    }

                    getbusinesname();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取业务名
        var getbusinesname = function(){
            var temp_b_ids = "'"+busineids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from businesss where b_id in ("+temp_b_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var temp_b_id = rs.rows.item(i).b_id,
                            temp_b_name = rs.rows.item(i).b_name;

                        businesobj[temp_b_id] = temp_b_name;
                    }

                    datahandler();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //数据处理
        var datahandler = function(){
            var backdata = [];

            for(var key in cluesobj){
                var tempdata = cluesobj[key];
                for(var key1 in tempdata){
                    var this_p_name = productobj[key1],
                        this_b_name = businesobj[key1],
                        this_b_state = null,
                        thisclue = templateobj[key];
                    if(thisclue){
                        this_b_state = thisclue[key1];
                    }else{
                        this_b_state = "0";
                    }

                    backdata.push({
                        PROD_NAME : this_p_name,
                        BUSI_NAME : this_b_name,
                        BUSI_STATE : this_b_state
                    })
                }
            }

            success1(backdata);
        };

        getbusinesids();
    },
    //检查密码
    checkPassword:function(password){
        if(!CMBC.pass){return false;}
        if(!password){return false;}
        if(trim(CMBC.pass) == trim(password)){
            return true;
        }else{
            return false;
        }
    },
    //删除自建客户
    delClient:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            ids = datas.clientId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!ids){alert("参数错误！");error1();return;}

        var isupdate = null;

        var getclinetInfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id  = '"+ids+"' and c_del ISNULL  ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("未找到客户信息！");return;}
                    if(parseInt(rs.rows.item(0).c_type) != 2){
                        error1("非自建客户不能删除！");return;
                    }
                    isupdate = (rs.rows.item(0).c_isupdate)? true : false;

                    checkclues();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var checkclues = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_client_id  = '"+ids+"' and c_del ISNULL  ",
                success:function(rs){
                    if(rs.rows.length >= 1){error1("该客户已与线索关联，不能删除！");return;}

                    delclients();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var delclients = function(){
            var sqls = null;
            if(isupdate){
                sqls = "update clients set c_del = '1' where  c_id  = '"+ids+"'   ";
            }else{
                sqls = "delete from clients where c_id  = '"+ids+"' ";
            }


            DATAINTERFACE.sqlite.exec({
                sql:sqls,
                success:function(){
                    success1("删除自建客户成功！");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getclinetInfo();
    },
    //客户在线查询前拍照  //废弃 接口已变更
    getImageForSerachInfo:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};





        DATAINTERFACE.media.getImageFromCamera({
            success:function(src){
                var backfilename = DATAHANDLER.fileuuid1()+src.substr(src.lastIndexOf(".")),
                    filename = DATAINTERFACE.directory.resource.fullPath+"/"+backfilename;

                xFace.CMBC.file.copyFileToXApp(src,filename,function(){
                    success1(backfilename);
                    /*
                     if(audioname){
                     DATAINTERFACE.file.del({
                     dir:"resource",
                     file:audioname,
                     success:function(){
                     success1(backfilename);
                     },
                     error:function(){
                     success1(backfilename);
                     }
                     });
                     }else{
                     success1(backfilename);
                     }
                     */
                },function(){
                    error1("保存图片失败");
                });

            },
            error:function(){
                error1("存储图片失败");
            }
        });
    },
    //删除照片
    delImageForSearch:function(datas){
        var success1 = datas.success,
            //error1 = datas.error,
            filename = datas.fileName;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if(!filename){error1("缺少参数！");return;}

        DATAINTERFACE.file.del({
            dir:"resource",
            file:filename,
            success:function(){
                success1("");
            },
            error:function(){
                success1("");
            }
        });
    },
    //存储在线查询信息
    saveClientOnlineSearchInfo:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            ajaxback = datas.ajaxBack,
            clientid = datas.clientId,
            ajaxstate = datas.ajaxState,
            imagesrc = datas.imageSrc;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if(!ajaxback || !clientid || !ajaxstate || !imagesrc){error1("缺少参数");return;}

        var clientname = null,
            clienttype = null,
            maxuuid = null;



        var getclientinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id  = '"+clientid+"' and c_del ISNULL  ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("未找到客户信息！");return;}
                    clientname = (rs.rows.item(0).c_info)? evel('('+rs.rows.item(0).c_info+')') : {};
                    clientname = (clientname.CUST_NAME)? clientname.CUST_NAME : "";
                    clienttype = rs.rows.item(0).TYPE;

                    getmaxuuid();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            });
        };

        var getmaxuuid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(s_uuid) as maxid  from searchonlineinfo  ",
                success:function(rs){
                    var thisid = rs.rows.item(0);

                    maxuuid = DATAHANDLER.getUUID(thisid);

                    saveinfo();


                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        var saveinfo = function(){
            var thistime = new Date().getTime(),
                thistitle = stamp2time(thistime)+" 查询了 "+clientname+" 的信息",
                thisid = maxuuid,
                thisresult = ajaxback,
                thisimage = imagesrc,
                thisclientid = clientid,
                thisclienttype = clienttype,
                thisissuccess = (ajaxstate) ? 1 : 0,
                thisedit = "1";

            DATAINTERFACE.sqlite.exec({
                sql:"insert into searchonlineinfo(s_uuid,s_time,s_info,s_title,s_image,s_clientid,s_clienttype,s_issuccess,s_edit) values('"+thisid+"','"+thistime+"','"+thisresult+"','"+thistitle+"','"+thisimage+"','"+thisclientid+"','"+thisclienttype+"','"+thisissuccess+"','"+thisedit+"')  ",
                success:function(rs){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        getclientinfo();
    },


    //任务部分==========================================================================
    //获取任务列表
    getTaskList:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};


        var arrayDesc = function(a,b){
            var as = a.CREATE_DATE,
                bs = b.CREATE_DATE;

            var a_l=as.length,
                b_l=bs.length;
            if(a_l==0 && b_l==0){ return 0;}
            var s=(a_l>b_l)? a_l : b_l,
                aa= 0,
                bb=0;
            for(i=0;i<s;i++){
                if(i+1>a_l){aa=1;bb=0;break;}
                if(i+1>b_l){aa=0;bb=1;break;}
                if(as.charCodeAt(i)>bs.charCodeAt(i)){aa=1;bb=0;break;}
                if(as.charCodeAt(i)<bs.charCodeAt(i)){aa=0;bb=1;break;}
            }

            return bb-aa;
        };


        DATAINTERFACE.sqlite.exec({
            sql:"select *  from tasks  order by tasks_id desc",
            success:function(rs){
                var backdata = [];
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = (rs.rows.item(i).t_info)? eval('('+rs.rows.item(i).t_info+')') : {};
                    if( parseInt(thisdata.TASK_STATUS) != 3 && thisdata.END_DATE){
                        var thistime = new Date().getTime();
                        var taskendtime = parseInt(thisdata.END_DATE);
                        if(thistime>taskendtime){
                            thisdata.TASK_STATUS = 4;
                        }
                    }
                    backdata.push(thisdata);
                }

                backdata.sort(arrayDesc);
                success1(backdata);

            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //任务执行
    taskdo:function(datas){
        var id = datas.id,
            success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!id){alert("缺少参数！");error1();return;}

        var task_busines = [],
            task_type = null,
            task_state = null,
            sqls = [],
            maxcluesid = "10000000000000000000",
            maxtemplateid = "10000000000000000000",
            businestemplate = {},
            select_templates = [],
            templates_info = {},
            task_busines_str = null,
            task_clients = [],
            task_start_time =null,
            task_end_time =null,
            task_info = null,
            task_clients_obj = {};




        //获取任务信息
        var gettaskinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from tasks where t_id = '"+id+"' ",
                success:function(rs){
                    if(rs.rows.length == 0){alert("该任务不存在，已被删除！");error1();return;}
                    task_busines_str = rs.rows.item(0).t_businesss_id;
                    task_busines = (rs.rows.item(0).t_businesss_id)? eval('('+rs.rows.item(0).t_businesss_id+')') : [];
                    task_type = rs.rows.item(0).t_type;
                    task_state = rs.rows.item(0).t_state;
                    task_clients = (rs.rows.item(0).t_clients_id)? eval('('+rs.rows.item(0).t_clients_id+')') : [];
                    task_info = (rs.rows.item(0).t_info)? eval('('+rs.rows.item(0).t_info+')') : {};
                    task_start_time = task_info.CREATE_DATE;
                    task_end_time = task_info.END_DATE;

                    if(parseInt(task_state) !=1 ){alert("该任务已经执行了！");error1();return;}
                    var temp_a = (rs.rows.item(0).t_clients_id)? eval('('+rs.rows.item(0).t_clients_id+')') : [];
                    getclientname(temp_a);

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取客户信息
        var getclientname = function(data){
            if(data.length = 0){
                getcluesmaxid();
            }else{
                var select_clients_info = "'"+data.join("','")+"'";
                DATAINTERFACE.sqlite.exec({
                    sql:"select *  from clients where c_id in ("+select_clients_info+") ",
                    success:function(rs){
                        for(var i= 0,l=rs.rows.length;i<l;i++){
                            var select_client_id = rs.rows.item(i).c_id,
                                select_client_name = (rs.rows.item(i).c_info) ? eval('('+rs.rows.item(i).c_info+')').CUST_NAME : "";

                            task_clients_obj[select_client_id] = select_client_name;
                        }

                        getcluesmaxid();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }

        };

        //获取线索的最大id值
        var getcluesmaxid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(c_id) as tt  from clues ",
                success:function(rs){
                    if(rs.rows.length != 0){
                        maxcluesid = (rs.rows.item(0).tt) ? rs.rows.item(0).tt : maxcluesid;
                    }

                    gettemplateid();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取模板的最大id值
        var gettemplateid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(t_uuid) as tt  from templagerdata ",
                success:function(rs){
                    if(rs.rows.length != 0){
                        maxtemplateid = ( rs.rows.item(0).tt ) ? rs.rows.item(0).tt : maxtemplateid ;

                    }

                    getbusinestemplate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };



        //获取任务下业务对应的模板id
        var getbusinestemplate = function(){
            var templates = "'"+task_busines.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select * from businesss where b_id in ("+templates+") ",
                success:function(rs){
                    var length = rs.rows.length;

                    for(var i=0;i<length;i++){
                        var temp_template = (rs.rows.item(i).b_template_obj)? eval('('+rs.rows.item(i).b_template_obj+')') : [],
                            b_id = rs.rows.item(i).b_id;

                        if(!businestemplate[b_id]){businestemplate[b_id] = {}}

                        for(var z= 0,zl=temp_template.length;z<zl;z++){
                            var thisobj = temp_template[z],
                                this_t_id = thisobj.TMPL_ID,
                                this_t_ismust = thisobj.IS_MUST;

                            if(!businestemplate[b_id][this_t_id]){businestemplate[b_id][this_t_id]={}}
                            businestemplate[b_id][this_t_id].ismust = this_t_ismust;
                            select_templates.push(this_t_id);
                        }
                    }

                    gettemplateinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })


        };

        //获取模板具体内容
        var gettemplateinfo = function(){
            var temp_templates1 = "'"+select_templates.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *   from templates where t_id in ("+temp_templates1+") ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var t_id = rs.rows.item(i).t_id,
                            t_name = rs.rows.item(i).t_name,
                            t_info = rs.rows.item(i).t_info,
                            t_ver = rs.rows.item(i).t_ver;

                        templates_info[t_id]={
                            t_id : t_id,
                            t_name : t_name,
                            t_info : t_info,
                            t_ver :t_ver
                        }
                    }

                    createsql();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //拼装sql，执行
        var createsql = function(){
            var create_clues_ids = [],
                temp_template_data = [];


            //插入关于任务的临时模板表
            for(var key in businestemplate){
                var this_b_id = key,
                    this_b_obj = businestemplate[key];

                for(var key1 in this_b_obj){
                    var this_t_id = key1,
                        this_t_obj = this_b_obj[key1],
                        this_t_ismust = this_t_obj.ismust,
                        this_t_name = templates_info[this_t_id].t_name,
                        this_t_info = templates_info[this_t_id].t_info,
                        this_t_ver = templates_info[this_t_id].t_ver,
                        this_task_id = id,
                        this_busines_id = this_b_id;
                    temp_template_data.push({
                        this_t_id:this_t_id,
                        this_t_name:this_t_name,
                        this_t_ver:this_t_ver,
                        this_t_task:this_task_id,
                        this_t_busines:this_busines_id,
                        this_t_ismust:this_t_ismust
                    });

                    sqls.push(" insert into mytemplages(m_id,m_name,m_info,m_ver,m_task_id,m_busines_id,m_ismust)  values('"+this_t_id+"','"+this_t_name+"','"+this_t_info+"','"+this_t_ver+"','"+this_task_id+"','"+this_busines_id+"','"+this_t_ismust+"')")
                }
            }




            //插入线索, 生成必填的模板的空数据
            if(parseInt(task_type) == 1 ){
                //精任务,自动生成线索。

                //判断uuid
                var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                    max_uuid = parseInt(maxcluesid.substr(7)),
                    max1_uuid = parseInt(maxtemplateid.substr(7)),
                    this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

                if(this_uuid<=max_uuid){ this_uuid = max_uuid; }
                if(this_uuid<=max1_uuid) {this_uuid = max1_uuid;}

                for(var i= 0,l=task_clients.length;i<l;i++){
                    this_uuid += 1;
                    var c_id = this_uuid_last+this_uuid.toString(),
                        c_type = '2',
                        c_state = '1',
                        c_business_id = task_busines_str,
                        c_client_id = task_clients[i],
                        c_title = task_clients_obj[c_client_id],
                        c_desc = task_clients_obj[c_client_id],
                        c_starttime = new Date().getTime(),
                        c_endtime = "",
                        c_edit = '1';

                    create_clues_ids.push(c_id);
                    sqls.push("insert into clues(c_id,c_type,c_state,c_business_id,c_client_id,c_title,c_desc,c_starttime,c_endtime,c_edit)  values('"+c_id+"','"+c_type+"','"+c_state+"','"+c_business_id+"','"+c_client_id+"','"+c_title+"','"+c_desc+"','"+c_starttime+"','"+c_endtime+"','"+c_edit+"') ")

                    //生成必填的模板的空数据

                    for(var z= 0,zl=temp_template_data.length;z<zl;z++){
                        var thisdata = temp_template_data[z];
                        if(thisdata.this_t_ismust == "1"){
                            this_uuid += 1;
                            var t_uuid = this_uuid_last+this_uuid.toString(),
                                t_id = thisdata.this_t_id,
                                t_name = thisdata.this_t_name,
                                t_ver = thisdata.this_t_ver,
                                t_datatime = new Date().getTime(),
                                t_ismust = thisdata.this_t_ismust,
                                t_iscomplete = '0',
                                t_clues_id = c_id,
                                t_busines_id = thisdata.this_t_busines,
                                t_task_id = id,
                                t_edit = '1';

                            sqls.push("insert into templagerdata(t_uuid,t_id,t_name,t_ver,t_datatime,t_ismust,t_iscomplete,t_clues_id,t_busines_id,t_task_id,t_edit) values('"+t_uuid+"','"+t_id+"','"+t_name+"','"+t_ver+"','"+t_datatime+"','"+t_ismust+"','"+t_iscomplete+"','"+t_clues_id+"','"+t_busines_id+"','"+t_task_id+"','"+t_edit+"') " );
                        }
                    }


                }
            }

            //修改任务信息
            var this_task_info = task_info,
                this_t_state = '2',
                this_t_clues_id = JSON.stringify(create_clues_ids),
                this_t_edit = '1';
            this_task_info.CLUES = create_clues_ids;
            this_task_info.TASK_STATUS = this_t_state;
            this_task_info = JSON.stringify(this_task_info);

            sqls.push(" update tasks set t_state='"+this_t_state+"',t_info='"+this_task_info+"',t_clues_id='"+this_t_clues_id+"',t_edit='"+this_t_edit+"'  where t_id = '"+id+"'  ");


            //记录日志
            var log_title = CMBC_MESSAGE.sysLogtype.t5,
                log_data = {
                    taskid:task_info.TASK_ID,
                    tasktype:task_info.TYPE,
                    createclueid:task_info.CLUES,
                    createclientid:task_info.CUSTS,
                    taskname:task_info.TASK_NAME,
                    typename:CMBC_MESSAGE.sysLogtype.t5
                },
                log_group = CMBC_MESSAGE.sysLogGroup.g2,
                log_info = CMBC_MESSAGE.sysLogtype.m5(log_data),
                log_nowtime = new Date().getTime(),
                log_address = phonegap.getMyAddressPoint(),
                log_other = JSON.stringify(log_data);

            sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );



            //执行
            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })

        };

        gettaskinfo();
    },
    //任务转发
    taskTranspond:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            taskid = datas.taskId,
            usercd = datas.userCd+"";

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!taskid){alert("参数错误");return;}
        if(!usercd){alert("参数错误");return;}

        if(usercd.length != 10){error1("请输入10位员工号！");return;}
        usercd = usercd.toUpperCase();

        if(!DATAINTERFACE.datas.userInfo){alert("你还未登录！");return;}
        if(DATAINTERFACE.datas.userInfo.USER_CD == usercd){
            error1("您不能将任务转给自己！");
            return;
        }

        var taskinfo = null;

        var gettaskinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from tasks where t_id = '"+taskid+"'   ",
                success:function(rs){
                    var length = rs.rows.length;
                    if(length != 1){ error1("数据不存在！");return;}
                    //任务要为新任务
                    var type = parseInt(rs.rows.item(0).t_state);
                    if(type != 1){
                        error1("任务已执行！");return;
                    }
                    //任务要是范任务
                    var lx = parseInt(rs.rows.item(0).t_type);
                    if(lx != 2){
                        error1("任务必须是泛任务才能转派！");return;
                    }

                    taskinfo = (rs.rows.item(0).t_info)? eval('('+rs.rows.item(0).t_info+')') : {};
                    taskhandler();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var taskhandler = function(){
            var sqls = [];
            taskinfo.TASK_STATUS = 3;
            var temp_info = JSON.stringify(taskinfo);
            sqls.push("insert into tasktranspond(taskid,usercd) values('"+taskid+"','"+usercd+"')  ");
            sqls.push(" update tasks set t_state = '3',t_info='"+temp_info+"',t_edit='1' where t_id = '"+taskid+"' ");

            //系统日志
            var log_title = CMBC_MESSAGE.sysLogtype.t16,
                log_data = {
                    taskid:taskinfo.TASK_ID,
                    tasktype:taskinfo.TYPE,
                    taskname:taskinfo.TASK_NAME,
                    receivercd:usercd,
                    typename:CMBC_MESSAGE.sysLogtype.t16
                },
                log_group = CMBC_MESSAGE.sysLogGroup.g2,
                log_info = CMBC_MESSAGE.sysLogtype.m16(log_data),
                log_nowtime = new Date().getTime(),
                log_address = phonegap.getMyAddressPoint(),
                log_other = JSON.stringify(log_data);

            sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );




            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })

        };

        gettaskinfo();
    },
    //任务详细信息
    getTaskInfo:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            taskid = datas.taskId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!taskid){alert("参数错误");error1();return;}

        var clueids = [],
            businesids = [],
            clientids = [],
            taksinfo = null,       //任务基础信息  输出
            cluesobj = {},          //线索下业务  temp
            businesobj = {},        //业务对象  temp
            clientobj = {},         //客户对象  输出
            complate_busines = {},   //完成的业务数
            all_busines = {},       //任务下还存在的业务
            doing_cluessids = [];      //执行中的线索ids


        //获取任务信息
        var getcluesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from tasks where t_id = '"+taskid+"' ",
                success:function(rs){
                    if(rs.rows.length != 1){alert("该任务不存在，已被删除！");error1();return;}
                    //获取线索数组
                    var clues = (rs.rows.item(0).t_clues_id)? eval('('+rs.rows.item(0).t_clues_id+')') : [];
                    for(var i= 0,l=clues.length;i<l;i++){
                        clueids.push(clues[i]);
                    }
                    //获取业务数组
                    var busines = (rs.rows.item(0).t_businesss_id) ? eval('('+rs.rows.item(0).t_businesss_id+')') : [];
                    for(var z= 0,zl=busines.length;z<zl;z++){
                        businesids.push(busines[z]);
                    }
                    //获取客户数组
                    var clients= (rs.rows.item(0).t_clients_id)? eval('('+rs.rows.item(0).t_clients_id+')') : [];
                    for(var b= 0,bl=clients.length;b<bl;b++){
                        clientids.push(clients[b]);
                    }
                    //任务基本信息
                    taksinfo = (rs.rows.item(0).t_info)? eval('('+rs.rows.item(0).t_info+')') : {};
                    getbusinesinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取任务下的业务信息
        var getbusinesinfo = function(){
            var temp_busines_ids = "'"+businesids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from businesss where b_id  in ("+temp_busines_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var this_b_id = rs.rows.item(i).b_id,
                            this_b_name = rs.rows.item(i).b_name;
                        businesobj[this_b_id] = this_b_name;
                    }
                    getclientinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取客户信息
        var getclientinfo = function(){
            if(clientids.length == 0){getbusinsefortask();return;}
            var temp_clients_ids = "'"+clientids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id  in ("+temp_clients_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var this_c_id = rs.rows.item(i).c_id,
                            this_c_info = (rs.rows.item(i).c_info) ? eval('('+rs.rows.item(i).c_info+')'):{};

                        clientobj[this_c_id] = this_c_info;
                    }

                    getbusinsefortask();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取任务下的业务总数  执行中的线索ids  非执行中的线索总数（当完成）
        var getbusinsefortask = function(){
            var temp_c_ids = "'"+clueids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:" select * from clues where c_id in ("+temp_c_ids+") ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i),
                            business = (thisdata.c_business_id)? eval('('+(thisdata.c_business_id)+')') : [],
                            c_state = parseInt(thisdata.c_state),
                            c_id = thisdata.c_id;

                        //累加线索中的业务数
                        for(var z= 0,zl=business.length;z<zl;z++){
                            var this_b_id = business[z],
                                old_n = (all_busines[this_b_id])? all_busines[this_b_id] : 0;

                            all_busines[this_b_id] = old_n + 1;

                            //线索为非办理中的 业务算完成
                            if(c_state != 2 ){
                                var old_cn = (complate_busines[this_b_id])? complate_busines[this_b_id] : 0;
                                complate_busines[this_b_id] = old_cn + 1;
                            }
                        }

                        //办理中的线索
                        if(c_state == 2){
                            doing_cluessids.push(c_id);
                        }

                    }

                    getbusinessinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取执行中的线索下的业务已完成的数量
        var getbusinessinfo = function(){
            var t_clues_ids = "'"+doing_cluessids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select sum(1) as total,sum(t_iscomplete) as complate,t_busines_id,t_clues_id  from templagerdata where t_clues_id in ("+t_clues_ids+") and t_del is null  GROUP BY t_busines_id,t_clues_id ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i);
                        if(thisdata.total == thisdata.complate){
                            var old_n = (complate_busines[thisdata.t_busines_id])? complate_busines[thisdata.t_busines_id] : 0;
                            complate_busines[thisdata.t_busines_id] = old_n + 1;
                        }
                    }

                    handlerdata();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //处理数据
        var handlerdata = function(){
            //获取完成的业务
            var backbusin = {};

            for(var i= 0,l=businesids.length;i<l;i++){
                var this_b_id = businesids[i];

                backbusin[this_b_id] = {
                    name : (businesobj[this_b_id])? businesobj[this_b_id] : "",
                    all : (all_busines[this_b_id])? all_busines[this_b_id] : "",
                    complate : (complate_busines[this_b_id])? complate_busines[this_b_id] : ""
                }
            }

            success1({
                busines:backbusin,
                clients:clientobj,
                taskinfo:taksinfo
            });
        };

        getcluesinfo();
    },
    //修改任务状态
    changeTaskState:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            taskid = datas.taskId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!taskid){alert("参数错误");error1();return;}


        var taskinfo = null,
            cluesids = null;

        //检查任务状态
        var  checktask = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from tasks  where t_id = '"+taskid+"'    ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("该任务不存在！");return;}
                    var thisstate = rs.rows.item(0).t_state;
                    if(thisstate =='2' || thisstate == '4'){}else{error1("该任务已是完成状态！");return;}
                    taskinfo = (rs.rows.item(0).t_info)? eval('('+rs.rows.item(0).t_info+')') : {};
                    cluesids = (rs.rows.item(0).t_clues_id)? eval('('+rs.rows.item(0).t_clues_id+')') : [];

                    checkcluesstate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //检查线索是否是执行中,非执行中可以完成，不用关模板填写是否完成
        //变更为检查线索是不是办结或废止
        var checkcluesstate = function(){
            var thiscluesids = "'"+cluesids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_id in ("+thiscluesids+") and  c_state  not in  ('6','9')    ",
                success:function(rs){
                    if(rs.rows.length == 0){
                        go();
                    }else{
                        error1("该任务下还有线索未完成！")
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //执行
        var go = function(){
            var temp_info = taskinfo;
            temp_info.TASK_STATUS = 3;
            temp_info = JSON.stringify(temp_info);

            var c_sql = [];
            c_sql.push("update tasks set t_state = '3',t_info='"+temp_info+"',t_edit = '1'  where t_id = '"+taskid+"'     ");

            //记录日志
            var log_title = CMBC_MESSAGE.sysLogtype.t6,
                log_data = {
                    taskid:taskinfo.TASK_ID,
                    tasktype:taskinfo.TYPE,
                    taskname:taskinfo.TASK_NAME,
                    taskstate:taskinfo.TASK_STATUS,
                    typename:CMBC_MESSAGE.sysLogtype.t6
                },
                log_group = CMBC_MESSAGE.sysLogGroup.g2,
                log_info = CMBC_MESSAGE.sysLogtype.m6(log_data),
                log_nowtime = new Date().getTime(),
                log_address = phonegap.getMyAddressPoint(),
                log_other = JSON.stringify(log_data);

            c_sql.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );




            DATAINTERFACE.sqlite.execs({
                sql:c_sql,
                success:function(){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        checktask();

    },
    //任务总结保存
    saveTaskSummary:function(datas){
        var cluesdata = datas.taskNoteData,
            cluesnoteid = datas.taskNoteId,
            cluesId = datas.taskId,
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if( cluesId ){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        var maxuuid = "10000000000000000000",
            sqls = [],
            taskinfo = null;

        if(cluesnoteid){
            //修改线索笔记
            DATAINTERFACE.sqlite.exec({
                sql:"update summaries set s_content = '"+cluesdata+"' where s_id = '"+cluesnoteid+"' ",
                success:function(){
                    success1(cluesnoteid);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        }else{
            //新建线索笔记

            //获取报告的最大uuid
            var getmaxuuid = function(){
                DATAINTERFACE.sqlite.exec({
                    sql:"select max(s_id) as tt from summaries ",
                    success:function(rs){
                        maxuuid = (rs.rows.item(0).tt) ? rs.rows.item(0).tt : maxuuid ;
                        gettaskinfo();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            };

            //获取任务的信息
            var gettaskinfo = function(){
                DATAINTERFACE.sqlite.exec({
                    sql:"select *  from tasks where t_id = '"+cluesId+"' ",
                    success:function(rs){
                        if(rs.rows.length != 1){error1("任务已被删除！");return;}
                        taskinfo = (rs.rows.item(0).t_info)? eval('('+rs.rows.item(0).t_info+')') : {};
                        savecluesnote();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            };

            //写入数据
            var savecluesnote = function(){
                //判断uuid
                var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                    max_uuid = parseInt(maxuuid.substr(7)),
                    this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

                if(this_uuid<=max_uuid){ this_uuid = max_uuid; }
                this_uuid += 1;

                var s_id = this_uuid_last+this_uuid.toString(),
                    s_content = cluesdata,
                    s_type = '1',
                    s_time = new Date().getTime(),
                    s_edit = '1';

                sqls.push("insert into summaries(s_id,s_content,s_type,s_time,s_edit) values('"+s_id+"','"+s_content+"','"+s_type+"','"+s_time+"','"+s_edit+"')");

                //现在默认只有一个线索笔记 直接覆盖
                var c_note_id = [];
                c_note_id.push(s_id);
                taskinfo.SUMMS = c_note_id;
                c_note_id = JSON.stringify(c_note_id);
                var t_task_info = JSON.stringify(taskinfo);

                sqls.push("update tasks set t_sums_id = '"+c_note_id+"',t_info = '"+t_task_info+"',t_edit='1'  where t_id = '"+cluesId+"' ");


                //记录日志
                var log_title = CMBC_MESSAGE.sysLogtype.t8,
                    log_data = {
                        taskid:taskinfo.TASK_ID,
                        tasktype:taskinfo.TYPE,
                        taskname:taskinfo.TASK_NAME,
                        reportid:s_id,
                        typename:CMBC_MESSAGE.sysLogtype.t8
                    },
                    log_group = CMBC_MESSAGE.sysLogGroup.g2,
                    log_info = CMBC_MESSAGE.sysLogtype.m8(log_data),
                    log_nowtime = new Date().getTime(),
                    log_address = phonegap.getMyAddressPoint(),
                    log_other = JSON.stringify(log_data);

                sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );




                DATAINTERFACE.sqlite.execs({
                    sql:sqls,
                    success:function(){
                        success1(s_id);
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            };

            getmaxuuid();
        }
    },
    //获取总结 (任务或线索)
    getSummerInfo:function(datas){
        var id = datas.id,   //任务或线索id
            type = parseInt(datas.type),
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if( !id ){error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        //判断获取类型
        var getsummerid = function(){
            if(type == 3){
                searchclue();
                return;
            }
            if(type == 1){
                searchtask();
                return;
            }
            error1(CMBC_MESSAGE.argument.parameterMissing);
        };
        //获取线索中的总结id 数组
        var searchclue = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_id = '"+id+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1){
                        error1("线索不存在");
                    }else{
                        var thisdata = rs.rows.item(0),
                            summerid = (thisdata.c_summs_id) ?  eval('('+thisdata.c_summs_id+')') : [];

                        getsummerinfo(summerid);
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取任务中的总结id  数组
        var searchtask = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from tasks where t_id = '"+id+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1){
                        error1("任务不存在");
                    }else{
                        var thisdata = rs.rows.item(0),
                            summerid = (thisdata.t_sums_id) ?  eval('('+thisdata.t_sums_id+')') : [];

                        getsummerinfo(summerid);
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取总结信息
        var getsummerinfo = function(ids){
            //线索和任务默认只有1个总结  只取第一个值
            if(ids.length == 0){
                success1({
                    TYPE:type,
                    SUMM_ID:"",
                    CONTENT:"",
                    CREATE_DATE:""
                });
                return;
            }

            var summerid = ids[0];
            DATAINTERFACE.sqlite.exec({
                sql:"select * from summaries where s_id = '"+summerid+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1 ){
                        success1({
                            TYPE:type,
                            SUMM_ID:"",
                            CONTENT:"",
                            CREATE_DATE:""
                        });
                    }else{
                        var thisdata = rs.rows.item(0);
                        success1({
                            TYPE:thisdata.s_type,
                            SUMM_ID:thisdata.s_id,
                            CONTENT:thisdata.s_content,
                            CREATE_DATE:thisdata.s_time
                        })
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })


        };

        getsummerid();
    },


    //线索部分==========================================================================
    //获取线索列表
    getClueList:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        var taskname = {};   //任务名obj
        var busines = {};
        var cbusines = {};

        //获取任务名
        var gettaskname = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from tasks ",
                success:function(rs){
                    for (var i= 0,l=rs.rows.length;i<l;i++){
                        var temp_cluess = (rs.rows.item(i).t_clues_id)? eval('('+rs.rows.item(i).t_clues_id+')'):[],
                            temp_names = (rs.rows.item(i).t_info)? eval('('+rs.rows.item(i).t_info+')'):{},
                            temp_id = rs.rows.item(i).t_id;

                        if(temp_names){
                            temp_names = temp_names.TASK_NAME;
                        }else{
                            temp_names = null;
                        }
                        if($.isArray(temp_cluess)){
                            for(var z= 0,zl =temp_cluess.length;z<zl;z++ ){
                                var temp_z = temp_cluess[z];
                                taskname[temp_z] = {
                                    name:temp_names,
                                    id:temp_id
                                };
                            }
                        }
                    }

                    getbusinesstate();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var getbusinesstate = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from templagerdata where t_del ISNULL  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var temp_cid = rs.rows.item(i).t_clues_id;
                        var temp_bid = rs.rows.item(i).t_busines_id;
                        var temp_isc = rs.rows.item(i).t_iscomplete;
                        if(!busines[temp_cid]){busines[temp_cid]={}}
                        if(!busines[temp_cid][temp_bid]){busines[temp_cid][temp_bid]=[]}
                        busines[temp_cid][temp_bid].push(temp_isc);
                    }

                    for(var key in busines){
                        cbusines[key] = 0;
                        var thisdata = busines[key],
                            iscomplete = true;
                        for(var key1 in thisdata){
                            var thisarray = thisdata[key1];
                            if(thisarray.length != 0){
                                for(var i= 0,l=thisarray.length;i<l;i++){
                                    if(thisarray[i] == 0 ){
                                        iscomplete =false;
                                        break;
                                    }
                                }
                                if(iscomplete){
                                    cbusines[key] += 1;
                                }
                            }else{
                                iscomplete = false;
                            }

                        }
                    }


                    getcluelist();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取线索主列表
        var getcluelist = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *,(select c_info from clients where c_id = cluess.c_client_id ) as client_info from clues as cluess where c_del is null  order by cluess.c_id desc",
                success:function(rs){
                    var backdata = [];

                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var temp_data = {};
                        //id
                        temp_data.CLUE_ID = rs.rows.item(i).c_id;
                        //名字
                        temp_data.add_CUST_NAME = (rs.rows.item(i).client_info)? eval('('+rs.rows.item(i).client_info+')') : {};
                        if(temp_data.add_CUST_NAME){
                            temp_data.add_CUST_NAME = temp_data.add_CUST_NAME.CUST_NAME;
                        }else{
                            temp_data.add_CUST_NAME = null;
                        }
                        //任务名
                        temp_data.add_TASK_NAME = (taskname[temp_data.CLUE_ID]) ? taskname[temp_data.CLUE_ID].name : "";
                        temp_data.add_TASK_ID = (taskname[temp_data.CLUE_ID])? taskname[temp_data.CLUE_ID].id : "";

                        //业务总数
                        var temp_aaa = rs.rows.item(i).c_business_id;
                        if(temp_aaa ){
                            temp_data.add_ALL_BUSINES = eval('('+rs.rows.item(i).c_business_id+')');
                        }else{
                            temp_data.add_ALL_BUSINES=[];
                        }
                        if($.isArray(temp_data.add_ALL_BUSINES)){
                            temp_data.add_ALL_BUSINES = temp_data.add_ALL_BUSINES.length;
                        }else{
                            temp_data.add_ALL_BUSINES = 0;
                        }
                        //已办理业务数(未测试)
                        temp_data.add_COMPLETE_BUSINES = cbusines[temp_data.CLUE_ID];
                        if(!temp_data.add_COMPLETE_BUSINES){
                            temp_data.add_COMPLETE_BUSINES = 0;
                        }
                        //创建日期，结束日期
                        temp_data.add_CREATDATE = rs.rows.item(i).c_starttime;
                        temp_data.add_ENDDATE = rs.rows.item(i).c_endtime;

                        //线索状态，类型
                        temp_data.add_CLUE_STATE = rs.rows.item(i).c_state;
                        temp_data.add_CLUE_TYPE = rs.rows.item(i).c_type;

                        backdata.push(temp_data)
                    }
                    success1(backdata);

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        gettaskname();
    },
    //线索详细信息（获取客户信息）
    getClueForClient:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clueid = datas.clueId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clueid){alert("参数错误！");error1();return;}


        var clientid = null,
            clientinfo = null,
            h_client = null,
            my_client = null;


        //获取线索中的客户id
        var getCluesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_id = '"+clueid+"' ",
                success:function(rs){
                    if(rs.rows.length !=1){error1("该线索不存在！");return;}
                    clientid = rs.rows.item(0).c_client_id;
                    getclientinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取客户信息
        var getclientinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id = '"+clientid+"' ",
                success:function(rs){
                    if(rs.rows.length !=1){error1("该客户信息不存在！");return;}

                    clientinfo = (rs.rows.item(0).c_info)? eval('('+rs.rows.item(0).c_info+')') : {};

                    if(parseInt(clientinfo.TYPE) == 1 ){
                        //行内客户
                        h_client = clientinfo;
                        getMyclientInfo(clientinfo.CUST_CD,clientid);
                    }else{
                        h_client = null;
                        my_client = clientinfo;
                        success1({
                            client:h_client,
                            myClient:my_client
                        });
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var getMyclientInfo = function(cd,id){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_cd = '"+cd+"' and c_id != '"+id+"' ",
                success:function(rs){
                    if(rs.rows.length == 0){
                        my_client = null;
                    }else{
                        my_client = (rs.rows.item(0).c_info)? eval('('+rs.rows.item(0).c_info+')') : {};
                    }

                    success1({
                        client:h_client,
                        myClient:my_client
                    })

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };



        getCluesinfo();

    },
    //线索详细信息（获取任务信息）
    getClueForTask:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clueid = datas.clueId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clueid){alert("参数错误！");error1();return;}

        var taskobj = {},
            clientobj = [];

        //获取线索信息
        var getCluesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_id = '"+clueid+"' ",
                success:function(rs){
                    if(rs.rows.length !=1){error1("该线索不存在！");return;}
                    var cluetype = rs.rows.item(0).c_type;

                    if(cluetype ==  '1'){
                        //自建线索，无任务信息
                        success1({
                            taskInfo : null,
                            clients : []
                        });
                    }else{
                        //任务下线索
                        gettaskinfo();
                    }

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取任务信息
        var gettaskinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from tasks  ",
                success:function(rs){
                    var find = false;
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var taskinfo = (rs.rows.item(i).t_info)? eval('('+rs.rows.item(i).t_info+')'): {},
                            clueids = taskinfo.CLUES;

                        if(find){break;}
                        for(var z= 0,zl=clueids.length;z<zl;z++){
                            if(clueid == clueids[z]){
                                taskobj = taskinfo;
                                find = true;
                                break;
                            }
                        }
                    }

                    if(!find){
                        error1("该线索的任务不存在！");
                    }else{
                        getclientsinfo();
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var getclientsinfo = function(){
            var temp_client_ids = "'"+taskobj.CUSTS.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id in ("+temp_client_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var clientinfo = (rs.rows.item(i).c_info) ? eval('('+rs.rows.item(i).c_info+')') : {};
                        clientobj.push(clientinfo);
                    }
                    success1({
                        taskInfo : taskobj,
                        clients : clientobj
                    });
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getCluesinfo();
    },
    //线索详细信息（获取产品）
    getClueForProduct:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clueid = datas.clueId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clueid){alert("参数错误！");error1();return;}

        var busineids = null;

        //获取线索信息
        var getCluesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_id = '"+clueid+"' ",
                success:function(rs){
                    if(rs.rows.length !=1){error1("该线索不存在！");return;}
                    busineids = (rs.rows.item(0).c_business_id) ? eval('('+rs.rows.item(0).c_business_id+')') : [];
                    getproductinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取产品信息
        var getproductinfo = function(){
            var temp_b_ids = "'"+busineids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from productvsbusines where b_id in ("+temp_b_ids+") ",
                success:function(rs){
                    var productobj = {};
                   for(var i= 0,l=rs.rows.length;i<l;i++){
                       var this_b_id = rs.rows.item(i).b_id,
                           this_p_id = rs.rows.item(i).p_id,
                           this_p_name = rs.rows.item(i).p_name;

                       productobj[this_p_id] = {
                           PROD_ID : this_p_id,
                           PROD_NAME : this_p_name
                       }
                   }
                    success1(productobj);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };



        getCluesinfo();
    },
    //线索详细信息（获取业务及模板）
    getClueForBusines:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clueid = datas.clueId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clueid){alert("参数错误！");error1();return;}

        var busineids = null,
            cluetype = null,
            taskid = null,
            mytemplateobj = {},   //业务id--[模板]
            businesname = {},       //业务id -- 业务名
            productname = {},      //业务id -- 产品名
            templateobj = {};      //业务id -- 数据


        //获取线索信息
        var getCluesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_id = '"+clueid+"' ",
                success:function(rs){
                    if(rs.rows.length !=1){error1("该线索不存在！");return;}
                    busineids = (rs.rows.item(0).c_business_id)? eval('('+rs.rows.item(0).c_business_id+')') : [];
                    cluetype = rs.rows.item(0).c_type;
                    if(cluetype == '2'){
                        gettaskid();
                    }else{
                        getmytemplate();
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取任务id
        var gettaskid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from tasks ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisclueids = (rs.rows.item(i).t_clues_id)? eval('('+rs.rows.item(i).t_clues_id+')') : [];
                        thisclueids = ","+thisclueids.join(",")+",";
                        if(thisclueids.indexOf(","+clueid+",")>-1){
                            taskid = rs.rows.item(i).t_id;
                            break;
                        }
                    }
                    getmytemplate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取全部模板
        var getmytemplate = function(){
            var sql = "",
                temp_b_ids = "'"+busineids.join("','")+"'";
            if(cluetype == '2'){
                //任务下的线索
                sql = "select * from mytemplages where m_task_id ='"+taskid+"' and m_busines_id in ("+temp_b_ids+")  ";
            }else{
                //自建线索
                sql = "select * from mytemplages where m_clues_id ='"+clueid+"' and m_busines_id in ("+temp_b_ids+")  ";
            }
            DATAINTERFACE.sqlite.exec({
                sql:sql,
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var this_b_id = rs.rows.item(i).m_busines_id,
                            this_m_info = (rs.rows.item(i).m_info)? eval('('+rs.rows.item(i).m_info+')') : {},
                            this_m_id = rs.rows.item(i).m_id,
                            this_m_ismust = rs.rows.item(i).m_ismust,
                            this_m_name = rs.rows.item(i).m_name;

                        if(!mytemplateobj[this_b_id]){
                            mytemplateobj[this_b_id] = [];
                        }
                        mytemplateobj[this_b_id].push({
                            TMPL_ID : this_m_id,
                            //TMPL_CONF : this_m_info.TMPL_CONF,
                            //CONF_ISMUSTS : this_m_info.IS_MUSTS,
                            TMPL_ISMUST: this_m_ismust,
                            TMPL_NAME : this_m_name
                        })

                    }
                    getbusinesname();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })



        };
        //获取线索名
        var getbusinesname = function(){
            var temp_b_ids = "'"+busineids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select * from businesss where b_id in ("+temp_b_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var this_b_id = rs.rows.item(i).b_id,
                            this_b_name = rs.rows.item(i).b_name;

                        businesname[this_b_id] = this_b_name;
                    }
                    getproductname();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取产品名
        var getproductname = function(){
            var temp_b_ids = "'"+busineids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select * from productvsbusines where b_id in ("+temp_b_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var this_b_id = rs.rows.item(i).b_id,
                            this_p_name = rs.rows.item(i).p_name;

                        productname[this_b_id] = this_p_name;
                    }
                    gettemplate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取模板数据
        var gettemplate = function(){
            var temp_b_ids = "'"+busineids.join("','")+"'";

            DATAINTERFACE.sqlite.exec({
                sql:"select * from templagerdata where t_busines_id in ("+temp_b_ids+") and   t_clues_id = '"+clueid+"' and t_del is null ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var this_b_id = rs.rows.item(i).t_busines_id,
                            this_t_id = rs.rows.item(i).t_id,
                            this_t_uuid = rs.rows.item(i).t_uuid,
                            this_t_info = (rs.rows.item(i).t_info)? eval('('+rs.rows.item(i).t_info+')') : {},
                            this_t_iscomplate = rs.rows.item(i).t_iscomplete,
                            this_t_datetime = rs.rows.item(i).t_datatime;

                        if(!templateobj[this_b_id]){templateobj[this_b_id]=[];}
                        templateobj[this_b_id].push({
                            TMPL_ID : this_t_id,
                            TMPL_UUID : this_t_uuid,
                            //TMPL_CONF : this_t_info,
                            TMPL_ISCOMPLATE : this_t_iscomplate,
                            TMPL_DATETIME : this_t_datetime
                        })
                    }

                    datahandler();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //数据处理
        var datahandler = function(){
            var backdata = [];

            for(var key in mytemplateobj){
                var this_b_id = key,
                    this_b_mytemp = mytemplateobj[key],
                    this_b_name = businesname[key],
                    this_p_name = productname[key],
                    this_b_temps =  templateobj[key];

                backdata.push({
                    BUSI_ID : this_b_id,
                    BUSI_NAME : this_b_name,
                    TMPLS : this_b_mytemp,
                    PROD_NAME : this_p_name,
                    DATA : this_b_temps
                });
            }

            backdata.sort(arrayDesc);


            success1(backdata);

        };

        var arrayDesc = function(a,b){
            var as = a.PROD_NAME,
                bs = b.PROD_NAME;

            var a_l=(as)? as.length : 0,
                b_l=(bs)? bs.length : 0;
            if(a_l==0 && b_l==0){ return 0;}
            var s=(a_l>b_l)? a_l : b_l,
                aa= 0,
                bb=0;
            for(i=0;i<s;i++){
                if(i+1>a_l){aa=1;bb=0;break;}
                if(i+1>b_l){aa=0;bb=1;break;}
                if(as.charCodeAt(i)>bs.charCodeAt(i)){aa=1;bb=0;break;}
                if(as.charCodeAt(i)<bs.charCodeAt(i)){aa=0;bb=1;break;}
            }

            return aa-bb;
        };



        getCluesinfo();
    },
    //线索信息
    getClueInfo:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clueid = datas.clueId;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clueid){alert("参数错误！");error1();return;}

        DATAINTERFACE.sqlite.exec({
            sql:"select *  from clues where c_id = '"+clueid+"' ",
            success:function(rs){
                if(rs.rows.length !=1){error1("该线索不存在！");return;}

                var temp_data = rs.rows.item(0);
                success1({
                    TYPE:temp_data.c_type,
                    CLUE_STATUS:temp_data.c_state,
                    NOTES: (temp_data.c_note_id)? eval('('+temp_data.c_note_id+')') : [],
                    SUMMS: (temp_data.c_summs_id)?eval('('+temp_data.c_summs_id+')') : [],
                    CLUE_TITLE:temp_data.c_title,
                    CLUE_DESC:temp_data.c_desc,
                    CREATE_DATE:temp_data.c_starttime,
                    END_DATE:temp_data.c_endtime,
                    CUST_ID:temp_data.c_client_id,
                    BUSIS:(temp_data.c_business_id) ? eval('('+temp_data.c_business_id+')') : []
                })


            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })

    },
    //获取模板相应信息及已填数据
    getDateForTemplate:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clueid = datas.clueId,
            businesid = datas.businesId,
            templateid = datas.templateId,
            templateuuid = datas.templateUUid;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clueid){alert("参数错误！");error1();return;}
        if(!templateid){alert("参数错误！");error1();return;}
        if(!templateuuid){alert("参数错误！");error1();return;}


        var taskid = null,
            cluetype = null,
            templatedata = null,
            ismustinput = null,
            template = null,
            templatename = null,
            tempval = null;

        //获取线索信息
        var getCluesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clues where c_id = '"+clueid+"' ",
                success:function(rs){
                    if(rs.rows.length !=1){error1("该线索不存在！");return;}
                    //busineids = (rs.rows.item(0).c_business_id)? eval('('+rs.rows.item(0).c_business_id+')') : [];
                    cluetype = rs.rows.item(0).c_type;
                    if(cluetype == '2'){
                        gettaskid();
                    }else{
                        getmytemplate();
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取任务id
        var gettaskid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from tasks ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisclueids = (rs.rows.item(i).t_clues_id)? eval('('+rs.rows.item(i).t_clues_id+')') : [];
                        thisclueids = ","+thisclueids.join(",")+",";
                        if(thisclueids.indexOf(","+clueid+",")>-1){
                            taskid = rs.rows.item(i).t_id;
                            break;
                        }
                    }
                    getmytemplate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取全部模板
        var getmytemplate = function(){
            var sql = "";

            if(cluetype == '2'){
                //任务下的线索
                sql = "select * from mytemplages where m_task_id ='"+taskid+"' and m_busines_id = '"+businesid+"' and m_id = '"+templateid+"'   ";
            }else{
                //自建线索
                sql = "select * from mytemplages where m_clues_id ='"+clueid+"' and m_busines_id = '"+businesid+"' and m_id = '"+templateid+"'  ";
            }

            DATAINTERFACE.sqlite.exec({
                sql:sql,
                success:function(rs){
                    if(rs.rows.length == 0){
                        error1("未找到模板数据！");
                        return;
                    }

                    var thisdata = rs.rows.item(0),
                        thisval = (thisdata.m_info) ? eval('('+thisdata.m_info+')') : {};

                    tempval = thisval;
                    //template = (thisval.TMPL_CONF)? thisval.TMPL_CONF : {};
                    //ismustinput = (thisval.IS_MUSTS)? thisval.IS_MUSTS : [];
                    templatename = thisdata.m_name;

                    //获取模板填入的数据
                    gettemplateindata();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取模板填入的数据
        var gettemplateindata = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from templagerdata where t_uuid = '"+templateuuid+"' ",
                success:function(rs){
                    if(rs.rows.length != 1){
                        error1("获取模板填写的数据错误！");
                        return;
                    }

                    var thisval = rs.rows.item(0).t_info;
                    templatedata = (thisval)? eval('('+thisval+')') : {};

                    tempval.TMPL_VAL = templatedata;
                    tempval.TMPL_NAME = templatename;

                    success1(tempval);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })

        };

        getCluesinfo();
    },
    //新建线索
    createClue:function(datas){
        var taskid = datas.taskId,
            clientid = datas.clientId,
            success1 = datas.success,
            error1 = datas.error,
            cluetype = null;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(!clientid){alert("参数错误！");error1();return;}
        cluetype = (taskid) ? "2" : "1" ;

        var clinetinfo = null,
            sqls = [],
            taskinfo = null,
            cluesarray = [],
            clientarray = [],
            taskstarttime = "",
            taskendtime = "",
            taskname = "",
            busines = [],
            totalbusines = 0,
            templatedata = [],
            cluesarray1 = [],
            maxcluesid = "10000000000000000000",
            maxtemplateid = "10000000000000000000";


        //检查任务状态及类型
        var checktask = function(){
            if(taskid){
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from tasks where t_id = '"+taskid+"'",
                    success:function(rs){
                        if(rs.rows.length != 1){error1("该任务不存在！");return;}

                        var tasktype = rs.rows.item(0).t_type,
                            taskstate = rs.rows.item(0).t_state;

                        taskinfo = (rs.rows.item(0).t_info) ? eval('('+rs.rows.item(0).t_info+')') : {};
                        cluesarray = (rs.rows.item(0).t_clues_id) ? eval('('+rs.rows.item(0).t_clues_id+')') : [];
                        cluesarray1 = (rs.rows.item(0).t_clues_id)? eval('('+rs.rows.item(0).t_clues_id+')') : [];
                        clientarray = (rs.rows.item(0).t_clients_id)? eval('('+rs.rows.item(0).t_clients_id+')'): [];
                        taskstarttime = taskinfo.CREATE_DATE;
                        taskendtime = taskinfo.END_DATE;
                        taskname = taskinfo.TASK_NAME;
                        busines = (rs.rows.item(0).t_businesss_id)? eval('('+rs.rows.item(0).t_businesss_id+')') : [];
                        totalbusines = busines.length;

                        //判断是否是范任务 并且要执行后的
                        if(parseInt(tasktype) != 2 || parseInt(taskstate) != 2){
                            error1("任务还没执行且不是泛任务!");return;
                        }

                        //判断是否过期
                        if(parseInt(taskendtime)){
                            var nowtiemstamp = new Date().getTime();
                            if(nowtiemstamp>parseInt(taskendtime)){
                                error1("任务已过期无法添加线索!");return;
                            }
                        }


                        //下一步
                        checkuserinclues();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //下一步
                checkuserinclues();
            }

        };

        //检查客户是否已经在这个范任务下
        var checkuserinclues = function(){
            if(taskid){
                var temp_cluesid = "'"+cluesarray1.join("','")+"'",
                    checked = false;
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from clues where c_id in ("+temp_cluesid+")  ",
                    success:function(rs){
                        for(var i= 0,l=rs.rows.length;i<l;i++){
                            if(clientid.toString() == rs.rows.item(i).c_client_id.toString()){
                                checked = true;
                                break;
                            }
                        }

                        if(checked){ error1("当前客户已在该任务下！");return;}

                        //下一步
                        getclientinfo();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                getclientinfo();
            }


        };


        //获取用户信息
        var getclientinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clients where c_id = '"+clientid+"'",
                success:function(rs){
                    if(rs.rows.length != 1){error1("数据不存在！");return;}
                    clinetinfo = (rs.rows.item(0).c_info)? eval('('+rs.rows.item(0).c_info+')') : {};

                    //下一步
                    getmusttemplate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取业务的必填模板信息
        var getmusttemplate = function(){
            if(taskid){
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from mytemplages where m_task_id = '"+taskid+"' and  m_ismust = '1' ",
                    success:function(rs){
                        for(var i= 0,l=rs.rows.length;i<l;i++){

                            templatedata.push(rs.rows.item(i));
                        }
                        getcluemaxid();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                getcluemaxid();
            }
        };


        //获取线索的最大id值
        var getcluemaxid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(c_id) as tt  from clues ",
                success:function(rs){
                    if(rs.rows.length != 0){
                        maxcluesid = (rs.rows.item(0).tt)? rs.rows.item(0).tt : maxcluesid   ;
                    }

                    gettemplateid();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取模板的最大id值
        var gettemplateid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(t_uuid) as tt  from templagerdata ",
                success:function(rs){
                    if(rs.rows.length != 0){
                        maxtemplateid = (rs.rows.item(0).tt)? rs.rows.item(0).tt : maxtemplateid;
                    }

                    addclues();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };



        //添加线索
        var addclues = function(){
            //判断uuid
            var clueid = maxcluesid,
                this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                max_uuid = parseInt(clueid.substr(7)),
                max_uuid1 = parseInt(maxtemplateid.substr(7)),
                this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

            if(this_uuid<=max_uuid){ this_uuid = max_uuid; }
            if(this_uuid<=max_uuid1){ this_uuid = max_uuid1; }

            this_uuid += 1;
            var this_in_uuid = this_uuid_last+this_uuid.toString(),
                this_in_clientid = clientid,
                this_in_taskid = taskid,
                this_in_cluetype = cluetype,
                this_in_cluetitle = clinetinfo.CUST_NAME,
                this_in_cluedesc = clinetinfo.CUST_NAME,
                this_in_starttime = new Date().getTime(),
                this_in_endtiem = "",
                this_in_business = "",
                this_in_edit = "1",
                this_in_state = "0";    //自建线索不在范任务下的  初始状态为0  （线索下无业务的）

            //范任务下的时间已任务时间为准
            if(taskid){
                this_in_starttime = new Date().getTime();
                this_in_endtiem = "";
                this_in_business = JSON.stringify(busines);
                this_in_state = "1";
            }

            //增加线索  任务下的线索有初始业务id
            sqls.push("insert into clues(c_business_id,c_id,c_type,c_state,c_client_id,c_title,c_desc,c_starttime,c_endtime,c_edit)  values ('"+this_in_business+"','"+this_in_uuid+"','"+this_in_cluetype+"','"+this_in_state+"','"+this_in_clientid+"','"+this_in_cluetitle+"','"+this_in_cluedesc+"','"+this_in_starttime+"','"+this_in_endtiem+"','"+this_in_edit+"')");

            //范任务修改任务的线索关联
            if(taskid){
                taskinfo.CLUES.push(this_in_uuid);
                //taskinfo.CUSTS.push(clientid);
                cluesarray.push(this_in_uuid);
               // clientarray.push(clientid);

                var task_in_info = JSON.stringify(taskinfo),
                    task_in_clues = JSON.stringify(cluesarray),
                    //task_in_client = JSON.stringify(clientarray),
                    task_in_edit = '1';

                sqls.push("update tasks set t_info = '"+task_in_info+"',t_clues_id = '"+task_in_clues+"',t_edit = '"+task_in_edit+"' where t_id = '"+taskid+"' ");
            }


            //生成必填模板的空数据并执行
            for(var i= 0,l=templatedata.length;i<l;i++){
                this_uuid += 1;
                var t_uuid = this_uuid_last+this_uuid.toString(),
                    thisdata = templatedata[i],
                    t_id = thisdata.m_id,
                    t_name = thisdata.m_name,
                    t_ver = thisdata.m_ver,
                    t_datatime = new Date().getTime(),
                    t_ismust = thisdata.m_ismust,
                    t_iscomplete = '0',
                    t_clues_id = this_in_uuid,
                    t_busines_id = thisdata.m_busines_id,
                    t_task_id = taskid,
                    t_edit = '1';

                sqls.push("insert into templagerdata(t_uuid,t_id,t_name,t_ver,t_datatime,t_ismust,t_iscomplete,t_clues_id,t_busines_id,t_task_id,t_edit) values('"+t_uuid+"','"+t_id+"','"+t_name+"','"+t_ver+"','"+t_datatime+"','"+t_ismust+"','"+t_iscomplete+"','"+t_clues_id+"','"+t_busines_id+"','"+t_task_id+"','"+t_edit+"') " );
            }


            //生成系统日志
            var log_title = CMBC_MESSAGE.sysLogtype.t4,
                log_data = {
                    clientname:this_in_cluetitle,
                    clientid:this_in_clientid,
                    taskid:taskid,
                    clueid:this_in_uuid,
                    taskname:taskname,
                    typename:CMBC_MESSAGE.sysLogtype.t4
                },
                log_group = CMBC_MESSAGE.sysLogGroup.g2,
                log_info = CMBC_MESSAGE.sysLogtype.m4(log_data),
                log_nowtime = new Date().getTime(),
                log_address = phonegap.getMyAddressPoint(),
                log_other = JSON.stringify(log_data);

            sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );



            //执行
            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    success1({
                        CLUE_ID:this_in_uuid,
                        add_ALL_BUSINES:totalbusines.toString(),
                        add_COMPLETE_BUSINES:"0",
                        add_CREATDATE:this_in_starttime,
                        add_CUST_NAME:this_in_cluetitle,
                        add_ENDDATE:taskendtime,
                        add_TASK_NAME:taskname
                    })
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };




        checktask();
    },
    //新建模板
    createTemplate:function(datas){
        var taskid = datas.taskId,
            cluesid = datas.clueId,
            templateid = datas.templateId,
            businesid = datas.businesId,
            success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(templateid && businesid && cluesid){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        var selecttemplate = null,
            maxtemplateid = "10000000000000000000";

        //获取模板信息
        var getmytemplatedata = function(){
            var sql = "";
            if(taskid){
                //获取任务下的模板
                sql = "select * from mytemplages where m_id = '"+templateid+"' and  m_task_id = '"+taskid+"' and m_busines_id = '"+businesid+"'    ";
            }else{
                //获取线索的模板
                sql = "select * from mytemplages where m_id = '"+templateid+"' and  m_clues_id = '"+cluesid+"' and m_busines_id = '"+businesid+"'    ";
            }

            DATAINTERFACE.sqlite.exec({
                sql:sql,
                success:function(rs){
                    if(rs.rows.length != 1 ){error1(CMBC_MESSAGE.sql.anonymous);return;}
                    selecttemplate = rs.rows.item(0);

                    gettemplateid();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        //获取模板的最大id值
        var gettemplateid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(t_uuid) as tt  from templagerdata ",
                success:function(rs){
                    if(rs.rows.length != 0){
                        maxtemplateid = (rs.rows.item(0).tt)? rs.rows.item(0).tt : maxtemplateid;
                    }

                    inserttemplate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //写入模板数据表 生成空数据
        var inserttemplate = function(){

            //判断uuid
            var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                max_uuid = parseInt(maxtemplateid.substr(7)),
                this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

            if(this_uuid<=max_uuid){ this_uuid = max_uuid; }
            this_uuid += 1;

            var t_uuid = this_uuid_last+this_uuid.toString(),
                t_id = templateid,
                t_name = selecttemplate.m_name,
                t_ver = selecttemplate.m_ver,
                t_datatime = new Date().getTime(),
                t_ismust = selecttemplate.m_ismust,
                t_iscomplete = '0',
                t_clues_id = cluesid,
                t_busines_id = businesid,
                t_task_id = taskid,
                t_edit = '1';

            DATAINTERFACE.sqlite.insertRowBackId({
                tableName:"templagerdata",
                fields:["t_uuid","t_id","t_name","t_ver","t_datatime","t_ismust","t_iscomplete","t_clues_id","t_busines_id","t_task_id","t_edit"],
                values:[t_uuid,t_id,t_name,t_ver,t_datatime,t_ismust,t_iscomplete,t_clues_id,t_busines_id,t_task_id,t_edit],
                success:function(id){
                    //返回id ===
                    success1({
                        UUID:t_uuid,
                        TMPL_ID:t_id,
                        VERS_ID:t_ver,
                        TMPL_NAME:t_name,
                        TMPL_CREATEDATA:t_datatime,
                        TMPL_ISMUST:t_ismust,
                        TMPL_ISCOMPLETE:t_iscomplete,
                        CLUE_ID:t_clues_id,
                        BUSIS_ID:t_busines_id,
                        TASK_ID:t_task_id
                    })
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.inserterr);
                }
            })

        };


        getmytemplatedata();
    },
    //删除模板
    delTemplate:function(datas){
        var sqlid = datas.UUID,
            success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(sqlid){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        var sqls = [];

        //获取模板信息
        var gettemplateinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from templagerdata where t_uuid = '"+sqlid+"' ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("表单数据不存在！");return;}

                    var thisdata = rs.rows.item(0),
                        thistid = thisdata.t_id,
                        thiscluesid = thisdata.t_clues_id,
                        thisbusinesid = thisdata.t_busines_id,
                        thisismust = thisdata.t_ismust;

                    if(parseInt(thisismust) == 1){
                        checkislasttemplate(thiscluesid,thisbusinesid,thistid);
                    }else{
                        deltemplate();
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //判断是否是最后一张表单数据
        var checkislasttemplate = function(clueid,businesid,templateid){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from templagerdata where t_id = '"+templateid+"' and t_clues_id = '"+clueid+"' and t_busines_id = '"+businesid+"' and t_del is null ",
                success:function(rs){
                    if(rs.rows.length > 1){
                        deltemplate();
                    }else{
                        error1("该表单属于必填表中的最后一张，不能删除！");
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //删除模板数据
        var deltemplate = function(){
            sqls.push("update templagerdata  set t_del = '1' where t_uuid ='"+sqlid+"' ");

            sqls.push("update resources set r_del='1' where  r_uuid = '"+sqlid+"'   ");

            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    success1("");

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //删除文件  同步时删除数据库中伪删除的数据时删除


        gettemplateinfo();
    },
    //保存表单数据
    saveTemplateData:function(datas){
        var templatedata = datas.template, //{CONF_ID:{CONF_ID:"",CONF_ VALUE:"",CONF_EN:"",CONF_NAME:""},...}    全发，未修改的也发
            resourcedata = datas.resource, // {CONF_ID:CONF_VAL,...}  新增或修改的才发
            sqlid = datas.templateUUID,
            iscomplete = datas.isComplete,
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if( sqlid && iscomplete ){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}
        if( !$.isObject(templatedata) ){ error1(CMBC_MESSAGE.argument.parameterMissing);return; }
        if( !$.isObject(resourcedata) ){ error1(CMBC_MESSAGE.argument.parameterMissing);return; }

        var sqls = [],
            templateinfo = null,
            filesize = {};

        var log_taskinfo = null,
            log_clientinfo = null,
            log_businesname = null,
            log_taskid = null,
            log_clueid = null,
            log_clientid = null,
            log_businesid = null,
            log_templateid = null,
            log_templatever = null,
            log_templatename = null;


        //获取文件大小
        var getfilesize = function(){
            var temp_filesize = [],
                dir = DATAINTERFACE.directory.resource;

            for(var key in resourcedata){
                temp_filesize.push({
                    id:key,
                    filename:resourcedata[key]
                })
            }

            var go = function(){
                if(temp_filesize.length == 0){
                    gettemplateinfo();
                }else{
                    var thisdata =  temp_filesize.shift();
                    getfilesize(thisdata);
                }
            };

            var getfilesize = function(data){
                dir.getFile(data.filename, {create: false, exclusive: false}, function(obj){
                    //获取成功
                    obj.file(function(fileobj){
                        //获取大小
                        filesize[data.id] = fileobj.size;
                        go();
                    },function(){
                        //失败
                        filesize[data.id] = 0;
                        go();
                    });
                }, function(){
                    //获取失败
                    filesize[data.id] = 0;
                    go();
                });
            };

            go();
        };


        //获取模板所属业务，线索等
        var gettemplateinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from templagerdata where t_uuid = '"+sqlid+"' and t_del is null  ",
                success:function(rs){
                    if(rs.rows.length != 1 ){error1("该模板表不存在！");return;}
                    templateinfo = rs.rows.item(0);

                    log_taskid = templateinfo.t_task_id;
                    log_clueid = templateinfo.t_clues_id;
                    log_businesid = templateinfo.t_busines_id;
                    log_templateid = templateinfo.t_id;
                    log_templatever = templateinfo.t_ver;
                    log_templatename = templateinfo.t_name;


                    gettaskinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var gettaskinfo = function(){
            if(log_taskid){
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from tasks where t_id = '"+log_taskid+"'  ",
                    success:function(rs){
                        if(rs.rows.length != 1 ){error1("获取任务信息失败！");return;}
                        log_taskinfo = rs.rows.item(0).t_info;
                        log_taskinfo = (log_taskinfo)? eval('('+log_taskinfo+')') : {};
                        getclueinfo();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //自建任务。。
                log_taskinfo = {};
                getclueinfo();

            }
        };

        var getclueinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_id = '"+log_clueid+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1 ){error1("获取线索信息失败！");return;}
                    log_clientid = rs.rows.item(0).c_client_id;
                    getclientinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var getclientinfo = function(){
            if(log_clientid){
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from clients where c_id = '"+log_clientid+"'  ",
                    success:function(rs){
                        if(rs.rows.length != 1 ){
                            //查询客户信息失败
                            log_clientinfo = {};
                        }else{
                            log_clientinfo = rs.rows.item(0).c_info;
                            log_clientinfo = (log_clientinfo)? eval('('+log_clientinfo+')') : {};
                        }

                        getbusinesinfo();

                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //客户信息为空
                log_clientinfo = {};
                getbusinesinfo();
            }
        };

        var getbusinesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from businesss where b_id = '"+log_businesid+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1 ){error1("获取业务信息失败！");return;}
                    log_businesname = rs.rows.item(0).b_name;
                    updatatemplate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //更新数据
        var updatatemplate = function(){
            var t_info = JSON.stringify(templatedata),
                t_iscomplete = iscomplete;
            //更新模板数据
            sqls.push(" update templagerdata set t_info = '"+t_info+"',t_iscomplete = '"+t_iscomplete+"',t_edit = '1' where t_uuid = '"+sqlid+"'    ");

            //删除修改过的资源文件
            var r_del_ids = [];
            for(var key in resourcedata){
                r_del_ids.push(key);
            }
            r_del_ids = "'"+r_del_ids.join("','")+"'";
            sqls.push(" update  resources set r_del = '1' where r_uuid = '"+sqlid+"' and r_id in ("+r_del_ids+") ");

            //添加新的资源文件
            for(var key in resourcedata){
                var r_uuid = sqlid,
                    r_id = key,
                    r_filename = resourcedata[key],
                    r_datatime = new Date().getTime(),
                    r_busines_id = templateinfo.t_busines_id,
                    r_clues_id = templateinfo.t_clues_id,
                    r_templager_id = templateinfo.t_id,
                    r_size = filesize[r_id];

                sqls.push("insert into resources(r_uuid,r_id,r_filename,r_datatime,r_busines_id,r_clues_id,r_templager_id,r_size) values('"+r_uuid+"','"+r_id+"','"+r_filename+"','"+r_datatime+"','"+r_busines_id+"','"+r_clues_id+"','"+r_templager_id+"','"+r_size+"')  ");
            }

            //生成系统日志
            var log_title = CMBC_MESSAGE.sysLogtype.t11,
                log_data = {
                    taskid:(log_taskinfo.TASK_ID)? log_taskinfo.TASK_ID : "",
                    taskname:(log_taskinfo.TASK_NAME)? log_taskinfo.TASK_NAME : "",
                    tasktype:(log_taskinfo.TYPE)? log_taskinfo.TYPE : "",
                    clueid:log_clueid,
                    clientid:log_clientid,
                    clientname:(log_clientinfo.CUST_NAME)? log_clientinfo.CUST_NAME : "",
                    businesid:log_businesid,
                    businesname:log_businesname,
                    templateid:log_templateid,
                    templatename:log_templatename,
                    templatever:log_templatever,
                    typename:CMBC_MESSAGE.sysLogtype.t11
                },
                log_group = CMBC_MESSAGE.sysLogGroup.g2,
                log_info = CMBC_MESSAGE.sysLogtype.m11(log_data),
                log_nowtime = new Date().getTime(),
                log_address = phonegap.getMyAddressPoint(),
                log_other = JSON.stringify(log_data);

            sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );




            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })

        };

        getfilesize();
    },
    //业务笔记保存
    saveBusinesNote:function(datas){
        var cluesdata = datas.clueNoteData,
            cluesnoteid = datas.clueNoteId,
            cluesId = datas.cluesId,
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if( cluesId ){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        var maxuuid = "10000000000000000000",
            sqls = [],
            taskinfo = null,
            cluetype = null,
            clientid = null,
            clientinfo = null;

        var getclueinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_id='"+cluesId+"'",
                success:function(rs){
                    if(rs.rows.length != 1 ){error1("线索不存在或已删除！");return;}

                    cluetype = rs.rows.item(0).c_type;
                    clientid = rs.rows.item(0).c_client_id;

                    gettaskinfo();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var gettaskinfo = function(){
            if(parseInt(cluetype) == 2){
                //任务线索
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from tasks",
                    success:function(rs){
                        var finded = false;
                        for(var i= 0,l=rs.rows.length;i<l;i++){
                            var thisdata = rs.rows.item(i),
                                thistaskinfo = thisdata.t_info;

                            thistaskinfo = (thistaskinfo)? eval('('+thistaskinfo+')') : {};

                            var thisclues = (thistaskinfo.CLUES) ? thistaskinfo.CLUES : [];

                            for(var z= 0,zl=thisclues.length;z<zl;z++){
                                if(thisclues[z] == cluesId){
                                    finded = true;
                                    taskinfo = thistaskinfo;
                                    break;
                                }
                            }

                            if(finded){ break;}
                        }

                        getclientinfo();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //自建线索
                taskinfo={};
                getclientinfo();
            }
        };

        var getclientinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clients where c_id = '"+clientid+"' ",
                success:function(rs){
                    var thisdata = rs.rows.item(0);
                    thisdata = (thisdata)? thisdata.c_info : "{}";
                    thisdata = (thisdata)? eval('('+thisdata+')') : {};
                    clientinfo = thisdata;
                    doit();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var doit = function(){
            if(cluesnoteid){
                //修改线索笔记
                DATAINTERFACE.sqlite.exec({
                    sql:"update summaries set s_content = '"+cluesdata+"' where s_id = '"+cluesnoteid+"' ",
                    success:function(){
                        success1(cluesnoteid);
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //新建线索笔记

                //获取报告的最大uuid
                var getmaxuuid = function(){
                    DATAINTERFACE.sqlite.exec({
                        sql:"select max(s_id) as tt from summaries ",
                        success:function(rs){
                            maxuuid = (rs.rows.item(0).tt) ? rs.rows.item(0).tt : maxuuid ;
                            savecluesnote();
                        },
                        error:function(){
                            error1(CMBC_MESSAGE.sql.anonymous);
                        }
                    })
                };

                //写入数据
                var savecluesnote = function(){
                    //判断uuid
                    var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                        max_uuid = parseInt(maxuuid.substr(7)),
                        this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

                    if(this_uuid<=max_uuid){ this_uuid = max_uuid; }
                    this_uuid += 1;

                    var s_id = this_uuid_last+this_uuid.toString(),
                        s_content = cluesdata,
                        s_type = '2',
                        s_time = new Date().getTime(),
                        s_edit = '1';

                    sqls.push("insert into summaries(s_id,s_content,s_type,s_time,s_edit) values('"+s_id+"','"+s_content+"','"+s_type+"','"+s_time+"','"+s_edit+"')");

                    //现在默认只有一个线索笔记 直接覆盖
                    var c_note_id = [];
                    c_note_id.push(s_id);
                    c_note_id = JSON.stringify(c_note_id);
                    sqls.push("update clues set c_note_id = '"+c_note_id+"',c_edit='1'  where c_id = '"+cluesId+"' ");

                    //增加系统日志

                    var log_title = CMBC_MESSAGE.sysLogtype.t10,
                        log_data = {
                            taskid:(taskinfo.TASK_ID)? taskinfo.TASK_ID : "",
                            tasktype:(taskinfo.TYPE)? taskinfo.TYPE : "",
                            taskname:(taskinfo.TASK_NAME)? taskinfo.TASK_NAME : "",
                            clueid:cluesId,
                            cluetype:cluetype,
                            clientid:clientinfo.CUST_ID,
                            clientname:clientinfo.CUST_NAME,
                            typename:CMBC_MESSAGE.sysLogtype.t10
                        },
                        log_group = CMBC_MESSAGE.sysLogGroup.g2,
                        log_info = CMBC_MESSAGE.sysLogtype.m10(log_data),
                        log_nowtime = new Date().getTime(),
                        log_address = phonegap.getMyAddressPoint(),
                        log_other = JSON.stringify(log_data);

                    sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );



                    DATAINTERFACE.sqlite.execs({
                        sql:sqls,
                        success:function(){
                            success1(s_id);
                        },
                        error:function(){
                            error1(CMBC_MESSAGE.sql.select_err);
                        }
                    })
                };

                getmaxuuid();
            }
        };

        getclueinfo();
    },
    //业务笔记查看
    readBusinesNote:function(datas){
        var cluesnoteid = datas.clueNoteId,
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if( cluesnoteid ){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        DATAINTERFACE.sqlite.exec({
            sql:"select * from summaries where s_id = '"+cluesnoteid+"' ",
            success:function(rs){
                var readdata = (rs.rows.item(0).s_content) ? rs.rows.item(0).s_content : "" ;
                success1(readdata);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.anonymous);
            }
        })
    },
    //获取范任务列表
    getScopeTaskList:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        DATAINTERFACE.sqlite.exec({
            sql:"select * from tasks where t_type = '2' and t_state = '2' ",
            success:function(rs){
                var backdata = [];
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        taskname = (thisdata.t_info) ? eval('('+thisdata.t_info+')').TASK_NAME : "",
                        taskid = thisdata.t_id;

                    backdata.push({TASK_ID:taskid,TASK_NAME:taskname});

                }
                success1(backdata);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })


    },
    //获取产品下业务的列表
    getProductVsBusines:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        var businessinfo = {},
            productinfo = {};

        //获取所有业务
        var getbusinesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from businesss  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i),
                            bname = thisdata.b_name,
                            bid = thisdata.b_id;

                        businessinfo[bid] = bname;
                    }
                    getproductinfo();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取所有产品并输出
        var getproductinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from products  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i),
                            bids = (thisdata.p_business_id) ? eval('('+thisdata.p_business_id+')') : [],
                            pid = thisdata.p_id;


                        if(bids.length != 0){
                            if(!productinfo[pid]){productinfo[pid] = [];}

                            for(var z= 0,zl=bids.length;z<zl;z++){
                                var this_b_id = bids[z];

                                productinfo[pid].push({BUSI_ID:this_b_id,BUSI_NAME:businessinfo[this_b_id]})
                            }
                        }


                    }

                    success1(productinfo);

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getbusinesinfo();
    },
    //删除业务（线索下）
    delBusines:function(datas){
        var cluesid = datas.cluesId,
            businesid = datas.businesId,
            success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(cluesid && businesid){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        var oldbusines = [],
            clue_type = null;

        //检查线索类型
        var checkclues = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_id = '"+cluesid+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1 ){error1("该线索不存在！");return;}
                    var thisval = rs.rows.item(0),
                        thistype = thisval.c_type,
                        thisstate = thisval.c_state;
                    oldbusines = (thisval.c_business_id)? eval('('+thisval.c_business_id+')') : [];

                    if(thistype != "1"){error1("该线索下不能删除业务！");return;}
                    clue_type = parseInt(thistype);

                    //old______________________________________
                    //if(thisstate == '3' || thisstate == '5'){error1("该线索已完成或废止！");return;}
                    //if(oldbusines.length < 2 ){error1("该线索下最后一个业务不能删除！");return;};

                    //new_____________________________________
                    if( thisstate == '2' || thisstate == '5' || thisstate=="6" || thisstate =="9" ){error1("当前线索状态不能删除业务！");return;}
                    if(oldbusines.length == 0 ){error1("该线索下没有业务！");return;};


                    checktask();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //检查任务情况
        var checktask = function(){
            if(clue_type == 2){
                //有任务的
                var taskinfo = null;
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from tasks",
                    success:function(rs){
                        var finded = false;
                        for(var i= 0,l=rs.rows.length;i<l;i++){
                            var thisdata = rs.rows.item(i),
                                thistaskinfo = thisdata.t_info;

                            thistaskinfo = (thistaskinfo)? eval('('+thistaskinfo+')') : {};

                            var thisclues = (thistaskinfo.CLUES) ? thistaskinfo.CLUES : [];

                            for(var z= 0,zl=thisclues.length;z<zl;z++){
                                if(thisclues[z] == cluesid){
                                    finded = true;
                                    taskinfo = thistaskinfo;
                                    break;
                                }
                            }

                            if(finded){ break;}
                        }

                        if(taskinfo){
                            if(parseInt(taskinfo.TASK_STATUS) == 3){
                                error1("该线索的任务已办结，业务不能删除。");
                            }else{
                                createsql();
                            }
                        }else{
                            error1("获取任务信息失败！");
                        }

                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                createsql();
            }
        };

        //瓶装sql
        var createsql = function(){
            var sqls = [];
            if(clue_type == 1){
                sqls.push("delete from mytemplages where m_clues_id = '"+cluesid+"' and m_busines_id = '"+businesid+"' ");
            }

            sqls.push("update templagerdata set t_del = '1' where t_clues_id = '"+cluesid+"' and t_busines_id = '"+businesid+"'   ");

            var newbusines = [];
            for(var i= 0,l=oldbusines.length;i<l;i++){
                if(oldbusines[i] != businesid.toString()){
                    newbusines.push(oldbusines[i]);
                }
            }
            var changestate = (newbusines.length == 0);
            newbusines = JSON.stringify(newbusines);

            if(changestate){
                sqls.push("update clues set c_business_id = '"+newbusines+"',c_edit = '1',c_state = '0'  where c_id = '"+cluesid+"'   ");
            }else{
                sqls.push("update clues set c_business_id = '"+newbusines+"',c_edit = '1' where c_id = '"+cluesid+"'   ");
            }

            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        checkclues();
    },
    //增加业务（自建线索下）
    addBusiness:function(datas){
        var cluesid = datas.cluesId,
            busines = datas.busines,
            success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(cluesid){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}
        if( !$.isArray(busines) ){error1(CMBC_MESSAGE.argument.parameterMissing);return;}
        if( busines.length == 0){error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        if( busines.length != 1){error1("线索下只能有1个业务！");return;}


        var allbusinesid = {},
            alltemplates = {},
            alltemplateinfo = {},
            maxtemplateid = "10000000000000000000",
            oldbusines = null,
            errorbusines = [];

        //检查线索类型
        var checkclues = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_id = '"+cluesid+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1 ){error1("该线索不存在！");return;}
                    var thisval = rs.rows.item(0),
                        thistype = thisval.c_type,
                        thisstate = thisval.c_state;
                    oldbusines = (thisval.c_business_id)? eval('('+thisval.c_business_id+')') : [];

                    if(thistype != "1"){error1("该线索下不能创建业务！");return;}

                    //old........
                    //if(thisstate == '3' || thisstate == '5'){error1("该线索已完成或废止！");return;}
                    //............................

                    //new........
                    //线索状态变更为0-9
                    if(thisstate != '0'){error1("该线索已完成或废止！");return;}
                    //线索下只能有一个业务
                    if(oldbusines.length>=1){error1("该线索已添加业务！");return;}





                    checkbusiness();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //检查创建的业务是否已存在该线索下
        var checkbusiness =function(){
            var olds = {},
                cf = [],
                re = [];

            for(var i= 0,l=oldbusines.length;i<l;i++){
                olds[oldbusines[i]] = "test";
            }
            for(var z= 0,zl=busines.length;z<zl;z++){
                if(olds[busines[z]]){
                    //有这个业务
                    cf.push(busines[z]);
                }else{
                    //新增的
                    re.push(busines[z]);
                }
            }

            errorbusines = cf;
            busines = re;


            if(busines.length == 0){
                error1("添加的业务已存在！")
            }else{
                getbusinesforclues();
            }
        };

        //获取业务下的模板
        var getbusinesforclues = function(){
            var businesids = "'"+busines.join("','")+"'";

            DATAINTERFACE.sqlite.exec({
                sql:"select * from businesss where b_id in("+businesids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i),
                            thisbid = thisdata.b_id,
                            thisbname = thisdata.b_name,
                            thistemlpages = (thisdata.b_template_obj)? eval('('+thisdata.b_template_obj+')') : [];

                        allbusinesid[thisbid] = {
                            name:thisbname,
                            info:[]
                        };
                        for(var z= 0,zl=thistemlpages.length;z<zl;z++){
                            //组装业务下的模板id
                            var t_id = thistemlpages[z].TMPL_ID,
                                t_ismust = thistemlpages[z].IS_MUST;
                            allbusinesid[thisbid].info.push({
                                id:t_id,
                                ismust:t_ismust
                            });
                            alltemplates[t_id] = "add";
                        }

                    }

                    getalltemplateinfo();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取所有模板信息
        var getalltemplateinfo = function(){
            var temp = [];
            for(var keys in alltemplates){
                temp.push(keys)
            }
            var temp_templateids = "'"+temp.join("','")+"'";

            DATAINTERFACE.sqlite.exec({
                sql:"select * from templates where t_id in("+temp_templateids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisval = rs.rows.item(i),
                            thisid = thisval.t_id,
                            thisname = thisval.t_name,
                            thisinfo = thisval.t_info,
                            thisver = thisval.t_ver;

                        alltemplateinfo[thisid] = {
                            TMPL_ID:thisid,
                            VERS_ID:thisver,
                            TMPL_NAME:thisname,
                            TMPL_CONF:thisinfo
                        }
                    }

                    gettemplateid();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取模板的最大id值
        var gettemplateid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(t_uuid) as tt  from templagerdata ",
                success:function(rs){
                    if(rs.rows.length != 0){
                        maxtemplateid = (rs.rows.item(0).tt)? rs.rows.item(0).tt : maxtemplateid;
                    }

                    createsql();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //生成sql
        var createsql = function(){
            //组装uuid
            var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                max_uuid = parseInt(maxtemplateid.substr(7)),
                this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

            if(this_uuid<=max_uuid){ this_uuid = max_uuid; }

            var sqls = [];
            //插入临时模板表 和 模板数据表（必填的）
            for(var key in allbusinesid){
                var m_clues_id = cluesid,
                    m_busines_id = key,
                    thisbusines = allbusinesid[key].info;

                oldbusines.push(m_busines_id);

               for(var i= 0,l=thisbusines.length;i<l;i++){
                   this_uuid += 1;
                   var m_id = thisbusines[i].id,
                       m_ismust = thisbusines[i].ismust,
                       m_name = alltemplateinfo[m_id].TMPL_NAME,
                       m_info = alltemplateinfo[m_id].TMPL_CONF,
                       m_ver = alltemplateinfo[m_id].VERS_ID,
                       m_uuid = this_uuid_last+this_uuid.toString(),
                       m_datatiem = new Date().getTime();

                   sqls.push("insert into mytemplages(m_id,m_name,m_info,m_ver,m_clues_id,m_busines_id,m_ismust)  values('"+m_id+"','"+m_name+"','"+m_info+"','"+m_ver+"','"+m_clues_id+"','"+m_busines_id+"','"+m_ismust+"')");
                   //插入模板数据表（必填的模板）
                   if(parseInt(m_ismust) == 1){
                       sqls.push("insert into templagerdata(t_uuid,t_id,t_name,t_ver,t_datatime,t_ismust,t_iscomplete,t_clues_id,t_busines_id,t_edit)  values('"+m_uuid+"','"+m_id+"','"+m_name+"','"+m_ver+"','"+m_datatiem+"','"+m_ismust+"','0','"+m_clues_id+"','"+m_busines_id+"','1') ");
                   }
               }
            }

            //修改线索记录（对应的业务，状态设置为执行中）
            var newbusinesids = JSON.stringify(oldbusines);
            sqls.push("update clues set c_business_id = '"+newbusinesids+"',c_state = '1',c_edit = '1' where c_id = '"+cluesid+"' ");

            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    if(errorbusines.length == 0){
                        var a=[];
                        success1(a);
                    }else{
                        geterrbusinesname();
                    }
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var geterrbusinesname = function(){
            var temp_b_ids =  "'"+ errorbusines.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select * from businesss where b_id in ("+temp_b_ids+")",
                success:function(rs){
                    var temp_names = [];
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        temp_names.push(rs.rows.item(i).b_name);
                    }
                    success1(temp_names);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })

        };


        checkclues();
    },
    //改变线索状态
    changeCluesState:function(datas){
        var cluesid = datas.cluesId,
            state = datas.state,
            success1 = datas.success,
            error1 = datas.error;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};
        if(cluesid && state){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}
        if(parseInt(state) == 2 || parseInt(state) == 5 || parseInt(state) == 9){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;};

        var cluetype = null,
            clientid = null,
            taskinfo = null,
            clientinfo = null;


        var getcluestate = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from  clues  where c_id = '"+cluesid+"'   ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("该线索不存在！");return;}
                    var thisstate = parseInt(rs.rows.item(0).c_state);

                    cluetype = rs.rows.item(0).c_type;
                    clientid = rs.rows.item(0).c_client_id;

                    if(thisstate == 1 || thisstate == 4 || thisstate == 3 || thisstate == 7 ){
                        gos();
                    }else{
                        error1("当前线索状态无法更改！");
                    }


                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var gos = function(){
            if(parseInt(state) == 2 || parseInt(state) == 5){
                DATAINTERFACE.sqlite.exec({
                    sql:"select t_clues_id,sum(1) as total,sum(t_iscomplete) as complete from templagerdata where t_del is null and t_clues_id = '"+cluesid+"'  GROUP BY t_clues_id",
                    success:function(rs){
                        if(rs.rows.length == 0){error1("该线索下的业务表单还没有完成！");return;}
                        var thisdata = rs.rows.item(0);
                        if(parseInt(thisdata.total) == parseInt(thisdata.complete)){
                            gettaskinfo();
                        }else{
                            error1("该线索下的业务表单还没有完成！");return;
                        }
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                gettaskinfo();
            }
        };


        var gettaskinfo = function(){
            if(parseInt(cluetype) == 2){
                //任务线索
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from tasks",
                    success:function(rs){
                        var finded = false;
                        for(var i= 0,l=rs.rows.length;i<l;i++){
                            var thisdata = rs.rows.item(i),
                                thistaskinfo = thisdata.t_info;

                            thistaskinfo = (thistaskinfo)? eval('('+thistaskinfo+')') : {};

                            var thisclues = (thistaskinfo.CLUES) ? thistaskinfo.CLUES : [];

                            for(var z= 0,zl=thisclues.length;z<zl;z++){
                                if(thisclues[z] == cluesid){
                                    finded = true;
                                    taskinfo = thistaskinfo;
                                    break;
                                }
                            }

                            if(finded){ break;}
                        }

                        getclientinfo();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //自建线索
                taskinfo={};
                getclientinfo();
            }
        };


        var getclientinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clients where c_id = '"+clientid+"' ",
                success:function(rs){
                    var thisdata = rs.rows.item(0);
                    thisdata = (thisdata)? thisdata.c_info : "{}";
                    thisdata = (thisdata)? eval('('+thisdata+')') : {};
                    clientinfo = thisdata;
                    doit();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };



        var doit = function(){
            var endtime = new Date().getTime(),
                c_sql = [];

            c_sql.push("update clues set c_state ='"+state+"',c_endtime = '"+endtime+"' ,c_edit = '1' where c_id = '"+cluesid+"'   ");

            //增加系统日志
            var log_title = CMBC_MESSAGE.sysLogtype.t7,
                log_data = {
                    taskid:(taskinfo.TASK_ID)? taskinfo.TASK_ID : "",
                    tasktype:(taskinfo.TYPE)? taskinfo.TYPE : "",
                    taskname:(taskinfo.TASK_NAME)? taskinfo.TASK_NAME : "",
                    clueid:cluesid,
                    cluetype:cluetype,
                    cluestate:state,
                    clientid:clientinfo.CUST_ID,
                    clientname:clientinfo.CUST_NAME,
                    typename:CMBC_MESSAGE.sysLogtype.t7
                },
                log_group = CMBC_MESSAGE.sysLogGroup.g2,
                log_info = CMBC_MESSAGE.sysLogtype.m7(log_data),
                log_nowtime = new Date().getTime(),
                log_address = phonegap.getMyAddressPoint(),
                log_other = JSON.stringify(log_data);

            c_sql.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );




            DATAINTERFACE.sqlite.execs({
                sql:c_sql,
                success:function(){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        getcluestate();
    },
    //保存线索报告
    saveClueReport:function(datas){
        var cluesdata = datas.clueReportData,
            cluesnoteid = datas.clueReportId,
            cluesId = datas.cluesId,
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if( cluesId ){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        var maxuuid = "10000000000000000000",
            sqls = [],
            taskinfo = null,
            cluetype = null,
            clientid = null,
            clientinfo = null;

        var getclueinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_id='"+cluesId+"'",
                success:function(rs){
                    if(rs.rows.length != 1 ){error1("线索不存在或已删除！");return;}

                    cluetype = rs.rows.item(0).c_type;
                    clientid = rs.rows.item(0).c_client_id;

                    gettaskinfo();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var gettaskinfo = function(){
            if(parseInt(cluetype) == 2){
                //任务线索
                DATAINTERFACE.sqlite.exec({
                    sql:"select * from tasks",
                    success:function(rs){
                        var finded = false;
                        for(var i= 0,l=rs.rows.length;i<l;i++){
                            var thisdata = rs.rows.item(i),
                                thistaskinfo = thisdata.t_info;

                            thistaskinfo = (thistaskinfo)? eval('('+thistaskinfo+')') : {};

                            var thisclues = (thistaskinfo.CLUES) ? thistaskinfo.CLUES : [];

                            for(var z= 0,zl=thisclues.length;z<zl;z++){
                                if(thisclues[z] == cluesId){
                                    finded = true;
                                    taskinfo = thistaskinfo;
                                    break;
                                }
                            }

                            if(finded){ break;}
                        }

                        getclientinfo();
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //自建线索
                taskinfo={};
                getclientinfo();
            }
        };

        var getclientinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clients where c_id = '"+clientid+"' ",
                success:function(rs){
                    var thisdata = rs.rows.item(0);
                    thisdata = (thisdata)? thisdata.c_info : "{}";
                    thisdata = (thisdata)? eval('('+thisdata+')') : {};
                    clientinfo = thisdata;
                    doit();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var doit = function(){
            if(cluesnoteid){
                //修改线索报告
                DATAINTERFACE.sqlite.exec({
                    sql:"update summaries set s_content = '"+cluesdata+"',s_isupdate=null,s_edit='1' where s_id = '"+cluesnoteid+"' ",
                    success:function(){
                        success1(cluesnoteid);
                    },
                    error:function(){
                        error1(CMBC_MESSAGE.sql.select_err);
                    }
                })
            }else{
                //新建线索报告

                //获取报告的最大uuid
                var getmaxuuid = function(){
                    DATAINTERFACE.sqlite.exec({
                        sql:"select max(s_id) as tt from summaries ",
                        success:function(rs){
                            maxuuid = (rs.rows.item(0).tt) ? rs.rows.item(0).tt : maxuuid ;
                            savecluesnote();
                        },
                        error:function(){
                            error1(CMBC_MESSAGE.sql.anonymous);
                        }
                    })
                };

                //写入数据
                var savecluesnote = function(){
                    //判断uuid
                    var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                        max_uuid = parseInt(maxuuid.substr(7)),
                        this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

                    if(this_uuid<=max_uuid){ this_uuid = max_uuid; }
                    this_uuid += 1;

                    var s_id = this_uuid_last+this_uuid.toString(),
                        s_content = cluesdata,
                        s_type = '3',
                        s_time = new Date().getTime(),
                        s_edit = '1';

                    sqls.push("insert into summaries(s_id,s_content,s_type,s_time,s_edit) values('"+s_id+"','"+s_content+"','"+s_type+"','"+s_time+"','"+s_edit+"')");

                    //现在默认只有一个线索报告 直接覆盖
                    var c_summs_id = [];
                    c_summs_id.push(s_id);
                    c_summs_id = JSON.stringify(c_summs_id);
                    sqls.push("update clues set c_summs_id = '"+c_summs_id+"',c_edit='1'  where c_id = '"+cluesId+"' ");

                    //日志
                    var log_title = CMBC_MESSAGE.sysLogtype.t9,
                        log_data = {
                            taskid:(taskinfo.TASK_ID)? taskinfo.TASK_ID : "",
                            tasktype:(taskinfo.TYPE)? taskinfo.TYPE : "",
                            taskname:(taskinfo.TASK_NAME)? taskinfo.TASK_NAME : "",
                            clueid:cluesId,
                            cluetype:cluetype,
                            clientid:clientinfo.CUST_ID,
                            clientname:clientinfo.CUST_NAME,
                            typename:CMBC_MESSAGE.sysLogtype.t9
                        },
                        log_group = CMBC_MESSAGE.sysLogGroup.g2,
                        log_info = CMBC_MESSAGE.sysLogtype.m9(log_data),
                        log_nowtime = new Date().getTime(),
                        log_address = phonegap.getMyAddressPoint(),
                        log_other = JSON.stringify(log_data);

                    sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );



                    DATAINTERFACE.sqlite.execs({
                        sql:sqls,
                        success:function(){
                            success1(s_id);
                        },
                        error:function(){
                            error1(CMBC_MESSAGE.sql.select_err);
                        }
                    })
                };

                getmaxuuid();
            }
        };

        getclueinfo();

    },
    //音频接口
    getAudio:function(datas){
        var audioname = datas.audioName,  //废弃
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        DATAINTERFACE.media.getAudioFromSystem({
            success:function(src){
                var backfilename = DATAHANDLER.fileuuid()+src.substr(src.lastIndexOf(".")),
                    filename = DATAINTERFACE.directory.resource.fullPath+"/"+backfilename;


                xFace.CMBC.file.copyFileToXApp(src,filename,function(){

                    success1(backfilename);
                    /*
                    if(audioname){
                        DATAINTERFACE.file.del({
                            dir:"resource",
                            file:audioname,
                            success:function(){
                                success1(backfilename);
                            },
                            error:error1
                        });
                    }else{
                        success1(backfilename);
                    }
                    */
                },error1);

            },
            error:error1
        });
    },
    //视频接口
    getVideo:function(datas){
        var audioname = datas.videoName,   //废弃
            success1 = datas.success,
            error1 = datas.error,
            getparam = datas.param;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        DATAINTERFACE.media.getVideoFromSystem({
            times:MYSET.videoLength,
            success:function(src){
                var filename = src.substr(src.lastIndexOf("/")+1);
                success1(filename);


                /*
                DATAINTERFACE.file.copyToResource({
                    srcs:newsrcs,
                    success:function(rs){
                        var aa = rs.join(",");
                        success1(aa);
                    },
                    error:function(err){
                        error1(err);
                    }
                });
                */
            },
            error:function(){
                error1("拍摄失败");
            },
            param:getparam
        });
    },
    //图片接口
    getImage:function(datas){
        var audioname = datas.imageName,  //废弃
            success1 = datas.success,
            error1 = datas.error,
            getparam = datas.param,
            value = datas.value,
            number = 0,
            limit = 1;

        if(value){
            number = value.split(",").length;
        }

        if($.isObject(getparam) && getparam.LMT){
            limit = parseInt(getparam.LMT);
        }

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};


        DATAINTERFACE.media.getImageFromCamera({
            success:function(srcs){
                if(!$.isArray(srcs)){error1("存储图片失败");return;}
                var backdata = [];
                for(var i= 0,l=srcs.length;i<l;i++){
                    var thisdata = srcs[i],
                        filename = thisdata.substr(thisdata.lastIndexOf("/")+1);
                    backdata.push(filename);
                }
                var newbackdata = backdata.join(","),
                    backsrcs = "";

                if(limit <= 1){
                    backsrcs = newbackdata;
                }else{
                    if(value){
                        backsrcs = value + "," + newbackdata;
                    }else{
                        backsrcs = newbackdata;
                    }

                }

                success1(backsrcs);

                /*
                DATAINTERFACE.file.copyToResource({
                    srcs:srcs,
                    success:function(rs){
                        var aa = rs.join(",");
                        success1(aa);
                    },
                    error:function(err){
                        error1(err);
                    }
                });
                */
            },
            error:function(err){
                var message = err || "存储图片失败";
                error1(message);
            },
            param:getparam,
            hasNumber:number
        });
    },
    //删除自建线索
    delclue:function(datas){
        var cluesId = datas.cluesId,
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if( cluesId ){}else{error1(CMBC_MESSAGE.argument.parameterMissing);return;}

        var getcluesinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from  clues  where c_id = '"+cluesId+"'   ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("该线索不存在！");return;}
                    var thistype = parseInt(rs.rows.item(0).c_type),
                        thisstate = parseInt(rs.rows.item(0).c_state);

                    //old__________________
                    //if(parseInt(thistype) != 1 ){error1("该线索不是自建线索，不能删除！");return;}
                    //if(parseInt(thisstate) == 2 ){error1("该自建线索正在执行中，不能删除！");return;}
                    //new__________________
                    if(thistype != 1 ){error1("该线索不是自建线索，不能删除！");return;}
                    if(thisstate == 6 ||  thisstate == 9){}else{error1("该自建线索需要在办结或废止状态时才能删除！");return;}


                    delclues();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var delclues = function(){
            var sqls = [];
            //标示线索无用
            sqls.push("update  clues set c_del = '1'  where c_id = '"+cluesId+"'   ");
            //标示表单数据无效
            sqls.push("update templagerdata set t_del = '1' where t_clues_id = '"+cluesId+"'   ");

            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    success1("自建线索删除成功！");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getcluesinfo();
    },



    //产品部分==========================================================================
    //获取产品目录树
    getProductIndex:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            filename = datas.filename;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};


        var getindex = function(){
            DATAINTERFACE.file.read({
                dir:"datas",
                filename:filename,
                success:function(data){
                    var backdata = (data)? eval('('+data+')') : {};
                    getproducts(backdata);
                },
                error:error1
            })
        };

        var getproducts = function(datas){
            if(filename == "XWYW.txt"){
                success1(datas);
                return;
            }

            var indexs =  datas.CATEGORY,
                products = datas.PRODIDS,
                productname = {},
                backproducts = [],
                newproducts = [];

            DATAINTERFACE.sqlite.exec({
                sql:" select * from products ",
                success:function(rs){
                    //处理数据
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i),
                            thisid = thisdata.p_id,
                            thisname = thisdata.p_name;

                        productname[thisid] = thisname;
                        if(parseInt(thisdata.p_isnew) == 1){
                            newproducts.push(thisdata);
                        }
                    }

                    //增加查询的对象和转拼音
                    var pinyinku = new $.pm.Pinyin();

                    for(var z= 0,zl=products.length;z<zl;z++){
                        var thisval = products[z];
                        if(productname[thisval]){
                            backproducts.push({
                                CATE_ID:thisval,
                                CATE_NAME:productname[thisval],
                                CATE_PY:pinyinku.GetQP(productname[thisval]),
                                CATE_JP:pinyinku.GetJP(productname[thisval])
                            })
                        }else{
                            backproducts.push({
                                CATE_ID:thisval,
                                CATE_NAME:productname[thisval],
                                CATE_PY:"",
                                CATE_JP:""
                            })
                        }
                    }

                    //自动增加新产品的目录
                    if(newproducts.length != 0){
                        var temp_newproduct = [];
                        for(var j= 0,jl=newproducts.length;j<jl;j++){
                            var temp_data = newproducts[j];
                            temp_newproduct.push({
                                CATE_CD:temp_data.p_no,
                                CATE_ID:temp_data.p_id,
                                CATE_NAME:temp_data.p_name,
                                CHILDREN:[],
                                TYPE:"2"
                            })
                        }

                        indexs.CHILDREN.push({
                            CATE_CD:"",
                            CATE_ID:"",
                            CATE_NAME:"最近更新",
                            CHILDREN:temp_newproduct,
                            TYPE:"1",
                            IMG:"new"
                        })
                    }


                    //输出
                    success1({
                        searchProducts:backproducts,
                        productsIndex:indexs
                    });
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })

        };



        getindex();
    },
    //获取小薇目录
    getXWProductIndex:function(datas){
        datas.filename = "MICRO.txt";
        this.getProductIndex(datas);
    },
    //获取产品大全目录
    getCPDQProductIndex:function(datas){
        datas.filename = "TOTAL.txt";
        this.getProductIndex(datas);
    },
    //获取培训园地目录
    getPXYDProductIndex:function(datas){
        datas.filename = "TRAIN.txt";
        this.getProductIndex(datas);
    },
    //获取小薇建线索的目录
    getXWXSProductIndex:function(datas){
        datas.filename = "XWYW.txt";
        this.getProductIndex(datas);
    },
    //获取产品详细信息
    getProductFile:function(datas){
        var productid = datas.productId,
            filename = datas.fileName,
            success1 = datas.success,
            error1 = datas.error,
            type = datas.type,
            pdir = DATAINTERFACE.directory.cp;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if(!productid){error1("缺少参数！");return;}
        if(!filename){error1("缺少参数！");return;}

        productid = productid.toString();

        var productname = null;

        var getproductname = function(){
            DATAINTERFACE.sqlite.exec({
                sql:" select * from products where p_id = '"+productid+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1){ error1("产品不存在！");return;}
                    productname = rs.rows.item(0).p_name;
                    getfileobj();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var getfileobj = function(){
            pdir.getDirectory(productid, {create: false, exclusive: false}, readfile, error1);
        };

        var readfile = function(dir){
            phonegap.files.readFile({
                dir:dir,
                file:filename,
                success:function(data){
                    if(type == "dir"){
                        //读取目录
                        var backdata = (data)? eval('('+data+')') : {};


                        var log_data = {
                            productid:productid,
                            productname:productname
                        };

                        DATAINTERFACE.datas.addSysLog({
                            success:function(){
                                success1(backdata);
                            },
                            error:function(){
                                success1(backdata);
                            },
                            title:CMBC_MESSAGE.sysLogtype.t18,
                            info:CMBC_MESSAGE.sysLogtype.m18(log_data),
                            group:CMBC_MESSAGE.sysLogGroup.g3,
                            other:log_data
                        });

                    }else{
                        //读取详细信息 并解密
                        if(!MYSET.productDecrypt){
                            success1(data);
                        }else{
                            decryptfile(data);
                        }
                    }
                },
                error:function(err){
                    error1(err);
                }
            })
        };

        var decryptfile = function(str){
            phonegap.SecurityCard.md5({
                str:str,
                type:"decrypt",
                success:function(rs){
                    success1(rs);
                },
                error:function(){
                    error1("获取文件信息失败！");
                }
            })



        };

        if(type == "dir"){
            getproductname();
        }else{
            getfileobj();
        }

    },
    //获取产品的目录
    getProductFileIndex:function(datas){
        datas.fileName = "data.txt";
        datas.type = "dir";
        DATAINTERFACE.datas.getProductFile(datas);
    },
    //获取产品节点详细信息
    getProductFileInfo:function(datas){
        datas.type = "info";
        DATAINTERFACE.datas.getProductFile(datas);
    },


    //用户部分==========================================================================
    /*
    userInfo:{
        USER_NAME:"tester",
        AREAS:[{GROUP_ID: "5",GROUP_NAME: "四川成都"}],
        EMAIL:"564763782@qq.com",
        GROUPS:[{GROUP_ID: "3",GROUP_NAME: "游击队"}],
        HEAD_URL:"用户头像URL",
        EXTEND:"配置的默认显示省市区参数  字符串对象",
        MOBILE:"18382305422",
        ORGS:[{GROUP_ID: "2",GROUP_NAME: "民生银行"}],
        ORG_NAME:"民生银行",
        USER_CD:"0000011304",
        USER_ID:"1"
    },
    */
    userInfo:null,

    //通告、公告部分====================================================================
    //获取系统信息
    getNoticeInfo:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            type = datas.type;


        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        DATAINTERFACE.sqlite.exec({
            sql:"select * from notices where n_type = '"+type+"' order by notices_id desc limit "+MYSET.newMessageNumber+"  ",
            success:function(rs){
                var backdata = [];
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = (rs.rows.item(i).n_info) ?  eval('('+rs.rows.item(i).n_info+')') : {};
                    backdata.push(thisdata);
                }

                success1(backdata);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //首页获取广告
    getAdvertising:function(datas){
        datas.type = "2";
        DATAINTERFACE.datas.getNoticeInfo(datas);
    },
    //首页获取系统公告
    getSystemNotice:function(datas){
        datas.type = "1";
        DATAINTERFACE.datas.getNoticeInfo(datas);
    },
    //首页获取最新信息
    getNewMessage:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        DATAINTERFACE.sqlite.exec({
            sql:"SELECT * from message where m_type = '1'  ORDER BY message_id desc  ",
            success:function(rs){
                var backdata = [],
                    maxnumber = MYSET.newMessageNumber,
                    nownumber = 0,
                    myname = DATAINTERFACE.datas.userInfo.USER_NAME || "";

                for(var i= 0,l=rs.rows.length;i<l;i++){
                    if(nownumber == maxnumber){
                        break;
                    }
                    var thisdata = (rs.rows.item(i).m_info) ? eval('('+rs.rows.item(i).m_info+')') : {},
                        thistext = "",
                        speachs = ($.isArray(thisdata.CONTENTS))? thisdata.CONTENTS : [] ;

                    for(var z= speachs.length-1;z>=0;z--){
                        if(z==0){
                            thistext = speachs[z].CONTENT;
                            nownumber += 1;
                            break;
                        }
                        if(speachs[z].CREATER != myname){
                            thistext = speachs[z].CONTENT;
                            nownumber +=1 ;
                            break;
                        }
                    }

                    backdata.push({
                        CREATER:rs.rows.item(i).m_creater,
                        CREATE_DATE:rs.rows.item(i).m_data,
                        RECEIVER:rs.rows.item(i).m_sendto,
                        CONTENT:thistext,
                        NOTICE_ID:rs.rows.item(i).m_id
                    })
                }

                success1(backdata);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //获取信息列表
    getMessageList:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        DATAINTERFACE.sqlite.exec({
            //sql:"select m_info as info,'m' as type,m_id as id,m_data as data from message UNION select n_info as info,'n' as type,n_id as id,n_data as data from notices order by data desc ",
            sql:"select m_info as info,'m' as type,m_id as id,m_data as data,m_type as typess,m_isreaded as isreaded from message  UNION select n_info as info,'n' as type,n_id as id,n_data as data,n_type as typess,n_isreaded as isreaded from notices where n_type='1' order by type,typess,data desc",
            success:function(rs){
                var backdata = [];
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = (rs.rows.item(i).info)? eval('('+rs.rows.item(i).info+')') : {},
                        type = thisdata.TYPE,
                        btype = rs.rows.item(i).type,
                        thisid = rs.rows.item(i).id,
                        thistimedata = rs.rows.item(i).data,
                        isreaded = rs.rows.item(i).isreaded;

                    backdata.push({
                        ID:thisid,
                        TYPE:type,
                        CLASSES:btype,
                        DATETIME:thistimedata,
                        ISREADED:(isreaded)? true : false ,
                        INFO:thisdata
                    })
                }

                success1(backdata);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })

    },
    //实时信息回复
    replyMessage:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            messageid = datas.messageId,
            messageinfo = datas.messageInfo;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if(!messageid || !messageinfo){error1("缺少参数！");return;}


        var messageobj = null,
            notupno = null;   //还未上传的信息从第几条开始

        //获取信息
        var getmessageinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from message where m_id = '"+messageid+"' ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("没有找到该id的记录！");return;}
                    messageobj = (rs.rows.item(0).m_info) ?  eval('('+rs.rows.item(0).m_info+')') : {};
                    notupno = rs.rows.item(0).m_notupno;

                    updatemessage();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //保存信息
        var updatemessage = function(){
            var thiscreater = DATAINTERFACE.datas.userInfo.USER_NAME,
                thisdatatime = new Date().getTime(),
                thiscontent = messageinfo;

            messageobj.CONTENTS.push({
                CREATE_DATE:thisdatatime,
                CREATER:thiscreater,
                CONTENT:thiscontent
            });

            notupno = (notupno)? notupno : messageobj.CONTENTS.length-1;

            var thismessageinfo = JSON.stringify(messageobj);


            DATAINTERFACE.sqlite.exec({
                sql:"update  message  set m_info = '"+thismessageinfo+"',m_edit = '1',m_notupno='"+notupno+"'   where m_id = '"+messageid+"' ",
                success:function(){
                    success1("")
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getmessageinfo();
    },
    //客户需求提交
    customerNeedsSubmit:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clientid = datas.clientId,
            grouptype = datas.groupType,
            receiveid = datas.receiveId,
            messageinfo = datas.messageInfo;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if(!messageinfo){error1("缺少参数！");return;}
        if(!grouptype){error1("缺少参数！");return;}
        if(!clientid){error1("缺少参数！");return;}
        if(!receiveid){error1("缺少参数！");return;}


        var maxtemplateid = "10000000000000000000";
        var getmaxuuid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select max(m_id) from message ",
                success:function(rs){
                    if(rs.rows.length != 0){
                        maxtemplateid = (rs.rows.item(0).tt)? rs.rows.item(0).tt : maxtemplateid;
                    }
                    insterdata();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var insterdata = function(){
            var this_uuid = parseInt(DATAHANDLER.uuid().substr(7)),
                max_uuid = parseInt(maxtemplateid.substr(7)),
                this_uuid_last = (DATAHANDLER.uuid().substr(0,7));

            if(this_uuid<=max_uuid){ this_uuid = max_uuid; }

            var m_id = this_uuid_last + this_uuid.toString(),
                m_creater = DATAINTERFACE.datas.userInfo.USER_NAME,
                m_data = new Date().getTime(),
                m_type = '2',
                m_sendto = receiveid,
                m_client_id = clientid,
                m_info = null,
                m_edit = '1';

            m_info = {
                TYPE:2,
                NOTICE_ID:m_id,
                CONTENTS:[],
                CUST_ID:m_client_id,
                CREATE_DATE:m_data,
                CREATER:m_creater,
                RECEIVER:m_sendto
            };
            m_info.CONTENTS.push({
                CREATE_DATE:m_data,
                CREATER:m_creater,
                CONTENT:messageinfo
            });

            if(grouptype == "1"){
                m_info.TEAM_ID = receiveid;
            }else{
                m_info.ORG_ID = receiveid;
            }

            m_info = JSON.stringify(m_info);


            DATAINTERFACE.sqlite.exec({
                sql:"insert into message(m_id,m_creater,m_data,m_type,m_sendto,m_client_id,m_info,m_edit,m_isreaded)  values('"+m_id+"','"+m_creater+"','"+m_data+"','"+m_type+"','"+m_sendto+"','"+m_client_id+"','"+m_info+"','"+m_edit+"','1') ",
                success:function(){
                    success1("");
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        getmaxuuid();
    },
    //客户需求接收方列表
    customerNeedsSendtos:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        var temp_data = DATAINTERFACE.datas.userInfo,
            backdata = [];
        if(!temp_data){error1("你还没有登录！");return;}


        if($.isArray(temp_data.GROUPS)){
            for(var i= 0,l=temp_data.GROUPS.length;i<l;i++){
                var temp_a = temp_data.GROUPS[i];
                temp_a.GROUP_TYPE = "1";
                backdata.push(temp_a);
            }
        }
        if($.isArray(temp_data.ORGS) && temp_data.ORGS.length != 0){
            var length = temp_data.ORGS.length - 1;
            var temp_b = temp_data.ORGS[length];
            temp_b.GROUP_TYPE = "2";

            backdata.push(temp_b);
        }

        success1(backdata);
    },
    //客户需求列表
    customerNeedsList:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clientid = datas.clientId;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};


        var temp_data = DATAINTERFACE.datas.userInfo,
            recives = {
                "1":{},
                "2":{}
            },
            temp_recive = [],
            backdata = [];

        if(!temp_data){error1("你还没有登录！");return;}

        //拼接接收者对象
        if($.isArray(temp_data.GROUPS)){
            for(var i= 0,l=temp_data.GROUPS.length;i<l;i++){
                var thisdata = temp_data.GROUPS[i];
                recives["1"][thisdata.GROUP_ID] = thisdata.GROUP_NAME;
            }
        }
        if($.isArray(temp_data.ORGS) && temp_data.ORGS.length != 0 ){
            var length = temp_data.ORGS.length - 1;
            var thasdata = temp_data.ORGS[length];
            recives["2"][thasdata.GROUP_ID] = thasdata.GROUP_NAME;
        }
        //======================


        var changestate = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"update message set  m_isreaded='1' where m_type = '2' and  m_client_id = '"+clientid+"' ",
                success:function(){
                    success1(backdata);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };




        DATAINTERFACE.sqlite.exec({
            sql:"select * from message where m_type = '2' and  m_client_id = '"+clientid+"' order by message_id desc",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisindatas = (thisdata.m_info) ? eval('('+thisdata.m_info+')') : {},
                        thisinfo = thisindatas.CONTENTS[0].CONTENT,
                        thisdatetime = thisindatas.CONTENTS[0].CREATE_DATE,
                        thisreplynumber = thisindatas.CONTENTS.length - 1,
                        thisreplays = thisindatas.CONTENTS,
                        thistype = (thisindatas.ORG_ID) ? 2 : 1,
                        thissendtoid = (thistype == 2) ? thisindatas.ORG_ID : thisindatas.TEAM_ID,
                        thisisreaded = (thisdata.m_isreaded)? true : false ,
                        thisisupdate = (thisdata.m_edit)? false : true;

                    thisreplays.shift();

                    for(var z= 0,zl=thisreplays.length;z<zl;z++){
                        var temp_name = thisreplays[z].CREATER;
                        thisreplays[z].CREATER = "from:"+ temp_name;
                    }

                    backdata.push({
                        CREATE_DATE:thisdatetime,
                        RECEIVER: (recives[thistype])? "to:"+recives[thistype][thissendtoid] : "",
                        CONTENT:thisinfo,
                        REPLYNUMBER:thisreplynumber,
                        REPLAYS:thisreplays,
                        ISREADED:thisisreaded,
                        ISUPDATE:thisisupdate
                    })

                }

                changestate();
                /*
                if(thisisreaded){
                    success1(backdata);
                }else{
                    changestate();
                }
                */

            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })


    },
    //首页数据提示
    xwIndexData:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};


        var newtask = 0,
            notcomplatetask = 0,
            newproduct = 0,
            selectin = [],
            resourcesize = 0,
            emaillist = 0;


        //获取完成任务和未完成任务数量
        var gettasknumber = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from tasks ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisstate = rs.rows.item(i).t_state;

                        if(thisstate == '1'){
                            newtask++;
                        }
                        if(thisstate == '2' || thisstate == '4'){
                            notcomplatetask++;
                        }
                    }

                    getnewproduct();

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //获取新产品数量
        var getnewproduct = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from products where p_isnew = '1' ",
                success:function(rs){
                    newproduct = rs.rows.length;


                    //getallcomplatebusines();
                    getcompletefile();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        /*
        //获取完成未上传的业务及所属线索
        var getallcomplatebusines = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select sum(1) as total,sum(t_iscomplete) as complate,t_clues_id,t_busines_id from templagerdata where t_del is null and t_isupdate is null GROUP BY t_clues_id,t_busines_id   ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thistotal = rs.rows.item(i).total,
                            thiscomplate = rs.rows.item(i).complate,
                            thiscluesid = rs.rows.item(i).t_clues_id,
                            thisbusinesid = rs.rows.item(i).t_busines_id;

                        if(parseInt(thistotal) == parseInt(thiscomplate) ){
                            //该业务是完成的
                            selectin.push(thiscluesid+thisbusinesid);
                        }
                    }
                    getresourcename();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.anonymous);
                }
            })
        };

        //获取要上传的资源大小
        var getresourcename = function(){
            var temp_in = "'"+selectin.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:"select * from resources  where r_clues_id || r_busines_id in ("+temp_in+") and r_del is null ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        resourcesize += parseInt(rs.rows.item(i).r_size);
                    }

                    complate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.anonymous);
                }
            })
        };
*/

        var getcompletefile = function(){
            DATAINTERFACE.datas.getNotUpdateFileSize({
                success:function(rs){
                    resourcesize = rs;
                    getemaillist();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var getemaillist = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from email  ",
                success:function(rs){
                    emaillist = rs.rows.length;
                    complate();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        //完成
        var complate = function(){
            success1({
                newtask:newtask,
                notcomplatetask:notcomplatetask,
                newproduct:newproduct,
                resourcesize:resourcesize,
                emailnumber:emaillist
            })
        };


        gettasknumber();
    },
    //信息模块获取详细信息
    getOneMessageInfo:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            id = datas.id,
            type = datas.type,
            classs = datas.class;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        if(!id || !type || !classs){error1("缺少参数！");return;}


        var tablename = (classs == "m") ? "message" : "notices" ,
            thistype = (classs == "m") ? "m_type" : "n_type",
            thisid = (classs == "m") ? "m_id" : "n_id",
            thisreaded = (classs == "m") ? "m_isreaded" : "n_isreaded",
            sqls = "select * from "+tablename+" where  "+thistype+" = '"+type+"' and "+thisid+" = '"+id+"' ",
            sqls1 = "update  "+tablename+" set  "+thisreaded+" = '1'  where  "+thistype+" = '"+type+"' and "+thisid+" = '"+id+"' ";


        var changestate = function(backdata){
            DATAINTERFACE.sqlite.exec({
                sql:sqls1,
                success:function(){

                    success1(backdata);

                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })

        };



        DATAINTERFACE.sqlite.exec({
            sql:sqls,
            success:function(rs){
                if(rs.rows.length != 1){error1("没有找到数据！");return;}

                var backdata = rs.rows.item(0).m_info || rs.rows.item(0).n_info ;
                backdata = (backdata)? eval('('+backdata+')') : {};

                //是否已看过
                var isreaded = (classs == "m") ?  rs.rows.item(0).m_isreaded : rs.rows.item(0).n_isreaded,
                    isupdate = null,
                    isnotupno = null;

                //判断是否上传过
                if(classs == "m"){
                    var temp_datas = backdata.CONTENTS;
                    if(parseInt(type) == 1){
                        //实时信息
                        isnotupno = (rs.rows.item(0).m_notupno)?  rs.rows.item(0).m_notupno : temp_datas.length   ;
                        for(var i= 0,l=temp_datas.length;i<l;i++){
                            temp_datas[i].ISUPDATE = (i<isnotupno) ;
                            /*
                            if(i>=isnotupno){
                                temp_datas[i].ISUPDATE = false;
                            }else{
                                temp_datas[i].ISUPDATE = true;
                            }
                            */
                        }
                    }else{
                        //客户需求
                        temp_datas[0].ISUPDATE = (rs.rows.item(0).m_edit)? false : true;
                    }
                }

                backdata.ISREADED = (isreaded)? true : false ;

                if(isreaded){
                    success1(backdata);
                }else{
                    changestate(backdata);
                }

            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })

    },

    //日志部分===============================================================
    //增加个人日志
    addMyLog:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            title = datas.title,
            info = datas.info,
            group = datas.group,
            _this = this;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        if(!title || !info || !group){error1("缺少参数！");return;}

        var nowtime = new Date().getTime(),
            thistyoe = "2",
            createaddress = phonegap.getMyAddressPoint(),
            edit = '1';

        DATAINTERFACE.sqlite.insertRowBackId({
            tableName:"mylog",
            fields:["c_date","c_address","c_content","c_title","c_group","c_type","c_edit"],
            values:[nowtime,createaddress,info,title,group,thistyoe,edit],
            success:function(c_id){

                var log_datass = {
                    group:group,
                    logid:c_id,
                    title:title
                };

                _this.addSysLog({
                    success:function(){success1(c_id);},
                    error:error1,
                    title:CMBC_MESSAGE.sysLogtype.t2,
                    info:CMBC_MESSAGE.sysLogtype.m2(log_datass),
                    group:CMBC_MESSAGE.sysLogGroup.g5,
                    other:log_datass
                });
                //success1(c_id);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        });



    },
    //获取日志列表
    getLogList:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            type = datas.type;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        var sql="";
        if(type && (parseInt(type)==1 || parseInt(type)==2)  ){
            sql = "select * from mylog where c_isdel is null and c_type = '"+type+"' order by mylog_id desc ";
        }else{
            sql = "select * from mylog where c_isdel is null  order by mylog_id desc ";
        }


        //系统日志输出
        var syslogdata = {};
        var outputsyslog = function(thisstate){
            var data = thisstate.c_date;
            data = stamp2time(data).split(" ");
            data = data[0];

            if(!syslogdata[data]){
                //不存在
                syslogdata[data] = {
                    ID:thisstate.mylog_id,
                    CREATE_DATE:data,
                    PLACE:thisstate.c_address,
                    CONTENT:thisstate.c_content,
                    TYPE:thisstate.c_type,
                    //TITLE:thisstate.c_title,
                    TITLE:data+" 销售日志",
                    GROUP:thisstate.c_group,
                    STATE:thisstate.c_state,
                    OTHER:thisstate.c_other,
                    ISUPDATE:(thisstate.c_isupdate)? true : false
                };
            }else{
                //存在
                syslogdata[data].CONTENT = syslogdata[data].CONTENT +  "<br/>" + thisstate.c_content
            }
        };



        DATAINTERFACE.sqlite.exec({
            sql:sql,
            success:function(rs){
                var backdata = [];

                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisstate = rs.rows.item(i);

                    if(parseInt(type)==1){
                        //系统日志 按天输出
                        outputsyslog(thisstate);
                    }else{
                        backdata.push({
                            ID:thisstate.mylog_id,
                            CREATE_DATE:thisstate.c_date,
                            PLACE:thisstate.c_address,
                            CONTENT:thisstate.c_content,
                            TYPE:thisstate.c_type,
                            TITLE:thisstate.c_title,
                            GROUP:thisstate.c_group,
                            STATE:thisstate.c_state,
                            OTHER:thisstate.c_other,
                            ISUPDATE:(thisstate.c_isupdate)? true : false
                        })
                    }
                }


                if(parseInt(type)==1){
                    //对象转数组
                    for(var key in syslogdata){
                        backdata.push(syslogdata[key]);
                    }

                }


                success1(backdata);

            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //删除个人日志
    delMyLog:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            id = datas.id;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        if(!id){error1("缺少参数！");return;}

        DATAINTERFACE.sqlite.exec({
            sql:"delete from mylog where mylog_id = "+id+" ",
            success:function(){
                success1("删除日志成功!");
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //修改个人日志
    mdfMyLog:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            title = datas.title,
            info = datas.info,
            group = datas.group,
            id = datas.id;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        if(!title || !info || !id || !group){error1("缺少参数！");return;}

        var nowtime = new Date().getTime(),
            edit = '1';

        DATAINTERFACE.sqlite.exec({
            sql:"update mylog set c_group='"+group+"',c_title='"+title+"',c_content='"+info+"',c_date='"+nowtime+"',c_edit='"+edit+"' where mylog_id="+id+" and  c_type='2' ",
            success:function(){
                success1("修改日志成功!");
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //系统日志增加
    addSysLog:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            title = datas.title,
            info = datas.info,
            group = datas.group,
            other = datas.other;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        if(!title || !info || !group){error1("缺少参数！");return;}

        var nowtime = new Date().getTime(),
            thistyoe = "1",
            createaddress = phonegap.getMyAddressPoint(),
            edit = '1',
            other = JSON.stringify(other);

        DATAINTERFACE.sqlite.insertRowBackId({
            tableName:"mylog",
            fields:["c_date","c_address","c_content","c_title","c_group","c_type","c_edit","c_other"],
            values:[nowtime,createaddress,info,title,group,thistyoe,edit,other],
            success:function(c_id){
                success1(c_id);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        });
    },




    //其它====================================================================
    //获取未下载产品列表及总大小
    getProductDownloadList:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        var backdata = {
                products:{},
                filesize:0
            };

        DATAINTERFACE.sqlite.exec({
            sql:"select * from products where p_state = '1' ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i);

                    backdata.products[thisdata.p_id] = {
                        name : thisdata.p_name,
                        id : thisdata.p_id,
                        url : thisdata.p_url,
                        size : thisdata.p_size,
                        cd : thisdata.p_no,
                        ver : thisdata.p_ver
                    };

                    backdata.filesize += parseInt(thisdata.p_size);
                }
                success1(backdata);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //获取未上传数据总大小
    getNotUpdateFileSize:function(datas){
        var success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        var clueids = [];

        /*
        var getcompleteclues = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select t_clues_id,sum(1) as total,sum(t_iscomplete) as complete from templagerdata where t_del is null and t_isupdate is null  GROUP BY t_clues_id  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i);
                        if(parseInt(thisdata.total) == parseInt(thisdata.complete)){
                            clueids.push(thisdata.t_clues_id)
                        }
                    }

                getfilesize();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.anonymous);
                }
            })
        };

        var getfilesize = function(){
            var temp_clues_id = "'"+clueids.join("','")+"'",
                filesize = 0;

            DATAINTERFACE.sqlite.exec({
                sql:" select * from resources  where r_clues_id  in ("+temp_clues_id+") and r_del is null ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i);
                        filesize += parseInt(thisdata.r_size);
                    }
                    success1(filesize);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.anonymous);
                }
            })
        };
        getcompleteclues();
        */

        var getsize = function(){
            var filesize = 0;

            DATAINTERFACE.sqlite.exec({
                sql:" select * from resources  where r_isupdate is null and r_del is null ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i);
                        filesize += parseInt(thisdata.r_size);
                    }
                    success1(filesize);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        getsize();
    },
    //获取新产品数据
    getNewProductList:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            newproduct = {};

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        DATAINTERFACE.sqlite.exec({
            sql:"select * from products where p_isnew = '1' ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i);
                    newproduct[thisdata.p_id] = thisdata.p_name;
                }
                success1(newproduct);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //邮件
    postEmail:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            email = datas.email,
            productid = datas.productId;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if(!email){error1("缺少参数");return;}
        if(!productid){error1("缺少参数");return;}

        var productname = null;

        var getproductname = function(){
            DATAINTERFACE.sqlite.exec({
                sql:" select * from products where p_id = '"+productid+"'  ",
                success:function(rs){
                    if(rs.rows.length != 1){ error1("产品不存在！");return;}
                    productname = rs.rows.item(0).p_name;
                    gos();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        var gos = function(){
            var sqls = [];
            sqls.push(" INSERT into email (e_email,e_product_id) VALUES('"+email+"','"+productid+"')  ");

            //系统日志
            var log_title = CMBC_MESSAGE.sysLogtype.t17,
                log_data = {
                    productid:productid,
                    productname:productname,
                    emailto:email,
                    typename:CMBC_MESSAGE.sysLogtype.t17
                },
                log_group = CMBC_MESSAGE.sysLogGroup.g3,
                log_info = CMBC_MESSAGE.sysLogtype.m17(log_data),
                log_nowtime = new Date().getTime(),
                log_address = phonegap.getMyAddressPoint(),
                log_other = JSON.stringify(log_data);

            sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );



            DATAINTERFACE.sqlite.execs({
                sql:sqls,
                success:function(){
                    var ms = "ok";
                    success1(ms);
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        getproductname();

    },
    //邮件列表显示
    getPostEmailList:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            newproduct = [];

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        DATAINTERFACE.sqlite.exec({
            sql:"select a.*,b.p_name from email as a,products as b where a.e_product_id = b.p_id  ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i);
                    newproduct.push({
                        id:thisdata.email_id,
                        email:thisdata.e_email,
                        productName:thisdata.p_name
                    })
                }
                success1(newproduct);
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //删除待发邮件
    delEmailList:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            id = parseInt(datas.id);

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};
        if(id < 0){
            error1("参数错误！");return;
        }

        DATAINTERFACE.sqlite.exec({
            sql:"delete from email where email_id = "+id+"  ",
            success:function(){
                success1("");
            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //获取字典中的声明
    getTextInFrom:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            str = datas.str;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        if(!str){error1("缺少参数");return;}
        if(str.indexOf("_") < 0 ){error1("缺少参数");return;}

        var thisdata = str.split("_"),
            filename = "s_"+thisdata[0]+".txt",
            filekey = thisdata[1];

        DATAINTERFACE.file.read({
            filename:filename,
            dir:"datas",
            success:function(rs){
                var get_temp_data = rs,
                    temp_data = [];

                get_temp_data = ( get_temp_data )? eval('('+get_temp_data+')') : {};
                if(get_temp_data[filekey]){

                    var getdata = eval('('+get_temp_data[filekey]+')');
                    if($.isArray(getdata)){
                        for(var i= 0,l=getdata.length;i<l;i++){
                            var get_f_data = getdata[i];
                            if($.isObject(get_f_data)){
                                for(var key in get_f_data){
                                    temp_data.push(get_f_data[key]);
                                }
                            }
                        }

                        var temp_data_back = temp_data.join("<br/><br/>");
                        success1(temp_data_back);

                    }else{
                        error1("未找到数据");
                    }
                }else{
                    error1("未找到数据");
                }
            },
            error:function(){
                error1("未找到数据");
            }
        })
    },
    //数据格式转换  xml 处理成json
    xmlToJson:function(datas){
        var str = datas.str,
            success1 = datas.success,
            error1 = datas.error,
            backdata = {};

        var data = $.parseXML(str);
        data = $(data);

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        if(!str){ error1("缺少参数！");return;}
        //判断数据格式转换是否正确
        if(data.length == 0){error1("查询失败！");return;}
       // data = data.find("SaleCustomerInfoServResult");
        //if(data.length == 0){error1("查询失败！");return;}


        //判断数据返回状态是否为s
        var data_states = data.find("SaleServReturn");
        if(data_states.length == 0){ error1("查询失败！");return;}

        var data_state = data_states.find("RetType").text(),
            data_msg = data_states.find("RetMsg").text();

        if(data_state.toLowerCase() != "s"){ error1(data_msg+" ");return;}


        //解析数据=================================
        var temp_baseInfo = data.find("CustBaseInfo"),    //客户基本信息
            temp_contInfo = data.find("CustConInfoAdd"),   //地址联系信息（多条）
            temp_eleInfo = data.find("CustConInfoEle"),   //电子联系信息 （多条）
            temp_orginInfo = data.find("CustOrgInfo"),      //客户归属信息
            temp_prodouctInfo = data.find("ConProdSum");  //产品使用汇总  （多条）



        //检查用户名是否为空  为空报错
        var checkusername = temp_baseInfo.find("CustName").text();
        if(trim(checkusername) == ""){
            error1("查询失败！");
            return;
        }

        var  objToJson = function(obj){
            //只支持一层
            var backobj = {};
            obj.children().each(function(){
                var thiskey = $(this).get(0).tagName,
                    thisval = $(this).text();

                backobj[thiskey] = thisval ;
            });

            return backobj;
        };

        var objToArray = function(obj){
            //2层
            var backobj = [];
            obj.children().each(function(){
                backobj.push(objToJson($(this)));
            });
            return backobj;
        };

        backdata.CustBaseInfo = objToJson(temp_baseInfo);
        backdata.CustOrgInfo = objToJson(temp_orginInfo);
        backdata.CustConInfoAdd = objToArray(temp_contInfo);
        backdata.CustConInfoEle = objToArray(temp_eleInfo);
        backdata.ConProdSum = objToArray(temp_prodouctInfo);

        success1(backdata);


    },
    //身份证在线查询接口
    getClientInfoOnline:function(datas){
        var c_data = datas.data,
            success1 = datas.success,
            error1 = datas.error;

        success1 = ( typeof(success1) == "function" ) ? success1 : function(){};
        error1 = ( typeof(error1) == "function" ) ? error1 : function(){};

        if(!c_data.TYPE){error1("参数错误");return;}
        var type = parseInt(c_data.TYPE);
        if(type==1 || type==2){}else{error1("参数错误");return;}

        var s_data = null;
        if(type == 1){
            //行内客户
            var user_cd = c_data.CUST_CD;
            if(!user_cd){error1("参数错误");return;}

            s_data = {
                CTYPE:"ZZ",
                CNO:user_cd
            }
        }else{
            //自建客户
            var card_type = c_data.ID_TYPE,
                card_no = c_data.ID_CARD;
            if(card_type && card_no){}else{error1("参数错误");return;}

            s_data = {
                CTYPE:card_type,
                CNO:card_no
            }

        }


        DATAINTERFACE.ajax.onlineSearchUserInfo(s_data,success1,error1);
    },
    //设置当前客户为营销状态(日志记录)
    setMarkClient:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clientid = datas.clientId,
            type = datas.type;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        if(!clientid){error1("缺少参数！");return;}

        DATAINTERFACE.sqlite.exec({
            sql:"select *  from clients where c_id  = '"+clientid+"' and c_del ISNULL  ",
            success:function(rs){
                if(rs.rows.length != 1){error1("客户不存在或已删除！");return;}

                var thisdata = rs.rows.item(0).c_info;
                thisdata = (thisdata)? eval('('+thisdata+')') : {};

                var log_datass = {
                    clientid:clientid,
                    clientname:thisdata.CUST_NAME,
                    typename:CMBC_MESSAGE.sysLogtype.t1,
                    type:type
                }


                //生成日志
                datas.title = CMBC_MESSAGE.sysLogtype.t1;
                datas.info = CMBC_MESSAGE.sysLogtype.m1(log_datass);
                datas.group = CMBC_MESSAGE.sysLogGroup.g6;
                datas.other = log_datass;
                DATAINTERFACE.datas.addSysLog(datas);


            },
            error:function(){
                error1(CMBC_MESSAGE.sql.select_err);
            }
        })



    },
    //征信查询接口
    queryCredit:function(datas){
        var success1 = datas.success,
            error1 = datas.error,
            clientid = datas.clientId,
            cache = datas.cache,
            param = datas.param;

        success1 = (typeof(success1) == "function")? success1 : function(){};
        error1 = (typeof(error1) == "function")? error1 : function(){};

        if(!clientid || !$.isObject(cache) || !$.isObject(param)){error1("缺少参数！");return;}

        var clientinfo = {},
            userinfo = {},
            _this = this,
            tourldata = {
                PATH:null,
                REQ_ENTITY:{
                    HEADER:{},
                    BODY:{}
                }
            };

        //获取客户信息
        var getclientinfo = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select *  from clients where c_id  = '"+clientid+"' and c_del ISNULL  ",
                success:function(rs){
                    if(rs.rows.length != 1){error1("获取客户信息失败！");return;}

                    var thisdata = rs.rows.item(0).c_info;
                    thisdata = (thisdata)? eval('('+thisdata+')') : {};

                    clientinfo = {
                        CUST_ID:thisdata.CUST_ID,
                        CUST_NAME:thisdata.CUST_NAME,
                        ID_CARD:thisdata.ID_CARD,
                        ID_TYPE:thisdata.ID_TYPE,
                        TYPE:thisdata.TYPE,
                        GENDER:thisdata.GENDER
                    }

                    getuserinfo();
                },
                error:function(){
                    error1(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取用户信息
        var getuserinfo = function(){
            userinfo = _this.userInfo;
            createparam();
        };
        //生成参数
        var createparam = function(){
            var ajax_params = ($.isObject(param.CONF_INIT_VALUE))? param.CONF_INIT_VALUE : param ;
            if(!$.isObject(ajax_params)){error1("模板参数错误！");return;}

            var params = ajax_params.URI;
            if(!$.isObject(params)){ error1("模板参数错误！");return;}

            var url = params.PATH;
            if(!url){ error1("模板参数错误！");return;}
            tourldata.PATH = url;

            params = params.PARMS;
            if(!$.isObject(params)){ error1("模板参数错误！");return;}

            var fn_name = params.METHOD;
            if(!fn_name){ error1("模板参数错误！");return;}

            tourldata.REQ_ENTITY.HEADER = {
                REQ_NO:DATAHANDLER.fileuuid(),
                REQ_DATE:xw_get_data(),
                REQ_TIME:xw_get_time(),
                METHOD:fn_name,
                EMP_NO:userinfo.USER_CD,
                PAD_ID:device.imei,
                REQ_SRC:"PAD"
            };

            var getbodys = params.BODY;
            if(!$.isObject(getbodys)){ error1("模板参数错误！");return;}

            var temp_data = tourldata.REQ_ENTITY.BODY;
            for(var key in getbodys){
                var choose = getbodys[key],
                    findkey = null;

                if(choose.indexOf("USER.")>-1){
                    findkey = choose.split(".")[1];
                    temp_data[key] = userinfo[findkey];
                }else if(choose.indexOf("CUST.")>-1){
                    findkey = choose.split(".")[1];
                    temp_data[key] = clientinfo[findkey];
                }else{
                    temp_data[key] = ($.isObject(cache[choose])) ? cache[choose].CONF_VALUE : "";
                }

            }

            sendajax();
        };
        //发送ajax
        var sendajax = function(){
            DATAINTERFACE.ajax.queryCredit(tourldata,function(data){
                //ajax成功
                handlerdata(data);

            },function(){
                //ajax失败
                error1("连接服务器超时！");
            })
        };
        //处理返回数据
        var handlerdata = function(data){
            //查询结构转对象
            try{
               data = eval('('+data+')');
            }catch(e){
                error1("查询结果格式错误！");return;
            }
            //解析
            if(!$.isObject(data)){error1("查询结果格式错误！");return;}
            var header = data.HEADER;
            if(!$.isObject(header)){error1("查询结果格式错误！");return;}

            var REQ_NO = header.REQ_NO,    //请求序号
                RES_DATE = header.RES_DATE,  //响应日期
                RES_TIME = header.RES_TIME,  //响应时间
                RES_CODE = header.RES_CODE,   //响应代码
                RES_DESP = header.RES_DESP;  //响应描述

            if(RES_CODE != '0000'){
                //失败
                error1(RES_DESP);
                return;
            }

            var bodyer = data.BODY;
            if(!$.isObject(bodyer)){error1("查询结果格式错误！");return;}
            var backdata = bodyer.RESULT;
            if(!$.isArray(backdata)){error1("查询结果格式错误！");return;}

            success1(backdata);
        };

        getclientinfo();
    }


};

//缓存数据
DATAINTERFACE.cache = {
    newProducts : {},
    notDownloadProducts : {}
};
