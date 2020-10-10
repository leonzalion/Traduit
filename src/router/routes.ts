import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
	{
		path: '/popup',
		component: () => import('pages/PopupPage.vue')
	},

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
