let navTimer

export default {
  data () {
    return {
      pointerStart: this.allowActionFromSearch ? -1 : 0,
      pointer: this.allowActionFromSearch ? -1 : 0,
      pointerDirty: false,
      optionHeight: 40,
      keyboardNavigating: false
    }
  },
  props: {
    /**
     * Enable/disable highlighting of the pointed value.
     * @type {Boolean}
     * @default true
     */
    showPointer: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    pointerPosition () {
      return this.pointer * this.optionHeight
    },
    visibleElements () {
      return this.optimizedHeight / this.optionHeight
    }
  },
  watch: {
    filteredOptions () {
      this.pointerAdjust()
    },
    isOpen () {
      this.pointerDirty = false
    }
  },
  methods: {
    optionHighlight (index, option) {
      return {
        'multiselect__option--highlight': index === this.pointer && this.showPointer,
        'multiselect__option--selected': option && this.isSelected(option)
      }
    },
    addPointerElement ({ key } = 'Enter') {
      /* istanbul ignore else */
      if (this.allowActionFromSearch && this.pointer === -1 && this.search) {
        this.emitActionFromSearch()
      } else if (this.filteredOptions.length > 0 && this.pointer >= 0) {
        this.select(this.filteredOptions[this.pointer], key)
      }
      this.pointerReset()
    },
    pointerForward () {
      this.setKeyboardNavigating()
      /* istanbul ignore else */
      if (this.pointer < this.filteredOptions.length - 1) {
        this.pointer++
        /* istanbul ignore next */
        if (this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight) {
          this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight
        }
        /* istanbul ignore else */
        if (this.filteredOptions[this.pointer].$isLabel) this.pointerForward()
      }
      this.pointerDirty = true
    },
    pointerBackward () {
      this.setKeyboardNavigating()
      if (this.pointer > 0) {
        this.pointer--
        /* istanbul ignore else */
        if (this.$refs.list.scrollTop >= this.pointerPosition) {
          this.$refs.list.scrollTop = this.pointerPosition
        }
        /* istanbul ignore else */
        if (this.filteredOptions[this.pointer].$isLabel) this.pointerBackward()
      } else if (this.pointer === 0) {
        this.pointer = this.pointerStart // 0 or -1
      } else {
        /* istanbul ignore else */
        if (this.filteredOptions[0].$isLabel) this.pointerForward()
      }
      this.pointerDirty = true
    },
    pointerReset () {
      /* istanbul ignore else */
      if (!this.closeOnSelect) return
      this.pointer = this.pointerStart
      /* istanbul ignore else */
      if (this.$refs.list) {
        this.$refs.list.scrollTop = 0
      }
    },
    pointerAdjust () {
      /* istanbul ignore else */
      if (this.pointer >= this.filteredOptions.length - 1) {
        this.pointer = this.filteredOptions.length
          ? this.filteredOptions.length - 1
          : this.pointerStart
      }

      if (this.filteredOptions.length > 0 && this.pointer >= 0 && this.filteredOptions[this.pointer].$isLabel) {
        this.pointerForward()
      }
    },
    pointerSet (index) {
      if (!this.keyboardNavigating) {
        this.pointer = index
        this.pointerDirty = true
      }
    },
    setKeyboardNavigating () {
      this.keyboardNavigating = true
      clearTimeout(navTimer)
      navTimer = setTimeout(() => {
        this.keyboardNavigating = false
      }, 200)
    }
  }
}
