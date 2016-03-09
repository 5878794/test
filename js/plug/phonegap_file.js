/*
 * Filename :phonegap_file.js
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-7-5
 * Time: 下午2:28
 * Email:5878794@qq.com
 * =====================================
 * Desc:  phonegap文件超做
 *
 *
 *
 * 上传-------------------------------------------------------
    bens.require("phonegap_file").upload({
         fileUrl:str,           //上传文件地址
         serverUrl:str,         //上传服务器地址
         fileKey:str,           //上传文件的key，相当与input的name
         param:obj,             //上传文件附带参数
         headers:obj,           //上传文件的报文头
         success:fn({           //上传文件成功   返回对象
                 responseCode:,
                 response:,
                 bytesSent:
                }),
         error:fn({             //上传文件失败   返回对象
                 code:,
                 http_status: 411???   有这只？
                 source:,
                 target:
         })
    })
    ----------------------------------------------------------
 *
 *
 *
 *
 *
 */







(function(){
    return {
        //只支持image类型上传。。。。改 mimeType
        upload:function(datas){
            var fileurl = datas.fileUrl,            //上传文件的资源地址
                serverUrl = datas.serverUrl,        //服务器地址
                filekey = datas.fileKey,            //上传文件的key，相当与input的name
                success = bens.getFunction(datas.success),  //成功回调
                error = bens.getFunction(datas.error),      //失败回调
                param = ($.isObject(datas.param))? datas.param : null,//上传时的其它参数  obj
                headers = ($.isObject(datas.headers))? datas.headers : null,//上传时的文件头

                options = new FileUploadOptions();

            if(!fileurl || !serverUrl || !filekey){
                console.log("phonegap_file.upload:参数错误");
                return;
            }


            options.fileKey=filekey;
            options.fileName=fileurl.substr(fileurl.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            if(param){
                options.params = param;
            }
            if(headers){
                options.headers = headers;
            }


            var successfn = function(rs){
                var responseCode = rs.responseCode,
//                    bytesSent = rs.bytesSent,
                    response = rs.response;

                if(responseCode == 200){
                    success(response);
                }else{
                    error({
                        http_status:responseCode,
                        code:responseCode
                    });
                }

            };


            var ft = new FileTransfer();
            ft.upload(fileurl, encodeURI(serverUrl), successfn, error, options);
        }
    }
})();