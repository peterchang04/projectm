import $g from './utils/globals.js';
const temp = {};

const _roles = {
  0: { name: 'engineer', bgColor: '#253822', iconColor: '#5ea726' },
  1: { name: 'captain', bgColor: '#414225', iconColor: '#d6b752' },
  2: { name: 'pilot', bgColor: '#3e2323', iconColor: '#e54646' },
  3: { name: 'intel', bgColor: '#2e2e40', iconColor: '#3c87cf' },
};

const _shipTypes = {
  transportMk1: {
    // physical characteristics
    length: 20,
    svg: 'MyShipSVG',
    mass: 80000, // kg
    // physics characteristics
    sMaxShip: 50, // this is the ship max speed value and fixed. sMax will vary depending on thrust
    aSMaxShip: 20, // angular speed max for this ship
    // collision poly
    polygon: [ // 100 x 100, but with middle at 0, so -50 -> 50 bounds
      { x: -4, y: 48, },
      { x: -29, y: -30 },
      { x: -18, y: -45 },
       // other side
      { x: 18, y: -45 },
      { x: 29, y: -30 },
      { x: 4, y: 48 }
    ],
    thrusters: { // using same 100x100 coordinate system as polygon
      forward: [{ x: -16, y: -52, wMin: 10, wMax: 35 }, { x: 16, y: -52, wMin: 10, wMax: 35 }],
      backward: [{ x: -16, y: -13, wMin: 10, wMax: 35 }, { x: 16, y: -13, wMin: 10, wMax: 35 }],
      leftForward: { x: -8, y: 41, wMin: 5, wMax: 20 },
      rightForward: { x: 8, y: 41, wMin: 5, wMax: 20 },
      leftBackward: { x: -20, y: -25, wMin: 5, wMax: 30 },
      rightBackward: { x: 20, y: -25, wMin: 5, wMax: 30 },
    },
    cannons: [ // forward facing
      { x: -29, y: -14, projectileType: '50mm' },
      { x: 29, y: -14, projectileType: '50mm' },
    ],
    turrets: [ // shoots in any direction
      { x: -19, y: -15, type: '50mmMk1' },
      { x: 19, y: -15, type: '50mmMk1' },
    ]
  }
};

const _projectileTypes = {
  '50mm': {
    sMax: 150,
    length: 3,
    c: '#ffbd49',
    w: .5,
    maxDistance: 200,
    polygon: [
      { x: 0, y: 50 },
      { x: 0, y: 0 },
    ],
    collisionEffect: 'smallImpact'
  },
  laser: {
    sMax: 600,
    length: 20,
    c: "#FF0000",
    w: .5,
    maxDistance: 200,
    polygon: [
      { x:0, y: 50 },
      { x:0, y: -50 },
    ],
    collisionEffect: 'laser',
  }
};

const _cannonTypes = {
  '50mm': {

  }
};

const _turretTypes = {
  laserMk1: {
    svg: 'TurretSVG',
    length: 6,
    aS: 30, // angular speed
    projectileType: 'laser',
  },
  '50mmMk1': {
    svg: 'TurretSVG',
    length: 6,
    aS: 30, // angular speed
    projectileType: '50mm',
  }
};

const _engineTypes = {

};

// traditional whole file export
export default {
  roles: _roles,
  shipTypes: _shipTypes ,
  projectileTypes: _projectileTypes,
  turretTypes: _turretTypes,
};
// allow deconstructed imports
export const projectileTypes = _projectileTypes;
export const shipTypes = _shipTypes;
export const roles = _roles;
export const turretTypes = _turretTypes;
