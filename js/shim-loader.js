  var html = document.children[0];
  
  var docObserver = new MutationObserver(function(mutRecords){
    for(var j = 0; j < mutRecords.length; j++){
      var newNodes = mutRecords[j].addedNodes;
      for(var i = 0; i < newNodes.length; i++){
        if(newNodes[i].tagName && newNodes[i].tagName.toLowerCase() == "head"){
          updateHead(newNodes[i]);
        }
      }
    }
  });
  
  docObserver.observe(html, {
    childList : true
  });
  
  function updateHead(head){
    var template = document.createElement("template");
    template.id = "tmp-head-cache";
    
    template.innerHTML = head.innerHTML;
    head.innerHTML = "";
    
    head.appendChild(createActivateScript(template.id));
    head.appendChild(createShimScript());
    head.appendChild(template);
  }
  
  function createShimScript(){
    var script = document.createElement("script");
    script.id = "shim";
    script.src = chrome.extension.getURL("js/shim.js");
    return script;
  }
  
  function createActivateScript(id){
    var script = document.createElement("script");
    script.id = "tmp-shim-load-complete";
    script.textContent = `window.shimLoadComplete = function(){ document.head.appendChild(document.importNode(document.getElementById('${id}').content, true)); document.head.removeChild(document.getElementById('${id}')); document.head.removeChild(document.getElementById('${script.id}')); }`;
    return script;
  }