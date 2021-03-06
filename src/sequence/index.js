'use strict';

var ensureStep = require('./ensureStep');

function Sequence(steps) {
  if (!(this instanceof Sequence)) {
    return new Sequence(steps);
  }

  this._steps = steps || [];
}

Sequence.prototype.step = function(step) {
  var newSteps = (step instanceof Sequence) ?
    step.steps : [ensureStep(step)];

  return new Sequence(this._steps.concat(newSteps));
};

Sequence.prototype.inverse = function() {
  return new Sequence(this.steps().reverse());
};

Sequence.prototype.clone = function() {
  return new Sequence(this.steps());
};

Sequence.prototype.steps = function() {
  return this._steps.slice();
};

module.exports = Sequence;