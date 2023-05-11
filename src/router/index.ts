import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    // name: 'Home',
    // component: () => import('../views/Home.vue'),
    redirect: { name: 'Signin'}
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../components/form/Signin.vue'),
    meta : { auth: false}
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../components/form/Signup.vue'),
    meta : { auth: false}
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue'),
    meta : { auth: true}
  },
  {
    path: '/addquestion',
    name: 'Question',
    component: () => import('../components/form/Question.vue'),
    meta : { auth: true}
  },

  {
    path: '/listquestion',
    name: 'Question List',
    component: () => import('../components/form/QuestionList.vue'),
    meta : { auth: true}
  },

  
  
  {
    path: '/listpractice',
    name: 'ListPractice',
    component: () => import('../components/form/ListPractice.vue'),
    meta : { auth: true}
    // children: [
    //   {
    //     path: 'createpractice',
    //     component: () => import('../components/form/Practice.vue')
    //   }
    // ]
  },
  ,
  {
    path: '/assignquiz',
    name: 'AssignQuiz',
    component: () => import('../components/form/AssignQuiz.vue'),
    meta : { auth: true}
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'Signin' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if(to.meta.auth && !authStore.isAuthenticated){
    next('/signin')
  } else if(!to.meta.auth && authStore.isAuthenticated){
    next('/account')
  }
  else{
    next()
  }
  
});
export default router;