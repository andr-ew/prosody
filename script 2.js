inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var livetrack;
var pages;
var patterns = [];

var ALL = -1;
var CUT = 0;
var LVL = 1;
var PAN = 2;
var FB = 3;

var tracks = [];

var Track = function(n) {
	var row = [];
	for(var i = 0; i < 15; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 15; i++) rowb[i] = 0;
	
	//this.n = n;
	this.r = new Toggle(0, [0, n], [LO, HI], ALL);
	this.m = new Toggle(0, [1, n], [0, HI], ALL);
	this.p1 = new Toggle(0, [2, n], [0, LO, HI], ALL);
	this.p2 = new Toggle(0, [3, n], [0, LO, HI], ALL);
	this.rev = new Toggle(0, [4, n], [LO, HI], ALL);
	this.s = new Value(3, [[5, 6, 7, 8, 9, 10], n], [[0, 0, 0, LO, 0, 0], HI], ALL);
	this.b = new Value(n, [[11, 12, 13, 14], n], [[0, 0, 0, 0], HI], ALL);
	this.cut = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], CUT);
	this.lvl = new Fader(12, [[0, 14], n + 4], [0, HI, LO], LVL);
	this.pan =  new Crossfader(7, [[0, 14], n + 4], [0, HI, LO], PAN);
	this.fb = new Fader(0, [[0, 12], n + 4], [0, HI, LO], FB);
	
	this.cut.look = function(x, y, z) {
		if(page == this.pg || -1 == this.pg) {
			if(y == this.p[1] && z == 1) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x) {
						output(n, "jump", x);
						break;
					}
				}
			}
		}
	}
}

var update = function(x, y, z) {
	for(i in tracks[y % 4]) {
		if(tracks[y % 4][i].look) tracks[y % 4][i].look(x, y, z);
		if(tracks[y % 4][i].draw) tracks[y % 4][i].draw(g);
		
		output(y % 4, i, tracks[y % 4][i].v);
	}
	
	g.refresh();
}

g.event = function(x, y, z) {
	if(x < 15) {
		patterns[y % 4][0].look(x, y, z);
		patterns[y % 4][1].look(x, y, z);
		
		update(x, y, z);
	}
	else {
		pages.look(x, y, z);
		pages.draw(g);
		
		livetrack.look(x, y, z);
		livetrack.draw(g)
		
		g.refresh();
	}
}

var redraw = function() {
	g.all(0);
	for(var i = 0; i < tracks.length; i++) {
		for(j in tracks[i]) {
			if(tracks[i][j].draw) tracks[i][j].draw(g);
		}
	}
}

input["pos"] = function(n) {
	if(page == CUT) {
		tracks[n[0]].cut.v = n[1];
		tracks[n[0]].cut.draw(g);
		
		//if(n[0] == 0)
 		g.refresh();
	}
}

input["pressr"] = function(n) {
	update(tracks[n[0]].r.p[0], tracks[n[0]].r.p[1], n[1]);
}

input["pressm"] = function(n) {
	update(tracks[n[0]].m.p[0], tracks[n[0]].m.p[1], n[1]);
}

input["m"] = function(n) {
	tracks[n[0]].m.v = n[1];
	tracks[n[0]].m.draw(g);
	g.refresh();
}

input["thistrack"] = function(n) {
	livetrack.v = n;
	livetrack.draw(g);
	g.refresh();
}

var init = function() {	
	livetrack = new Value(-1, [15, [0, 1, 2, 3]], [[LO, LO, LO, LO], HI], ALL);
	livetrack.event = function(v, last) {
		output("settrack", v);
		
		this.v = last;
	}
	
	pages = new Value(0, [15, [4, 5, 6, 7]], [[0, 0, 0, 0], HI], ALL);
	pages.event = function(v) {
		page = v;
		redraw();
	}
	
	for(var i = 0; i < 4; i++) {
 		tracks[i] = new Track(i);

		for(j in tracks[i]) {
			if(tracks[i][j].draw) {
				tracks[i][j].draw(g);
				output(i, j, tracks[i][j].v);
			}
		}
		
		patterns[i] = [];
		patterns[i][0] = new Pattern(tracks[i].p1, update);
		patterns[i][1] = new Pattern(tracks[i].p2, update);
	}
	
	livetrack.draw(g);
	pages.draw(g);
	
	g.refresh();
}