function install(editor) {
  editor.view.container.focus();
  let commanded = false
  let shifted = false

  editor.on('keydown', e => {
    // console.log('keydown', e.code)
    switch (e.code) {
      case 'MetaLeft':
      case 'MetaRight':
        commanded = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        shifted = true;
        break;        
      case 'KeyI': 
        console.log(editor.nodes);
        console.log("-------")
        console.log(editor.toJSON());
        break;
      case 'Backspace':
        if (!document.activeElement.tagName !== "INPUT") {
          editor.selected.each((n) => editor.removeNode(n));
          editor.selected.list = [];
        }
        break;
      case 'Space':
        let rect = editor.view.container.getBoundingClientRect();
        let event = new MouseEvent('contextmenu', {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2
        });

        editor.trigger('contextmenu', { e: event, view: editor.view });
        break;
      case 'KeyZ':
        if(!commanded){
          editor.zoomToNodes();
        }

        // now this is handled by the menu
        // if (commanded) {
        //   editor.trigger('undo');
        // }
        // if(commanded && shifted){
        //   editor.trigger('redo');
        // }
      case 'Escape':
        editor.trigger('hidecontextmenu');
        break;
      case 'KeyT':
        editor.nodes[0].data.noteOut = parseInt(Math.random() * 10)
        editor.nodes[0].data.velocityOut = parseInt(Math.random() * 20)
        editor.trigger("process");
        break;
      default: break;
    }
  });

  editor.on('keyup', e => {
    switch (e.code) {
      case 'MetaLeft':
      case 'MetaRight':
        commanded = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        shifted = false;
        break;        
      default: break;
    }
  });


}

export default { install}