import Vue from 'vue'
import Router from 'vue-router'

// 登录模块START
import bindTel from '@/pages/login/bindTel'
import isNewUser from '@/pages/login/isNewUser'
import getCode from '@/pages/login/getCode'
import chooseIdentity from '@/pages/login/choose_identity'
import fill_in_information from '@/pages/login/fill_in_information'
// 登录模块END

// 首页模块
// import index from '@/pages/index/index'
import order from '@/pages/index/order'
import searchResult from '@/pages/index/searchResult'
import writerDetail from '@/pages/index/writerDetail'
import privateMsg from '@/pages/index/privateMsg'
import viewingMechanism from '@/pages/index/viewingMechanism'
// 首页模块 end

// 圈子
import circle from '@/pages/circle/circle'
import postCircle from '@/pages/circle/postCircle'
import circleDetail from '@/pages/circle/circleDetail'
import myMineCircle from '@/pages/circle/myMineCircle'
import myCollectionCircle from '@/pages/circle/myCollectionCircle'
import activeMessage from '@/pages/circle/activeMessage'
// 圈子END

// 任务
import supplementMissionDetail from '@/pages/mission/supplementMissionDetail'
import missionDetail from '@/pages/mission/missionDetail'
import mission from '@/pages/mission/mission'
import postMission from '@/pages/mission/postMission'
import taskOrientation from '@/pages/mission/taskOrientation'
import replyDetailsToPay from '@/pages/mission/replyDetailsToPay'
import replyDetails from '@/pages/mission/replyDetails'
import toConfirmMission from '@/pages/mission/toConfirmMission'
import serviceRecipient from '@/pages/mission/serviceRecipient'
import handelEnroll  from '@/pages/mission/handelEnroll'
import taskPay  from '@/pages/mission/taskPay'
import paySuccess  from '@/pages/mission/paySuccess'
import payFail  from '@/pages/mission/payFail'
// 任务  end


// 我的
import mineIndex from '@/pages/mine/mineIndex'
import supplementaryRegistration from '@/pages/mine/supplementaryRegistration'
import myMainPage from '@/pages/mine/myMainPage'
import realNameAuthentication  from '@/pages/mine/realNameAuthentication'
import educationAuthentication  from '@/pages/mine/educationAuthentication'
import authorAuthentication  from '@/pages/mine/authorAuthentication'
import myPostMission from '@/pages/mine/myPostMission'
import myEnrollMission from '@/pages/mine/myEnrollMission'
import myTags from '@/pages/mine/myTags'
import myFallow from '@/pages/mine/myFallow'
import myMailbox from '@/pages/mine/myMailbox'
import mailDetail from '@/pages/mine/mailDetail'
import systemMessage from '@/pages/mine/systemMessage'
import contactUs from '@/pages/mine/contactUs'
import feedback from '@/pages/mine/feedback'
import commonProblem from '@/pages/mine/commonProblem'
import privacyClause from '@/pages/mine/privacyClause'
import partnerRegistration from '@/pages/mine/partnerRegistration'
import myNetwork from '@/pages/mine/myNetwork'
import myWallet from '@/pages/mine/myWallet'
import recharge from '@/pages/mine/recharge'
import cashWithdrawal from '@/pages/mine/cashWithdrawal'
import cashWithdrawalSuccess from '@/pages/mine/cashWithdrawalSuccess'
import myMediator from '@/pages/mine/myMediator'
import addFellow from '@/pages/mine/addFellow'
import giveRedEnvelopes from '@/pages/mine/giveRedEnvelopes'
import missionInExecutionBuss from '@/pages/mine/missionInExecutionBuss'
import missionInExecutionAuth from '@/pages/mine/missionInExecutionAuth'
import stagePlan from '@/pages/mine/stagePlan'
import registAchievement from '@/pages/mine/registAchievement'
import missionInAfterEvaluteBuss from '@/pages/mine/missionInAfterEvaluteBuss'

// 给家教贴标签
import evaluationAuthor from '@/pages/mine/evaluationAuthor'

// 我的end
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/circle',
      name: 'circle',
      component: circle,
      meta:{
        title:'圈子'
      }
    }, {
      path: '/circleDetail',
      name: 'circleDetail',
      component: circleDetail,
      meta:{
        title:'圈子详情'
      }
    }, 
    {
      path: '/myCollectionCircle',
      name: 'myCollectionCircle',
      component: myCollectionCircle,
      meta:{
        title:'我的收藏'
      }
    },{
      path: '/myMineCircle',
      name: 'myMineCircle',
      component: myMineCircle,
      meta:{
        title:'我的圈子'
      }
    },{
      path: '/activeMessage',
      name: 'activeMessage',
      component: activeMessage,
      meta:{
        title:'动态'
      }
    },{
      path: '/postCircle',
      name: 'postCircle',
      component: postCircle,
      meta:{
        title:'发布圈子'
      }
    },
    {
      path: '/getCode',
      name: 'getCode',
      component: getCode,
      meta:{
        title:'授权登陆'
      }
    },
    {
      path: '/',
      name: 'isNewUser',
      component: isNewUser,
      meta:{
        title:'授权登陆'
      }
    },
    
    // {
    //   path: '/index',
    //   name: 'index',
    //   component: index,
    //   meta:{
    //     title:'首页'
    //   }
    // }
    {
      path:'/order',
      name:'order',
      component:order,
      meta:{
        title:'订单'
      }
    }
    ,{
      path: '/viewingMechanism',
      name: 'viewingMechanism',
      component: viewingMechanism,
      meta:{
        title:'机构'
      }
    },{
      path:'/bindTel',
      name:'bindTel',
      component:bindTel,
      meta:{
        title:'绑定电话'
      }
    },{
      path:'/getCode',
      name:'getCode',
      component:getCode,
      meta:{
        title:'授权登陆'
      }
    },{
      path:'/choose_identity',
      name:'choose_identity',
      component:chooseIdentity,
      meta:{
        title:'选择身份'
      }
    },{
      path:'/fill_in_information',
      name:'fill_in_information',
      component:fill_in_information,
      meta:{
        title:'补充资料'
      }
    },{
      path:'/searchResult',
      name:'searchResult',
      component:searchResult,
      meta:{
         keepAlive: false,
        title:'搜索结果'
      }
    },{
      path: '/missionDetail',
      name: 'missionDetail',
      component: missionDetail,
      meta:{
        title:'任务详情',
        keepAlive: false
      }
    },
    {
      path: '/supplementMissionDetail',
      name: 'supplementMissionDetail',
      component: supplementMissionDetail,
      meta:{
        title:'任务详情',
        keepAlive: false
      }
    },
    
    {
      path: '/index',
      name: 'index',
      component: mission,
      meta:{
        title:'任务大厅'
      }
    },{
      path: '/postMission',
      name: 'postMission',
      component: postMission,
      meta:{
        title:'发布任务'
      }
    },{
      path: '/taskOrientation',
      name: 'taskOrientation',
      component: taskOrientation,
      meta:{
        title:'定向发布任务'
      }
    },
    {
      path: '/replyDetailsToPay',
      name: 'replyDetailsToPay',
      component: replyDetailsToPay,
      meta:{
        title:'发送确认'
      }
    },{
      path: '/replyDetails',
      name: 'replyDetails',
      component: replyDetails,
      meta:{
        title:'发送确认'
      }
    },{
      path: '/toConfirmMission',
      name: 'toConfirmMission',
      component: toConfirmMission,
      meta:{
        title:'发送确认'
      }
    },{
      path: '/mailDetail',
      name: 'mailDetail',
      component: mailDetail,
      meta:{
        title:'信箱详情'
      }
    },{
      path: '/systemMessage',
      name: 'systemMessage',
      component: systemMessage,
      meta:{
        title:'系统消息'
      }
    },{
      path: '/contactUs',
      name: 'contactUs',
      component: contactUs,
      meta:{
        title:'联系我们'
      }
    },{
      path: '/feedback',
      name: 'feedback',
      component: feedback,
      meta:{
        title:'意见反馈'
      }
    },{
      path: '/myMailbox',
      name: 'myMailbox',
      component: myMailbox,
      meta:{
        title:'我的信箱'
      }
    },{
      path: '/myMailbox',
      name: 'myMailbox',
      component: myMailbox,
      meta:{
        title:'我的信箱'
      }
    },{
      path: '/myFallow',
      name: 'myFallow',
      component: myFallow,
      meta:{
        title:'我的关注'
      }
    },{
      path: '/myTags',
      name: 'myTags',
      component: myTags,
      meta:{
        title:'我的标签'
      }
    },{
      path: '/myTags',
      name: 'myTags',
      component: myTags,
      meta:{
        title:'我的标签'
      }
    },{
      path: '/evaluationAuthor',
      name: 'evaluationAuthor',
      component: evaluationAuthor,
      meta:{
        title:'评价'
      }
    },{
      path: '/commonProblem',
      name: 'commonProblem',
      component: commonProblem,
      meta:{
        title:'常见问题'
      }
    },{
      path: '/partnerRegistration',
      name: 'partnerRegistration',
      component: partnerRegistration,
      meta:{
        title:'合作方登记'
      }
    },{
      path: '/myNetwork',
      name: 'myNetwork',
      component: myNetwork,
      meta:{
        title:'我的网络'
      }
    },{
      path: '/myWallet',
      name: 'myWallet',
      component: myWallet,
      meta:{
        title:'我的钱包'
      }
    },{
      path: '/myMediator',
      name: 'myMediator',
      component: myMediator,
      meta:{
        title:'我的调解人'
      }
    },{
      path: '/addFellow',
      name: 'addFellow',
      component: addFellow,
      meta:{
        title:'我的关注'
      }
    },{
      path: '/recharge',
      name: 'recharge',
      component: recharge,
      meta:{
        title:'充值'
      }
    },
    
    {
      path: '/cashWithdrawal',
      name: 'cashWithdrawal',
      component: cashWithdrawal,
      meta:{
        title:'提现'
      }
    }, {
      path: '/cashWithdrawalSuccess',
      name: 'cashWithdrawalSuccess',
      component: cashWithdrawalSuccess,
      meta:{
        title:'提现成功'
      }
    },{
      path: '/giveRedEnvelopes',
      name: 'giveRedEnvelopes',
      component: giveRedEnvelopes,
      meta:{
        title:'赞赏红包'
      }
    },{
      path: '/missionInExecutionBuss',
      name: 'missionInExecutionBuss',
      component: missionInExecutionBuss,
      meta:{
        title:'任务详情'
      }
    },
    {
      path: '/missionInAfterEvaluteBuss',
      name: 'missionInAfterEvaluteBuss',
      component: missionInAfterEvaluteBuss,
      meta:{
        title:'任务详情'
      }
    },
    
    {
      path: '/missionInExecutionAuth',
      name: 'missionInExecutionAuth',
      component: missionInExecutionAuth,
      meta:{
        title:'任务详情'
      }
    }, {
      path: '/registAchievement',
      name: 'registAchievement',
      component: registAchievement,
      meta:{
        title:'登记阶段成果'
      }
    }, {
      
      path: '/stagePlan',
      name: 'stagePlan',
      component: stagePlan,
      meta:{
        title:'写阶段计划'
      }
    },{
      path: '/privacyClause',
      name: 'privacyClause',
      component: privacyClause,
      meta:{
        title:'隐私条款'
      }
    },{
      path: '/myEnrollMission',
      name: 'myEnrollMission',
      component: myEnrollMission,
      meta:{
        title:'我报名的任务'
      }
    },{
      path: '/myPostMission',
      name: 'myPostMission',
      component: myPostMission,
      meta:{
        title:'我发布的任务',
        keepAlive: false
      }
    },{
      path: '/serviceRecipient',
      name: 'serviceRecipient',
      component: serviceRecipient,
      meta:{
        title:'服务接收者'
      }
    },{
      path: '/handelEnroll',
      name: 'handelEnroll',
      component: handelEnroll,
      meta:{
        title:'处理报名'
      }
    },{
      path: '/taskPay',
      name: 'taskPay',
      component: taskPay,
      meta:{
        title:'支付'
      }
    },{
      path: '/payFail',
      name: 'payFail',
      component: payFail,
      meta:{
        title:'支付结果'
      }
    },{
      path: '/paySuccess',
      name: 'paySuccess',
      component: paySuccess,
      meta:{
        title:'支付结果'
      }
    },
    {
      path: '/writerDetail',
      name: 'writerDetail',
      component: writerDetail,
      meta:{
        title:'家教详情',
        keepAlive: false
      }
    },{
      path: '/privateMsg',
      name: 'privateMsg',
      component: privateMsg,
      meta:{
        title:'私信'
      }
    },{
      path:'/mineIndex',
      name:'mine',
      component:mineIndex,
      meta:{
        title:'我的'
      }
    },{
      path:'/supplementaryRegistration',
      name:'mine',
      component:supplementaryRegistration,
      meta:{
        title:'补充登记'
      }
    },{
      path:'/myMainPage',
      name:'myMainPage',
      component:myMainPage,
      meta:{
        title:'基本资料'
      }
    },{
      path:'/educationAuthentication',
      name:'educationAuthentication',
      component:educationAuthentication,
      meta:{
        title:'学历认证'
      }
    },{
      path:'/authorAuthentication',
      name:'authorAuthentication',
      component:authorAuthentication,
      meta:{
        title:'家教资历'
      }
    },{
      path:'/realNameAuthentication',
      name:'realNameAuthentication',
      component:realNameAuthentication,
      meta:{
        title:'实名认证'
      }
    }
  ]
})
