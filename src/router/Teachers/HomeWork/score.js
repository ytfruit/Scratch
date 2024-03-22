import Vue from 'vue'
import VueRouter from 'vue-router'
import Score from "@/views/Teachers/HomeWork/Score.vue";

Vue.use(VueRouter)

const scoreroutes = [
    {
        path: '/teachers/score',
        name: 'Score',
        component: Score,
        meta:{
            title:"批改题目"
        },
    }


]

export default scoreroutes
