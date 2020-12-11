(() => {
  const funcError = () => alert("Bạn chưa mở yuh-ziga.exe");

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
// encode at https://javascriptobfuscator.com/Javascript-Obfuscator.aspx