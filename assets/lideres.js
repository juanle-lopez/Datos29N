// Currículums: la foto (o el botón) abre la trayectoria completa en una ventana.
(function(){
  var open=null;
  function show(id){var d=document.getElementById('cv-'+id);if(!d)return;
    if(d.showModal)d.showModal();else d.setAttribute('open','');open=d;document.documentElement.classList.add('cvopen')}
  function hide(d){if(d.close)d.close();else d.removeAttribute('open');document.documentElement.classList.remove('cvopen')}
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-cv]');if(b){show(b.getAttribute('data-cv'));return}
    var x=e.target.closest('[data-close]');if(x){hide(x.closest('dialog'));return}
    if(e.target.tagName==='DIALOG')hide(e.target)});
  document.querySelectorAll('dialog.cvd2').forEach(function(d){d.addEventListener('close',function(){document.documentElement.classList.remove('cvopen')})});
  if(location.hash.indexOf('#cv-')===0)show(location.hash.slice(4));
})();
