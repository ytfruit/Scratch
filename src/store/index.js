
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        iframeSrc:'https://www.scratch5.com/scratch/',
        // ruleForm:[],
        // routes:[],
        newStu:[],
        id_section:'',
        id_course:'',
        id_qs:'',
        id_q:'',
        id_Q:[],
        id_c:'',
        id_homework:'',
        question:[],
        grade:[],
        video_yet:[],
        section_c:[],
        sectiondetail:[],
        timeendUp:[],
    },
    mutations:{
        initRoutes(state,data){
            state.routes=data;
        },
        savestu_id(state,data){
            state.newStu=data
        },
        saveid_section(state,data){
            state.id_section=data
        },
        savesection_deatil(state,data){
            state.sectiondetail=data
        },
        saveid_course(state,data){
            state.id_course=data
        },
        saveid_qs(state,data){
            state.id_qs=data
        },
        saveid_c(state,data){
            state.id_c=data
        },
        savesetion_c(state,data){
            state.section_c=data
        },
        saveid_q(state,data){
            state.id_q=data
        },
        setid_homework(state,data){
            state.id_homework=data
        },
        setgrade(state,data){
            state.grade=data
        },
        savevideo_yet(state,data){
            state.video_yet=data
        },
        saveid_Q(state,data){
            state.id_Q=data
        },
       savequestion(state,data){
        state.question=data
       },
       savetimeendUp(state,data){
        state.timeendUp=data
       }
    },
    actions: {

    },
    modules: {

    },

    // plugins:[
    //     createPresistedstate({
    //         storage:window.sessionStorage,
    //         reducer(val){
    //             return{
    //                 iframeSrc:'https://www.scratch5.com/scratch/',
    //                 ruleForm:val.ruleForm,
    //                 routes:val.routes,
    //                 newStu:val.newStu,
    //                 id_section:val.id_section,
    //                 id_course:val.id_course,
    //                 id_qs:val.id_qs,
    //                 id_q:val.id_q,
    //                 id_Q:val.id_Q,
    //                 id_c:val.id_c,
    //                 id_homework:val.id_homework,
    //                 question:val.question,
    //                 grade:val.grade,
    //                 video_yet:val.video_yet,
    //                 section_c:val.section_c,
    //                 sectiondetail:val.sectiondetail,
    //                 timeendUp:val.timeendUp,
    //             }
    //         }
    //     })
    // ]

})



