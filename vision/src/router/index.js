import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/sellerpage",
    component: () => import("@/view/SellerPage"),
  },
	{
    path: "/trendpage",
    component: () => import("@/view/TrendPage"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
