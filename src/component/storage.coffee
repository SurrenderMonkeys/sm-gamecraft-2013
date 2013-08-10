Game = window.Game || {};

Game.Storage = class Storage
  constructor: (gameName = 'Crafty') ->
    Crafty.storage.open(gameName)

  save: (key, type = 'save', data) ->
    Crafty.storage.save(key, type, ent)

  load: (key, type = 'save') ->
    Crafty.storage.load(key, type)
