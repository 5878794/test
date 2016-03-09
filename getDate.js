/**
 * Created by bens on 16-1-13.
 */



$(document).ready(function(){
    var aaaa = GETDATE.getDays(a);
    console.log(aaaa)
});



var GETDATE = {
        dateToStamp:function(a){
                if(!a){
                    return new Date().getTime();
                }


                var new_str = a.replace(/:/g,'-');
                new_str = new_str.replace(/ /g,'-');
                new_str = new_str.replace(/\//ig,'-');
                var arr = new_str.split("-");

                if(arr.length != 6){
                    for(var i= 0,l=6-arr.length;i<l;i++){
                        arr.push(0);
                    }
                }

                return new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5])).getTime();
        },
        getStampArray:function(arr){
                var b= [];
                var obj = {};
                var date = [];
                for(var i= 0,l=arr.length;i<l;i++){
                        var  this_val = arr[i],
                                stamp = this.dateToStamp(this_val);
                        var that_val = this_val.split(" ")[0];
                        that_val = this.dateToStamp(that_val+" 24:00:00");

                        if(!obj.hasOwnProperty(that_val)){
                                obj[that_val] = true;
                                date.push(that_val);
                        }
                        b.push(stamp);
                }

                return {
                        dates:date.sort(),
                        newArr: b.sort()
                }
        },
        getDays: function(arr){

                var obj = this.getStampArray(arr),
                        dates = obj.dates,
                        newArr = obj.newArr,
                        nowStamp = new Date().getTime().toString(),
                        index = newArr.indexOf(nowStamp);

                if(index == -1){
                        index = this.getIndex(newArr,nowStamp,0);
                }

                var temp_index = 0,
                        temp_arr = [];
                for(var i= 0,l=dates.length;i<l;i++){
                        var this_stamp = dates[i];
                        temp_index = this.getIndex(newArr,this_stamp,temp_index);
                        temp_arr.push(temp_index);
                }
                return {
                        now:index,
                        dates:temp_arr
                }

        },
        getIndex:function(data,date,index){
                var temp = data.length-1;
                for(var l=data.length;index<l;index++){
                        if(date <= data[index]){
                                temp = index - 1;
                                break;
                        }
                }
                return temp;
        }
};