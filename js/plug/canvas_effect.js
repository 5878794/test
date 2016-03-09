/*
 * Filename : canvas_effect.js
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-8-2
 * Time: 上午11:32
 * Email:5878794@qq.com
 * =====================================
 * Desc:  canvas画布滤镜  (去色、黑白、反色、浮雕)
 *
 *      bens.require("canvas_effect")       （4个效果选1）
 *          .greyScale(obj)              //去色
 *          .blackAndWhite(obj)          //黑白
 *          .negative(obj)               //反色（胶片感觉）
 *          .relief(obj)                 //浮雕
 *          .restore(obj)                //还原（直接写入初始缓存的图片数据，不处理）
 *
 *
 *      @param--------
 *      obj = {
 *         imageData:obj        //图片的数据 ctx.getImageData(0,0,width,height)
 *         ctx:obj              //画布对象 document.getElementById("myCanvas").getContext("2d")
 *      }
 *
 */

//var c = document.getElementById("myCanvas"),
//    ctx = c.getContext("2d"),
//    data = ctx.getImageData(0,0,200,200);
//
//bens.require("canvas_effect").greyScale({
//    imageData:data,
//    ctx:ctx
//});


(function(){
    return {
        //还原
        restore:function(datas){
            var input_data = datas.imageData,
                ctx = datas.ctx;

            ctx.putImageData(input_data,0,0);
        },
        //去色
        greyScale:function(datas){
            var input_data = datas.imageData,
                ctx = datas.ctx,
                width = input_data.width || 0,
                height = input_data.height || 0,
                output_data = ctx.createImageData(input_data),
                l = width * height * 4;

            for (var i = 0; i < l ; i += 4) {
                var r = input_data.data[i],
                    g = input_data.data[i + 1],
                    b = input_data.data[i + 2],
                    new_color = parseInt((r + g + b) / 3);

                output_data.data[i] = new_color;
                output_data.data[i + 1] = new_color;
                output_data.data[i + 2] = new_color;
                output_data.data[i + 3] = 255;
            }

            ctx.putImageData(output_data,0,0);
        },
        //黑白
        blackAndWhite:function(datas){
            var input_data = datas.imageData,
                ctx = datas.ctx,
                width = input_data.width || 0,
                height = input_data.height || 0,
                output_data = ctx.createImageData(input_data),
                l = width * height * 4;

            for (var i = 0; i < l ; i += 4) {
                var r = input_data.data[i],
                    g = input_data.data[i + 1],
                    b = input_data.data[i + 2],
                    new_color = parseInt((r + g + b) / 3);

                new_color = (new_color>=100)? 255 : 0;

                output_data.data[i] = new_color;
                output_data.data[i + 1] = new_color;
                output_data.data[i + 2] = new_color;
                output_data.data[i + 3] = 255;
            }

            ctx.putImageData(output_data,0,0);
        },
        //底片效果（反色）
        negative:function(datas){
            var input_data = datas.imageData,
                ctx = datas.ctx,
                width = input_data.width || 0,
                height = input_data.height || 0,
                output_data = ctx.createImageData(input_data),
                l = width * height * 4;

            for (var i = 0; i < l ; i += 4) {
                var r = input_data.data[i],
                    g = input_data.data[i + 1],
                    b = input_data.data[i + 2];

                output_data.data[i] = 255-r;
                output_data.data[i + 1] = 255-g;
                output_data.data[i + 2] = 255-b;
                output_data.data[i + 3] = 255;
            }

            ctx.putImageData(output_data,0,0);
        },
        //浮雕效果
        relief:function(datas){
            var input_data = datas.imageData,
                ctx = datas.ctx,
                output_data = ctx.createImageData(input_data);

            for ( var x = 1; x < input_data.width-1; x++) {
                for ( var y = 1; y < input_data.height-1; y++){

                    // Index of the pixel in the array
                    var idx = (x + y * input_data.width) * 4;
                    var bidx = ((x-1) + y * input_data.width) * 4;
                    var aidx = ((x+1) + y * input_data.width) * 4;

                    // calculate new RGB value
                    var nr = input_data.data[aidx + 0] - input_data.data[bidx + 0] + 128;
                    var ng = input_data.data[aidx + 1] - input_data.data[bidx + 1] + 128;
                    var nb = input_data.data[aidx + 2] - input_data.data[bidx + 2] + 128;
                    nr = (nr < 0) ? 0 : ((nr >255) ? 255 : nr);
                    ng = (ng < 0) ? 0 : ((ng >255) ? 255 : ng);
                    nb = (nb < 0) ? 0 : ((nb >255) ? 255 : nb);

                    // assign new pixel value
                    output_data.data[idx + 0] = nr; // Red channel
                    output_data.data[idx + 1] = ng; // Green channel
                    output_data.data[idx + 2] = nb; // Blue channel
                    output_data.data[idx + 3] = 255; // Alpha channel
                }
            }
            ctx.putImageData(output_data,0,0);
        }
    };
})();






