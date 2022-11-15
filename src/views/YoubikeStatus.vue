<template>
  <div class="bg">
    <div class="container py-4">
      <h1 class="text-center text-light fw-bold">桃園微笑單車站點資訊</h1>
      <div class="row justify-content-center py-5">
        <div class="col-xl-3 col-md-4 col-6">
          <div class="input-group mb-3 ps-sm-0 ps-2">
            <input
              type="text"
              class="form-control"
              placeholder="站點關鍵字"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              v-model="search"
            />
            <button
              class="btn btn-secondary"
              type="button"
              id="button-addon2"
              v-if="!hasSearch"
              @click="getData"
            >
              <i class="bi bi-search"></i>
            </button>
            <button
              class="btn btn-secondary"
              type="button"
              id="button-addon2"
              v-if="hasSearch"
              @click="clearSearch"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <div
          class="
            col-xl-4 col-md-5 col-6
            d-flex
            justify-content-end
            align-items-start
            pe-sm-0
          "
        >
          <select
            class="form-select w-50"
            aria-label="Default select example"
            v-model="filterArea"
            @change="getData"
          >
            <option selected>全部</option>
            <option v-for="area in area" :key="area" :value="area">
              {{ area }}
            </option>
          </select>
        </div>
        <div
          class="site-info col-xl-7 col-md-9 mb-4"
          v-for="site in pageData"
          :key="site.sna"
        >
          <div class="d-flex justify-content-between">
            <div class="d-flex flex-xl-row flex-column">
              <p class="h4 fw-bold mb-xl-0">
                {{ site.sna }}
              </p>
              <span class="ps-xl-2 ps-0">{{ site.ar }}</span>
            </div>
            <p
              class="site-status text-success fw-bold"
              v-if="(site.sbi / site.tot) * 100 > 40"
            >
              供車狀況：充足
            </p>
            <p
              class="site-status text-warning fw-bold"
              v-else-if="
                (site.sbi / site.tot) * 100 < 40 &&
                (site.sbi / site.tot) * 100 > 15
              "
            >
              供車狀況：緊繃
            </p>
            <p
              class="site-status text-danger fw-bold"
              v-else-if="(site.sbi / site.tot) * 100 < 15"
            >
              供車狀況：不足
            </p>
          </div>
          <div class="row pt-3">
            <div class="col">
              <p>總車格：{{ site.tot }}</p>
              <p>目前可用車數量：{{ site.sbi }}</p>
            </div>
            <div class="col">
              <p>目前空位數量：{{ site.bemp }}</p>
              <p v-if="site.act" class="text-success">站點狀態：啟用中</p>
              <p v-else class="text-danger">站點狀態：無法使用</p>
            </div>
          </div>
          <div class="progress">
            <div
              class="progress-bar bg-success"
              :class="{
                'bg-warning': (site.sbi / site.tot) * 100 < 40,
                'bg-danger': (site.sbi / site.tot) * 100 < 15,
              }"
              role="progressbar"
              :style="{ width: (site.sbi / site.tot) * 100 + '%' }"
              :aria-valuenow="site.sbi"
              aria-valuemin="0"
              :aria-valuemax="site.tot"
            ></div>
          </div>
        </div>
        <div v-if="site.length === 0">
          <div
            class="
              notfound
              d-flex
              flex-column
              justify-content-center
              align-items-center
              mt-4
            "
          >
            <i class="bi bi-emoji-dizzy-fill"></i>
            <p class="h2 pt-4">找不到{{ search }}相關站點，請重新搜尋。</p>
          </div>
        </div>
      </div>
      <Pagination
        :page="pages"
        @switch-page="setPage"
        v-if="site.length !== 0"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '../components/Pagination.vue';

export default {
  data() {
    return {
      site: [],
      area: [],
      pageData: [],
      pages: {},
      filterArea: '全部',
      search: '',
      hasSearch: false,
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getData() {
      const api = 'https://data.tycg.gov.tw/api/v1/dump/datastore/a1b4714b-3b75-4ff8-a8f2-cc377e4eaa0f';
      this.$http
        .get(api)
        .then((res) => {
          this.site = Object.values(res.data.retVal);
          const allArea = this.site.map((value) => value.sarea);
          this.area = allArea.filter((value, index, arr) => arr.indexOf(value) === index);
          if (this.search.trim() !== '') {
            this.hasSearch = true;
            this.filterArea = '全部';
            this.site = this.site.filter((value) => value.sna.match(this.search));
          }
          if (this.filterArea !== '全部') {
            this.search = '';
            this.site = this.site.filter((value) => value.sarea === this.filterArea);
          }
          this.setPage(1);
        })
        .catch((err) => {
          console.log(`請求失敗，代碼：${err.request.status}`);
        });
    },
    setPage(nowPage) {
      const dataTotal = this.site.length;
      const perpage = 20;
      const pageTotal = Math.ceil(dataTotal / perpage);
      let currentPage = nowPage;
      if (currentPage > pageTotal) {
        currentPage = pageTotal;
      }
      const minData = currentPage * perpage - perpage + 1;
      const maxData = currentPage * perpage;
      const data = [];
      this.site.forEach((value, i) => {
        const num = i + 1;
        if (num >= minData && num <= maxData) {
          data.push(value);
        }
      });
      this.pages = {
        pageTotal,
        currentPage,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < pageTotal,
      };
      this.renderData(data);
    },
    clearSearch() {
      this.hasSearch = false;
      this.search = '';
      this.getData();
    },
    renderData(data) {
      this.pageData = data;
    },
  },
  created() {
    this.getData();
  },
};
</script>
