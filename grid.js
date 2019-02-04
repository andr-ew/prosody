inlets = 1;
outlets = 1;

var monome_instance;

var grid = {
	connect: function() {
		monome_instance = new Grid();
		
		return monome_instance;
	}
}

function loadbang() {
	init();
}

function mute(i) {
	//post(Number(i));
	
	if(monome_instance) monome_instance.mute(i);
}

function disconnect() {
	if(monome_instance) monome_instance.disconnect();
}

function reconnect() {
	if(monome_instance) monome_instance.reconnect();
}
/*
function connect(n) {
	if(monome_instance) monome_instance.connect(n);
}
*/
function focus(i) {
	if(monome_instance) monome_instance.focus(i);
}

function gridjs_input() {
	var gridjs_inputs = {
		monome: {
			osc: function(n) {
				if(monome_instance) monome_instance.osc(n);
			},
			menu: function(n) {
				if(monome_instance) monome_instance.menu(n);
			}
		}
	}
	
	var index = arrayfromargs(arguments);
	
	var n = index.slice();
	n.shift();
	n.shift();
	
	gridjs_inputs[index[0]][index[1]](n);
}

//var in = function(a) {]
var input = {}

function input_list() {
	var index = arrayfromargs(arguments);
	
	var n = index.slice();
	n.shift();
	//n.shift();
	
	//post(index);
	
	input[index[0]](n);
}

function output() {
	outlet(0, "out", arrayfromargs(arguments));
}

function Monome() {
	this.event = function() {}
	//post(this.event);
	
	this.in_port = 0;
	this.prefix = "";
	
	this.autoconnect = 0;
	this.connected = 0;
	this.device = 0;
	this.index = 1;
	this.enabled = 1;
	
	this.device_size;
	
	this.serials = [];
	this.devices = [];
	this.ports = [];
	
	this.in_port = Math.round(Math.random() * 1000) + 12288;
	
	this.prefix = "/monome";
	
	this.autoconnect = 1;
	
	outlet(0, "monome", 0, "port", this.in_port);
	this.rescan();
}
	
Monome.prototype.send = function() {
	if(this.enabled) {
		outlet(0, "monome", 2, arguments[0]);
	}
}

Monome.prototype.rescan = function() {
	if(this.enabled) {
		outlet(0, "monome", 1, "/serialosc/list", "localhost", this.in_port);
		outlet(0, "monome", 1, "/serialosc/notify", "localhost", this.in_port);
		outlet(0, "monome", 3, "clear");
		outlet(0, "monome", 3, "append", "none");
		outlet(0, "monome", 3, "textcolor", 1.0, 1.0, 1.0, 0.3);
		
		this.ports = [];
		this.devices = [];
		this.serials = [];
	}
}


Monome.prototype.osc = function(n) {
	if(n[0] == "/serialosc/device") {
	//	post(n[3]);
	//	if(!this.ports.includes(n[3]) {
		outlet(0, "monome", 3, "append", n[1], n[2]);
		this.ports.push(n[3]);
		this.devices.push(n[2]);
		this.serials.push(n[1]);
		
		if(this.autoconnect == 1 && this.enabled) {
			outlet(0, "monome", 3, 1);
		}
		
		if(this.connected && this.enabled) {
			var i;
			for(i = 0; i < this.serials.length; i++) {
				if(this.serials[i] == this.connected)
					outlet(0, "monome", 3, i+1);
			}
		}
			
	}
	else if(n[0] == "/serialosc/remove" || n[0] == "/serialosc/add") {
		if(this.enabled) this.rescan();
	}
	
	else if(n[0] == "/sys/port" && n[1] != this.in_port) {
		outlet(0, "monome", 3, "set", 0);
		outlet(0, "monome", 3, "textcolor", 1.0, 1.0, 1.0, 0.3);
		this.connected = 0;
		this.device = 0;
	}
	
	else if(n[0] == "/sys/size") {
		this.device_size = [];
		this.device_size[0] = n[1];
		this.device_size[1] = n[2];
	}
	
	else {
		if(this.enabled) this.parse(n);
	}
}

//function serial() {
	//var i;
	//for(i = 0; i < serials.length; i++) {
	//	if(serials[i] == arguments[0])
	//		change(i+1);
	//}
//}

Monome.prototype.menu = function(i) {
	if(this.enabled) {
		if(i != 0) {
			this.index = i;
			
			outlet(0, "monome", 3, "textcolor", 1.0, 1.0, 1.0, 1.0);
			outlet(0, "monome", 2, "port", this.ports[i-1]);
			outlet(0, "monome", 2, "/sys/port", this.in_port);
			outlet(0, "monome", 2, "/sys/prefix", this.prefix);
			outlet(0, "monome", 2, "/sys/info");
			
			outlet(0, "monome", 4, this.serials[i-1]);
			outlet(0, "monome", 5, this.devices[i-1]);
			
			//autoconnect = 0;
			this.connected = this.serials[i-1];
			this.device = this.devices[i-1];
			
			this.onreconnect();
		}
		else {
			this.ondisconnect();
			
			//post(this.ports);
			//post(this.serials);
			if(this.connected)
				outlet(0, "monome", 2, "/sys/port", 0);
		}
		
		item = i;
		//outlet(3, i);
	}
}


Monome.prototype.ondisconnect = function() {}
	
Monome.prototype.onreconnect = function() {}
	
Monome.prototype.disconnect = function() { 
	this.ondisconnect();
	outlet(0, "monome", 3, 0);
}

Monome.prototype.reconnect = function() {
	outlet(0, "monome", 3, this.index);
	this.onreconnect();
}
/*
Monome.prototype.connect = function(n) {
	outlet(0, "monome", 3, n);
	this.onreconnect();
}
*/
Monome.prototype.parse = function(n) {
	if(this.event) this.event(n);
}

Monome.prototype.mute = function(i) {
	this.enabled = !i;
	
	outlet(0, "monome", 3, "ignoreclick", i);
	
	if(i) {
		outlet(0, "monome", 3, "textcolor", 1.0, 1.0, 1.0, 0.3);
	} 
	else {
		outlet(0, "monome", 3, "textcolor", 1.0, 1.0, 1.0, 1.0);
	}
}

Monome.prototype.focus = function(i) {
	if(i) {
		this.mute(0);
		this.reconnect()
	} 
	else {
		this.disconnect()
		this.mute(1);
	}
}

function Grid() {
	Monome.call(this);
	
	this.matrix = [];
	
	this.all = function(z) {
		for(var x = 0; x < 16; x++) {
			this.matrix[x] = []
			
			for(var y = 0; y < 16; y++) {
				this.matrix[x][y] = z;
			}
		}
	}
	
	this.led = function(x, y, z) {
		this.matrix[x][y] = z;
	}
	
	this.quad_off = [[0, 0,], [8, 0], [0, 8], [8, 8], [16, 0,], [24, 0], [16, 8], [24, 8]];
	this.quad_count;
	
	this.refresh = function() {
		if(this.device_size) {
			
			this.quad_count = this.device_size[0] * this.device_size[1] / 64;
			
			//post(this.device_size[0]);
			
			for(var i = 0; i < this.quad_count; i++) {
				var quad_mess = [this.prefix + "/grid/led/level/map", this.quad_off[i][0], this.quad_off[i][1]];
				
				for(var y = 0; y < 8; y++) {
					for(var x = 0; x < 8; x++) {
						quad_mess[(y * 8) + x + 3] = this.matrix[x + this.quad_off[i][0]][y + this.quad_off[i][1]];
					}
				}
				
				this.send(quad_mess);
			}
		}
		else {
			var task = new Task(this.refresh, this);
			task.schedule(1);
		}
	}
	
	this.all(0);
}

Grid.prototype = Object.create(Monome.prototype);
Grid.prototype.constructor = Grid;
	
Grid.prototype.parse = function(n) {
	if(n) {
		if(n[0] == "/monome/grid/key") {
			this.event(n[1], n[2], n[3]);
		}
	}
	else this.refresh();
}

Grid.prototype.ondisconnect = function() {
	this.send([this.prefix + "/grid/led/level/all", 0]);
}

Grid.prototype.onreconnect = function() {
	this.refresh();
}

Grid.prototype.mute = function(i) {
	//post(i);
	
	if(i)  {
		this.ondisconnect();
		Monome.prototype.mute.call(this, i);
	}
	else { 
		Monome.prototype.mute.call(this, i);
		this.onreconnect();
	}
}
