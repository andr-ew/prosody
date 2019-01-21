inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var nav1;
var nav2;
var top = 0;
var bottom = 0;

var controls = {}
controls.tracks = [];

var Track = function(n, pg1, pg2, buffg) {
	var row = [];
	for(var i = 0; i < 15; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 15; i++) rowb[i] = 0;
	
	//this.n = n;
	this.r = new Toggle(0, [0, n], [LO, HI], pg1);
	this.m = new Toggle(0, [1, n], [0, HI], pg1);
	this.p1 = new Pattern(0, [2, n], [0, LO, HI], pg1, update);
	this.p2 = new Pattern(0, [3, n], [0, LO, HI], pg1, update);
	this.rev = new Toggle(0, [4, n], [LO, HI], pg1);
	this.s = new Value(3, [[5, 6, 7, 8, 9, 10], n], [[0, 0, 0, LO, 0, 0], HI], pg1);
	this.b = new Value(n, [[11, 12, 13, 14], n], [[0, 0, 0, 0], HI], pg1);
	this.cut = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	/*
	this.cut.look = function(x, y, z) {
		if(this.pg()) {
			if(y == this.p[1] && z == 1) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x) {
						output("tracks", n, "jump", x);
						return 1;
						break;
					}
				}
			}
		}
	}
	*/
	this.cut.look = function() {};
	
	this.jump = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	this.jump.draw = function() {}
}

var update = function(h, i, j, v) {
	if (controls[h][i][j].v != v) {
		controls[h][i][j].event(v);
		controls[h][i][j].v = v;
		
		output(h, i, j, controls[h][i][j].v);
	}
	
	controls[h][i][j].draw(g);
	
	g.refresh();
}

g.event = function(x, y, z) {
	if(x < 15) {
		for(h in controls) {
			for(var i = 0; i < controls[h].length; i++) {
				for(j in controls[h][i]) {
					if(controls[h][i][j].look(x, y, z)) {
						for(l in controls[h][i]) {
							if(!(controls[h][i][j].ispattern) && controls[h][i][l].ispattern) {
								controls[h][i][l].store(h, i, j, controls[h][i][j].v);
							}
						}
						
						output(h, i, j, controls[h][i][j].v);
					}
					
					controls[h][i][j].draw(g);
				}
		}
		}
		
		g.refresh();
	}
	else {
		nav1.look(x, y, z);
		nav1.draw(g);
		
		nav2.look(x, y, z);
		nav2.draw(g);
		
		g.refresh();
	}
}

var redraw = function() {
	g.all(0);
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].draw) controls[h][i][j].draw(g);
			}
		}
	}
}

input["tracks"] = function(n) {
	if(n[0] == "pos") {
		if(bottom == 0) {
			controls.tracks[n[1]].cut.v = n[2];
			controls.tracks[n[1]].cut.draw(g);
			
			//if(n[0] == 0)
	 		g.refresh();
		}
	}
	else if(n[0] == "m") {
		controls.tracks[n[1]].m.v = n[2];
		controls.tracks[n[1]].m.draw(g);
		g.refresh();
	}
}

var init = function() {	
	nav1 = new Value(0, [15, [0, 1, 2, 3]], [[0, 0, 0, 0], HI], function() { return 1 });
	nav1.event = function(v) {
		top = v;
		redraw();
	}
	
	nav2 = new Value(0, [15, [4, 5, 6, 7]], [[0, 0, 0, 0], HI], function() { return 1 } );
	nav2.event = function(v) {
		bottom = v;
		redraw();
	}
	
	for(var i = 0; i < 4; i++) {
 		controls.tracks[i] = new Track(i, function() { return top == 0 }, function() { return bottom == 0 }, [0,1,2,3]);
		
		for(j in controls.tracks[i]) {
			if(controls.tracks[i][j].draw) {
				controls.tracks[i][j].draw(g);
				
				output(i, j, controls.tracks[i][j].v);
			}
		}
	}
	
	nav1.draw(g);
	nav2.draw(g);
	
	g.refresh();
}