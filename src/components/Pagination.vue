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
        :class="{ 'active': i == page.currentPage }"
        v-for="i in page.pageTotal"
        :key="i"
        @click="switchPage(i)"
      >
        <a
          class="page-link"
          href="#"
          >{{ i }}</a
        >
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
};
</script>
