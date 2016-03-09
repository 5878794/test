/*
 * Filename : inputcursor.js
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-7-22
 * Time: 下午1:46
 * Email:5878794@qq.com
 * =====================================
 * Desc:  input焦点操作，获取焦点、设置焦点、插入文字
 *
 *
 * //获取input的焦点--------------------------------------------
 * bens.require("inputcursor").getPosition({
 *     obj:id/jqdom/dom     //input对象
 * })
 *
 * return {
 *      start:number,       //焦点开始位置
 *      end:number,         //焦点结束位置
 *      text:string         //焦点选取文字
 * }
 *
 *
 *
 * //设置input的焦点--------------------------------------------
 * bens.require("inputcursor").setPosition({
 *     obj:id/jqdom/dom     //input对象
 *     start:number,        //焦点开始位置
 *     end:number           //焦点结束位置
 * })
 *
 *
 *
 * //input内插入文字--------------------------------------------
 * bens.require("inputcursor").insertText({
 *     obj:id/jqdom/dom     //input对象
 *     start:number,        //焦点开始位置
 *     end:number           //焦点结束位置
 *     text:string          //要插入的文字
 * })
 */


(function(){
    return  {
        getPosition:function(data){
            var _this=bens.getDom(data.obj),
                rangeData = {text: "", start: 0, end: 0 };

            if (_this.setSelectionRange) { // W3C
                _this.focus();
                rangeData.start= _this.selectionStart;
                rangeData.end = _this.selectionEnd;
                rangeData.text = (rangeData.start != rangeData.end) ? _this.value.substring(rangeData.start, rangeData.end): "";
            } else if (document.selection) { // IE
                _this.focus();
                var i,
                    oS = document.selection.createRange(),
                // Don't: oR = textarea.createTextRange()
                    oR = document.body.createTextRange();
                oR.moveToElementText(_this);

                rangeData.text = oS.text;
                rangeData.bookmark = oS.getBookmark();

                // object.moveStart(sUnit [, iCount])
                // Return Value: Integer that returns the number of units moved.
                for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i ++) {
                    // Why? You can alert(textarea.value.length)
                    if (_this.value.charAt(i) == '\r' ) {
                        i ++;
                    }
                }
                rangeData.start = i;
                rangeData.end = rangeData.text.length + rangeData.start;
            }

            return rangeData;
        },
        setPosition:function(data){
            var _this=bens.getDom(data.obj),
                start = parseInt(data.start) || 0,
                end = parseInt(data.end) || $(_this).val().length,
                rangeData = {text: "", start: start, end: end };

            _this.focus();
            if (_this.setSelectionRange) { // W3C
                _this.setSelectionRange(rangeData.start, rangeData.end);
            } else if (_this.createTextRange) { // IE
                var oR;
                oR = _this.createTextRange();
                oR.moveStart('character', parseInt(rangeData.start));
                oR.moveEnd('character', -1*($(_this).val().length-parseInt(rangeData.end)));
                oR.select();
            }
        },
        insertText:function(data){
            var _this=bens.getDom(data.obj),
                start = parseInt(data.start) || 0,
                end = parseInt(data.end) || $(_this).val().length,
                text = data.text || "";

            var rangeData = {text: text, start: start, end: end };

            if (_this.setSelectionRange) { // W3C
                var ovalue=$(_this).val(),
                    nvalue=ovalue.substring(0,rangeData.start)+rangeData.text+ovalue.substring(rangeData.end),
                    nStart = rangeData.start + text.length,
                    nEnd = rangeData.start + text.length;

                $(_this).val(nvalue);
                this.setPosition({
                    obj:_this,
                    start:nStart,
                    end:nStart
                });
            } else if (_this.createTextRange) { // IE
                this.setPosition({
                    obj:_this,
                    start:start,
                    end:end
                });

                var sR;
                sR = document.selection.createRange();
                sR.text = text;
                sR.setEndPoint('StartToEnd', sR);
                sR.select();
            }
        }
    };
})();
