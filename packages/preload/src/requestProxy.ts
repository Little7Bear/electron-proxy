import httpProxy from 'http-proxy';

// 创建代理服务器
let proxy = httpProxy.createProxyServer({});

/**
 * @description:创建代理服务器并将所有请求（请求头、请求体）都转发到指定的目标 URL。主要用于在开发中测试和调试，模拟真实生产环境。
 * @param {string} target 目标 URL 地址
 * @return {*}
 */
export function createProxyServer(target: string, port: number) {
  if (proxy) proxy.close();
  proxy = httpProxy
    .createProxyServer({ target, secure: false, ws: true, changeOrigin: true })
    .listen(port);
}

/**
 * @description: 关闭代理
 */
export function close() {
  if (proxy) proxy.close();
}
