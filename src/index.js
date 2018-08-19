const importRouter = m => import('' + m);

function component() {
  var element = document.createElement("div");
  var button = document.createElement("button");
  var br = document.createElement("br");
  button.innerHTML = "Click me and look at the console!";
  element.appendChild(br);
  element.appendChild(button);
  button.onclick = e => {
    importRouter("@/print").then(module => {
      console.log(module);
      var print = module.default;
      print();
    });
  };
  return element;
}

document.body.appendChild(component());
