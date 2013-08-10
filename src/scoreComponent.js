Game = Game || {};

Game.setupScore = function() {
  Crafty.c("Score", {
    init: function() {
      this.requires('DOM, 2D, Text');
      this.attr({ x: 10, y: 10, z:100});
      this.textColor("#ff0000");
      this.text("Score: " + 0);
    },

    update: function(value) {
      text = "Score: ";
      originalValue = parseInt(this.text().replace(text, ""));
      newValue = originalValue + value;
      this.text(text + newValue);
    }
  });
};