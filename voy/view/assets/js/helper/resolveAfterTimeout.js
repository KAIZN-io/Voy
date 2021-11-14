/**
 * Creates and returns a Promise that automatically resolves after the given
 * timeout.
 *
 * This can be used for waiting on things that need a fixed time to complete,
 * such as css animations or transitions.
 *
 * @param {int} timeout The duration in ms to wait before resolving the Promise.
 * @returns {Promise} A Promise that resolves after the given timeout
 */
export default function resolveAfterTimeout(timeout) {
  return new Promise( (resolve) => setTimeout( resolve, timeout ) );
}
