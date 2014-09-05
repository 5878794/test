var DATAHANDLER={};

//生成uuid  数据库用
DATAHANDLER.uuid = function(){
    var datatime = new Date().getTime().toString(),
        usercd = MYSET.usercd.substr(3);

    return usercd+datatime;
};
//生成uuid  文件用
DATAHANDLER.fileuuid = function(){
    var datatime = new Date().getTime().toString(),
        usercd = MYSET.usercd;
    return usercd+"_"+datatime;
};
DATAHANDLER.fileuuid1 = function(){
    var datatime = new Date().getTime().toString(),
        usercd = MYSET.usercd;
    return "s_"+usercd+"_"+datatime;
};

//获取最大的uuid (后面的接口在用  前面的没替换该接口)
DATAHANDLER.getUUID = function(id){
    var nowdate = new Date().getTime(),
        olddate = null,
        newid = null;

    if(!id || parseInt(id) == 0){
        newid = DATAHANDLER.uuid();
    }else{
        olddate = parseInt(id.substr(7));
        if(nowdate>olddate){
            newid = DATAHANDLER.uuid();
        }else{
            olddate += 1;
            newid = MYSET.usercd.substr(3) + olddate ;
        }
    }

    return newid;
};


//判断是否在内网   datas={callback:function}    返回true false
DATAHANDLER.checkNetkwork = function(datas){
    var myip = null,
        callback = datas.callback;

    callback = ( typeof(callback) == "function" )? callback : function(){};

    var getmyip = function(){
        phonegap.getIp({
            success:function(ips){
                myip = ips;
                checkip();
            }
        });
    };

    var checkip = function(){
        var ip = "195.1.152",  //匹配前3段
            checked = false;

        for(var i= 0,l=myip.length;i<l;i++){
            var thisip = myip[i];
            if(thisip.substring(0,9) == ip){
                checked = true;
                break;
            }
        }

        if(checked){
            callback(true);
        }else{
            callback(false);
        }

    };

    getmyip();
};

//数据更新
DATAHANDLER.upload = {
    all:false,          //初始化更新
    success:null,
    error:null,             //error文本
    onprogress:null,
    allstep:0,
    uploadResorce:true,
    init:function(data){
        var success = data.success,
            error = data.error,
            usertrigger = data.userTrigger || false,    //true false
            onprogress = data.onprogress || function(){},
            uploadResorce = data.uploadResorce;

        success = ( typeof(success) == "function" )? success : function(){};
        error = ( typeof(error) == "function" )? error : function(){};

        this.success = success;
        this.error = error;
        this.onprogress = onprogress;
        this.uploadResorce = uploadResorce;

        var _this = this,
            uploading = null;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from  updatatime ",
            success:function(rs){
                var cs = true;
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i);
                    if(thisdata.u_name == "updatastart" ){
                        uploading = (thisdata.u_other)? eval('('+thisdata.u_other+')') : {};
                    }else{
                        cs = false;
                    }
                }

                if(uploading){
                    //更新中被中断！！！
                    _this.all = uploading.cs;

                    //执行到上传文件
                    if(uploading.uploadfile){
                        _this.allstep = 6;
                        DATAHANDLER.uploadFile.init();
                        return;
                    }
                    //执行到上传数据
                    if(uploading.uploaddata && parseInt(uploading.uploaddata) == 1){
                        _this.allstep = 5;
                        DATAHANDLER.uploadData.init();
                        return;
                    }
                    //执行到数据备份
                    if(uploading.backup && parseInt(uploading.backup) == 1){
                        _this.allstep = 4;
                        DATAHANDLER.backupData.init();
                        return;
                    }
                    //执行到数据下载
                    if(uploading.downloaddata && parseInt(uploading.downloaddata) == 1){
                        _this.allstep = 2;
                        DATAHANDLER.downloadData.init();
                        return;
                    }

                    DATAHANDLER.uploadFile.init();
                }else{
                    _this.all = cs;
                    if(cs){

                        _this.allstep = 2;
                        //直接进入下载 打标示
                        _this.init1(cs);


                    }else{
                        //看是否是用户促发
                        if(usertrigger){
                            _this.allstep = 6;
                            DATAHANDLER.uploadFile.init();
                        }else{
                            success();
                        }
                    }
                }
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });

    },
    init1:function(cs){
        var sqls = [],
            info = {
                downloaddata:1,
                cs:cs
            };
        info = JSON.stringify(info);

        sqls.push("insert into  updatatime (u_name,u_other) values('updatastart','"+info+"')");

        DATAINTERFACE.sqlite.execs({
            sql:sqls,
            success:function(){
                DATAHANDLER.downloadData.init();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    init2:function(){
        var sqls = [],
            info = {
                uploaddata:1,
                backup:1,
                downloaddata:1,
                cs:DATAHANDLER.upload.all
            };
        info = JSON.stringify(info);

        sqls.push("insert into  updatatime (u_name,u_other) values('updatastart','"+info+"')");

        DATAINTERFACE.sqlite.execs({
            sql:sqls,
            success:function(){
                DATAHANDLER.uploadData.init();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    }
};

//上传文件
DATAHANDLER.uploadFile = {
    init:function(){
        if(DATAHANDLER.upload.uploadResorce){
            this.getFlieList();
        }else{
            DATAHANDLER.upload.init2();
        }

    },
    //获取文件列表
    getFlieList:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadResourceFile1);
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from resources where r_isupdate is null and r_del is null ",
            success:function(rs){
                var filenames = [],
                    src = DATAINTERFACE.directory.resource.fullPath;

                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisfilenames = thisdata.r_filename;

                    if(thisfilenames.indexOf(",")> -1){
                        thisfilenames = thisfilenames.split(",");
                        for(var j= 0,jl=thisfilenames.length;j<jl;j++){
                            filenames.push(src+"/"+thisfilenames[j]);
                        }
                    }else{
                        filenames.push(src+"/"+thisfilenames);
                    }
                }

                if(filenames.length != 0 ){
                    //有文件需要上传
                    filenames.push(src+"/"+"desc.json");
                    _this.zipFile(filenames);
                }else{
                    //无文件上传  跳过
                    _this.saveUpdataState();
                }

            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //打包文件
    zipFile:function(filenames){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadResourceFile2);
        var zip = DATAHANDLER.fileuuid()+".zip",
            thiszipfilename = DATAINTERFACE.directory.temp.fullPath+"/"+zip,
            _this = this;

        phonegap.zip({
            srcs:filenames,
            targetSrc:thiszipfilename,
            success:function(){
                //打包成功
                _this.saveUpdataState(zip);
            },
            error:function(){
                //打包失败
                DATAHANDLER.upload.error(CMBC_MESSAGE.file.zip_file_error);
            }
        })
    },
    //保存更新开始标示
    saveUpdataState:function(filename){
        var _this = this,
            info = {
                uploadfile:filename,
                uploaddata:1,
                backup:1,
                downloaddata:1,
                cs:DATAHANDLER.upload.all
            };

        info = JSON.stringify(info);

        //设置updatatime表中更新状态为开始更新
        DATAINTERFACE.sqlite.exec({
            sql:"insert into updatatime(u_name,u_other) values('updatastart','"+info+"') ",
            success:function(){
                if(filename){
                    //有文件需要上传
                    _this.uploadFIleStart(filename);
                }else{
                    //无文件需要上传
                    DATAHANDLER.uploadData.init();
                }

            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //上传文件
    uploadFIleStart:function(filename){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadResourceFile3);
        var _this = this,
            serverurl = MYSET.fileUploadSrc,
            localurl = DATAINTERFACE.directory.temp.fullPath+"/"+filename,
            localurl1 = localurl.substring(1),
            fileTransfer = new xFace.AdvancedFileTransfer(localurl1,serverurl,true);

        var temp_per = CMBC_MESSAGE.progressHint.uploadResourceFile3.pre;

        //进度事件
        fileTransfer.onprogress = function(evt){
            //console.log(evt);
            //CMBC_MESSAGE.progressHint.uploadResourceFile3.pre = ??   notdo
            DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadResourceFile3);
        };
        //开始
        fileTransfer.upload(function(){
            //成功
            CMBC_MESSAGE.progressHint.uploadResourceFile3.pre = temp_per;
            DATAHANDLER.uploadFile.sqlHandler();
        }, function(err){
            //失败
            CMBC_MESSAGE.progressHint.uploadResourceFile3.pre = temp_per;
            DATAHANDLER.upload.error(CMBC_MESSAGE.fileupload[err.code]);
        });
    },
    //清除上传标示成功跳转到上传数据
    sqlHandler:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadResourceFile4);
        var sqls = [],
            _this = this,
            info = {
                uploaddata:1,
                backup:1,
                downloaddata:1,
                cs:DATAHANDLER.upload.all
            };

        info = JSON.stringify(info);

        sqls.push("update resources set r_isupdate = '1' ");
        sqls.push("update updatatime set u_other = '"+info+"' where u_name = 'updatastart' ");

        DATAINTERFACE.sqlite.execs({
            sql:sqls,
            success:function(){
                DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadResourceFile5);
                DATAHANDLER.uploadData.init();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    }
};

//上传数据
DATAHANDLER.uploadData = {
    TASKS:[],
    CLUES:[],
    SUMMARIES:[],
    BUSIDATAS:[],
    TASKAPPOINT:[],
    CUSTOMERS:[],
    MESSAGES:[],
    EMAILS:[],
    LOGS:[],
    sqls:[],
    init:function(){
        this.TASKS = [];
        this.CLUES = [];
        this.SUMMARIES = [];
        this.BUSIDATAS = [];
        this.TASKAPPOINT = [];
        this.CUSTOMERS = [];
        this.MESSAGES = [];
        this.EMAILS = [];
        this.LOGS = [];
        this.sqls = [];



        this.taskstart();
    },
    //任务数据获取开始===================
    taskstart:function(){
        this.getTaskInfo();
    },
    //获取任务信息(全部)
    getTaskInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData1);
        var _this = this,
            conmplatetask = [],
            conplateclues = [];

        DATAINTERFACE.sqlite.exec({
            sql:"select * from tasks where t_edit = '1'",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = (rs.rows.item(i).t_info) ? eval('('+rs.rows.item(i).t_info+')') : {};

                    if(parseInt(thisdata.TASK_STATUS) == 3){
                        conmplatetask.push(thisdata.TASK_ID);
                        var thisclues = (thisdata.CLUES)? thisdata.CLUES : [];
                        for(var z= 0,zl=thisclues.length;z<zl;z++){
                            conplateclues.push(thisclues[z]);
                        }

                    }

                    _this.TASKS.push(thisdata);
                    _this.sqls.push("update tasks set t_edit = null where t_id = '"+rs.rows.item(i).t_id+"' ");
                }
                _this.getBusinesCompleteClues(conmplatetask,conplateclues);
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //获取要上传的业务所属线索
    getBusinesCompleteClues:function(conmplatetask,conplateclues){
        var _this = this,
            mycompletebusiness = [],
            mycompleteclues = [];

        //获取完成的业务和所属线索
        var getcomplateclueid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select sum(1) as total,sum(t_iscomplete) as complate,t_busines_id,t_clues_id  from templagerdata where  t_del is null  GROUP BY t_busines_id,t_clues_id ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i);
                        if(thisdata.total == thisdata.complate){
                            //完成的业务
                            var thisbusiness = thisdata.t_busines_id,
                                thisclues = thisdata.t_clues_id;

                            mycompletebusiness.push(thisbusiness);
                            mycompleteclues.push(thisclues);
                        }
                    }
                    _this.getClueInfo(conmplatetask,conplateclues,mycompletebusiness,mycompleteclues);
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getcomplateclueid();

    },
    //获取线索信息（条件：完成的线索任务没有完成，任务完成 下面的所有线索，没有上传过的）  自建线索只有完成了才会传
    getClueInfo:function(conmplatetask,conplateclues,mycompletebusiness,mycompleteclues){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData2);
        var _this = this,
            newarray = conplateclues.concat(mycompleteclues),
            thiscomplateclues = "'"+newarray.join("','")+"'";



        DATAINTERFACE.sqlite.exec({
            sql:"select * from clues where  c_id in ("+thiscomplateclues+") and c_edit = '1' and c_del is null   ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i);

                    _this.CLUES.push({
                        TYPE:thisdata.c_type,
                        CLUE_ID:thisdata.c_id,
                        CLUE_TITLE:thisdata.c_title,
                        CLUE_STATUS:thisdata.c_state,
                        CLUE_DESC:thisdata.c_desc,
                        CREATE_DATE:thisdata.c_starttime,
                        END_DATE:thisdata.c_endtime,
                        BUSIS: (thisdata.c_business_id) ? eval('('+thisdata.c_business_id+')') : [],
                        CUST_ID:thisdata.c_client_id,
                        NOTES: (thisdata.c_note_id) ? eval('('+thisdata.c_note_id+')'): [],
                        SUMMS: (thisdata.c_summs_id) ? eval('('+thisdata.c_summs_id+')') : []
                    });

                    _this.sqls.push("update clues set c_isupdate = '1',c_edit = null  where c_id = '"+thisdata.c_id+"' ");


                }
                _this.getSummerInfo(conmplatetask,conplateclues,mycompletebusiness,mycompleteclues);

            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //获取报告信息（条件：任务完成   任务完成下的所有线索和自建线索中状态是完成的线索报告和日志）
    getSummerInfo:function(conmplatetask,conplateclues,mycompletebusiness,mycompleteclues){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData3);
        var _this = this,
            sum_ids = [];

        var newarray = conplateclues.concat(mycompleteclues);

        var thistaskids = "'"+conmplatetask.join("','")+"'",
            thisclueids = "'"+newarray.join("','")+"'";

        var getcompletesumid = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"SELECT t_sums_id as sums from tasks WHERE t_id in ("+thistaskids+") UNION ALL SELECT c_note_id as sums from clues where c_id in ("+thisclueids+") or (c_type = '1' and  (c_state = '2' or c_state='5') )  UNION ALL SELECT c_summs_id as sums from clues where c_id in ("+thisclueids+") or (c_type = '1' and  (c_state = '2' or c_state='5') ) ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = (rs.rows.item(i).sums)? eval('('+rs.rows.item(i).sums+')') : [];

                        if($.isArray(thisdata)){
                            for(var z= 0,zl=thisdata.length;z<zl;z++){
                                sum_ids.push(thisdata[z]);
                            }
                        }
                    }

                    getsumsinfo();

                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };


        var getsumsinfo = function(){
            var temp_ids = "'"+ sum_ids.join("','")+"'";
            DATAINTERFACE.sqlite.exec({
                sql:" select * from summaries where s_id in ("+temp_ids+") and s_isupdate is null     ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i);

                        _this.SUMMARIES.push({
                            TYPE:thisdata.s_type,
                            SUMM_ID:thisdata.s_id,
                            CONTENT:thisdata.s_content,
                            CREATE_DATE:thisdata.s_time
                        });

                        _this.sqls.push("update summaries set s_edit = null,s_isupdate = '1' where s_id = '"+thisdata.s_id+"' ");
                    }

                    _this.getBusinesInfo(conmplatetask,conplateclues,mycompletebusiness,mycompleteclues);
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        getcompletesumid();
    },
    //获取模板数据（条件：任务完成下的线索+业务是完成的）
    getBusinesInfo:function(conmplatetask,conplateclues,mycompletebusiness,mycompleteclues){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData4);
        var _this = this;

        var handlerobjtoarray = function(data){
            var getval = data.CONF_VALUE,
                gettype = data.CONF_OTP,
                getnewarray = [],
                newval = null;

            for(var j= 0,jl=getval.length;j<jl;j++){
                var get1obj = getval[j],
                    get1objkey = null,
                    get1objval = null;

                for(var key in get1obj){
                    get1objkey = key;
                    get1objval = get1obj[key];
                }

                if(gettype == "K"){
                    getnewarray.push(get1objkey);
                }else{
                    getnewarray.push(get1objval);
                }
            }

            newval = getnewarray.join(",");
            data.CONF_VALUE = newval;
            return data;

        };



        var getbusinsdata = function(){
            var search_array = [],
                serach_str = null;
            for(var s= 0,sl=mycompletebusiness.length;s<sl;s++){
                search_array.push(mycompleteclues[s]+"_"+mycompletebusiness[s]);
            }

            serach_str = "'"+ search_array.join("','") + "'";

            //上传过一次然后删除的表单不管
            DATAINTERFACE.sqlite.exec({
                //slq:"select * from templagerdata where t_clues_id || '_' || t_busines_id  in ("+serach_str+") and ( (t_edit is not null and t_del is null) or (t_del is not null and t_isupdate is not null)  ) ",
                sql:"select * from templagerdata where t_clues_id || '_' || t_busines_id  in ("+serach_str+") and t_edit is not null and t_del is null ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisdata = rs.rows.item(i),
                            thisval = (thisdata.t_info)? eval('('+thisdata.t_info+')') : {},
                            handlerdata = [];

                        //对象转数组  并处理select类的值 从对象转为  key/val
                        for(var key in thisval){
                            var getdata = thisval[key],
                                getval = getdata.CONF_VALUE;

                            if($.isArray(getval)){
                                var newgetdata = handlerobjtoarray(getdata);
                                handlerdata.push(newgetdata);
                            }else{
                                handlerdata.push(getdata);
                            }
                        }

                        _this.BUSIDATAS.push({
                            CLUE_ID:thisdata.t_clues_id,
                            VERS_ID:thisdata.t_ver,
                            BUSI_ID:thisdata.t_busines_id,
                            COPY_CD:thisdata.t_uuid,
                            COPY_TITLE:thisdata.t_uuid,
                            CREATE_DATE:thisdata.t_datatime,
                            CHILDREN:handlerdata
                        });

                        _this.sqls.push("update templagerdata set t_isupdate = '1',t_edit = null where t_uuid = '"+thisdata.t_uuid+"'  ");

                    }
                    _this.taskcomplate();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getbusinsdata();

    },
    //任务数据获取完成
    taskcomplate:function(){
        this.taskAppoint();
    },
    //任务指派部分=====================
    taskAppoint:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData5);
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from tasktranspond",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thistaskid = thisdata.taskid,
                        thisusercd = thisdata.usercd;

                    _this.TASKAPPOINT.push({
                        TASK_ID:thistaskid,
                        USER_CD:thisusercd
                    });
                }
                _this.sqls.push("delete from tasktranspond");
                _this.getClientInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })


    },
    //客户信息部分=====================
    getClientInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData6);
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from clients where (c_edit = '1' and c_del is null) or ( c_del = '1' and c_isupdate='1') order by c_type  ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisinfo = (thisdata.c_info)? eval('('+thisdata.c_info+')') : {},
                        thisdel = thisdata.c_del;

                    if(thisdel == '1'){
                        thisinfo.CUST_STATUS = '1';
                    }else{
                        thisinfo.CUST_STATUS = '0';
                    }

                    _this.CUSTOMERS.push(thisinfo);
                    //下载是全量更新会删除表中所有 添加服务器的数据

                }

                _this.getMessageInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //用户信息部分=====================
    getMessageInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData6);
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from message where m_edit = '1' ",
            success:function(rs){

                for(var i= 0,l=rs.rows.length;i<l;i++){

                    var thisdata = rs.rows.item(i),
                        thisinfo = (thisdata.m_info) ? eval('('+thisdata.m_info+')') : {},
                        this_t_id = thisinfo.TEAM_ID,
                        this_o_id =  thisinfo.ORG_ID;

                    _this.MESSAGES.push({
                        TYPE:thisdata.m_type,
                        NOTICE_ID:thisdata.m_id,
                        CUST_ID:thisdata.m_client_id,
                        CONTENTS:thisinfo.CONTENTS,
                        CREATE_DATE:thisdata.m_data,
                        CREATER:thisdata.m_creater,
                        ORG_ID:this_o_id,
                        TEAM_ID:this_t_id
                    });
                }

                _this.sqls.push("update message set m_edit = null,m_notupno = null");
                _this.getEmailInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //发送邮件部分=====================
    getEmailInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData7);
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from email  ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisemail = thisdata.e_email,
                        thisproductid = thisdata.e_product_id;

                    _this.EMAILS.push({
                        EMAIL:thisemail,
                        PROD_ID:thisproductid
                    });

                }

                _this.sqls.push("delete from email");
                _this.getLogList();

            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //系统日志部分====================
    getLogList:function(){
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from mylog where c_isdel is null and c_edit = '1'  ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisdate = thisdata.c_date,
                        thisplace = thisdata.c_address,
                        thisconent = thisdata.c_content,
                        thistype = thisdata.c_type,
                        thistitle = thisdata.c_title,
                        thisgroup = thisdata.c_group;

                    _this.LOGS.push({
                        CREATE_DATE:thisdate,
                        PLACE:thisplace,
                        CONTENT:thisconent,
                        TYPE:thistype,
                        TITLE:thistitle,
                        TAGTYPE:thisgroup
                    });

                }

                var temp_time = new Date().getTime();
                temp_time = temp_time - MYSET.clearLogTime;

                _this.sqls.push("delete from mylog where c_date < '"+temp_time+"' ");
                _this.sqls.push("delete from mylog where c_isdel = '1'");
                _this.sqls.push("update  mylog set c_isupdate = '1',c_edit = null ");
                _this.complates();

            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //数据准备完成=====================
    complates:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData8);
        //打包ajax 上传  上传成功清除函数变量
        var datas = [],
            _this = this;


        //任务指派
        for(var i= 0,l=_this.TASKAPPOINT.length;i<l;i++){
            datas.push({
                ACTION_NAME:"TASK_APPOINT",
                ACTION_INFO:_this.TASKAPPOINT[i]
            });
        }


        //客户数据
        datas.push({
            ACTION_NAME:"UPLOAD_CUST_LIST",
            ACTION_INFO:{CUSTOMERS:_this.CUSTOMERS}
        });

        //任务数据
        datas.push({
            ACTION_NAME:"UPLOAD_TASK",
            ACTION_INFO:{
                TASKS:_this.TASKS,
                CLUES:_this.CLUES,
                SUMMARIES:_this.SUMMARIES,
                BUSIDATAS:_this.BUSIDATAS
            }
        });
        //用户信息
        datas.push({
            ACTION_NAME:"UPLOAD_USER",
            ACTION_INFO:{MESSAGES:_this.MESSAGES}
        });


        //邮件部分
        for(var z= 0,zl=_this.EMAILS.length;z<zl;z++){
            datas.push({
                ACTION_NAME:"EMAIL_INFO",
                ACTION_INFO:_this.EMAILS[z]
            });
        }

        //日志部分
        datas.push({
            ACTION_NAME:"USER_DIARY",
            ACTION_INFO:{DIARYS:_this.LOGS}
        });



        AJAXALL(datas,function(data){
            var success = true;
            for(var i= 0,l=data.length;i<l;i++){
                var thisdata = data[i];

                if(parseInt(thisdata.ACTION_RETURN_CODE) != 0 ){
                    success = false;
                }
            }

            if(success){
                //上传成功
                _this.handlerSql();
            }else{
                //上传失败
                DATAHANDLER.upload.error(CMBC_MESSAGE.ajax.upload_err);
            }
        });
    },
    //清数据库标示
    handlerSql:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData9);
        var _this = this,
            info = {
                backup:1,
                downloaddata:1,
                cs:DATAHANDLER.upload.all
            };
        info = JSON.stringify(info);

        _this.sqls.push("update updatatime set u_other = '"+info+"' where u_name = 'updatastart' ");

        DATAINTERFACE.sqlite.execs({
            sql:_this.sqls,
            success:function(){
                _this.TASKS=[];
                _this.CLUES = [];
                _this.SUMMARIES = [];
                _this.BUSIDATAS = [];
                _this.TASKAPPOINT = [];
                _this.CUSTOMERS = [];
                _this.MESSAGES = [];
                _this.EMAILS = [];
                _this.LOGS = [];
                _this.sqls = [];

                DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.uploadData10);
                DATAHANDLER.backupData.init();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    }
};

//清理数据 上传备份数据(取消备份)
DATAHANDLER.backupData = {
    backupData:{},
    init:function(){
        this.backupData = {};
        this.clearDelData();
    },
    //开始清理数据库=====================
    clearDelData:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData1);
         //message 表  清除超过60天的数据
        //任务   清除完成的任务
        //notices表  清除超过60天的数据
        //resources表  清除删除的数据 和文件
        //templagerdata表 清除删除的表和 资源文件


        this.delSqlTaskCompleteData();

    },
    //检查是否有任务已完成，清除该任务相关数据
    delSqlTaskCompleteData:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData2);
        //清除线索，模板临时缓存表，模板数据表，报告表(清除该任务相关的数据)
        var _this = this,
            sql = [],
            cluess = [],
            notaskcluess = [],
            tasks =[],
            resourcename = [],
            resources = [],
            summaries = [];

        //查询完成的任务并删除
        var selectCompleteTask = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from tasks where t_state = '3'   ",
                success:function(rs){
                    var numbers = rs.rows.length;

                    for (var i = 0; i<numbers; i++ ){
                        //获取任务下的线索数组并拼装到cluess
                        var thistaskclues = (rs.rows.item(i).t_clues_id) ? eval(rs.rows.item(i).t_clues_id) : [];
                        for(var z= 0,zl=thistaskclues.length;z<zl;z++){
                            cluess.push(thistaskclues[z]);
                        }

                        //累加完成的任务id
                        tasks.push(rs.rows.item(i).t_id);

                        //累加完成的任务报告id
                        var thissummar = (rs.rows.item(i).t_sums_id)? eval(rs.rows.item(i).t_sums_id) : [];
                        for(var w= 0,wl=thissummar.length;w<wl;w++){
                            summaries.push(thissummar[w]);
                        }

                        sql.push("delete from tasks where t_id = '"+rs.rows.item(i).t_id+"'  ");
                    }
                    selectCompleteCluesNotInTask();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //查询删除的线索(不属于任务的)
        var selectCompleteCluesNotInTask = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_type = '1' and   c_del is not null  ",
                success:function(rs){
                    var numbers = rs.rows.length;

                    for (var i = 0; i<numbers; i++ ){
                        cluess.push(rs.rows.item(i).c_id);
                        notaskcluess.push(rs.rows.item(i).c_id);
                    }
                    delCompleteClues();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //删除完成的线索和自建线索删除的（不管是否在完成的任务下的）
        var delCompleteClues = function(){
            var thiscluess = "'"+cluess.join("','")+"'";
            sql.push("delete from clues where c_id in ("+thiscluess+")  ");

            delMytemplages();
        };

        //删除任务或线索对应的实际模板版本对应表
        var delMytemplages = function(){
            var thisnotaskcluess = "'"+notaskcluess.join("','")+"'";
            sql.push("delete from mytemplages where m_clues_id in ("+thisnotaskcluess+")  ");

            var thistasks = "'"+tasks.join("','")+"'";
            sql.push("delete from mytemplages where m_task_id in ("+thistasks+")   ");

            delTemplagerdata();
        };

        //删除填写的模板数据表
        var delTemplagerdata = function(){
            var thiscluess = "'"+cluess.join("','")+"'";

            sql.push("delete from templagerdata where t_clues_id in ("+thiscluess+")  ");

            selectResourceTable();
        };

        //查出资源文件表中记录（视频 音频 图片）
        var selectResourceTable = function(){
            var thisclues = "'"+cluess.join("','")+"'";

            DATAINTERFACE.sqlite.exec({
                sql:"select * from resources where r_clues_id in ("+thisclues+")  ",
                success:function(rs){
                    var numbers = rs.rows.length;

                    for (var i = 0; i<numbers; i++ ){
                        resourcename.push(rs.rows.item(i).r_filename);
                        resources.push(rs.rows.item(i).resources_id);
                    }
                    delResourceTable();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })

        };

        //删除资源表中记录
        var delResourceTable = function(){
            var thisresources = "'"+resources.join("','")+"'";

            sql.push("delete from resources where resources_id in ("+thisresources+")  ");

            delResourceFile();
        };

        //删除资源文件
        var delResourceFile = function(){
            if(resourcename.length == 0){
                selectSummaries();
                return;
            }
            DATAINTERFACE.file.dels({
                dir:"resource",
                delNames:resourcename,
                success:function(){
                    selectSummaries();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.file.dirdel);
                }
            })
        };

        //查询线索的报告表和笔记表
        var selectSummaries = function(){
            var thisclues = "'"+cluess.join("','")+"'";

            DATAINTERFACE.sqlite.exec({
                sql:"select * from clues where c_id in ("+thisclues+")  ",
                success:function(rs){
                    var numbers = rs.rows.length;

                    for (var i = 0; i<numbers; i++ ){
                        var thiscluesnote = (rs.rows.item(i).c_note_id)?  eval(rs.rows.item(i).c_note_id) : [];
                        var thissummaries = (rs.rows.item(i).c_summs_id)? eval(rs.rows.item(i).c_summs_id) : [];
                        for(var z= 0,zl=thiscluesnote.length;z<zl;z++){
                            summaries.push(thiscluesnote[z]);
                        }
                        for(var w= 0,wl=thissummaries.length;w<wl;w++){
                            summaries.push(thissummaries[w]);
                        }
                    }
                    delSummaries();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        //删除完成的报告表
        var delSummaries = function(){
            var thisSummaries = "'"+summaries.join("','")+"'";
            sql.push("delete from summaries where s_id in ("+thisSummaries+")");

            _this.delMessageNoticeData(sql);
        };

        selectCompleteTask();
    },
    //删除信息类超过60天的数据
    delMessageNoticeData:function(sql){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData3);
        var _this = this;

        //删除60天前的信息
        var outdaytime = parseInt(new Date().getTime()) - 5184000000;
        sql.push(" delete from message where m_data <= '"+outdaytime+"' ");
        sql.push(" delete from notices where n_data <= '"+outdaytime+"' ");

        _this.delTemplagerdata(sql);
    },
    //删除模板数据中删除的数据
    delTemplagerdata:function(sql){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData4);
        var _this = this;

        sql.push(" delete from templagerdata where t_del = '1' ");

        _this.getDelTemplagerResource(sql);

    },
    //获取删除的模板中的资源文件
    getDelTemplagerResource:function(sql){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData5);
        var _this = this,
            delids = [],
            delfiles = [];

        //获取删除的模板id
        var getdeltemplagerids = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from templagerdata where t_del = '1' ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        delids.push(rs.rows.item(i).t_uuid);
                    }

                    getdelfilename();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };
        //获取删除模板中的文件名及数据
        var getdelfilename = function(){
            var temp_ids = "'"+delids.join("','")+"'";
            sql.push(" delete from resources where r_uuid in  ("+temp_ids+") ");
            DATAINTERFACE.sqlite.exec({
                sql:"select * from resources where r_uuid in  ("+temp_ids+")  ",
                success:function(rs){
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        delfiles.push(rs.rows.item(i).r_filename);
                    }

                    _this.getDelResourcesFile(sql,delfiles);
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
                }
            })
        };

        getdeltemplagerids();

    },
    //获取删除的资源 并删除数据和文件
    getDelResourcesFile:function(sql,delfiles){
        var _this = this;

        sql.push("delete from resources where r_del = '1'");

        DATAINTERFACE.sqlite.exec({
            sql:"select * from resources where r_del = '1' ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    delfiles.push(rs.rows.item(i).r_filename);
                }

                _this.handlerDataFile(sql,delfiles);
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });



    },
    //删除文件
    handlerDataFile:function(sql,delfiles){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData6);
        var _this = this;
        DATAINTERFACE.file.dels({
            dir:"resource",
            delNames:delfiles,
            success:function(){
                _this.handlerDataSql(sql);
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.file.dirdel);
            }
        })
    },
    //清理数据库
    handlerDataSql:function(sql){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData7);
        var _this = this;
        DATAINTERFACE.sqlite.execs({
            sql:sql,
            success:function(){
                _this.clearDelDataComplate();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //清理完成
    clearDelDataComplate:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.clearVoidData8);
        //this.getBackupData();  //取消备份直接完成
        this.backupDataSuccess();
    },
    //开始获取备份数据=====================
    getBackupData:function(){
        //任务表 tasks
        //线索表 clues
        //模板数据表 templagerdata
        //任务对应模板 mytemplages
        //资源表 resources
        //报告表 summaries
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData1);
        this.getSQLTaskInfo();
    },
    //获取任务表信息
    getSQLTaskInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData2);
        var _this = this;
        _this.backupData.tasks = {};
        _this.backupData.tasks.fields = ["t_id","t_type","t_state","t_info","t_clients_id","t_clues_id","t_businesss_id","t_sums_id","t_edit","t_other"];
        _this.backupData.tasks.values = [];

        DATAINTERFACE.sqlite.exec({
            sql:"select * from tasks ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisvalue = [];

                    thisvalue.push(thisdata.t_id);
                    thisvalue.push(thisdata.t_type);
                    thisvalue.push(thisdata.t_state);
                    thisvalue.push( (thisdata.t_info) ? eval('('+thisdata.t_info+')') :{});
                    thisvalue.push( (thisdata.t_clients_id)?eval('('+thisdata.t_clients_id+')'):[]);
                    thisvalue.push( (thisdata.t_clues_id)?eval('('+thisdata.t_clues_id+')'):[]);
                    thisvalue.push( (thisdata.t_businesss_id)?eval('('+thisdata.t_businesss_id+')'):[]);
                    thisvalue.push( (thisdata.t_sums_id)?eval('('+thisdata.t_sums_id+')'):[]);
                    thisvalue.push(thisdata.t_edit);
                    thisvalue.push(thisdata.t_other);
                    _this.backupData.tasks.values.push(thisvalue);
                }

                _this.getSQLCluesInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //获取线索表信息
    getSQLCluesInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData3);
        var _this = this;
        _this.backupData.clues = {};
        _this.backupData.clues.fields = ["c_id","c_type","c_state","c_business_id","c_client_id","c_note_id","c_summs_id","c_title","c_desc","c_starttime","c_endtime","c_edit","c_isupdate","c_other"];
        _this.backupData.clues.values = [];

        DATAINTERFACE.sqlite.exec({
            sql:"select * from clues ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisvalue = [];

                    thisvalue.push(thisdata.c_id);
                    thisvalue.push(thisdata.c_type);
                    thisvalue.push(thisdata.c_state);
                    thisvalue.push( (thisdata.c_business_id)? eval('('+thisdata.c_business_id+')') : [] );
                    thisvalue.push(thisdata.c_client_id);
                    thisvalue.push( (thisdata.c_note_id)? eval('('+thisdata.c_note_id+')') : []);
                    thisvalue.push( (thisdata.c_summs_id)?eval('('+thisdata.c_summs_id+')') : []);
                    thisvalue.push(thisdata.c_title);
                    thisvalue.push(thisdata.c_desc);
                    thisvalue.push(thisdata.c_starttime);
                    thisvalue.push(thisdata.c_endtime);
                    thisvalue.push(thisdata.c_edit);
                    thisvalue.push(thisdata.c_isupdate);
                    thisvalue.push(thisdata.c_other);
                    _this.backupData.clues.values.push(thisvalue);
                }

                _this.getSQLTemplagerdataInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //获取表单数据表信息
    getSQLTemplagerdataInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData4);
        var _this = this;
        _this.backupData.templagerdata = {};
        _this.backupData.templagerdata.fields = ["t_uuid","t_id","t_name","t_myname","t_info","t_ver","t_datatime","t_ismust","t_iscomplete","t_clues_id","t_busines_id","t_task_id","t_edit","t_del","t_isupdate","t_other"];
        _this.backupData.templagerdata.values = [];

        DATAINTERFACE.sqlite.exec({
            sql:"select * from templagerdata ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisvalue = [];

                    thisvalue.push(thisdata.t_uuid);
                    thisvalue.push(thisdata.t_id);
                    thisvalue.push(thisdata.t_name);
                    thisvalue.push(thisdata.t_myname);
                    thisvalue.push( (thisdata.t_info) ?eval('('+thisdata.t_info+')') : {});
                    thisvalue.push(thisdata.t_ver);
                    thisvalue.push(thisdata.t_datatime);
                    thisvalue.push(thisdata.t_ismust);
                    thisvalue.push(thisdata.t_iscomplete);
                    thisvalue.push(thisdata.t_clues_id);
                    thisvalue.push(thisdata.t_busines_id);
                    thisvalue.push(thisdata.t_task_id);
                    thisvalue.push(thisdata.t_edit);
                    thisvalue.push(thisdata.t_del);
                    thisvalue.push(thisdata.t_isupdate);
                    thisvalue.push(thisdata.t_other);
                    _this.backupData.templagerdata.values.push(thisvalue);
                }

                _this.getSQLMytemplagesInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //获取任务模板表信息
    getSQLMytemplagesInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData5);
        var _this = this;
        _this.backupData.mytemplages = {};
        _this.backupData.mytemplages.fields = ["m_id","m_name","m_info","m_ver","m_task_id","m_clues_id","m_busines_id","m_ismust","m_other"];
        _this.backupData.mytemplages.values = [];

        DATAINTERFACE.sqlite.exec({
            sql:"select * from mytemplages ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisvalue = [];

                    thisvalue.push(thisdata.m_id);
                    thisvalue.push(thisdata.m_name);
                    thisvalue.push( (thisdata.m_info)?eval('('+thisdata.m_info+')'):{});
                    thisvalue.push(thisdata.m_ver);
                    thisvalue.push(thisdata.m_task_id);
                    thisvalue.push(thisdata.m_clues_id);
                    thisvalue.push(thisdata.m_busines_id);
                    thisvalue.push(thisdata.m_ismust);
                    thisvalue.push(thisdata.m_other);
                    _this.backupData.mytemplages.values.push(thisvalue);
                }

                _this.getSQLResourcesInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //获取资源表信息
    getSQLResourcesInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData6);
        var _this = this;
        _this.backupData.resources = {};
        _this.backupData.resources.fields = ["r_uuid","r_id","r_filename","r_datatime","r_busines_id","r_clues_id","r_templager_id","r_del","r_size","r_isupdate","r_other"];
        _this.backupData.resources.values = [];

        DATAINTERFACE.sqlite.exec({
            sql:"select * from resources ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisvalue = [];

                    thisvalue.push(thisdata.r_uuid);
                    thisvalue.push(thisdata.r_id);
                    thisvalue.push(thisdata.r_filename);
                    thisvalue.push(thisdata.r_datatime);
                    thisvalue.push(thisdata.r_busines_id);
                    thisvalue.push(thisdata.r_clues_id);
                    thisvalue.push(thisdata.r_templager_id);
                    thisvalue.push(thisdata.r_del);
                    thisvalue.push(thisdata.r_size);
                    thisvalue.push(thisdata.r_isupdate);
                    thisvalue.push(thisdata.r_other);
                    _this.backupData.resources.values.push(thisvalue);
                }

                _this.getSQLSummariesInfo();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //获取报告表信息
    getSQLSummariesInfo:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData7);
        var _this = this;
        _this.backupData.summaries = {};
        _this.backupData.summaries.fields = ["s_id","s_content","s_type","s_time","s_edit","s_isupdate","s_other"];
        _this.backupData.summaries.values = [];

        DATAINTERFACE.sqlite.exec({
            sql:"select * from summaries ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisvalue = [];

                    thisvalue.push(thisdata.s_id);
                    thisvalue.push(thisdata.s_content);
                    thisvalue.push(thisdata.s_type);
                    thisvalue.push(thisdata.s_time);
                    thisvalue.push(thisdata.s_edit);
                    thisvalue.push(thisdata.s_isupdate);
                    thisvalue.push(thisdata.s_other);
                    _this.backupData.summaries.values.push(thisvalue);
                }

                _this.getBackupDataComplate();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });
    },
    //上传数据准备完成 写入文件
    getBackupDataComplate:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData8);
        var _this = this,
            data = _this.backupData;

        data = {
                CLIENT_DATA : data,
                MESSAGES : []
                };

        var newdata = JSON.stringify(data);

        DATAINTERFACE.file.write({
            dir:"datas",
            file:"userbackup.json",
            data:newdata,
            success:function(){
                _this.zipBackupData();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.filesystem.info);
            }
        });


        /*
        AJAXS("UPLOAD_USER",data,function(datas){

            var thisdata = datas[0];

            if(parseInt(thisdata.ACTION_RETURN_CODE) == 0 ){
                //成功
                _this.backupDataSuccess();
            }else{
                //失败
                DATAHANDLER.upload.error(CMBC_MESSAGE.ajax.download_err);
            }
        })
        */

    },
    //打包备份文件
    zipBackupData:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData9);
        var zip = DATAHANDLER.fileuuid()+"backup.zip",
            thiszipfilename = DATAINTERFACE.directory.temp.fullPath+"/"+zip,
            _this = this,
            filenames = [],
            src = DATAINTERFACE.directory.datas.fullPath;

        filenames.push(src+"/userbackup.json");
        filenames.push(src+"/desc.json");

        phonegap.zip({
            srcs:filenames,
            targetSrc:thiszipfilename,
            success:function(){
                //打包成功
                _this.uploadBackdataZip(zip);
            },
            error:function(){
                //打包失败
                DATAHANDLER.upload.error(CMBC_MESSAGE.file.zip_file_error);
            }
        })
    },
    //上传zip文件
    uploadBackdataZip:function(filename){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData10);
        var _this = this,
            serverurl = MYSET.fileUploadSrc,
            localurl = DATAINTERFACE.directory.temp.fullPath+"/"+filename,
            localurl1 = localurl.substring(1),
            fileTransfer = new xFace.AdvancedFileTransfer(localurl1,serverurl,true);

        var temp_per = CMBC_MESSAGE.progressHint.backupdData10.pre;

        //进度事件
        fileTransfer.onprogress = function(evt){
            //console.log(evt);
            //CMBC_MESSAGE.progressHint.backupdData10.pre = ??  //notdo
            //DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData10);
        };
        //开始
        fileTransfer.upload(function(){
            //成功
            CMBC_MESSAGE.progressHint.backupdData10.pre = temp_per;
            _this.delBackDataFile(filename);
        }, function(err){
            //失败
            CMBC_MESSAGE.progressHint.backupdData10.pre = temp_per;
            DATAHANDLER.upload.error(CMBC_MESSAGE.fileupload[err.code]);
        });
    },
    //删除备份的文件
    delBackDataFile:function(filename){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData11);
        var _this = this;

        var delfile = function(){
            DATAINTERFACE.file.del({
                dir:"datas",
                file:"userbackup.json",
                success:function(){
                    _this.backupDataSuccess();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.filesystem.info);
                }
            });
        };

        /*
        var delzip = function(){
            DATAINTERFACE.file.del({
                dir:"temp",
                file:filename,
                success:function(){
                    _this.backupDataSuccess();
                },
                error:function(){
                    DATAHANDLER.upload.error(CMBC_MESSAGE.filesystem.info);
                }
            });
        };
        */

        delfile();

    },
    //数据备份成功
    backupDataSuccess:function(){

        //清标示
        var _this = this,
            sqls = [],
            info = {
                downloaddata:1,
                cs:DATAHANDLER.upload.all
            };
        info = JSON.stringify(info);

        sqls.push("update updatatime set u_other = '"+info+"' where u_name = 'updatastart' ");

        DATAINTERFACE.sqlite.execs({
            sql:sqls,
            success:function(){
                _this.backupData={};
                DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.backupdData12);
                DATAHANDLER.downloadData.init();
            },
            error:function(){
                DATAHANDLER.upload.error(CMBC_MESSAGE.sql.select_err);
            }
        });

    }
};

//下载数据
DATAHANDLER.downloadData = {
    oldStamp:null,
    tempData:{},
    newTimestamp:{},
    isInitialize:false,
    delFileData:[],
    //下载更新入口
    //initialize:true false  是否初始化更新
    //completefn:完成回调
    init:function(){
        this.tempData = {};
        this.newTimestamp = {};
        this.delFileData = [];
        this.temp_timestamp = null;

        //设置空时间的时间戳
        var dateVal="2000-01-01 00:00:00";
        this.oldStamp = new Date(dateVal).getTime();
        this.isInitialize = DATAHANDLER.upload.all ;

        //获取上次下载的时间列表，完成后进入downloadData（）
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK1);
        this.getDownloadTime();
    },
    //获取、初始化本地数据和产品时间戳版本====================================================================
    //获取上次下载的时间戳
    getDownloadTime:function(){
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from updatatime",
            success:function(rs){
                var numbers = rs.rows.length,
                    data = {};

                for (var i = 0; i<numbers; i++ ){
                    data[rs.rows.item(i).u_name]  = rs.rows.item(i).u_timestamp;
                }

                _this.downloadData(data);
            },
            error:function(){
                _this.sqlERR("get_updatatime_err");
            }
        })
    },
    //下载数据
    downloadData:function(datetime){
        //调用所有ajax接口，成功依次执行
        //检查版本及代码更新
        this.downloadAPK(datetime);
    },
    //出错处理部分=====================================================================================
    //数据库处理出错
    sqlERR:function(err){
        DATAHANDLER.upload.error(CMBC_MESSAGE.sql[err]);
    },
    //文件写入出错
    fileERR:function(err){
        DATAHANDLER.upload.error(CMBC_MESSAGE.file[err]);
    },
    //ajax错误，超时或无法连接服务器
    ajaxTimeOut:function(fn,timestamp){
        DATAHANDLER.upload.error(CMBC_MESSAGE.ajax.download_err);
    },

    //ajax 获取数据部分======================================================================================
    //apk更新(与代码更新合并)
    downloadAPK:function(timestamp){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK2);
        var ver = device.productVersion,
            _this = this;

        timestamp.downloadAPK = (timestamp.downloadAPK)? timestamp.downloadAPK : _this.oldStamp;

        DATAINTERFACE.ajax.checkAPK({
            ENGI_VER:ver,
            APP_VER:timestamp.downloadAPK
        },function(data,backtime){
            //ajax成功
            _this.newTimestamp.downloadAPK = backtime;
            _this.tempData.downloadAPK = data;
            _this.downloadCode(timestamp);
        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadAPK",timestamp);
        })

    },
    temp_timestamp : null,
    //代码更新检查
    downloadCode:function(timestamp){
        //与apk更新接口合并
        //this.downloadProducts(timestamp);

        this.temp_timestamp = timestamp ;
        this.downloadSoftware();
        /*
         var _this = this;
         timestamp.downloadCode = (timestamp.downloadCode)? timestamp.downloadCode : _this.oldStamp ;

         DATAINTERFACE.ajax.checkCode({
         TIMESTAMP:timestamp.downloadCode
         },function(data){
         //ajax成功
         _this.tempData.downloadCode = data;
         _this.newTimestamp.downloadCode = new Date().getTime();
         _this.downloadProducts(timestamp);
         },function(){
         //ajax失败
         _this.ajaxTimeOut("downloadCode",timestamp);
         })
         */
    },

    //系统文件更新部分======================================================================================
    //下载code，安装code
    restartSystem:false,
    //开始下载
    downloadSoftware:function(){

        var _this = this;

        if($.isObject(_this.tempData.downloadAPK)){
            _this.downloadCodeFile();
        }else{
            //跳过
            _this.downloadProducts();
        }
    },
    //下载代码包
    downloadCodeFile:function(){

        var _this = this,
            thisdata = this.tempData.downloadAPK.APP;


        if($.isObject(thisdata)){
            var src = thisdata.URL;
            _this.restartSystem = true;
            _this.downloadCodeFileStart(src);
        }else{
            //下一步
            _this.downloadAPKFile();
        }
    },
    //下载代码文件开始
    downloadCodeFileStart:function(src){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK3);
        var _this = DATAHANDLER.downloadData,
            srcs = [],
            filename = null;

        srcs.push({url:src,id:""});
        filename = src.substring(src.lastIndexOf('/')+1);

        var temp_per = CMBC_MESSAGE.progressHint.downloadAPK3.pre;
        var iserrror = false;
        /*
         phonegap.files.downloads({
         src:srcs,
         dir:DATAINTERFACE.directory.temp,
         success:function(){
         _this.unzipCodeFile(filename);
         },
         error:function(){
         _this.fileERR("filewrite");
         }
         })
         */
        phonegap.files.superDownloadFile.start({
            urls:srcs,
            dir:DATAINTERFACE.directory.temp,
            progress:function(evt){
                //console.log(evt);
                //CMBC_MESSAGE.progressHint.downloadAPK3.pre = ?? //notdo
                //DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK3);
            },
            start:function(){},
            success:function(){},
            complete:function(){
                if(!iserrror){
                    CMBC_MESSAGE.progressHint.downloadAPK3.pre = temp_per;
                    _this.unzipCodeFile(filename);
                }

            },
            error:function(id){
                CMBC_MESSAGE.progressHint.downloadAPK3.pre = temp_per;
                iserrror = true;
                _this.fileERR("filewrite");
            }
        });
    },
    //解压文件
    unzipCodeFile:function(filename){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK4);
        var _this = this,
            src = DATAINTERFACE.directory.temp.fullPath+"/"+filename,
            targetSrc = DATAINTERFACE.directory.cmbc.fullPath;

        phonegap.unzip({
            src:src,
            targetSrc:targetSrc,
            success:function(){
                _this.delDownloadCodeFile(filename);
            },
            error:function(){
                _this.fileERR("filewrite");
            }
        })
    },
    //删除下载的zip文件
    delDownloadCodeFile:function(filename){
        var _this = this;
        DATAINTERFACE.file.del({
            dir:"temp",
            file:filename,
            success:function(){
                _this.updateDowmloadCodeStamp();
            },
            error:function(){
                _this.fileERR("filewrite");
            }
        })
    },
    //更新代码时间戳
    updateDowmloadCodeStamp:function(){
        var _this = this,
            sql = [];

        sql.push(" delete from updatatime where u_name = 'downloadAPK'  ");
        sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadAPK','"+_this.newTimestamp.downloadAPK+"')  ");
        DATAINTERFACE.sqlite.execs({
            sql:sql,
            success:function(){
                //下一步
                _this.downloadAPKFile();
            },
            error:function(){
                _this.sqlERR("select_err");
            }
        })
    },
    //下载apk，安装apk
    downloadAPKFile:function(){
        var _this = this,
            thisdata = this.tempData.downloadAPK.ENGI;

        if($.isObject(thisdata)){
            var src = thisdata.URL;
            _this.downloadAPPStart(src);
        }else{
            //下一步
            _this.checkNeedRestart();
        }
    },
    //下载apk
    downloadAPPStart:function(src){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK5);
        var _this = this,
            srcs = [],
            filename = null;

        srcs.push({url:src,id:""});
        filename = src.substring(src.lastIndexOf('/')+1);

        var temp_per = CMBC_MESSAGE.progressHint.downloadAPK5.pre;
        var iserror = false;

        phonegap.files.superDownloadFile.start({
            urls:srcs,
            dir:DATAINTERFACE.directory.temp,
            progress:function(evt){
                //console.log(evt);
                //CMBC_MESSAGE.progressHint.downloadAPK5.pre = ?? //notdo
                //DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK5);
            },
            start:function(){},
            success:function(){},
            complete:function(){
                if(!iserror){
                    CMBC_MESSAGE.progressHint.downloadAPK5.pre = temp_per;
                    _this.installAPK(filename);
                }
            },
            error:function(id){
                iserror = true;
                CMBC_MESSAGE.progressHint.downloadAPK5.pre = temp_per;
                _this.fileERR("filewrite");
            }
        });
        /*
        phonegap.files.downloads({
            src:srcs,
            dir:DATAINTERFACE.directory.temp,
            success:function(){
                _this.installAPK(filename);
            },
            error:function(){
                _this.fileERR("filewrite");
            }
        })
        */
    },
    //安装apk
    installAPK:function(filename){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK6);
        var _this = this,
            src = DATAINTERFACE.directory.temp.fullPath+"/"+filename;

        phonegap.installApp({
            appSrc:src,
            success:function(){
                //自动重启
            },
            error:function(){
                _this.fileERR("filewrite");
            }
        })
    },
    //上2项有重启应用
    checkNeedRestart:function(){
        if(this.restartSystem){
            DATAINTERFACE.alert({
                title:CMBC_MESSAGE.system.title,
                message:CMBC_MESSAGE.system.must_restart_system,
                button:"确定",
                callback:function(){
                    xFace.AMS.reset();
                }
            });
        }else{
            DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadAPK7);
            this.downloadProducts();
        }
    },





    //获取最新的产品信息（包含：完整的产品及时间戳版本列表，产品大全、学习园地、小薇的产品目录树，业务对应模板类表，模板具体数据列表）
    downloadProducts:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData0);
        var _this = this;
        var timestamp = _this.temp_timestamp;

        timestamp.downloadProducts = (timestamp.downloadProducts)? timestamp.downloadProducts : _this.oldStamp ;

        DATAINTERFACE.ajax.getProductList({
            TIMESTAMP:timestamp.downloadProducts
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadProducts = data;
            _this.newTimestamp.downloadProducts = backtime;
            _this.downloadDICT(timestamp);

        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadProducts",timestamp);
        })
    },
    //获取数据字典
    downloadDICT:function(timestamp){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData1);
        var _this = this;
        timestamp.downloadDICT = (timestamp.downloadDICT)? timestamp.downloadDICT : _this.oldStamp ;

        DATAINTERFACE.ajax.downloadDicInfo({
            TIMESTAMP:timestamp.downloadDICT
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadDICT = data;
            _this.newTimestamp.downloadDICT = backtime;
            _this.downloadUser(timestamp);

        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadDICT",timestamp);
        })
    },
    //获取用户数据部分(包含：登陆用户信息（内存中），实时信息)  其他数据在初始化时才会下发，通过参数控制
    downloadUser:function(timestamp){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData2);
        var _this = this,
            type = (this.isInitialize) ? 2 : 1;
        timestamp.downloadUser = (timestamp.downloadUser)? timestamp.downloadUser : _this.oldStamp ;

        DATAINTERFACE.ajax.UserDataDownload({
            TIMESTAMP:timestamp.downloadUser,
            TYPE:type
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadUser = data;
            _this.newTimestamp.downloadUser = backtime;
            _this.downloadTask(timestamp);

        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadUser",timestamp);
        })
    },
    //下载任务部分（任务数据） 增量更新。
    downloadTask:function(timestamp){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData3);
        var _this = this,
            type = ( _this.isInitialize || !timestamp.downloadTask) ? 2 : 1;

        timestamp.downloadTask = (timestamp.downloadTask)? timestamp.downloadTask : _this.oldStamp ;


        DATAINTERFACE.ajax.taskDataDownload({
            TIMESTAMP:timestamp.downloadTask,
            TYPE:type
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadTask = data;
            _this.newTimestamp.downloadTask = backtime;
            _this.downloadClient(timestamp);
            //_this.downloadInfo(timestamp)
        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadTask",timestamp);
        })
    },
    //下载客户资料数据(包含：客户数据 )
    downloadClient:function(timestamp){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData4);
        var _this = this;
        timestamp.downloadClient = (timestamp.downloadClient)? timestamp.downloadClient : _this.oldStamp ;

        DATAINTERFACE.ajax.ClientDataDownload({
            TIMESTAMP:timestamp.downloadClient
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadClient = data;
            _this.newTimestamp.downloadClient = backtime;
            _this.downloadInfo(timestamp);
        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadClient",timestamp);
        })
    },
    //公告通告信息下载(包含：通告，广告数据，服务器时间戳)
    downloadInfo:function(timestamp){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData5);
        var _this = this;
        timestamp.downloadInfo = (timestamp.downloadInfo)? timestamp.downloadInfo : _this.oldStamp ;

        DATAINTERFACE.ajax.infoDataDownload({
            TIMESTAMP:timestamp.downloadInfo
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadInfo = data;
            _this.newTimestamp.downloadInfo = backtime;

            _this.downloadResourceImage(timestamp)

        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadInfo",timestamp);
        })
    },
    //下载广告中的图片和其它需要下载的图片到本地
    downloadResourceImage:function(timestamp){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData6);
        var _this = this;
        DATAINTERFACE.ajax.downloadResourceFile({

        },function(data){
            //ajax成功
            _this.tempData.downloadResourceImage = data;

            //下载完成。。。
            _this.downloadCluteAudit(timestamp);

        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadInfo",timestamp);
        })
    },
    //线索审核
    downloadCluteAudit:function(timestamp){
        var _this = this;
        timestamp.downloadCluteAudit = (timestamp.downloadCluteAudit)? timestamp.downloadCluteAudit : _this.oldStamp ;

        DATAINTERFACE.ajax.cluteAudit({
            TIMESTAMP:timestamp.downloadCluteAudit
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadCluteAudit = data;
            _this.newTimestamp.downloadCluteAudit = backtime;

            //下载完成。。。
            _this.downloadBackupData();

        },function(){
            //ajax失败
            _this.ajaxTimeOut("downloadInfo",timestamp);
        })
    },





    //初始化下载备份的数据
    downloadBackupData:function(){
        this.updataSql(); //取消备份文件的下载


        /*
        var _this = this,
            src = _this.tempData.downloadUser.CLIENT_DATA,
            filename = null;

        if(!src){
            _this.tempData.downloadUser.CLIENT_DATASS = null;
            //下一步
            _this.updataSql();
            return;
        }


        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData7);

        var srcs = [];
        srcs.push({url:src,id:""});
        filename = src.substring(src.lastIndexOf('/')+1);

        var temp_per = CMBC_MESSAGE.progressHint.downloadData7.pre;
        var iserror = false;




        phonegap.files.downloads({
            src:[src],
            dir:DATAINTERFACE.directory.temp,
            success:function(){
                _this.readBackupData(filename);
            },
            error:function(err){
                _this.fileERR("filewrite");
            }
        })
        */

    },
    //读取备份的数据
    readBackupData:function(filename){
        var _this = this;
        DATAINTERFACE.file.read({
            dir:"temp",
            filename:filename,
            success:function(rs){
                rs = (rs)? eval('('+rs+')') : {};
                _this.tempData.downloadUser.CLIENT_DATASS = rs;
                _this.updataSql();
            },
            error:function(){
                _this.fileERR("filewrite");
            }
        })
    },




    //更新数据库，文件部分===================================================================================
    //默认数据是全量更新（删除本地所有，插入服务器下载数据）
    //线索，业务，系统，通知类使用增量更新（删除服务器下发id所对应的数据，在插入服务器下载的所有数据）有变动
    updataSql:function(){
        DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData8);
        this.updataProductAPI();
    },

    //产品更新接口数据处理===================================================
    updataProductAPI:function(){
        if($.isObject(this.tempData.downloadProducts)){
            this.getOldProducts();
        }else{
            //跳到下一步
            this.updataClientAPI();
        }
    },
    //更新产品表部分==============（全量更新）
    getOldProducts:function(){
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from products",
            success:function(rs){
                var numbers = rs.rows.length,
                    data = {};

                for (var i = 0; i<numbers; i++ ){
                    data[rs.rows.item(i).p_id]  = rs.rows.item(i).p_ver;
                }

                _this.getUpadateProductList(data);
            },
            error:function(){
                _this.sqlERR("select_err");
            }
        })
    },
    getUpadateProductList:function(data){
        var _this = this,
            server_data =_this.tempData.downloadProducts.PRODS,
            newDir = [],
            delDir = [];

        if($.isObject(server_data)){
            //找出需要删除的产品
            for(var key1 in data){
                if(server_data[key1]){
                    //存在
                }else{
                    delDir.push(key1);
                }
            }

            //开始比较找出需要更新的产品
            for ( var key in server_data){
                if(data[key] ){
                    //记录存在
                    if( parseInt(server_data[key].VERSION) > parseInt(data[key]) ){
                        newDir.push({id:key,type:"updata"});
                    }else{
                        newDir.push({id:key,type:"change"});
                    }
                }else{
                    //记录不存在
                    newDir.push({id:key,type:"add"});
                }
            }
        }else{
            //跳过产品更新
            _this.updataSqlBusinessTable();
            return;
        }

        if(newDir.length == 0 && delDir.length == 0){
            //跳过产品更新
            _this.updataSqlBusinessTable();
        }else{
            //更新产品表
            _this.updataSqlProductTable(server_data,newDir,delDir);
        }
    },
    updataSqlProductTable:function(data,updata,deldata){
        var _this = this,
            sql=[];

        sql.push("update products set p_isnew = '0' ");
        for(var i= 0,l=updata.length;i<l;i++){
            var id = updata[i].id,
                newdata = data[id],
                newid = newdata.PROD_ID,
                newbusines = JSON.stringify(newdata.BUSIS),
                newver = newdata.VERSION,
                newname = newdata.PROD_NAME,
                newurl = newdata.PACKAGE_URL,
                newsize = newdata.PACKAGE_SIZE,
                newno = newdata.PROD_CD,
                newstate = 1;

            if(updata[i].type == "add"){
                sql.push("insert into products(p_id,p_name,p_url,p_size,p_no,p_business_id,p_ver,p_state,p_isnew) values('"+newid+"','"+newname+"','"+newurl+"','"+newsize+"','"+newno+"','"+newbusines+"','"+newver+"','"+newstate+"','1') ");
            }else{
                if(updata[i].type == "updata"){
                    sql.push("update products set p_name='"+newname+"',p_url='"+newurl+"',p_size='"+newsize+"',p_no='"+newno+"', p_business_id='"+newbusines+"',p_ver='"+newver+"',p_state='1',p_isnew='1' where  p_id = '"+newid+"'  ");
                }else{
                    sql.push("update products set p_name='"+newname+"',p_url='"+newurl+"',p_size='"+newsize+"',p_no='"+newno+"', p_business_id='"+newbusines+"',p_ver='"+newver+"' where  p_id = '"+newid+"'  ");
                }
            }
        }

        if(deldata.length != 0){
            var delIds="";
            for(var i= 0,l=deldata.length;i<l;i++){
                delIds += "'"+deldata[i]+"',";
            }
            delIds = delIds.substr(0,delIds.length-1);

            sql.push("delete from products where p_id in ("+delIds+")");

            //下一步
            _this.delFileData = deldata;
            _this.updataSqlProductvsbusinesTable(sql);
        }else{
            _this.updataSqlProductvsbusinesTable(sql);
        }
    },
    //更新产品与业务的对应表（全量更新）
    updataSqlProductvsbusinesTable:function(sql){
        var _this = this,
            server_data =_this.tempData.downloadProducts.PRODS;

        if(server_data){
            sql.push("delete from productvsbusines ");
            for(var key in server_data){
                var thisdata = server_data[key],
                    p_id = thisdata.PROD_ID,
                    p_name = thisdata.PROD_NAME,
                    b_id = thisdata.BUSIS;

                if($.isArray(b_id) && b_id.length != 0 ){
                    for(var i= 0,l=b_id.length;i<l;i++){
                        sql.push(" insert into productvsbusines(p_id,p_name,b_id) values('"+p_id+"','"+p_name+"','"+b_id[i]+"') ");
                    }
                }
            }

            _this.updataSqlBusinessTable(sql);
        }else{
            _this.updataSqlBusinessTable(sql);
        }
    },
    //更新业务对应模板表==============(全量更新)
    updataSqlBusinessTable:function(sql){
        var _this = this,
            serverdata = _this.tempData.downloadProducts.BUSIS;

        if(sql && $.isArray(sql)){}else{var sql=[];}


        if($.isObject(serverdata)){
            sql.push("delete from businesss");
            for(var key in serverdata){
                var newid = serverdata[key].BUSI_ID,
                    newname = serverdata[key].BUSI_NAME,
                    newtmpls = JSON.stringify(serverdata[key].TMPLS);

                sql.push("insert into businesss(b_id,b_name,b_template_obj) values('"+newid+"','"+newname+"','"+newtmpls+"') ");
            }
        }else{
            //跳过
            _this.updataSqlTemplatesTable(sql);
            return;
        }
        _this.updataSqlTemplatesTable(sql);
    },
    //更新模板具体信息表==============（全量更新）
    updataSqlTemplatesTable:function(sql){
        var _this = this,
            serverdata = _this.tempData.downloadProducts.TMPLS;

        if($.isObject(serverdata)){
            sql.push("delete from templates");
            for(var key in serverdata){
                var newid = serverdata[key].TMPL_ID,
                    newname = serverdata[key].TMPL_NAME,
                    newtmpls = JSON.stringify({
                        TMPL_CONF:serverdata[key].TMPL_CONF,
                        IS_MUSTS : serverdata[key].IS_MUSTS,
                        STATISTICS : serverdata[key].STATISTICS
                    }),
                    newver = serverdata[key].VERS_ID;

                sql.push("insert into templates(t_id,t_name,t_info,t_ver) values('"+newid+"','"+newname+"','"+newtmpls+"','"+newver+"') ");
            }
        }

        _this.updataFileProductTree(sql);
    },
    //更新产品目录树--文件 =============（全量更新）
    updataFileProductTree:function(sql){
        var _this = this,
            CATEGORIES = _this.tempData.downloadProducts.CATEGORIES,
            MICRO,
            TRAIN,
            allfiles= 0,
            writefile = 0;

        var filewriteok = function(){
            writefile++;
            if(writefile == allfiles){
                //下一步
                _this.updataFileXWTree(sql);
            }
        };

        var filewriteerr = function(){
            _this.fileERR("write");
        };


        if($.isObject(CATEGORIES)){
            if($.isObject(CATEGORIES.MICRO)){ allfiles++ ;  }
            if($.isObject(CATEGORIES.TRAIN)){ allfiles++ ;  }
            if($.isObject(CATEGORIES.TOTALS)){ allfiles++ ;  }

            if(allfiles == 0){
                _this.updataFileXWTree(sql);
                return;
            }

            if($.isObject(CATEGORIES.MICRO)){
                //更新小薇
                var data = JSON.stringify(CATEGORIES.MICRO);
                DATAINTERFACE.file.write({
                    dir:"datas",
                    file:"MICRO.txt",
                    data:data,
                    success:filewriteok,
                    error:filewriteerr
                })
            }

            if($.isObject(CATEGORIES.TRAIN)){
                //更新培训
                var data = JSON.stringify(CATEGORIES.TRAIN);
                DATAINTERFACE.file.write({
                    dir:"datas",
                    file:"TRAIN.txt",
                    data:data,
                    success:filewriteok,
                    error:filewriteerr
                })
            }

            if($.isObject(CATEGORIES.TOTALS)){
                //更新产品大全
                var data = JSON.stringify(CATEGORIES.TOTALS);
                DATAINTERFACE.file.write({
                    dir:"datas",
                    file:"TOTAL.txt",
                    data:data,
                    success:filewriteok,
                    error:filewriteerr
                })
            }
        }else{
            //下一步
            _this.updataFileXWTree(sql);
        }
    },
    //保存小薇目录树--文件 =============（全量更新）
    updataFileXWTree:function(sql){
        var _this = this,
            DATA = _this.tempData.downloadProducts.BUSICATEGORIES;

        if($.isObject(DATA)){
            //更新小薇
            var data = JSON.stringify(DATA);
            DATAINTERFACE.file.write({
                dir:"datas",
                file:"XWYW.txt",
                data:data,
                success:function(){
                    _this.delFileProducts(sql);
                },
                error:function(){
                    _this.fileERR("write");
                }
            })
        }else{
            _this.delFileProducts(sql);
        }


    },
    //删除无权限的产品文件数据
    delFileProducts:function(sql){
        var _this = this,
            deldata = _this.delFileData;

        if(deldata.length == 0){
            _this.updataProductTimestamp(sql);
        }else{
            //删除多余的产品文件夹  产品文件夹名字以他自己的id命名
            DATAINTERFACE.directory.delbyname({
                dir:"cp",
                delNames:deldata,
                success:function(){
                    _this.delFileData = [];
                    _this.updataProductTimestamp(sql);
                },
                error:function(){
                    _this.fileERR("dirdel");
                }
            });
        }
    },
    //执行sql 更新时间戳
    updataProductTimestamp:function(sql){
        var _this = this;
        sql.push(" delete from updatatime where u_name = 'downloadProducts'  ");
        sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadProducts','"+_this.newTimestamp.downloadProducts+"')  ");
        DATAINTERFACE.sqlite.execs({
            sql:sql,
            success:function(){
                //下一步
                _this.updataClientAPI();
            },
            error:function(){
                _this.sqlERR("select_err");
            }
        })
    },



    //客户更新接口数据处理===================================================
    updataClientAPI:function(){
        if($.isObject(this.tempData.downloadClient)){
            this.updataSqlClientTable();
        }else{
            //跳到下一步
            this.updataDictAPI();
        }
    },
    //更新客户信息表=============（全量更新）
    updataSqlClientTable:function(){
        var _this = this,
            serverdata = _this.tempData.downloadClient.CUSTOMERS,
            sql = [],
            delids="";

        if($.isObject(serverdata)){
            //删除所有数据
            sql.push(" delete from clients");

            //拼装sql
            for(var key in serverdata){
                var thisdata = serverdata[key],
                    newid = thisdata.CUST_ID,
                    newinfo = JSON.stringify(thisdata),
                    newtype = thisdata.TYPE,
                    newcd = thisdata.CUST_CD,
                    newfamiliesid = JSON.stringify(thisdata.FAMILIES);

                sql.push("insert into clients( c_id,c_cd,c_info,c_type,c_families_id,c_isupdate) values('"+newid+"','"+newcd+"','"+newinfo+"','"+newtype+"','"+newfamiliesid+"','1')");
            }
        }

        if(sql.length !=0){
            //sql.unshift("delete from clients where c_id in ("+delids+")");
            sql.push(" delete from updatatime where u_name = 'downloadClient'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadClient','"+_this.newTimestamp.downloadClient+"')  ");

            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.updataDictAPI();
                },
                error:function(){
                    _this.sqlERR("select_err");
                }
            })
        }else{
            //下一步
            _this.updataDictAPI();
        }
    },


    //字典数据接口数据处理===================================================（全量）
    updataDictAPI:function(){
        if($.isArray(this.tempData.downloadDICT) && this.tempData.downloadDICT.length !=0 ){

            this.updataFileDict();
        }else{
            //跳到下一步
            this.updataTaskAPI();
        }
    },
    //生成字典文件
    updataFileDict:function(){
        var _this = this,
            serverdata = _this.tempData.downloadDICT;

        var go = function(){
            if(serverdata.length == 0){
                //完成
                _this.updataTaskAPI();
            }else{
                //继续
                var thisdata = serverdata.shift(),
                    thiskey = null,
                    thisstr = null;

                if(!$.isObject(thisdata)){
                    go();
                    return;
                }

                for(var key in thisdata){
                    thiskey = "s_"+key+".txt";
                    thisstr = thisdata[key];
                }

                if($.isObject(thisstr)){
                    thisstr = JSON.stringify(thisstr);
                }

                savetofile(thiskey,thisstr);
            }
        };

        var savetofile = function(filename,str){
            DATAINTERFACE.file.write({
                dir:"datas",
                file:filename,
                data:str,
                success:function(){
                    go();
                },
                error:function(){
                    _this.fileERR("filewrite");
                }
            })
        };

        go();
    },


    //任务更新接口数据处理===================================================
    updataTaskAPI:function(){
        if($.isObject(this.tempData.downloadTask)){
            this.updataSqlTaskTable();
        }else{
            //跳到下一步
            this.updataSqlClueAPI();
        }
    },
    //更新任务表=============（增量更新） 持续添加  完成的任务在上传时清除
    updataSqlTaskTable:function(){
        var _this = this,
            sql=[],
            serverdata = _this.tempData.downloadTask.TASKS;

        if($.isObject(serverdata)){
            //sql.push("delete from tasks");
            //拼装sql
            for(var key in serverdata){
                var thisdata = serverdata[key],
                    newid = thisdata.TASK_ID,
                    newtype = thisdata.TYPE,
                    newstate = thisdata.TASK_STATUS,
                    newinfo = JSON.stringify(thisdata),
                    newclientsid = JSON.stringify(thisdata.CUSTS),
                    newcluesid = JSON.stringify(thisdata.CLUES),
                    newbusinesssid = JSON.stringify(thisdata.BUSIS),
                    newsumsid = JSON.stringify(thisdata.SUMMS);

                sql.push("insert into tasks(t_id,t_type,t_state,t_info,t_clients_id,t_clues_id,t_businesss_id,t_sums_id) values('"+newid+"','"+newtype+"','"+newstate+"','"+newinfo+"','"+newclientsid+"','"+newcluesid+"','"+newbusinesssid+"','"+newsumsid+"')");
            }

        }

        if(sql.length !=0){
            sql.push(" delete from updatatime where u_name = 'downloadTask'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadTask','"+_this.newTimestamp.downloadTask+"')  ");

            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.updataSqlClueAPI();
                },
                error:function(){
                    _this.sqlERR("select_err");
                }
            })
        }else{
            //下一步
            _this.updataSqlClueAPI();
        }

    },

    //线索审核更新接口数据处理===============================================
    updataSqlClueAPI:function(){
        if($.isObject(this.tempData.downloadCluteAudit)){
            this.updataSqlClueTable();
        }else{
            //跳到下一步
            this.updataUserAPI();
        }
    },
    updataSqlClueTable:function(){
        var _this = this,
            sql=[],
            serverdata = _this.tempData.downloadCluteAudit;

        if($.isObject(serverdata)){
            //sql.push("delete from tasks");
            //拼装sql
            for(var key1 in serverdata){
                  var  thisclueid = key1,
                       thisstate = serverdata[key1];

                if(thisstate){
                    thisstate = parseInt(thisstate);
                    if(thisstate == 3 || thisstate == 4 || thisstate == 6 || thisstate ==7 ){
                        sql.push("update clues set c_state = '"+thisstate+"' where  c_id = '"+thisclueid+"' " );
                    }
                }

            }
        }

        if(sql.length !=0){
            sql.push(" delete from updatatime where u_name = 'downloadCluteAudit'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadCluteAudit','"+_this.newTimestamp.downloadCluteAudit+"')  ");

            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.updataUserAPI();
                },
                error:function(){
                    _this.sqlERR("select_err");
                }
            })
        }else{
            //下一步
            _this.updataUserAPI();
        }
    },



    //用户更新接口数据处理===================================================
    updataUserAPI:function(){
        if($.isObject(this.tempData.downloadUser)){
            this.updataFileUserInfo();
        }else{
            //跳到下一步
            this.updataInfoAPI();
        }
    },
    //更新用户信息资料--文件==============（全量更新）
    updataFileUserInfo:function(){
        var _this = this,
            serverdata = JSON.stringify(_this.tempData.downloadUser.USER);

        DATAINTERFACE.file.write({
            dir:"datas",
            file:"userinfo.txt",
            data:serverdata,
            success:function(){
                _this.updataSqlMessageTable();
            },
            error:function(){
                _this.fileERR("filewrite");
            }
        });
    },
    //更新客户需求，实时信息表=============（增量更新）
    updataSqlMessageTable:function(){
        var _this = this,
            serverdata = _this.tempData.downloadUser.MESSAGES,
            sql = [],
            delids="";

        if($.isObject(serverdata)){
            //拼装sql
            for(var key in serverdata){
                var thisdata = serverdata[key],
                    newid = thisdata.NOTICE_ID,
                    newtype = thisdata.TYPE,
                    newinfo = JSON.stringify(thisdata),
                    newclientid = thisdata.CUST_ID,
                    newcreater = thisdata.CREATER,
                    newdata = thisdata.CREATE_DATE,
                    newsendto = thisdata.RECEIVER;


                delids += "'"+newid+"',";

                sql.push("insert into message(m_id,m_creater,m_data,m_type,m_sendto,m_info,m_client_id) values('"+newid+"','"+newcreater+"','"+newdata+"','"+newtype+"','"+newsendto+"','"+newinfo+"','"+newclientid+"')");
            }
            delids = delids.substr(0,delids.length-1);

        }

        if(sql.length !=0){
            sql.unshift("delete from message where m_id in ("+delids+")");

            sql.push(" delete from updatatime where u_name = 'downloadUser'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadUser','"+_this.newTimestamp.downloadUser+"')  ");

            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.updatebackdata();
                },
                error:function(){
                    _this.sqlERR("select_err");
                }
            })
        }else{
            //下一步
            _this.updatebackdata();
        }
    },
    //更新备份的数据(初始化才执行)
    updatebackdata:function(){
        if(!$.isObject(this.tempData.downloadUser.CLIENT_DATASS)){
            this.updataInfoAPI();
            return;
        }

        var _this = this,
            serverdata = this.tempData.downloadUser.CLIENT_DATASS.CLIENT_DATA,   //自定义上传的数据格式
            serverurl = _this.tempData.downloadUser.URL;   //资源地址 = 这个地址+资源文件名

        //线索表 updataSqlCluesTable
        //模板数据表 updataSqltemplagerdataTable
        //任务对应模板 updataSqlMytemplagesTable
        //资源表 updataSqlResourcesTable
        //报告表 updataSqlSummariesTable
        //任务表 tasks
        //资源  下载下来
        if($.isObject(serverdata)){
            var clues = serverdata.clues,
                templagerdata = serverdata.templagerdata,
                mytemplages = serverdata.mytemplages,
                resources = serverdata.resources,
                summaries = serverdata.summaries,
                tasks = serverdata.tasks;

            //清空要恢复的表
            var cleartable = function(){
                var thissql = [];
                thissql.push("delete from clues");
                thissql.push("delete from templagerdata");
                thissql.push("delete from mytemplages");
                thissql.push("delete from resources");
                thissql.push("delete from summaries");
                //thissql.push("delete from tasks");
                DATAINTERFACE.sqlite.execs({
                    sql:thissql,
                    success:function(){
                        //下一步
                        restoreclues();
                    },
                    error:function(){
                        _this.sqlERR("select_err");
                    }
                })
            };
            //还原线索表
            var restoreclues = function(){
                if($.isObject(clues)){
                    if(clues.values.length != 0){
                        DATAINTERFACE.sqlite.insertValue({
                            table:"clues",
                            fields:clues.fields,
                            values:clues.values,
                            success:function(){
                                clearbacktask();
                            },
                            error:function(){
                                _this.sqlERR("select_err");
                            }
                        })
                    }else{
                        clearbacktask();
                    }

                }else{
                    clearbacktask();
                }
            };
            //清除已备份的任务
            var clearbacktask = function(){
                var thisdatas = tasks.values,
                    ids = [];

                if(thisdatas.length == 0){
                    restoreTasks();
                    return;
                }


                for(var i= 0,l=thisdatas.length;i<l;i++){
                    ids.push(thisdatas[i][0]);
                }

                var sqlid = "'"+ids.join("','")+"'";
                DATAINTERFACE.sqlite.execs({
                    sql:["delete from tasks where t_id in ("+sqlid+") "],
                    success:function(){
                        //下一步
                        restoreTasks();
                    },
                    error:function(){
                        _this.sqlERR("select_err");
                    }
                })

            };
            //还原任务表
            var restoreTasks = function(){
                if($.isObject(tasks)){
                    if(tasks.values.length != 0 ){
                        DATAINTERFACE.sqlite.insertValue({
                            table:"tasks",
                            fields:tasks.fields,
                            values:tasks.values,
                            success:function(){
                                restoremytemplages();
                            },
                            error:function(){
                                _this.sqlERR("select_err");
                            }
                        })
                    }else{
                        restoremytemplages();
                    }


                }else{
                    restoremytemplages();
                }
            };
            //还原关联的末班表
            var restoremytemplages = function(){
                if($.isObject(mytemplages)){
                    if(mytemplages.values.length != 0 ){
                        DATAINTERFACE.sqlite.insertValue({
                            table:"mytemplages",
                            fields:mytemplages.fields,
                            values:mytemplages.values,
                            success:function(){
                                restoretemplagerdata();
                            },
                            error:function(){
                                _this.sqlERR("select_err");
                            }
                        })
                    }else{
                        restoretemplagerdata();
                    }


                }else{
                    restoretemplagerdata();
                }
            };
            //还原表单数据表
            var restoretemplagerdata = function(){
                if($.isObject(templagerdata)){
                    if(templagerdata.values.length != 0){
                        DATAINTERFACE.sqlite.insertValue({
                            table:"templagerdata",
                            fields:templagerdata.fields,
                            values:templagerdata.values,
                            success:function(){
                                restoresummaries();
                            },
                            error:function(){
                                _this.sqlERR("select_err");
                            }
                        })
                    }else{
                        restoresummaries();
                    }


                }else{
                    restoresummaries();
                }
            };
            //还原报告表
            var restoresummaries = function(){
                if($.isObject(summaries)){
                    if(summaries.values.length != 0){
                        DATAINTERFACE.sqlite.insertValue({
                            table:"summaries",
                            fields:summaries.fields,
                            values:summaries.values,
                            success:function(){
                                restoreresources();
                            },
                            error:function(){
                                _this.sqlERR("select_err");
                            }
                        })
                    }else{
                        restoreresources();
                    }


                }else{
                    restoreresources();
                }
            };
            //还原资源表
            var restoreresources = function(){
                if($.isObject(resources)){
                    if(resources.values.length != 0){
                        DATAINTERFACE.sqlite.insertValue({
                            table:"resources",
                            fields:resources.fields,
                            values:resources.values,
                            success:function(){
                                _this.downloadResource(serverurl);
                            },
                            error:function(){
                                _this.sqlERR("select_err");
                            }
                        })
                    }else{
                        _this.updataInfoAPI();
                    }


                }else{
                    _this.updataInfoAPI();
                }
            };

            cleartable();
        }else{
            _this.updataInfoAPI();
        }
    },
    //下载资源表(初始化才执行)
    downloadResource:function(serverurl){
        var _this = this,
            downloadfiles = [];

        var getFilename = function(){
            DATAINTERFACE.sqlite.exec({
                sql:"select * from resources",
                success:function(rs){
                    //下一步
                    for(var i= 0,l=rs.rows.length;i<l;i++){
                        var thisfilename = rs.rows.item(i).r_filename;
                        downloadfiles.push({url:serverurl+"/"+thisfilename,id:""});
                    }
                    if(downloadfiles.length == 0 ){
                        //跳过
                        _this.updataInfoAPI();
                    }else{
                        downloadfile();
                    }
                },
                error:function(){
                    _this.sqlERR("select_err");
                }
            })
        };

        var downloadfile = function(){
            var iserror = false;
            DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData9);
            phonegap.files.superDownloadFile.start({
                urls:downloadfiles,
                dir:DATAINTERFACE.directory.resource,
                progress:function(evt){
                    //console.log(evt);
                },
                start:function(){},
                success:function(){},
                complete:function(){
                    if(!iserror){
                        _this.updataInfoAPI();
                    }
                },
                error:function(id){
                    iserror = true;
                    _this.fileERR("filewrite");
                }
            });

            /*
            phonegap.files.downloads({
                src:downloadfiles,
                dir:DATAINTERFACE.directory.resource,
                success:function(){
                    _this.updataInfoAPI();
                },
                error:function(){
                    _this.fileERR("filewrite");
                }
            })
            */
        };


        getFilename();
    },




    //信息更新接口数据处理===================================================
    updataInfoAPI:function(){
        if($.isObject(this.tempData.downloadInfo)){
            this.updataSqlNoticesTable();
        }else{
            //跳到下一步
            this.setUpdataStateEnd();
        }
    },
    //更新通告、广告表===========（增量更新）
    updataSqlNoticesTable:function(){
        var _this = this,
            serverdata = _this.tempData.downloadInfo.NOTICES,
            sql = [],
            delids="";

        if($.isObject(serverdata)){
            //拼装sql
            for(var key in serverdata){
                var thisdata = serverdata[key],
                    newid = thisdata.NOTICE_ID,
                    newtype = thisdata.TYPE,
                    newinfo = JSON.stringify(thisdata),
                    newdata = thisdata.CREATE_DATE;


                delids += "'"+newid+"',";

                sql.push("insert into notices(n_id,n_type,n_info,n_data) values('"+newid+"','"+newtype+"','"+newinfo+"','"+newdata+"')");
            }
            delids = delids.substr(0,delids.length-1);

        }

        if(sql.length !=0){
            sql.unshift("delete from notices where n_id in ("+delids+")");

            sql.push(" delete from updatatime where u_name = 'downloadInfo'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadInfo','"+_this.newTimestamp.downloadInfo+"')  ");


            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.cleaningString();
                },
                error:function(){
                    _this.sqlERR("select_err");
                }
            })
        }else{
            //下一步
            _this.cleaningString();
        }
    },


    //清理字段中的字符串null undefined
    cleaningString:function(){
        var _this = this;

        var sql = [];
        //clues
        sql.push("update clues set c_other = null where c_other='null' or c_other = 'undefined' or c_other = ''  ");
        sql.push("update clues set c_isupdate = null where c_isupdate='null' or c_isupdate = 'undefined' or c_isupdate = ''  ");
        sql.push("update clues set c_edit = null where c_edit='null' or c_edit = 'undefined' or c_edit=''  ");
        //templagerdata
        sql.push("update templagerdata set t_edit = null where t_edit='null' or t_edit = 'undefined' or  t_edit='' ");
        sql.push("update templagerdata set t_del = null where t_del='null' or t_del = 'undefined' or t_del=''  ");
        sql.push("update templagerdata set t_isupdate = null where t_isupdate='null' or t_isupdate = 'undefined' or t_isupdate=''  ");
        sql.push("update templagerdata set t_other = null where t_other='null' or t_other = 'undefined' or t_other=''  ");
        sql.push("update templagerdata set t_task_id = null where t_task_id='null' or t_task_id = 'undefined' or t_task_id=''  ");
        //mytemplages
        sql.push("update mytemplages set m_task_id = null where m_task_id='null' or m_task_id = 'undefined' or m_task_id=''  ");
        sql.push("update mytemplages set m_clues_id = null where m_clues_id='null' or m_clues_id = 'undefined' or m_clues_id=''  ");
        sql.push("update mytemplages set m_other = null where m_other='null' or m_other = 'undefined' or m_other=''  ");
        //resources
        sql.push("update resources set r_del = null where r_del='null' or r_del = 'undefined' or r_del=''  ");
        sql.push("update resources set r_isupdate = null where r_isupdate='null' or r_isupdate = 'undefined' or r_isupdate=''  ");
        sql.push("update resources set r_other = null where r_other='null' or r_other = 'undefined' or r_other='' ");
        //summaries
        sql.push("update summaries set s_edit = null where s_edit='null' or s_edit = 'undefined' or s_edit=''  ");
        sql.push("update summaries set s_isupdate = null where s_isupdate='null' or s_isupdate = 'undefined' or s_isupdate=''  ");
        sql.push("update summaries set s_other = null where s_other='null' or s_other = 'undefined' or s_other='' ");
        //tasks
        sql.push("update tasks set t_edit = null where t_edit='null' or t_edit = 'undefined' or t_edit=''  ");
        sql.push("update tasks set t_other = null where t_other='null' or t_other = 'undefined' or t_other=''  ");


        DATAINTERFACE.sqlite.execs({
            sql:sql,
            success:function(){
                //下一步
                _this.downloadResourceImageStart();
            },
            error:function(){
                _this.sqlERR("select_err");
            }
        })
    },

    //下载广告图片和员工头像等。。。。。
    downloadResourceImageStart:function(){
        var _this = this,
            data = _this.tempData.downloadResourceImage,
            datas = null;

        if($.isObject(data) && data.FILES.length != 0 ){
            datas = data.FILES;
        }else{
            _this.setUpdataStateEnd();
            return;
        }

        if(datas && $.isArray(datas) && datas.length !=0){
            DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData10);
             //下载文件到 downloadimage
            var thisdatas = [];

            for(var i= 0,l=datas.length;i<l;i++){
                thisdatas.push({url:datas[i],id:""})
            }

            var iserror = false;
            phonegap.files.superDownloadFile.start({
                urls:thisdatas,
                dir:DATAINTERFACE.directory.downloadimage,
                progress:function(evt){
                    //console.log(evt);
                },
                start:function(){},
                success:function(){},
                complete:function(){
                    //if(!iserror){
                        _this.setUpdataStateEnd();
                    //}
                },
                error:function(id){
                    iserror = true;
                    //_this.setUpdataStateEnd();
                }
            });
            /*
            phonegap.files.downloads({
                src:datas,
                dir:DATAINTERFACE.directory.downloadimage,
                success:function(){
                    _this.setUpdataStateEnd();
                },
                error:function(){
                    _this.setUpdataStateEnd();
                    //_this.fileERR("filewrite");
                }
            })
            */
        }else{
            _this.setUpdataStateEnd();
        }
    },



    //设置更新状态 完毕 执行回调 ==================================
    setUpdataStateEnd:function(){
        var _this = this,
            sqls = [];

        //写系统日志
        var log_title = CMBC_MESSAGE.sysLogtype.t13,
            log_data = {},
            log_group = CMBC_MESSAGE.sysLogGroup.g4,
            log_info = CMBC_MESSAGE.sysLogtype.m13(log_data),
            log_nowtime = new Date().getTime(),
            log_address = phonegap.getMyAddressPoint(),
            log_other = JSON.stringify(log_data);

        sqls.push("insert into mylog(c_date,c_address,c_content,c_title,c_group,c_type,c_edit,c_other) values('"+log_nowtime+"','"+log_address+"','"+log_info+"','"+log_title+"','"+log_group+"','1','1','"+log_other+"') " );


        //删除更新中标记，删除
        //设置updatatime表中更新状态为开始更新
        sqls.push("delete from updatatime where  u_name = 'updatastart'");
        DATAINTERFACE.sqlite.execs({
            sql:sqls,
            success:function(){
                //数据下载完成
                _this.oldStamp=null;
                _this.tempData={};
                _this.newTimestamp={};
                _this.delFileData = [];
                DATAHANDLER.upload.onprogress(CMBC_MESSAGE.progressHint.downloadData11);
                DATAHANDLER.upload.success();
            },
            error:function(err){
                _this.sqlERR("get_updatatime_err");
            }
        });
    }
};


//信息的单独同步
DATAHANDLER.uploadAndDownloadMessageInfo = {
    successfn:null,
    errorfn:null,
    sqls:[],
    upmessage:[],
    CUSTOMERS:[],
    tempData:{},
    newTimestamp:{},
    stamptime:null,
    init:function(data){
        var success = data.success,
            error = data.error;

        this.successfn = ( typeof(success) == "function") ? success : function(){} ;
        this.errorfn = ( typeof(error) == "function") ? error : function(){} ;

        var dateVal="2000-01-01 00:00:00";
        this.stamptime = new Date(dateVal).getTime();

        this.checkNetwork();
    },
    //检查网络
    checkNetwork:function(){
        var _this = this;
        DATAINTERFACE.ajax.getServerTime(
            //成功
            function(r,t){
                _this.getMessageFromSql();
            },
            //失败
            function(r,t){
                if(t){
                    _this.getMessageFromSql();
                }else{
                    _this.backError("无法连接服务器。");
                }
            }
        )
    },
    //读取信息
    getMessageFromSql:function(){
        var _this = this;

        DATAINTERFACE.sqlite.exec({
            sql:"select * from message where m_edit = '1' ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){

                    var thisdata = rs.rows.item(i),
                        thisinfo = (thisdata.m_info) ? eval('('+thisdata.m_info+')') : {},
                        this_t_id = thisinfo.TEAM_ID,
                        this_o_id =  thisinfo.ORG_ID;

                    _this.upmessage.push({
                        TYPE:thisdata.m_type,
                        NOTICE_ID:thisdata.m_id,
                        CUST_ID:thisdata.m_client_id,
                        CONTENTS:thisinfo.CONTENTS,
                        CREATE_DATE:thisdata.m_data,
                        CREATER:thisdata.m_creater,
                        ORG_ID:this_o_id,
                        TEAM_ID:this_t_id
                    });
                }

                _this.sqls.push("update message set m_edit = null,m_notupno = null");
                _this.getClientFromSql();

            },
            error:function(){
                _this.backError(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //获取客户信息
    getClientFromSql:function(){
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from clients where (c_edit = '1' and c_del is null) or ( c_del = '1' and c_isupdate='1') order by c_type  ",
            success:function(rs){
                for(var i= 0,l=rs.rows.length;i<l;i++){
                    var thisdata = rs.rows.item(i),
                        thisinfo = (thisdata.c_info)? eval('('+thisdata.c_info+')') : {},
                        thisdel = thisdata.c_del;

                    if(thisdel == '1'){
                        thisinfo.CUST_STATUS = '1';
                    }else{
                        thisinfo.CUST_STATUS = '0';
                    }

                    _this.CUSTOMERS.push(thisinfo);
                    //下载是全量更新会删除表中所有 添加服务器的数据

                }

                _this.sqls.push("update clients set c_edit = null,c_isupdate='1' ");
                _this.sqls.push("delete from clients where c_del = '1' and c_isupdate='1' ");
                _this.uploadData();
            },
            error:function(){
                _this.backError(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //上传数据
    uploadData:function(){
        //打包ajax 上传  上传成功清除函数变量
        var datas = [],
            _this = this;


        //客户数据
        datas.push({
            ACTION_NAME:"UPLOAD_CUST_LIST",
            ACTION_INFO:{CUSTOMERS:_this.CUSTOMERS}
        });

        //用户信息
        datas.push({
            ACTION_NAME:"UPLOAD_USER",
            ACTION_INFO:{MESSAGES:_this.upmessage}
        });


        AJAXALL(datas,function(data){
            var success = true;
            for(var i= 0,l=data.length;i<l;i++){
                var thisdata = data[i];

                if(parseInt(thisdata.ACTION_RETURN_CODE) != 0 ){
                    success = false;
                }
            }

            if(success){
                //上传成功
                _this.handlerSql();
            }else{
                //上传失败
                _this.backError(CMBC_MESSAGE.ajax.upload_err);
            }
        });
    },
    //清理数据
    handlerSql:function(){
        var _this = this;

        DATAINTERFACE.sqlite.execs({
            sql:_this.sqls,
            success:function(rs){
                _this.getTimeStamp();
            },
            error:function(){
                _this.backError(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //获取数据时间戳版本
    getTimeStamp:function(){
        var _this = this;
        DATAINTERFACE.sqlite.exec({
            sql:"select * from updatatime",
            success:function(rs){
                var numbers = rs.rows.length,
                    data = {};

                for (var i = 0; i<numbers; i++ ){
                    data[rs.rows.item(i).u_name]  = rs.rows.item(i).u_timestamp;
                }

                _this.downloadUser(data);
            },
            error:function(){
                _this.backError(CMBC_MESSAGE.sql.select_err);
            }
        })
    },
    //下载数据
    downloadUser:function(timestamp){
        var _this = this,
            type = 1;
        timestamp.downloadUser = (timestamp.downloadUser)? timestamp.downloadUser : _this.stamptime ;

        DATAINTERFACE.ajax.UserDataDownload({
            TIMESTAMP:timestamp.downloadUser,
            TYPE:type
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadUser = data;
            _this.newTimestamp.downloadUser = backtime;
            _this.downloadInfo(timestamp);

        },function(){
            //ajax失败
            _this.backError(CMBC_MESSAGE.ajax.download_err);
        })
    },
    downloadInfo:function(timestamp){
        var _this = this;
        timestamp.downloadInfo = (timestamp.downloadInfo)? timestamp.downloadInfo : _this.stamptime ;

        DATAINTERFACE.ajax.infoDataDownload({
            TIMESTAMP:timestamp.downloadInfo
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadInfo = data;
            _this.newTimestamp.downloadInfo = backtime;

            _this.downloadResourceImage(timestamp);

        },function(){
            //ajax失败
            _this.backError(CMBC_MESSAGE.ajax.download_err);
        })
    },
    downloadResourceImage:function(timestamp){
        var _this = this;
        DATAINTERFACE.ajax.downloadResourceFile({

        },function(data){
            //ajax成功
            _this.tempData.downloadResourceImage = data;

            _this.downloadCluteAudit(timestamp);

        },function(){
            //ajax失败
            _this.backError(CMBC_MESSAGE.ajax.download_err);
        })
    },
    downloadCluteAudit:function(timestamp){
        var _this = this;
        timestamp.downloadCluteAudit = (timestamp.downloadCluteAudit)? timestamp.downloadCluteAudit : _this.stamptime ;

        DATAINTERFACE.ajax.cluteAudit({
            TIMESTAMP:timestamp.downloadCluteAudit
        },function(data,backtime){
            //ajax成功
            _this.tempData.downloadCluteAudit = data;
            _this.newTimestamp.downloadCluteAudit = backtime;

            //下载完成。。。
            _this.updataSqlMessage();

        },function(){
            //ajax失败
            _this.backError(CMBC_MESSAGE.ajax.download_err);
        })
    },

    //更新数据库
    updataSqlMessage:function(){
        if(!$.isObject(this.tempData.downloadUser)){
            //下一步
            this.updataSqlNotice();
            return;
        }

        var _this = this,
            serverdata = _this.tempData.downloadUser.MESSAGES,
            sql = [],
            delids="";

        if($.isObject(serverdata)){
            //拼装sql
            for(var key in serverdata){
                var thisdata = serverdata[key],
                    newid = thisdata.NOTICE_ID,
                    newtype = thisdata.TYPE,
                    newinfo = JSON.stringify(thisdata),
                    newclientid = thisdata.CUST_ID,
                    newcreater = thisdata.CREATER,
                    newdata = thisdata.CREATE_DATE,
                    newsendto = thisdata.RECEIVER;


                delids += "'"+newid+"',";

                sql.push("insert into message(m_id,m_creater,m_data,m_type,m_sendto,m_info,m_client_id) values('"+newid+"','"+newcreater+"','"+newdata+"','"+newtype+"','"+newsendto+"','"+newinfo+"','"+newclientid+"')");
            }
            delids = delids.substr(0,delids.length-1);

        }

        if(sql.length !=0){
            sql.unshift("delete from message where m_id in ("+delids+")");

            sql.push(" delete from updatatime where u_name = 'downloadUser'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadUser','"+_this.newTimestamp.downloadUser+"')  ");

            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.updataSqlNotice();
                },
                error:function(){
                    _this.backError(CMBC_MESSAGE.sql.select_err);
                }
            })
        }else{
            //下一步
            _this.updataSqlNotice();
        }


    },
    updataSqlNotice:function(){
        if(!$.isObject(this.tempData.downloadInfo)){
            //下一步
            this.updataSqlClueTable();
            return;
        }

        var _this = this,
            serverdata = _this.tempData.downloadInfo.NOTICES,
            sql = [],
            delids="";

        if($.isObject(serverdata)){
            //拼装sql
            for(var key in serverdata){
                var thisdata = serverdata[key],
                    newid = thisdata.NOTICE_ID,
                    newtype = thisdata.TYPE,
                    newinfo = JSON.stringify(thisdata),
                    newdata = thisdata.CREATE_DATE;


                delids += "'"+newid+"',";

                sql.push("insert into notices(n_id,n_type,n_info,n_data) values('"+newid+"','"+newtype+"','"+newinfo+"','"+newdata+"')");
            }
            delids = delids.substr(0,delids.length-1);

        }

        if(sql.length !=0){
            sql.unshift("delete from notices where n_id in ("+delids+")");

            sql.push(" delete from updatatime where u_name = 'downloadInfo'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadInfo','"+_this.newTimestamp.downloadInfo+"')  ");


            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.updataSqlClueTable();
                },
                error:function(){
                    _this.backError(CMBC_MESSAGE.sql.select_err);
                }
            })
        }else{
            //下一步
            _this.updataSqlClueTable();
        }

    },
    updataSqlClueTable:function(){
        if(!$.isObject(this.tempData.downloadCluteAudit)){
            //跳到下一步
            this.downloadResourceImageStart();
            return;
        }

        var _this = this,
            sql=[],
            serverdata = _this.tempData.downloadCluteAudit;

        if($.isObject(serverdata)){
            //sql.push("delete from tasks");
            //拼装sql
            for(var key1 in serverdata){
                var thisclueid = key1,
                    thisstate = serverdata[key1];


                if(thisstate){
                    thisstate = parseInt(thisstate);
                    if(thisstate == 3 || thisstate == 4 || thisstate == 6 || thisstate ==7 ){
                        sql.push("update clues set c_state = '"+thisstate+"' where  c_id = '"+thisclueid+"' " );
                    }
                }

            }
        }

        if(sql.length !=0){
            sql.push(" delete from updatatime where u_name = 'downloadCluteAudit'  ");
            sql.push(" insert into updatatime(u_name,u_timestamp) values('downloadCluteAudit','"+_this.newTimestamp.downloadCluteAudit+"')  ");

            DATAINTERFACE.sqlite.execs({
                sql:sql,
                success:function(){
                    //下一步
                    _this.downloadResourceImageStart();
                },
                error:function(){
                    _this.backError(CMBC_MESSAGE.sql.select_err);
                }
            })
        }else{
            //下一步
            _this.downloadResourceImageStart();
        }
    },
    //下载文件
    downloadResourceImageStart:function(){
        var _this = this,
            data = _this.tempData.downloadResourceImage,
            datas = null;

        if($.isObject(data) && data.FILES.length != 0 ){
            datas = data.FILES;
        }else{
            _this.cleaningString();
            return;
        }

        if(datas && $.isArray(datas) && datas.length !=0){
            //下载文件到 downloadimage
            var thisdatas = [];

            for(var i= 0,l=datas.length;i<l;i++){
                thisdatas.push({url:datas[i],id:""})
            }

            var iserror = false;
            phonegap.files.superDownloadFile.start({
                urls:thisdatas,
                dir:DATAINTERFACE.directory.downloadimage,
                progress:function(evt){
                    //console.log(evt);
                },
                start:function(){},
                success:function(){},
                complete:function(){
                    //if(!iserror){
                        _this.cleaningString();
                    //}
                },
                error:function(id){
                    iserror = true;
                    //_this.setUpdataStateEnd();
                }
            });
            /*
             phonegap.files.downloads({
             src:datas,
             dir:DATAINTERFACE.directory.downloadimage,
             success:function(){
             _this.setUpdataStateEnd();
             },
             error:function(){
             _this.setUpdataStateEnd();
             //_this.fileERR("filewrite");
             }
             })
             */
        }else{
            _this.cleaningString();
        }
    },
    //清理数据库并完成
    cleaningString:function(){
        var _this = this;

        _this.backSuccess();
    },
    //返回成功
    backSuccess:function(){
        this.successfn("");
        this.refreshThis();
    },
    //返回失败
    backError:function(err){
        this.errorfn(err);
        this.refreshThis();
    },
    //清空变量
    refreshThis:function(){
        this.successfn = null;
        this.errorfn = null;
        this.sqls = [];
        this.upmessage = [];
        this.tempData = {};
        this.newTimestamp = {};
        this.stamptime = null;
        this.CUSTOMERS = [];
    }
};

