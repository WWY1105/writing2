<template>
    <div>
        <group>
            <!--<cell>-->
            <flexbox justify="space-between" class="sexBox" height="200px">
                <flexbox-item>
                    {{title}}
                </flexbox-item justify="space-between">
                <flexbox-item>
                    <checker class="checkerBox" v-model="seexCheckType" default-item-class="normalClass" selected-item-class="selectedClass">
                        <checker-item :value="item.value" v-for="item,index in radiosArr" @on-item-click="toCheck(index)" :key="index">
                            <i :class="item.selected?'selectCircleFill':'selectCircle'"></i>{{item.text}}
                        </checker-item>
                    </checker>
                </flexbox-item>
            </flexbox>
            <!--</cell>-->

        </group>
    </div>
</template>

<script>
import { Flexbox, FlexboxItem, CheckIcon, Group,Checker,CheckerItem,} from 'vux'
export default {
    data() {
        return {
            seexCheckType: '',//性别选中值
        }
    },
    props: ['radiosArr','title'],
    methods: {
        toCheck(index) {
            for (var i in this.radiosArr) {
                this.radiosArr[i].selected = false;
            }
            this.radiosArr[index].selected=true;
            // alert(this.radiosArr[index].value)
            this.$emit('getRadioValue',this.radiosArr[index].value)
        }
    },
    components:{
Flexbox,
FlexboxItem,
CheckIcon,
CheckerItem,
 Group,
 Checker
    }
}
</script>

<style scoped>
.sexBox {
    padding: 10px 16px;
}

.checkerBox {
    display: flex;
        justify-content: space-between;
    width: 100%;
}

.vux-flexbox .vux-flexbox-item:first-child {
    max-width: 70px;
}
.selectCircle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #3375C5;
    display: inline-block;
}

.selectCircleFill {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #3375C5;
    background: #3375C5;
    display: inline-block;
}
.vux-checker-item i {
    margin-right: 5px;
}
.vux-checker-item{
       margin-left: 0px;
    font-size: 14px;
    color: #3375C5;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
</style>
