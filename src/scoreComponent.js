Game = window.Game || {};

Game.setupScore = function() {
  Crafty.c("Score", {
    init: function() {
      this.requires('DOM, 2D, Text');
      this.attr({ x: 0, y: -20, z:100});
      this.textColor("#ff0000");
      this.text("Score: " + 0);
      this.css({
        background: "#fff",
        border: "1px solid #000",
        fontSize: 28,
        padding: 5,
        position: "relative",
        width: "auto"
      });
    },

    update: function(value) {
      text = "Score: ";
      originalValue = parseInt(this.text().replace(text, ""));
      newValue = originalValue + value;
      this.text(text + newValue);
    }
  });
};
