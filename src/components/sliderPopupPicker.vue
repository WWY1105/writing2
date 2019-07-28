<template>
    <div>
        <group>
             <!--年级选择器start-->
             <!-- <span>{{$refs.picker3&&$refs.picker3.getNameValues()}}</span> -->
            <popup-picker :title="leftText" @on-change='change' ref="picker3" :popup-style="{zIndex: zindex}" :data="gradesArr"  :placeholder="myRight"  class="gradePicker"></popup-picker>
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
            myRight:''
        }
    },
    watch:{
        rightText(val){
            console.log('watch'+val)
            this.myRight=this.rightText
        }
    },
    props:['gradesArr','leftText','id','rightText','zindex'],
    components:{
        Picker,
         Group,
         PopupPicker
    },
    mounted(){
        this.myRight=this.rightText
        // alert(this.rightText)
    },
    methods:{
         // pop
        changeValue(value) {
             this.pickerIsShow=!this.pickerIsShow;
        },
        change(value) {
             console.log('value'+value)
             var  name=this.$refs.picker3.getNameValues(value);
             var  value=value[0];

             this.myRight=name;
              console.log('右边的文字name'+this.myRight)

              console.log('value'+value)
            this.$emit('changeResult',{
                name:name,
                value:value
            })
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
