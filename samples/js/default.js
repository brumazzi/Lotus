function mostrar_alerta(evt, value){
  alert(value);
}

Lotus.createTemplate(formTemplate);

$(document).ready(()=>{
  var t = Lotus.toTemplameJSON($('#test'), 'badge');

  var f = $($('form')[0]);
  Lotus.createTemplate(t);
  Lotus.replaceByTemplate(f, "badge");
});
