import Hammer from 'hammerjs';
import 'styles/style.scss';
// import base from 'styles/base.css'
import imageSrc from 'images/file.png';

const DIRECTION_NONE = 1;
const DIRECTION_LEFT = 2;
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 8;
const DIRECTION_DOWN = 16;
const DIRECTION_HORIZONTAL = 6;
const DIRECTION_VERTICAL = 24;
const DIRECTION_ALL = 30;

const threshold = 300;

const css = (el, obj) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            el.style[key] = obj[key];
        }
    }
}

const image = new Image();

image.src = imageSrc;

const element = document.createElement('div');

element.appendChild(image);

document.body.appendChild(element);

const {
    clientHeight,
    clientWidth
} = document.documentElement;

const devicePixelRatio = window.devicePixelRatio || 1;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

const ratio = devicePixelRatio / backingStoreRatio;

const radius = clientWidth * ratio / 2 * .8;

canvas.width = clientWidth * ratio;
canvas.height = clientHeight * ratio;
canvas.style.width = `${clientWidth}px`;
canvas.style.height = `${clientHeight}px`;
ctx.strokeStyle = '#fff';
ctx.lineWidth = 1 * ratio;
ctx.fillStyle = 'rgba(0,0,0,.5)';
ctx.fillRect(0, 0, clientWidth * ratio, clientHeight * ratio);

ctx.beginPath();
ctx.arc(clientWidth * ratio / 2, clientHeight * ratio / 2, radius, 0, 2 * Math.PI);
ctx.stroke();
ctx.clip();
ctx.globalAlpha = 0;
ctx.globalCompositeOperation = 'source-in'
ctx.fill();

const canvasContainer = document.createElement('div');
canvasContainer.id = 'canvasContainer';
css(canvasContainer, {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    'pointer-events': 'none',
})

canvasContainer.appendChild(canvas);

document.body.appendChild(canvasContainer);

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
    console.log('pinchstart');
    console.log(evt)
});

hammer.on('pinchmove', (evt) => {
    console.log('pinchmove');
    console.log(evt);
    element.style.transform = `translate3d(${deltaX}px,${deltaY}px,0) rotate(${rotation}) scale(${scale*evt.scale})`;
});

hammer.on('pinchend', (evt) => {
    console.log('pinchend');
    lastPinchTime = Date.now();
    scale *= evt.scale;
    console.log(evt);
    element.style.transform = `translate3d(${deltaX}px,${deltaY}px,0) rotate(${rotation}) scale(${scale})`;
});