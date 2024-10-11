export default defineAppConfig({
  pages: ["pages/index/index", "pages/hanzi/xue", "pages/hanzi/nian"],
  entryPagePath: "pages/hanzi/nian",
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "学汉字",
    navigationBarTextStyle: "black",
  },
  lazyCodeLoading: "requiredComponents",
});
