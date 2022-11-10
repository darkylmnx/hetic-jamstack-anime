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
export default {
  name: 'PagePage',
  head() {
    return {
      title: `Accueil page ${this.$route.params.page}`
    };
  },
  asyncData({ params }) {
    const page = params.page || 1;
    return fetch(`http://localhost:1111/items/Trailers?meta=total_count&page=${page}&limit=12`)
      .then(res => res.json())
      .then((data) => ({
        data,
      }))
  },
}
</script>
