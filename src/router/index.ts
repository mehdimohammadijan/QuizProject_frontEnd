import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../components/form/Signin.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../components/form/Signup.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue'),
  },
  {
    path: '/addquestion',
    name: 'Question',
    component: () => import('../components/form/Question.vue'),
  },
  
  {
    path: '/listpractice',
    name: 'ListPractice',
    component: () => import('../components/form/ListPractice.vue'),
    // children: [
    //   {
    //     path: 'createpractice',
    //     component: () => import('../components/form/Practice.vue')
    //   }
    // ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;