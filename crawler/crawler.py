import argparse
import csv
import os
import re
import time
from datetime import date, datetime
from urllib.parse import urljoin

import mysql.connector
import requests
from bs4 import BeautifulSoup


NEWS_URL = "https://www.dufe.edu.cn/news/news/"
DATABASE_NAME = "fintech_crawler"
TABLE_NAME = "dufe_news"
CSV_HEADERS = ["新闻标题", "发布日期", "发稿单位", "网页链接"]
DEFAULT_DEPARTMENT = "东北财经大学金融科技学院"


def get_mysql_config():
    return {
        "host": os.getenv("MYSQL_HOST", "localhost"),
        "port": int(os.getenv("MYSQL_PORT", "3306")),
        "user": os.getenv("MYSQL_USER", "root"),
        "password": os.getenv("MYSQL_PASSWORD", ""),
        "charset": "utf8mb4",
    }


def create_database_and_table():
    config = get_mysql_config()
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    cursor.execute(
        f"""
        CREATE DATABASE IF NOT EXISTS {DATABASE_NAME}
        DEFAULT CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci
        """
    )
    cursor.execute(f"USE {DATABASE_NAME}")
    cursor.execute(
        f"""
        CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            publish_date DATE NOT NULL,
            department VARCHAR(100),
            url VARCHAR(500) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uniq_url (url)
        )
        """
    )

    conn.commit()
    cursor.close()
    conn.close()


def fetch_html(url):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0 Safari/537.36"
        )
    }
    response = requests.get(url, headers=headers, timeout=30)
    response.encoding = response.apparent_encoding
    response.raise_for_status()
    return response.text


def fetch_html_with_retry(url, retries=3, sleep_seconds=1):
    last_error = None
    for attempt in range(1, retries + 1):
        try:
            return fetch_html(url)
        except requests.RequestException as error:
            last_error = error
            print(f"请求失败，准备重试 {attempt}/{retries}: {url}")
            time.sleep(sleep_seconds)
    raise last_error


def clean_text(text):
    return re.sub(r"\s+", " ", text).strip()


def parse_chinese_date(text):
    match = re.search(r"(\d{4})[年\.-](\d{1,2})[月\.-](\d{1,2})日?", text)
    if not match:
        return None
    year, month, day = match.groups()
    return date(int(year), int(month), int(day)).isoformat()


def page_url(page_number):
    if page_number == 1:
        return NEWS_URL
    return urljoin(NEWS_URL, f"{page_number}.html")


def get_total_pages(html):
    soup = BeautifulSoup(html, "html.parser")
    total_pages = 1
    for link in soup.find_all("a", href=True):
        text = clean_text(link.get_text())
        href = link["href"]
        if text.isdigit():
            total_pages = max(total_pages, int(text))
        match = re.search(r"/news/news/(\d+)\.html", href)
        if match:
            total_pages = max(total_pages, int(match.group(1)))
    return total_pages


def parse_news_list(html, base_url=NEWS_URL):
    soup = BeautifulSoup(html, "html.parser")
    news = []
    seen_urls = set()

    for link in soup.find_all("a", href=True):
        title = clean_text(link.get_text())
        href = link["href"].strip()

        if not title or "content_" not in href:
            continue
        if not href.startswith("content_"):
            continue

        parent_text = clean_text(link.parent.get_text(" ", strip=True))
        publish_date = parse_chinese_date(parent_text)
        if publish_date is None:
            continue

        url = urljoin(base_url, href)
        if url in seen_urls:
            continue

        seen_urls.add(url)
        news.append(
            {
                "新闻标题": title,
                "发布日期": publish_date,
                "发稿单位": "",
                "网页链接": url,
            }
        )

    return news


def fill_departments(news_list):
    for item in news_list:
        item["发稿单位"] = DEFAULT_DEPARTMENT
    return news_list


def should_stop_for_target_date(page_news, target_date):
    if not page_news:
        return False
    oldest_date = min(item["发布日期"] for item in page_news)
    return oldest_date < target_date


def crawl_pages(target_date=None, crawl_all=False):
    first_html = fetch_html_with_retry(page_url(1), retries=5, sleep_seconds=2)
    total_pages = get_total_pages(first_html)
    all_news = []
    seen_urls = set()

    for page_number in range(1, total_pages + 1):
        try:
            html = (
                first_html
                if page_number == 1
                else fetch_html_with_retry(page_url(page_number), retries=3)
            )
        except Exception as error:
            print(f"列表页跳过: 第 {page_number} 页，原因: {error}")
            continue

        page_news = parse_news_list(html, page_url(page_number))
        print(f"已爬取第 {page_number}/{total_pages} 页，解析到 {len(page_news)} 条")

        if target_date and not crawl_all:
            page_news_to_save = [
                item for item in page_news if item["发布日期"] == target_date
            ]
        else:
            page_news_to_save = page_news

        for item in page_news_to_save:
            if item["网页链接"] not in seen_urls:
                seen_urls.add(item["网页链接"])
                all_news.append(item)

        if target_date and not crawl_all and should_stop_for_target_date(page_news, target_date):
            break

    return all_news


def save_to_csv(news_list, file_name):
    with open(file_name, "w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=CSV_HEADERS)
        writer.writeheader()
        writer.writerows(news_list)
    return file_name


def save_to_mysql(news_list):
    create_database_and_table()

    if not news_list:
        return 0

    config = get_mysql_config()
    config["database"] = DATABASE_NAME
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    sql = f"""
    INSERT INTO {TABLE_NAME} (title, publish_date, department, url)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        publish_date = VALUES(publish_date),
        department = VALUES(department)
    """

    data = [
        (
            item["新闻标题"],
            item["发布日期"],
            item["发稿单位"],
            item["网页链接"],
        )
        for item in news_list
    ]

    cursor.executemany(sql, data)
    conn.commit()
    affected_rows = cursor.rowcount

    cursor.close()
    conn.close()
    return affected_rows


def crawl(target_date=None, crawl_all=False):
    news_list = crawl_pages(target_date=target_date, crawl_all=crawl_all)
    fill_departments(news_list)

    if crawl_all:
        csv_name = "all_news.csv"
    else:
        csv_name = f"{target_date.replace('-', '')}.csv"

    save_to_csv(news_list, csv_name)
    affected_rows = save_to_mysql(news_list)

    return csv_name, len(news_list), affected_rows


def main():
    parser = argparse.ArgumentParser(description="Crawl DUFE news and save to CSV/MySQL.")
    parser.add_argument(
        "--date",
        default=None,
        help="Target publish date, format: YYYY-MM-DD. Default: today unless --all is used.",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Crawl all pages instead of only one date.",
    )
    args = parser.parse_args()

    target_date = args.date
    if not args.all and target_date is None:
        target_date = datetime.now().date().isoformat()

    csv_name, news_count, affected_rows = crawl(
        target_date=target_date,
        crawl_all=args.all,
    )

    print(f"CSV文件: {csv_name}")
    print(f"新闻数量: {news_count}")
    print(f"MySQL影响行数: {affected_rows}")


if __name__ == "__main__":
    main()
