<script>
import constants from '~/constants';

export default {
  props: {
    anime: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    isLoading: false,
    isNewCommentLoading: false,
    comments: [],
    newComment: {
      username: '',
      rate: 1,
      text: '',
    },
  }),
  methods: {
    addComment() {
      const newComment = { ...this.newComment };
      newComment.trailer = this.anime.id;

      this.isNewCommentLoading = true;
      fetch(`${constants.URL}/items/Comments`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(newComment),
      })
        .then((res) => res.json())
        .then((json) => {
          this.comments.unshift(json.data);
          this.newComment.username = '';
          this.newComment.text = '';
          this.newComment.rate = 1;
          window.scroll(0, 0);
        })
        .finally(() => (this.isNewCommentLoading = false));
    },
  },
  created() {
    this.isLoading = true;
    fetch(`${constants.URL}/items/Comments?sort[]=-date_created&filter[trailer][_eq]=${this.anime.id}`)
      .then((res) => res.json())
      .then((json) => (this.comments = json.data))
      .finally(() => (this.isLoading = false));
  }
}
</script>

<template>
  <section class="section has-background-light">
    <div v-if="isLoading" class="notification is-info">
      Chargement...
    </div>
    <div v-else>
      <article v-for="comment in comments" :key="comment.id" class="box">
        <h4 class="title is-6">
          {{ comment.username }}
        </h4>
        <p>{{ comment.text }}</p>
        <p>{{ comment.rate }}</p>
      </article>
    </div>

    <form class="box mt-5" @submit.prevent="addComment">
      <div class="field">
        <p class="control">
          <label for="username">
            Pseudo
          </label>
          <input v-model="newComment.username" type="text" required class="input">
        </p>
      </div>
      <div class="field">
        <p class="control">
          <label for="Note">
            Note
          </label>
          <input v-model.number="newComment.rate" type="number" min="1" max="5" required class="input">
        </p>
      </div>
      <div class="field">
        <p class="control">
          <label for="username">
            Text
          </label>
          <textarea v-model="newComment.text" required class="input" style="height: 200px"></textarea>
        </p>
      </div>
      <div class="field">
        <button
          class="button is-primary"
          :class="{'is-loading': isNewCommentLoading}"
          type="submit"
        >
          Envoyer
        </button>
      </div>
    </form>
  </section>
</template>
