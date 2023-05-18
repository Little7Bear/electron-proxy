import type { Express } from 'express';
import express from 'express';
import { urlencoded, json } from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import os from 'os';

let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let systemDomain = '';
const myIp = getIPAdress();
let app: Express;

function replaceUrlParam(url: string, paramName: string, paramValue: string) {
  const pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + paramValue + '$2');
  }
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
}

function getMatchParams(url: string, param: string) {
  let result = '';
  const reg = new RegExp('[?&]' + param + '=([^&]*)', 'i');
  const matches = url.match(reg);
  if (matches && matches.length) {
    result = decodeURIComponent(matches[1]);
  }
  return result;
}

function getIPAdress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName] as os.NetworkInterfaceInfo[];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

/**
 * @description:创建代理服务器并将所有请求（请求头、请求体）都转发到指定的目标 URL。主要用于在开发中测试和调试，模拟真实生产环境。
 * @param {string} target 目标 URL 地址
 * @param {number} port 端口
 * @return {*}
 */
export async function createProxyServer(target: string, port: number) {
  app = express();
  app.use(urlencoded({ extended: true }));
  app.use(json());
  await close();

  const proxy = createProxyMiddleware({
    target,
    ws: false,
    changeOrigin: true,
    secure: false,
    onProxyReq(proxyReq, req) {
      const prefix = proxyReq.host.split('-')[0];
      systemDomain = prefix + '-one.iotomp.com';
      if (getMatchParams(proxyReq.path, 'systemDomain')) {
        proxyReq.path = replaceUrlParam(proxyReq.path, 'systemDomain', systemDomain);
      }

      if (req.body && Object.getOwnPropertyNames(req.body).length) {
        if (req.body.systemDomain) req.body.systemDomain = systemDomain;
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError(err, req, res) {
      res.json({ code: '500', msg: '转发异常', action: req.path });
    },
  });

  app.use(proxy);
  server = await app.listen(port);
}

/**
 * @description: 关闭代理
 */
export async function close() {
  if (server) {
    await server.close();
  }
}

export const ip = myIp;
