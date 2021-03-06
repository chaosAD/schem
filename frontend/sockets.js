var PluginAdapter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PluginAdapter = (function() {

  function PluginAdapter(name) {
    this.send_msg_data = __bind(this.send_msg_data, this);    this.name = name;
    this.queued = [];
    this.get_socket();
  }

  PluginAdapter.prototype.get_socket = function() {
    var loc, port,
      _this = this;
    console.log(document.URL);
    loc = window.location;
    port = parseInt(loc.port) + 1;
    this.socket = new WebSocket("ws://" + loc.hostname + ":" + port + "/spawn_plugin/" + this.name);
    this.socket.onopen = function() {
      var val, _, _len, _ref, _results;
      _this.opened = true;
      _this.handle_open();
      _ref = _this.queued;
      _results = [];
      for (_ = 0, _len = _ref.length; _ < _len; _++) {
        val = _ref[_];
        _results.push(_this.send_msg_data(val));
      }
      return _results;
    };
    this.socket.onmessage = function(msg) {
      var data;
      if (msg.data === "ok") {
        return console.log("valid plugin");
      } else if (msg.data === "plugin not found") {
        return alert("unable to find the plugin " + _this.name + " at the server");
      } else {
        data = JSON.parse(msg.data);
        return _this.handle_msg(data);
      }
    };
    return this.socket.onclose = function() {
      return _this.handle_close();
    };
  };

  PluginAdapter.prototype.send_msg_data = function(send_data) {
    console.log("send", send_data);
    if (!this.opened) {
      return this.queued.push(send_data);
    } else {
      return this.socket.send(send_data);
    }
  };

  PluginAdapter.prototype.handle_open = function() {
    return console.log("openend controll socket");
  };

  PluginAdapter.prototype.handle_close = function() {
    return console.log("closed controll socket");
  };

  PluginAdapter.prototype.handle_msg = function(msg) {
    return console.log(msg);
  };

  return PluginAdapter;

})();
