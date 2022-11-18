<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination d-flex justify-content-center">
      <li class="page-item">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          v-if="page.hasPrevious"
          @click="switchPage(Number(page.currentPage) - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
        <a class="page-link disabled" href="#" aria-label="Previous" v-else>
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        class="page-item"
        :class="{ active: i == page.currentPage }"
        v-for="i in pages"
        :key="i"
        @click="switchPage(i)"
      >
        <a class="page-link" href="#">{{ i }}</a>
      </li>
      <li class="page-item">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          v-if="page.hasNext"
          @click="switchPage(Number(page.currentPage) + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
        <a class="page-link disabled" href="#" aria-label="Next" v-else>
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['page'],
  methods: {
    switchPage(i) {
      this.$emit('switch-page', i);
    },
  },
  computed: {
    startPage() {
      if (this.page.currentPage === 1) return 1;
      if (this.page.currentPage === this.page.pageTotal) {
        if (this.page.pageTotal - 5 <= 0) {
          return 1;
        }
        return this.page.pageTotal - 5;
      }
      return Math.max(this.page.currentPage - 4, 1);
    },
    endPage() {
      const limitPage = this.startPage + this.page.maxPage;
      if (limitPage < this.page.pageTotal) {
        return limitPage;
      }
      if (limitPage >= this.page.pageTotal) {
        return this.page.pageTotal;
      }
      return limitPage;
    },
    pages() {
      const range = [];
      for (let i = this.startPage; i <= this.endPage; i += 1) {
        range.push(i);
      }
      return range;
    },
  },
};
</script>
