import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import PlansView from '@/views/PlansView.vue';
import CustomersView from '@/views/CustomersView.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/plans'
      },
      {
        path: 'plans',
        name: 'plans',
        component: PlansView
      },
      {
        path: 'customers',
        name: 'customers',
        component: CustomersView
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  const isPublic = Boolean(to.meta.public);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false);

  if (isPublic) {
    if (to.name === 'login' && auth.isAuthenticated) {
      next({ name: 'dashboard' });
      return;
    }
    next();
    return;
  }

  if (requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  next();
});

export default router;
