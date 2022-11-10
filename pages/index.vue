<template>
  <div>
    <HomeContent
      :meta="data.meta"
      :animes="data.data"
    />
  </div>
</template>

<script>
import constants from '~/constants';
export default {
  name: 'IndexPage',
  asyncData() {
    return fetch(`${constants.URL}/items/Trailers?meta=total_count&page=1&limit=12`)
      .then(res => res.json())
      .then((data) => ({
        data,
      }))
  },
  watch: {
    ['$route.query.s'](newVal) {
      fetch(`${constants.URL}/items/Trailers?meta=total_count&page=1&limit=12&search=${newVal}`)
      .then(res => res.json())
      .then((json) => (this.data = json));
    }
  }
}
</script>
