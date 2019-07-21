<template>
    <div>
        <group>
             <!--年级选择器start-->
            <popup-picker :title="leftText"  @on-change='change' v-model="chooseResult" :popup-style="{zIndex: zindex}"  :placeholder="rightText" :data="sliderArr"   class="gradePicker"></popup-picker>
            <!--年级选择器end-->
        </group>
        
    </div>
</template>

<script>
import {  Group,Picker ,PopupPicker} from 'vux'
export default {
    name:'slidePicker',
    data(){
        return {
            pickerIsShow:false,
            chooseResult:[],
            //  rightText:'不限'
        }
    },
    props:['sliderArr','leftText','id','rightText','zindex'],
    components:{
        Picker,
         Group,
         PopupPicker
    },
    mounted(){
        
         console.log(this.gradesArr)
        
         console.log(this.sliderArr)
    },
    methods:{
         // pop
        changeValue(value) {
             this.pickerIsShow=!this.pickerIsShow;
        },
        change(value) {
            // var arr=[];
            // var str=this.$refs.picker3.getNameValues();
            //  arr.push(str);
            //  this.chooseResult=value;
            // console.log(arr)
            this.$emit('changeResult',value)
        }
       
        // pop
    }
}
</script>

<style scoped>
p.chooseHang {
    padding: 9px 16px 9px 15px;
    height: 44px;
}

p.chooseHang .leftText {
    color: #242424;
    font-size: 14px;
}

p.chooseHang .rightText {
    color: #3375C5;
    font-size: 14px;
}

p.chooseHang .rightText svg {
    margin-left: 12px;
}
.gradePicker{
    /*z-index:999999999;*/
}


</style>
