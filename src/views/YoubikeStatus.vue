<template>
  <div class="bg">
    <div class="container py-4">
      <h1 class="text-center text-light fw-bold">台中微笑單車站點資訊</h1>
      <div class="row justify-content-center py-4">
        <div class="col-xl-3 col-md-4 col-6">
          <div class="input-group mb-3 ps-sm-0 ps-2">
            <input type="text" class="form-control" placeholder="站點關鍵字" aria-label="站點關鍵字"
              aria-describedby="basic-addon2" v-model="search" />
            <span class="input-group-text bg-secondary border-0" id="basic-addon2" disabled v-if="!hasSearch">
              <i class="bi bi-search text-light"></i>
            </span>
            <button class="btn btn-secondary" type="button" id="button-addon2" v-if="hasSearch" @click="clearSearch">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <div class="
            col-xl-4 col-md-5 col-6
            d-flex
            justify-content-end
            align-items-start
            pe-sm-0
          ">
          <select class="form-select w-50" :class="{ 'bg-disabled': this.hasSearch }"
            aria-label="Default select example" v-model="filterArea" :disabled="hasSearch" @change="getData">
            <option selected>全部</option>
            <option v-for="area in area" :key="area" :value="area">
              {{ area }}
            </option>
          </select>
        </div>
        <div class="site-info col-xl-7 col-md-9 mb-4" v-for="site in pageData" :key="site.sna">
          <div class="d-flex flex-md-row justify-content-between flex-column">
            <p class="h4 fw-bold mb-xl-0 mb-2">
              {{ site.sna }}
            </p>
            <p class="site-status text-success fw-bold mb-xl-0 mb-2" v-if="(site.sbi / site.tot) * 100 >= 40">
              供車狀況：充足
            </p>
            <p class="site-status text-tight fw-bold mb-xl-0 mb-2" v-else-if="
              (site.sbi / site.tot) * 100 < 40 &&
              (site.sbi / site.tot) * 100 > 15
            ">
              供車狀況：緊繃
            </p>
            <p class="site-status text-danger fw-bold mb-xl-0 mb-2" v-else-if="(site.sbi / site.tot) * 100 <= 15">
              供車狀況：不足
            </p>
          </div>
          <p class="mb-0">{{ site.ar }}</p>
          <div class="row pt-3">
            <div class="col">
              <p>總車格：{{ site.tot }}</p>
              <p>目前可用車數量：{{ site.sbi }}</p>
            </div>
            <div class="col">
              <p v-if="site.bemp >= 0">目前空位數量：{{ site.bemp }}</p>
              <p v-else>目前空位數量：0</p>
              <p v-if="site.act != 1" class="text-danger">站點狀態：無法使用</p>
              <p v-else class="text-success">站點狀態：啟用中</p>
            </div>
          </div>
          <div class="progress">
            <div class="progress-bar bg-success" :class="{
              'bg-warning': (site.sbi / site.tot) * 100 < 40,
              'bg-danger': (site.sbi / site.tot) * 100 < 15,
            }" role="progressbar" :style="{ width: (site.sbi / site.tot) * 100 + '%' }" :aria-valuenow="site.sbi"
              aria-valuemin="0" :aria-valuemax="site.tot"></div>
          </div>
        </div>
        <div class="
            err-msg
            col-xl-7 col-md-9
            d-flex
            flex-column
            justify-content-center
            align-items-center
            mt-4
          " v-if="pageData.length === 0 && !errStatus">
          <i class="bi bi-emoji-dizzy-fill"></i>
          <p class="h2 pt-4">找不到"{{ search }}"相關站點，請重新搜尋。</p>
        </div>
        <div class="
            err-msg
            col-xl-7 col-md-9
            d-flex
            flex-column
            justify-content-center
            align-items-center
            mt-4
          " v-if="errStatus">
          <i class="bi bi-emoji-dizzy-fill"></i>
          <p class="h2 pt-4">連線錯誤。</p>
        </div>
      </div>
      <Pagination :page="pages" @switch-page="setPage" v-if="pageData.length !== 0"></Pagination>
    </div>
    <footer class="bg-dark text-light py-3 text-center">
      <p class="mb-1">Copyright © 2022 moonstrand</p>
      <p class="mb-1">個人練習作品，非商業用途。</p>
      <a class="footer-link" href="https://github.com/moonstrand">
        <i class="bi bi-github pe-1"></i>GitHub
      </a>
    </footer>
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
      errStatus: false,
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getData() {
      const api = 'https://datacenter.taichung.gov.tw/swagger/OpenData/86dfad5c-540c-4479-bb7d-d7439d34eeb1';
      this.$http
        .get(api)
        .then((res) => {
          console.log(res.data);
          this.site = Object.values(res.data.retVal);
          this.site = this.site.map((value) => ({ ...value, sna: value.sna.replace('YouBike2.0_', '') }));
          const allArea = this.site.map((value) => value.sarea);
          this.area = allArea.filter((value, index, arr) => arr.indexOf(value) === index);
          this.setPage(1);
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            this.errStatus = true;
          }
        });
    },
    setPage(nowPage) {
      const dataTotal = this.filterSite.length;
      const perpage = 20;
      const maxPage = 5;
      const pageTotal = Math.ceil(dataTotal / perpage);
      let currentPage = nowPage;
      if (currentPage > pageTotal) {
        currentPage = pageTotal;
      }
      const minData = currentPage * perpage - perpage + 1;
      const maxData = currentPage * perpage;
      const data = [];
      this.filterSite.forEach((value, i) => {
        const num = i + 1;
        if (num >= minData && num <= maxData) {
          data.push(value);
        }
      });
      this.pages = {
        pageTotal,
        currentPage,
        maxPage,
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
  computed: {
    filterSite() {
      let filterItems;
      if (this.filterArea === '全部') {
        filterItems = this.site.filter((value) => value);
        if (this.search.trim() !== '') {
          filterItems = this.site.filter((value) => value.sna.match(this.search));
        }
      } else if (this.filterArea !== '全部') {
        filterItems = this.site.filter((value) => value.sarea === this.filterArea);
        if (this.search.trim() !== '') {
          filterItems = this.site.filter((value) => value.sna.match(this.search));
        }
      }
      return filterItems;
    },
  },
  watch: {
    search(n) {
      if (n.trim() !== '') {
        this.hasSearch = true;
        this.filterArea = '全部';
        this.setPage(1);
      } else if (n.trim() === '') {
        this.hasSearch = false;
        this.filterArea = '全部';
        this.setPage(1);
      }
    },
    filterArea(n) {
      if (n !== '全部') {
        this.setPage(1);
      }
    },
  },
  created() {
    this.getData();
  },
};
</script>
