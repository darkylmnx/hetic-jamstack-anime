<template>
  <div>
    <HomeContent
      :currentPage="$route.params.page || 1"
      :meta="data.meta"
      :animes="data.data"
    />
  </div>
</template>

<script>
import constants from '~/constants';

export default {
  name: 'PagePage',
  head() {
    return {
      title: `Accueil page ${this.$route.params.page}`
    };
  },
  asyncData({ params }) {
    const page = params.page || 1;
    return fetch(`${constants.URL}/items/Trailers?meta=total_count&page=${page}&limit=12`)
      .then(res => res.json())
      .then((data) => ({
        data,
      }))
  },
}
</script>
