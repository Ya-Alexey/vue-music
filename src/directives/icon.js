export default {
  beforeMount(el, binding) {
    let iconsClass = `fa fa-${binding.value} text-xl`;

    if (binding.arg === 'full') {
      iconsClass = binding.value;
    }

    if (binding.modifiers.right) {
      iconsClass += ' float-right ';
    }

    if (binding.modifiers.yellow) {
      iconsClass += ' text-yellow-400 ';
    } else {
      iconsClass += ' text-green-400 ';
    }

    el.innerHTML += `<i class="${iconsClass}"></i>`;
  }
}