<template>
  <div class="columns">
    <div class="column">
      <div class="section has-background-primary">
        <p>
          <NuxtLink class="has-text-white" to="/">
            Retour à l'accueil
          </NuxtLink>
        </p>
        <article class="mt-5">
          <div class="box" style="height: 100%">
            <h2 class="title">
              {{ anime.title }}
            </h2>
            <h3 class="subtitle">
              Note de la rédaction : {{ anime.rate }}
              <br>
              Note des commentaires : {{ avgComments }}
            </h3>
            <p class="mt-2 has-text-weight-bold">
              Nombre de visites : {{ nbVisits }}
            </p>
            <p class="mt-2">{{ anime.published_at }}</p>
            <figure v-if="anime.image" class="image" style="width: 300px">
              <img :src="`http://localhost:1111/assets/${anime.image}`" :alt="anime.title">
            </figure>
            <div class="mt-2 has-text-weight-bold" v-html="anime.synopsis" />
            <figure v-if="ytCode" class="image mx-auto" style="width: 560px">
              <iframe width="560" height="315" :src="`https://www.youtube.com/embed/${ytCode}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
            </figure>
            <div class="mt-2">
              <a :href="anime.yt_url">
                Voir la video
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="column is-4">
      <CommentsList :anime="anime" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimePage',
  head() {
    const img = this.anime.image
    ? [ {
          name: 'og:image',
          content: `http://localhost:1111/assets/${this.anime.image}`
        } ]
    : [];

    return {
      title: `Anime : ${this.anime.title}`,
      meta: [
        ...img
      ]
    };
  },
  computed: {
    ytCode() {
      const url = this.anime.yt_url;

      if (!url) {
        return null;
      }

      let matches = url.match(/https?\:\/\/www\.youtube\.com\/watch\?v\=([a-zA-Z0-9_-]+)/);

      if (matches && matches[1]) {
        return matches [1];
      }

      matches = url.match(/https?\:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/);

      if (matches && matches[1]) {
        return matches [1];
      }

      return null;
    },
  },
  methods: {
    trackVisit() {
      const lastVisit = window.localStorage.getItem('__lva');

      if (!lastVisit || lastVisit < (Date.now() - (1000 * 60 * 5))) {
        const newVisit = {
          trailer: this.anime.id,
        };

        fetch('http://localhost:1111/items/Visits', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(newVisit),
        })
          .then(() => {
            window.localStorage.setItem('__lva', Date.now());
          });
      }
    },
  },
  async asyncData({ params }) {
    const avgComments = await fetch(`http://localhost:1111/items/Comments?filter[trailer][_eq]=${params.id}&aggregate[avg]=rate`)
      .then((res) => res.json())
      .then((json) => json.data[0].avg.rate);

    const nbVisits = await fetch(`http://localhost:1111/items/Visits?filter[trailer][_eq]=${params.id}&aggregate[count]=*`)
      .then((res) => res.json())
      .then((json) => json.data[0].count);

    const anime = await fetch('http://localhost:1111/items/Trailers/' + params.id)
      .then(res => res.json())
      .then((json) => json.data);

    return {
      avgComments,
      nbVisits,
      anime,
    };
  },
  mounted() {
    this.trackVisit();
  },
}
</script>
