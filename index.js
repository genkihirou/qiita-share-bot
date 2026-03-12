// Qiita API から記事一覧を取得
async function fetch_qiita_items() {
  const url = "https://qiita.com/api/v2/items?page=1&per_page=20";

  const response = await fetch(url);
  const items = await response.json();

  return items;
}

// ストック数が多い記事をソート
function pick_top_item(items) {
  return items.sort((a, b) => b.stocks_count - a.stocks_count)[0];
}

// Slack Webhook URLを取得して送信
async function post_to_slack(item) {
  // 人気記事を用意
  const text =`今日のQiita人気記事${item.title} ${item.url} ストック数: ${item.stocks_count}`;
  // slackへ送信
  const webhook = process.env.SLACK_WEBHOOK_URL;
  await fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });
}

// 人気記事をslackへ共有
async function main() {
  const items = await fetch_qiita_items();
  const top = pick_top_item(items);
  await post_to_slack(top);
}

main();
