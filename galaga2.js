$(document).ready(function() {
  Controller.init();
  Controller.tick();
});

var View = {

  init: function() {
    this.shipMove();
  },

  render: function(ship, beams, baddies, badbeams) {
    var $game = $('.game');
    $game.html("");
    this.buildElements($game, ship, 'ship');
    if (beams[0]) {
      this.buildElements($game, beams, 'beam');
    }
    if (baddies[0]) {
      this.buildElements($game, baddies, 'baddie');
    }
    if (badbeams[0]) {
      this.buildElements($game, badbeams, 'badbeam');
    }
  },

  buildElements: function($game, item, klass) {
    for (var i = 0; i < item.length; i++) {
      var coords = item[i].coords
      var block = '<div class="' + klass + '"></div>'
      block = $(block).css('left', coords[0])
              .css('top', coords[1]);
      $game.append(block);
    }
  },

  shipMove: function() {
    $(document).keydown(function(e) {
      var keycode = e.keyCode;
      if (keycode === 32) {
        e.preventDefault();
        Controller.fireBeam();
      } else if (keycode === 37 || keycode === 39) {
        e.preventDefault();
        Controller.moveShip(e.keyCode);
      }
    });
  },

  gameOver: function() {
    alert("GAME OVER");
  }

}

var Controller = {

  init: function() {
    Model.init();
    View.init();
  },

  tick: function() {
    setInterval(function() {
      View.render(Model.ship, Model.beams, Model.baddies, Model.baddieBeams);
      Model.updateBadBeam();
      if (Model.beams[0]) {
        Model.updateBeam();
        Model.destroyBaddies();
      }
      if (Model.gameOver()) {
        View.gameOver();
      }
    }, 10);

    setInterval(function() {
      if (Model.baddies[0]) {
        Model.moveBaddies();
      }
    }, 1000);

    setInterval(function() {
      Model.fireAtRandom();
    }, 5000)
  },

  moveShip: function(keycode) {
    Model.updateShip(keycode);
  },

  fireBeam: function() {
    Model.createBeam();
  }
}

var Model = {

  init: function() {
    this.buildBaddies();
  },

  ship: [new Ship],
  beams: [],
  baddies: [],
  baddieBeams: [],

  updateShip: function(keycode) {
    if (keycode === 37) {
      for(var i = 0; i < this.ship.length; i++) {
        this.ship[i].coords[0] -= 8;
      }
    } else if (keycode === 39) {
      for(var i = 0; i < this.ship.length; i++) {
        this.ship[i].coords[0] += 8;
      }
    }
  },

  createBeam: function() {
    if (this.beams.length < 4) {
      var shipMiddle = this.ship[0].coords[0];
      newBeam = new Beam(shipMiddle, 550);
      this.beams.push(newBeam);
    }
  },

  updateBeam: function() {
    beams = this.beams;
    for (var i = 0; i < beams.length; i++) {
      if (beams[i].coords[1] < 0) {
        beams.splice(i, 1);
      } else {
        beams[i].coords[1] -= 8;
      }
    }
  },

  buildBaddies: function() {
  for (var j = 1; j <= 3; j++)
    for (var i = 1; i <= 10; i++) {
      var baddie = new Baddie(64 * i, j * 50);
      this.baddies.push(baddie);
    }
  },

  moveBaddies: function() {
    var baddies = this.baddies;
    if (baddies[0].count % 3 === 0) {
      for (var i = 0; i < baddies.length; i++) {
        baddies[i].coords[1] += 16;
        baddies[i].direction = !baddies[i].direction;
      }
    }
    for (var i = 0; i < baddies.length; i++) {
      baddies[i].count += 1;
      if (baddies[i].direction) {
        baddies[i].coords[0] -= 32;
      } else {
        baddies[i].coords[0] += 32;
      }
    }
  },

  destroyBaddies: function() {
    var baddies = this.baddies;
    var beams = this.beams;
    var k = beams.length - 1;

    while (k >= 0) {
      for (var i = baddies.length - 1; i >= 0; i--) {
        var start = baddies[i].coords[0];
        if(this.beamTouchingBaddie(baddies[i], beams[k])) {
          baddies.splice(i,1);
          beams.splice(k,1);
        }
      }
      k--;
    }
  },

  beamTouchingBaddie: function(baddie, beam) {
    beamCoords = beam.coords;
    baddieCoords = baddie.coords;
    if (beamCoords[0] >= baddieCoords[0] && beamCoords[0] <= baddieCoords[0] + baddie.wide) {
      if (beamCoords[1] <= baddieCoords[1]) {
        return true;
      }
    } else {
      return false;
    }
  },

  gameOver: function() {
    if (this.baddies.length === 0) {
      return true;
    }
    for (var i = 0; i < this.baddies.length; i++) {
      if (this.baddies[i].coords[1] > 542) {
        return true;
      }
    }
  },

  fireAtRandom: function() {
    var randomBaddie = Math.floor(Math.random() * this.baddies.length);
    var randomBaddie = this.baddies[randomBaddie];
    var middle = randomBaddie.coords[0];
    var top = randomBaddie.coords[1];
    newBeam = new Beam(middle, top);
    this.baddieBeams.push(newBeam);
  },

  updateBadBeam: function() {
    beams = this.baddieBeams;
    for (var i = 0; i < beams.length; i++) {
      if (beams[i].coords[1] > 600) {
        beams.splice(i, 1);
      } else {
        beams[i].coords[1] += 8;
      }
    }
  },

  destroyShip: function() {
    var ship = this.ship;
    var beams = this.beams;
    for (var i = this.baddieBeams.length - 1; i >= 0; i--) {
      var start = ship[0].coords[0];
      if(this.beamTouchingBaddie(this.ship[0], beams[k])) {
        ship.splice(i,1);
        beams.splice(k,1);
      }
    }
    k--;
  }

}

function Ship() {
  this.coords = [400,550];
  this.tall = 24;
  this.wide = 24;
}

function Baddie(left, top) {
  this.coords = [left, top];
  this.tall = 8;
  this.wide = 32;
  this.direction = true;
  this.count = 1;
}

function Beam(middle, top) {
  this.coords = [middle,top];
  this.tall = 8;
  this.wide = 8;
}
