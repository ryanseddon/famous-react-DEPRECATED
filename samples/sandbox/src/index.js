/* global document, window */

'use strict';

var dat = require('dat-gui');
var Timer = require('famous/utilities/Timer');
var Transform = require('famous/core/Transform');
var Spring = require('famous/transitions/SpringTransition');

var React = require('react');
window.React = React; // for dev

var FamousReact = require('../../../src');
var Transitionable = FamousReact.Transitionable;
var DOM = FamousReact.DOM;

var App = React.createClass({
  displayName: 'demo',

  getDefaultProps: function() {
    return {
      dampingRatio: 0.5,
      speed: 500,
      animation: Spring,
      visible: true
    };
  },
  getInitialState: function() {
    return {
      famous: false
    };
  },
  componentDidMount: function() {
    this.timeout = Timer.setTimeout(this.toggle, this.props.speed*2);
  },
  componentWillUnmount: function() {
    Timer.clear(this.timeout);
  },
  toggle: function() {
    this.setState({
      famous: !this.state.famous
    });
    this.timeout = Timer.setTimeout(this.toggle, this.props.speed*2);
  },

  render: function() {
    if (!this.props.visible) {
      return null;
    }
    var swap = this.state.famous ? 0 : 600;
    var translate = this.state.famous ? 0 : 200;
    var scale = this.state.famous ? 2 : 1;
    var anim = {
      method: this.props.animation,
      period: this.props.speed,
      dampingRatio: this.props.dampingRatio
    };

    var swap1Transform = Transitionable(Transform.translate(swap, 0, 0), anim);
    var swap2Transform = Transitionable(Transform.translate(-swap, 0, 0), anim);
    var transformX = Transitionable(Transform.translate(0, translate, 0), anim);
    var transformScale = Transitionable(Transform.scale(scale), anim);

    var centeredBlock = DOM.div({
      height: 50,
      width: 50,
      center: true,
      transform: transformScale,
      style: {
        backgroundColor: '#FF851B'
      }
    });

    var centered = DOM.div({
      key: 'centered',
      height: 200,
      width: 200,
      style: {
        backgroundColor: '#0074D9',
        display: 'inline-block'
      }
    }, centeredBlock);

    var img = DOM.img({
      ref: 'img',
      key: 'img',
      height: 200,
      width: 200,
      transform: swap1Transform,
      src: 'famous_logo.png',
      style: {
        backgroundColor: '#fff'
      }
    });

    var img2 = DOM.img({
      ref: 'img2',
      key: 'img2',
      height: 200,
      width: 200,
      transform: swap2Transform,
      src: 'react_logo.png'
    });

    var vid = DOM.video({
      ref: 'vid',
      key: 'vid',
      height: 200,
      width: 200,
      muted: true,
      loop: true,
      autoPlay: true,
      style: {
        backgroundColor: '#111111'
      },
      transform: transformX,
      src: './dizzy.mp4'
    });

    var container = DOM.div({
      height: 200,
      width: 800,
      center: true
    }, [img, vid, centered, img2]);

    return DOM.div({
      height: this.props.height,
      width: this.props.width
    }, container);
  }
});

// demo code
var state = {
  dampingRatio: 0.5,
  speed: 500,
  visible: true,
  height: document.body.clientHeight,
  width: document.body.clientWidth
};
var app = App(state);
var inst = React.renderComponent(app, document.body);

var render = function(){
  inst.setProps(state);
};

var gui = new dat.GUI();
var damping = gui.add(state, 'dampingRatio', 0.3, 1).step(0.1).listen();
var speed = gui.add(state, 'speed', 150, 2000).step(10).listen();

damping.onChange(render);
speed.onChange(render);

window.addEventListener('resize', function(){
  state.height = document.body.clientHeight;
  state.width = document.body.clientWidth;
  render();
}, false);

document.addEventListener('visibilitychange', function(){
  state.visible = !document.hidden;
  render();
}, false);