import { writeFile, readFile, existsSync } from 'fs';
import { resolve } from 'node:path';

let filePath = '';
filePath = resolve(__dirname, '../../../public/cardSet.json');

/**
 * @description: 写入
 * @param {string} json 数据
 */
export function save(json: string) {
  return new Promise((resolve, reject) => {
    writeFile(filePath, json, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}

/**
 * @description: 读取
 */
export function read(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!existsSync(filePath)) resolve('');
    readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
