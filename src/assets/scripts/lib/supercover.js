
/**
 * Casts a ray from one 2d vector to another and returns the set of all grid squares that were
 * hit by the ray. Adapted from http://eugen.dedu.free.fr/projects/bresenham/.
 *
 * @function supercover
 * @param  {Vector2} startV2  The starting point.
 * @param  {Vector2} finalV2  The goal point.
 * @return {Array<Vector2>}
 */
export default function supercover(startV2, finalV2) {
  const [ x1, y1 ] = startV2;
  const [ x2, y2 ] = finalV2;
  let ystep, xstep;    // the step on y and x axis
  let error;           // the error accumulated during the increment
  let errorprev;       // *vision the previous value of the error variable
  let y = y1, x = x1;  // the line points
  let ddy, ddx;        // compulsory variables: the double values of dy and dx
  let dx = x2 - x1;
  let dy = y2 - y1;
  const points = [ [ x1, y1 ] ];
  // NB the last point can't be here, because of its previous point (which has to be verified)
  if (dy < 0) {
    ystep = -1;
    dy = -dy;
  } else {
    ystep = 1;
  }
  if (dx < 0) {
    xstep = -1;
    dx = -dx;
  } else {
    xstep = 1;
  }
  ddy = 2 * dy;  // work with double values for full precision
  ddx = 2 * dx;
  if (ddx >= ddy) {  // first octant (0 <= slope <= 1)
    // compulsory initialization (even for errorprev, needed when dx==dy)
    errorprev = error = dx;  // start in the middle of the square
    for (let i = 0; i < dx; i++) {  // do not use the first point (already done)
      x += xstep;
      error += ddy;
      if (error > ddx) {  // increment y if AFTER the middle ( > )
        y += ystep;
        error -= ddx;
        // three cases (octant == right->right-top for directions below):
        if (error + errorprev < ddx) { // bottom square also
          points.push([ x, y - ystep ]);
        } else if (error + errorprev > ddx) { // left square also
          points.push([ x - xstep, y ]);
        } else {  // corner: bottom and left squares also
          points.push([ x, y - ystep ]);
          points.push([ x - xstep, y ]);
        }
      }
      points.push([ x, y ]);
      errorprev = error;
    }
  } else {  // the same as above
    errorprev = error = dy;
    for (let i = 0; i < dy; i++) {
      y += ystep;
      error += ddx;
      if (error > ddy) {
        x += xstep;
        error -= ddy;
        if (error + errorprev < ddy) {
          points.push([ x - xstep, y ]);
        } else if (error + errorprev > ddy) {
          points.push([ x, y - ystep ]);
        } else {
          points.push([ x - xstep, y ]);
          points.push([ x, y - ystep ]);
        }
      }
      points.push([ x, y ]);
      errorprev = error;
    }
  }

  return points;
};
