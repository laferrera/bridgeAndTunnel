import createSelectedNodeUpdater from './utils/createSelectedNodeUpdater';
function install(editor) {
    var accumulate = false;
  editor.bind('nodedeselect');
  editor.bind('nodedeselected');

  editor.on('click', (e) => {
    if (e.e.shiftKey || editor.selected.list.length === 0) {
      return;
    }
;
    const updateNodes = createSelectedNodeUpdater(editor);
    editor.selected.each(node => {
      if (editor.trigger('nodedeselect', node)) {
        editor.selected.remove(node);
        node.update();
        editor.trigger('nodedeselected', node);
      }
    });
    editor.selected.clear();
    updateNodes();
  });
  let lastSelectedId = null;
  let controlKey = false;
  editor.on('keydown', event => {
    if (event.shiftKey) {
      controlKey = true;
    }
  });
  editor.on('keyup', event => {
    if (!event.shiftKey) {
      controlKey = false;
    }
  });
  editor.on('nodetranslated', ({
    node
  }) => {
    if (node.id === lastSelectedId) {
      lastSelectedId = null;
    }
  });

  editor.on('nodeselect', node => {
    if (!controlKey && editor.selected.contains(node) && lastSelectedId !== node.id) {
      lastSelectedId = node.id;
      return false;
    }

    lastSelectedId = null;

    // if (controlKey) {
    //   return true;
    // }

    const deselectNodes = [];
    let countedNodes = 0;
    editor.selected.each(n => {
      if (node === n) return;
      countedNodes += 1;

      if (editor.trigger('nodedeselect', n)) {
        deselectNodes.push(n);
      }
    });

    if (deselectNodes.length === countedNodes) {
      return true;
    }

    deselectNodes.forEach(n => {
      editor.selected.remove(n);
      n.update();
      editor.trigger('nodedeselected', n);
    });

    if (!editor.selected.contains(node)) {
      if (editor.trigger('nodeselect', node)) {
        editor.selected.add(node);
        node.update();
        editor.trigger('nodeselected', node);
      }
    }

    return false;
  });
}

export default { install }