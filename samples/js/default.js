function mostrar_alerta(evt, value){
  alert(value);
}

Lotus.createTemplate(formTemplate, 'myForm');

$(document).ready(()=>{
  var t = Lotus.toTemplameJSON($('#test'));

  var f = $($('form')[0]);
  Lotus.createTemplate(t, 'badge');
  Lotus.replaceByTemplate(f, "badge");
});
