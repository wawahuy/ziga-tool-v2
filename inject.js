// *******************************
// ******     PRODUCTION  ********
// *******************************
(() => {
  const funcError = () => {
    document.body.innerHTML = "Bạn vui lòng khởi động yuh-ziga.exe trước khi gọi script này!"
  }

  const head  = document.getElementsByTagName('head')[0];
  const link  = document.createElement('link');
  link.id   = 'myCss';
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = 'http://localhost:14552/inject/styles.css';
  link.media = 'all';
  link.onerror = funcError;
  head.appendChild(link);

  const script  = document.createElement('script');
  script.src = 'http://localhost:14552/inject/bundle.js';
  script.onerror = funcError;
  document.body.appendChild(script);
})();


// *******************************
// ******    DEVELOPMENT  ********
// *******************************
(() => {
  const loadCss = (n) => {
    const head  = document.getElementsByTagName('head')[0];
    const link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'http://localhost:3000/' + n;
    link.media = 'all';
    link.onerror = () => console.log('error stylesheet');
    head.appendChild(link);
  }

  const loadScript = (n) => {
    const script  = document.createElement('script');
    script.src = 'http://localhost:3000/' + n;
    script.onerror = () => console.log('error script');
    document.body.appendChild(script);
  }

  // loadCss('vendors.css');
  // loadCss('inject.css');
  loadScript('vendors.bundle.js');
  loadScript('inject.bundle.js');
})();


