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
	{
    path: "/mappage",
    component: () => import("@/view/MapPage"),
  },
	{
    path: "/rankpage",
    component: () => import("@/view/RankPage"),
  },
	{
    path: "/hotpage",
    component: () => import("@/view/HotPage"),
  },
	{
    path: "/stockpage",
    component: () => import("@/view/StockPage"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
