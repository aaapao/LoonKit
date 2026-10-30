/**
 * LoonKit · 签到 / 查询类脚本模板
 *
 * 配套任务：Task/daily-checkin.ltx
 * 可用对象：$httpClient $persistentStore $notification $done $argument
 *
 * 约定：
 * 1. 脚本自包含。Loon 不支持 require / import，公共逻辑直接内联。
 * 2. $done() 只能调用一次，放在最外层收尾。
 * 3. 任何分支都要给用户反馈，定时任务静默失败最难排查。
 */

const NAME = '示例站点';
const KEY_TOKEN = 'loonkit.checkin.token';
const KEY_LAST = 'loonkit.checkin.last';

/** $argument 兼容：可能是 "k=v&k2=v2" 字符串，也可能是对象 */
function getArgs() {
  const raw = typeof $argument === 'undefined' ? '' : $argument;
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  return String(raw)
    .split('&')
    .filter(Boolean)
    .reduce((acc, pair) => {
      const i = pair.indexOf('=');
      if (i > 0) acc[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
      return acc;
    }, {});
}

function storeRead(key, fallback) {
  const v = $persistentStore.read(key);
  return v === null || v === undefined || v === '' ? fallback : v;
}

function notify(title, subtitle, body) {
  $notification.post(title, subtitle, body);
}

/** Promise 化 $httpClient，超时由 Loon 的 timeout 参数控制 */
function request(options) {
  return new Promise((resolve, reject) => {
    const method = String(options.method || 'GET').toLowerCase();
    const fn = $httpClient[method] || $httpClient.get;
    fn(
      {
        url: options.url,
        headers: options.headers || {},
        body: options.body,
      },
      (error, response, data) => {
        if (error) return reject(new Error(String(error)));
        resolve({ status: response && response.status, body: data });
      }
    );
  });
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function main() {
  const args = getArgs();
  const token = args.token || storeRead(KEY_TOKEN, '');

  if (!token) {
    notify(NAME, '缺少 Token', '在插件参数里填写 token 后重试');
    return;
  }

  // 同日去重：手动触发和定时任务撞车时不重复请求
  if (storeRead(KEY_LAST, '') === today()) {
    console.log(`${NAME} 今日已完成，跳过`);
    return;
  }

  const res = await request({
    url: 'https://example.com/api/checkin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ source: 'loon' }),
  });

  let data = {};
  try {
    data = JSON.parse(res.body);
  } catch (e) {
    throw new Error(`响应不是 JSON（HTTP ${res.status}）`);
  }

  if (res.status !== 200 || data.code !== 0) {
    throw new Error(data.message || `签到失败，HTTP ${res.status}`);
  }

  $persistentStore.write(today(), KEY_LAST);
  notify(NAME, '签到成功', data.message || `连续签到 ${data.days || '-'} 天`);
}

main()
  .catch((err) => notify(NAME, '执行失败', err.message || String(err)))
  .then(() => $done());
