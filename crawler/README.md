# DUFE News Crawler

这个脚本会爬取东北财经大学新闻页面，把指定日期的新闻保存为 `YYYYMMDD.csv`，并自动写入 MySQL。

## 1. 安装依赖

```bash
pip install -r requirements.txt
```

## 2. 设置 MySQL 密码

PowerShell 中运行：

```powershell
$env:MYSQL_PASSWORD="你的MySQL密码"
```

如果你的 MySQL 不是默认配置，也可以设置：

```powershell
$env:MYSQL_HOST="localhost"
$env:MYSQL_PORT="3306"
$env:MYSQL_USER="root"
```

## 3. 运行爬虫

爬取今天的数据：

```bash
python crawler.py
```

爬取指定日期的数据：

```bash
python crawler.py --date 2026-05-01
```

爬取所有新闻页面：

```bash
python crawler.py --all
```

程序会自动创建：

- 数据库：`fintech_crawler`
- 数据表：`dufe_news`
- CSV 文件：指定日期时例如 `20260501.csv`，全量爬取时为 `all_news.csv`

说明：

- `python crawler.py --date 2026-05-01` 会自动翻页查找这个日期的新闻。
- `python crawler.py --all` 会从第 1 页爬到最后一页，耗时会更久。
- 数据库用网页链接去重，重复运行不会重复插入同一条新闻。

## 4. 在 MySQL Workbench 检查

```sql
USE fintech_crawler;
SELECT * FROM dufe_news;
```

检查是否有重复链接：

```sql
SELECT url, COUNT(*)
FROM dufe_news
GROUP BY url
HAVING COUNT(*) > 1;
```
