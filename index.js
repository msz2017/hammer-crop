import Hammer from 'hammerjs';
import 'styles/style.scss';
// import base from 'styles/base.css'
// import s from 'hammer-crop'

const DIRECTION_NONE = 1;
const DIRECTION_LEFT = 2;
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 8;
const DIRECTION_DOWN = 16;
const DIRECTION_HORIZONTAL = 6;
const DIRECTION_VERTICAL = 24;
const DIRECTION_ALL = 30;

const threshold = 300;


const element = document.querySelector('.hammer');
// const img = element.querySelector('.hammer');

const hammer = new Hammer(element);
hammer.get('pinch').set({
    enable: true
});
hammer.get('rotate').set({
    enable: true
});
hammer.get('pan').set({
    direction: Hammer.DIRECTION_ALL
});
hammer.get('swipe').set({
    direction: Hammer.DIRECTION_VERTICAL
});

let deltaX = 0,
    deltaY = 0,
    angle = 0,
    rotation = 0,
    scale = 1,
    enablePan = false;

let lastPinchTime = Date.now();


hammer.on('panstart', (evt) => {
    enablePan = true;
    console.log('panstart');
    console.log(evt)
});

hammer.on('panmove', (evt) => {
    if (Date.now() - lastPinchTime < threshold) return;
    console.log('pan');
    console.log(evt)
    element.style.transform = `translate3d(${deltaX+evt.deltaX}px,${deltaY+evt.deltaY}px,0) rotate(${rotation}) scale(${scale})`;
    evt.preventDefault();
});

hammer.on('panend', (evt) => {
    if (Date.now() - lastPinchTime < threshold) return;
    console.log('panend');
    console.log(evt)
    deltaX += evt.deltaX;
    deltaY += evt.deltaY;
    element.style.transform = `translate3d(${deltaX}px,${deltaY}px,0) rotate(${rotation}) scale(${scale})`;
    evt.preventDefault();
});

hammer.on('pinchstart', (evt) => {
    enablePan = false;
    console.log('scale');
    console.log(evt)
});

hammer.on('pinchend', (evt) => {
    console.log('pinchend');
    lastPinchTime = Date.now();
});