import request from "@/utils/request";

export const convertToPinyin = async (text: string): Promise<string> => {
  if (!text) return "";
  const pinyins = await request<[[string]]>(`/xuepy/pinyin/${text}`);
  return pinyins.join(",");
};
