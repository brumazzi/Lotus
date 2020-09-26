var formTemplate = {
  "name": "myForm",
  "node": {
    "tag": "form",
    "id": "my-form",
    "class": "bg-dark p-3 mt-5",
    "node": [
      {
        "tag": "input",
        "type": "text",
        "class": "form-control",
        "name": "data",
        "value": 'texto',
        "id": "my-box",
      },
      {
        "tag": "input",
        "type": "button",
        "value": "Enviar",
        "class": "btn btn-success mt-2",
        "id": "submit-button",
        "events": [
          {
            "type": "click",
            "callback": "mostrar_alerta",
            "args": ["evt", "$('#my-box').val()"]
          }
        ]
      }
    ]
  }
};
