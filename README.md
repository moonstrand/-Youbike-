# 台中微笑單車站點資訊 #
以Vue框架開發，供查詢台中內所有站點資訊，串接台中公共自行車即時服務資料，撈取台中各站點資料並實作篩選地區以及關鍵字功能。
原先為撈取桃園各站點資訊，但後續因受到 CORS 策略保護無法正常抓到 JSON 資料，故改為撈取台中站點

### Demo ###
https://moonstrand.github.io/youbike-taoyuan/



## 如何執行專案 ##

### 安裝專案 ###
    npm install

### 編譯專案 ###
    npm run serve

### 分析及修復 ###
    npm run lint

## 主要功能 ##

- 撈取資料後以站點為單位呈區塊顯示，資料為總車格、可用車、空位數量以及站點狀態
- 以總車格與可用車數量比例計算，呈現供車狀況並於下方以進度條圖形顯示
- 以站點關鍵字及台中行政區篩選各站點顯示

## 作品使用技術、語言 ##
- HTML
- RWD/SCSS
- JavaScript ES6
- AJAX
- Git
- ESLint

## 作品使用框架、函式庫、套件 ##
- Vue.js
- Vue CLI
- Axios
- Bootstrap

## 素材引用來源 ##
### API ###
[TCG OPEN DATA API](https://opendata.taichung.gov.tw/search/6e38eb56-0e9a-4b9e-806d-23cd35d44d6b)

### 背景圖片來源 ###
[Unsplash](https://unsplash.com/)
