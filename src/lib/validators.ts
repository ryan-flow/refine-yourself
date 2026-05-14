const MAX_FILE_SIZE = 10 * 1024 * 1024

export function validateChatFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.txt')) {
    return '仅支持 .txt 格式的聊天记录文件'
  }
  if (file.size === 0) {
    return '文件内容为空'
  }
  if (file.size > MAX_FILE_SIZE) {
    return '文件过大，请上传小于 10MB 的文件'
  }
  return null
}
