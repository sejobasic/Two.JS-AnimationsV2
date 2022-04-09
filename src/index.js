import './styles.css'
import Two from 'two.js'

const container = document.querySelector('section')

// HELPER FUNCTIONS ----->
// t = general timeline / u = individual timeline
// Ease in out cubic
// Easings specify the rate at which an animation happens over time.
// Ease in out is a curve with a slower entrance, a faster middle and
// a slower exit, making animations *ease* into and out of their movement.
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}

// Clamp
// Takes a value, a min and a max, if the value is less than the min
// it will set the value to the min and if the value is greater than
// the max it will set the value to the max
// e.g. clamp(11, 0, 10) would return 10
// e.g. clamp(9, 0, 10) would return 9
function clamp(input, min, max) {
  return Math.max(min, Math.min(input, max))
}

// Map range
// Re-maps a number from one range to another. eg. https://processing.org/reference/map_.html
// (nb: numbers are not clamped by default to min and max parameters)
// e.g. map(70, 0, 100, 0, 10) would return 7
// e.g. map(70, 0, 100, 10, 20) would return 17
function map(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}

// do both of the above! map and clamp together!
// e.g. mapAndClamp(70, 0, 100, 0, 10) would return 7
// e.g. mapAndClamp(70, 0, 100, 10, 20) would return 17
// e.g. mapAndClamp(110, 0, 100, 10, 20) would return 20, not 21, as it's clamped to 20 max
function mapAndClamp(value, low1, high1, low2, high2) {
  return clamp(
    map(value, low1, high1, low2, high2),
    Math.min(low2, high2),
    Math.max(low2, high2)
  )
}

const params = {
  width: 500,
  height: 500
}

const two = new Two(params)
two.appendTo(container)

// config for animation
const numOfShapes = 25
const shapes = []
const shapeMin = 0
const shapeMax = 500
const shapeDiff = shapeMax - shapeMin
// loop is 4 seconds times 60 frames per second
const loopDuration = 4 * 60

// make shapes
for (let i = 0; i < numOfShapes; i++) {
  const x = 250
  const y = 20 * i + 5

  const shape = two.makeRectangle(x, y, shapeMax, 10)
  shape.fill = '#f2ccc3'
  shape.noStroke()

  shapes.push(shape)
}

let t = 0.25

two.bind('update', (frameCount) => {
  // loop using modulo current frame and remainder frame count
  // const currentFrame = frameCount % loopDuration
  // const t = currentFrame / loopDuration
  // loop through each shape and add width
  // Create delay at start and end points
  shapes.forEach((shape, index) => {
    const aStart = 0.01 * (numOfShapes - index)
    const aEnd = 0.01 * index

    let u = 0

    if (t < 0.5) {
      u = mapAndClamp(t, aStart, 0.5 - aEnd, 0, 1)
    } else {
      u = mapAndClamp(t, 0.5 + aStart, 1 - aEnd, 1, 0)
    }
    shape.width = shapeMin + shapeDiff * easeInOutCubic(u)
    shape.translation.x = 250 * easeInOutCubic(u)
  })
})

document.addEventListener('mousemove', (event) => {
  // find cursor location between the two edges of page
  t = mapAndClamp(event.pageX, 0, window.innerWidth, 0, 1)
})

two.play()
