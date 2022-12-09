var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
// Object.defineProperty(exports, "__esModule", { value: true });
var MOUSE_LEFT_BUTTON = 0;
function drawSelectionArea(area, position, size) {
  area.style.left = "".concat(position.x, "px");
  area.style.top = "".concat(position.y, "px");
  area.style.width = "".concat(size.width, "px");
  area.style.height = "".concat(size.height, "px");
  area.style.opacity = "1";
}
function cleanSelectionArea(area) {
  area.style.left = "0px";
  area.style.top = "0px";
  area.style.width = "0px";
  area.style.height = "0px";
  area.style.opacity = "0";
}
function applyTransform(translateX, translateY, scale, position) {
  return {
    x: (position.x - translateX) / scale,
    y: (position.y - translateY) / scale,
  };
}
function install(editor, params) {
  var _a, _b;
  var _c, _d, _e, _f;
  editor.bind("multiselection");
  var cfg = params !== null && params !== void 0 ? params : {};
  // #region
  var accumulate = false;
  var pressing = false;
  var selection = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  // #endregion
  var canvas = editor.view.container.firstElementChild;
  // #region
  var getNodesFromSelectionArea = function () {
    if (!cfg.enabled) {
      return [];
    }
    var _a = editor.view.area.transform,
      translateX = _a.x,
      translateY = _a.y,
      scale = _a.k;
    var areaStart = applyTransform(
      translateX,
      translateY,
      scale,
      __assign({}, selection[0])
    );
    var areaEnd = applyTransform(
      translateX,
      translateY,
      scale,
      __assign({}, selection[1])
    );
    if (areaEnd.x < areaStart.x) {
      var num = areaStart.x;
      areaStart.x = areaEnd.x;
      areaEnd.x = num;
    }
    if (areaEnd.y < areaStart.y) {
      var num = areaStart.y;
      areaStart.y = areaEnd.y;
      areaEnd.y = num;
    }
    return editor.nodes.filter(function (item) {
      var _a = item.position,
        x = _a[0],
        y = _a[1];
      return (
        x >= areaStart.x && x <= areaEnd.x && y >= areaStart.y && y <= areaEnd.y
      );
    });
  };
  // #endregion
  // #region
  var selectionArea = document.createElement("div");
  selectionArea.classList.add("selection-area");
  selectionArea.style.position = "absolute";
  selectionArea.style.boxSizing = "border-box";
  selectionArea.style.pointerEvents = "none";
  cleanSelectionArea(selectionArea);
  // #endregion
  // #region
  {
    var className =
      (_e = cfg.selectionArea) === null || _e === void 0
        ? void 0
        : _e.className;
    if (className) {
      (_a = selectionMode.classList).add.apply(_a, className.split(" "));
    } else {
      selectionArea.style.backgroundColor = "rgba(255,255,255,0.2)";
      selectionArea.style.border = "solid 1px #ffffff";
    }
  }
  // #endregion
  var handleMouseDown = function (e) {
    if (!cfg.enabled || e.button !== MOUSE_LEFT_BUTTON || !e.shiftKey) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    pressing = true;
    canvas.style.pointerEvents = "none";
    Array.from(canvas.querySelectorAll("path")).forEach(function (item) {
      item.style.pointerEvents = "none";
    });
    cleanSelectionArea(selectionArea);
    selection[0] = { x: e.offsetX, y: e.offsetY };
    selection[1] = { x: e.offsetX, y: e.offsetY };
  };
  var handleMouseUp = function (e) {
    // e.preventDefault()
    // e.stopPropagation()
    if (!cfg.enabled || !e.shiftKey) {
      return;
    }

    var selectedNodes = getNodesFromSelectionArea();
    pressing = false;
    canvas.style.pointerEvents = "auto";
    Array.from(canvas.querySelectorAll("path")).forEach(function (item) {
      item.style.pointerEvents = "auto";
    });
    cleanSelectionArea(selectionArea);
    selection[0] = { x: 0, y: 0 };
    selection[1] = { x: 0, y: 0 };

    selectedNodes.forEach(function (node) {
      editor.selectNode(node, accumulate);
    });
  };
  var handleMouseMove = function (e) {
    if (!cfg.enabled || !e.shiftKey || !pressing) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    selection[1] = { x: e.offsetX, y: e.offsetY };
    var size = {
      width: Math.abs(selection[1].x - selection[0].x),
      height: Math.abs(selection[1].y - selection[0].y),
    };
    var position = __assign({}, selection[0]);
    if (selection[1].x < selection[0].x) {
      position.x = selection[1].x;
    }
    if (selection[1].y < selection[0].y) {
      position.y = selection[1].y;
    }
    drawSelectionArea(selectionArea, position, size);
  };
  // #endregion
  // #region
  editor.view.container.style.position = "relative";
  editor.view.container.appendChild(selectionArea);
  editor.view.container.addEventListener("mousedown", handleMouseDown);
  editor.view.container.addEventListener("mouseup", handleMouseUp);
  editor.view.container.addEventListener("mouseout", handleMouseUp);
  editor.view.container.addEventListener("mousemove", handleMouseMove);
  editor.on("destroy", function () {
    editor.view.container.removeChild(selectionArea);
    editor.view.container.removeEventListener("mousedown", handleMouseDown);
    editor.view.container.removeEventListener("mouseup", handleMouseUp);
    editor.view.container.removeEventListener("mouseout", handleMouseUp);
    editor.view.container.removeEventListener("mousemove", handleMouseMove);
  });

  editor.on("multiselection", function (enabled) {
    cfg.enabled = enabled;
  });
  editor.on("keydown", function (e) {
    var _a, _b;
    if (e.shiftKey) {
      accumulate = true;
    }
  });
  editor.on("keyup", function () {
    var _a, _b;
    if (accumulate) {
      accumulate = false;
    }
  });
  editor.on("translate", function () {
    return !accumulate;
  });
  // #endregion
}

export default { install };
