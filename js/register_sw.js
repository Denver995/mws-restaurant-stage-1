if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js', { scope: './'})
    .then(registration => navigator.serviceWorker.ready)
    .then(registration => { // register sync
      console.log('Sync start registration');
      document.getElementById('btn-submit').addEventListener('click', () => {
        registration.sync.register('post-review').then(() => {
            console.log('Sync registered');
        });
      });
    });
