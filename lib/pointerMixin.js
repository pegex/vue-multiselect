'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var navTimer = void 0;

exports.default = {
  data: function data() {
    return {
      pointer: this.allowActionFromSearch ? -1 : 0,
      pointerDirty: false,
      optionHeight: 40,
      keyboardNavigating: false
    };
  },

  props: {
    showPointer: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    pointerPosition: function pointerPosition() {
      return this.pointer * this.optionHeight;
    },
    visibleElements: function visibleElements() {
      return this.optimizedHeight / this.optionHeight;
    }
  },
  watch: {
    filteredOptions: function filteredOptions() {
      this.pointerAdjust();
    },
    isOpen: function isOpen() {
      this.pointerDirty = false;
    }
  },
  methods: {
    optionHighlight: function optionHighlight(index, option) {
      return {
        'multiselect__option--highlight': index === this.pointer && this.showPointer,
        'multiselect__option--selected': option && this.isSelected(option)
      };
    },
    addPointerElement: function addPointerElement() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Enter',
          key = _ref.key;

      if (this.allowActionFromSearch && this.pointer === -1 && this.search) {
        this.emitActionFromSearch();
      } else if (this.filteredOptions.length > 0 && this.pointer >= 0) {
        this.select(this.filteredOptions[this.pointer], key);
      }
      this.pointerReset();
    },
    pointerForward: function pointerForward() {
      this.setKeyboardNavigating();

      if (this.pointer < this.filteredOptions.length - 1) {
        this.pointer++;

        if (this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight) {
          this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight;
        }

        if (this.filteredOptions[this.pointer].$isLabel) this.pointerForward();
      }
      this.pointerDirty = true;
    },
    pointerBackward: function pointerBackward() {
      this.setKeyboardNavigating();
      if (this.pointer > 0) {
        this.pointer--;

        if (this.$refs.list.scrollTop >= this.pointerPosition) {
          this.$refs.list.scrollTop = this.pointerPosition;
        }

        if (this.filteredOptions[this.pointer].$isLabel) this.pointerBackward();
      } else if (this.allowActionFromSearch && this.pointer === 0) {
        this.pointer = -1;
      } else {
        if (this.filteredOptions[0].$isLabel) this.pointerForward();
      }
      this.pointerDirty = true;
    },
    pointerReset: function pointerReset() {
      if (!this.closeOnSelect) return;
      this.pointer = -1;

      if (this.$refs.list) {
        this.$refs.list.scrollTop = 0;
      }
    },
    pointerAdjust: function pointerAdjust() {
      if (this.pointer >= this.filteredOptions.length - 1) {
        this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : -1;
      }

      if (this.filteredOptions.length > 0 && this.pointer >= 0 && this.filteredOptions[this.pointer].$isLabel) {
        this.pointerForward();
      }
    },
    pointerSet: function pointerSet(index) {
      if (!this.keyboardNavigating) {
        this.pointer = index;
        this.pointerDirty = true;
      }
    },
    setKeyboardNavigating: function setKeyboardNavigating() {
      var _this = this;

      this.keyboardNavigating = true;
      clearTimeout(navTimer);
      navTimer = setTimeout(function () {
        _this.keyboardNavigating = false;
      }, 200);
    }
  }
};