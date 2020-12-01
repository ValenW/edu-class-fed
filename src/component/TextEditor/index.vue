<template>
  <div class="editor" ref="editor"></div>
</template>

<script lang="ts">
import E from 'wangeditor'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TextEditor extends Vue {
  @Prop({ type: String, default: '' })
  private value!: string

  $refs!: {
    editor: HTMLElement
  }
  private mounted() {
    this.initEditor()
  }

  private initEditor() {
    const editor = new E(this.$refs.editor)
    editor.config.onchange = (html: string) => {
      this.$emit('input', html)
    }
    editor.create()
    editor.txt.html(this.value)
  }
}
</script>

<style scoped></style>
