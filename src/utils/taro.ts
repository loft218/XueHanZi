import Taro from "@tarojs/taro";

export const getPlatform = () => Taro.getSystemInfoSync().platform;
export const isDevTools = () => getPlatform() === "devtools";

export const saveFile = async (
  data: ArrayBuffer,
  fileName: string
): Promise<string | null> => {
  try {
    const fileSystemManager = Taro.getFileSystemManager();

    // 使用文件系统管理器写入文件
    await fileSystemManager.writeFile({
      filePath: fileName,
      data,
      encoding: "binary",
    });

    console.log(`File saved successfully: ${fileName}`);
    return fileName; // 返回保存的文件路径
  } catch (error) {
    console.error("Error saving file:", error);
    return null; // 返回 null 表示保存失败
  }
};

export const checkFileExists = async (fileName: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const fileSystemManager = Taro.getFileSystemManager();
    fileSystemManager.stat({
      path: fileName,
      success: () => resolve(true), // 文件存在
      fail: () => resolve(false), // 文件不存在
    });
  });
};
