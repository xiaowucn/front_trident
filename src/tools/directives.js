export const loadMoreSelectOptions = {
  bind(el, binding) {
    const selectDropdownEl = el.querySelector(
      '.el-select-dropdown .el-select-dropdown__wrap',
    );
    selectDropdownEl.addEventListener('scroll', function() {
      const condition =
        this.scrollHeight - this.scrollTop - 10 <= this.clientHeight;
      if (condition) {
        binding.value();
      }
    });
  },
};
