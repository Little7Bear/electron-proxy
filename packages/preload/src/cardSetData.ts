import { writeFile, readFile, existsSync } from 'fs';
import { resolve } from 'path';

const filename = resolve(__dirname, '../data/cardSet.json');

/**
 * @description: 写入
 * @param {string} json 数据
 */
export function save(json: string) {
  return new Promise((resolve, reject) => {
    writeFile(filename, json, err => {
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
    if (!existsSync(filename)) resolve('');
    readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
