$(document).ready(function() {
  Controller.init();
  Controller.tick();
});

var View = {

  init: function() {
    this.shipMove();
    this.buildGrid();
  },

  render: function(ship, beams, baddies) {
    var $game = $('.game');
    $game.children().removeClass('ship beam baddie');
    this.buildElements(ship, 'ship');
    if (beams[0]) {
      this.buildElements(beams, 'beam');
    }
    if (baddies[0]) {
      for (var i = 0; i < baddies.length; i++) {
        this.buildElements(baddies[i], 'baddie');
      }
    }
  },

  buildGrid: function() {
    var $game = $('.game');
    for (var i = 0; i < 80; i++) {
      for (var j = 0; j < 100; j++) {
        $game.append('<div class="grid" data-id="' + (i + 1) + ',' + (j + 1) + '"><div>')
      }
    }
  },

  buildElements: function(item, klass) {
    for (var i = 0; i < item.length; i++) {
      var piece = item[i]
      var square = $('div[data-id="' + piece[0] + ',' + piece[1] + '"]')
      square.addClass(klass);
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
  }

}

var Controller = {

  init: function() {
    Model.init();
    View.init();
  },

  tick: function() {
    setInterval(function() {
      View.render(Model.ship, Model.beams, Model.baddies);
      if (Model.beams[0]) {
        Model.updateBeam();
        Model.destroyBaddies();
      }
    }, 0);

    setInterval(function() {
      Model.moveBaddies();
    }, 1000);
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

  ship: [[79,49], [79,50], [79,51], [80,49], [80,50], [80,51]],
  beams: [],
  baddies: [],

  updateShip: function(keycode) {
    if (keycode === 37) {
      for(var i = 0; i < this.ship.length; i++) {
        this.ship[i][1] -= 1;
      }
    } else if (keycode === 39) {
      for(var i = 0; i < this.ship.length; i++) {
        this.ship[i][1] += 1;
      }
    }
  },

  createBeam: function() {
    var shipMiddle = this.ship[1];
    this.beams.push([shipMiddle[0] - 1, shipMiddle[1]]);
  },

  updateBeam: function() {
    beams = this.beams;
    for (var i = 0; i < beams.length; i++) {
      if (beams[i][0] < 1) {
        beams.splice(i, 1);
      } else {
        beams[i][0] -= 1;
      }
    }
  },

  buildBaddies: function() {
    for (var i = 1; i <= 10; i ++) {
      var baddie = [];
      for (var j = 0; j < 4; j++) {
        baddie.push([1,i + j]);
      }
      this.baddies.push(baddie);
    }
  },

  moveBaddies: function() {
    var baddies = this.baddies;
    for (var i = 0; i < baddies.length; i++) {
      for (var j = 0; j < baddies[i].length; j++) {
        baddies[i][j][0] += 1;
      }
    }
  },

  destroyBaddies: function() {
    var baddies = this.baddies;
    var beams = this.beams;
    var k = beams.length - 1;

    while (k >= 0) {
      for (var i = baddies.length - 1; i >= 0; i--) {
        for (var j = baddies[i].length - 1; j >= 0; j--) {
          if (baddies[i][j][0] === beams[k][0] && baddies[i][j][1] === beams[k][1]) {
            console.log(baddies[i][j]);
            console.log(beams[k]);
            baddies.splice(i,1);
            beams.splice(k,1);
          }
        }
      }
      k--;
    }
  }

}
