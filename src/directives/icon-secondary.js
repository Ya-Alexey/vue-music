export default {
  beforeMount(el, binding) {
    let iconsClass = `fa fa-${binding.value.icon} text-green-400 text-xl`;

    if (binding.value.right) {
      iconsClass += ' float-right ';
    }

    el.innerHTML += `<i class="${iconsClass}"></i>`;
  }
}
