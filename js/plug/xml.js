/**
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-4-7
 * Time: 下午3:08
 * ==============================================================
 * xml处理
 * ==============================================================
 *
 * 需要 bens
 *
 *
 * //将字符串转换成xml
 * require("xml").getXml(str);
 * @param str：str   //要转换的字符串
 *
 *
 * //将xml转换成json
 * require("xml").toJson(xml);
 * @param xml: str/xml dom  //要转换的字符串或xml对象
 *
 */




(function(){
    var text2xml = function(text){
        var doc;
        if (window.ActiveXObject){
            doc=new ActiveXObject('Microsoft.XMLDOM');
            doc.async='false';
            doc.loadXML(text);
        } else {
            var parser=new DOMParser();
            doc=parser.parseFromString(text,'text/xml');
        }
        return doc;
    };

    var xmlToJson = function(xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                //obj["__attr__"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    //obj["__attr__"][attribute.nodeName] = attribute.nodeValue;
                    obj[attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    };


    return {
        getXml:function(str){
            return text2xml(str);
        },
        toJson:function(xml){
            return xmlToJson(xml);
        }
    }


})();