export default defineAppConfig({
  pages: ["pages/index/index", "pages/hanzi/xue"],
  entryPagePath: "pages/index/index",
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "学汉字",
    navigationBarTextStyle: "black",
  },
  lazyCodeLoading: "requiredComponents",
});
