
function debounceBoolean (delay) {
  let timeout
  return {
    get: () => !!timeout,
    set: value => {
      clearTimeout(timeout)
      timeout = value ? setTimeout(() => timeout = null, delay) : null
    }
  }
}

module.exports = {
  debounceBoolean
}
