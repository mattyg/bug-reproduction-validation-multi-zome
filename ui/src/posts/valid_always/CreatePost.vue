<template>
  <mwc-snackbar ref="create-error"></mwc-snackbar>

  <div style="display: flex; flex-direction: column">
    <span style="font-size: 18px">Create Post</span>
  
    <div style="margin-bottom: 16px">
      <mwc-textarea outlined label="Body" :value="body" @input="body = $event.target.value" required></mwc-textarea>
    </div>

  
    <mwc-button 
      raised
      label="Create Post"
      :disabled="!isPostValid"
      @click="createPost"
    ></mwc-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, ComputedRef } from 'vue';
import { AppAgentClient, Record, AgentPubKey, EntryHash, ActionHash, DnaHash } from '@holochain/client';
import { Post } from './types';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-snackbar';
import { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-textarea';

export default defineComponent({
  data(): {
    body: string;
  } {
    return { 
      body: '',
    }
  },
  computed: {
    isPostValid() {
    return true && this.body !== '';
    },
  },
  mounted() {
  },
  methods: {
    async createPost() {
      const post: Post = { 
        body: this.body!,
      };

      try {
        const record: Record = await this.client.callZome({
          cap_secret: null,
          role_name: 'posts',
          zome_name: 'valid_always',
          fn_name: 'create_post',
          payload: post,
        });
        this.$emit('post-created', record.signed_action.hashed.hash);
      } catch (e: any) {
        const errorSnackbar = this.$refs['create-error'] as Snackbar;
        errorSnackbar.labelText = `Error creating the post: ${e.data.data}`;
        errorSnackbar.show();
      }
    },
  },
  emits: ['post-created'],
  setup() {
    const client = (inject('client') as ComputedRef<AppAgentClient>).value;
    return {
      client,
    };
  },
})
</script>
