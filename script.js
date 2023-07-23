const size = 9
const lower = 0 + size;
const upper = 500 - size;
const speed = 0.5;
const items_to_draw = 5;

function getRandomMinusOrPlusOne() {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();

  // If randomNumber is less than 0.5, return -1, otherwise return 1
  return randomNumber < 0.5 ? -1 : 1;
}

function generate_coord() {
  return Math.floor(Math.random() * upper) + lower;
}

function findIndexOfMinValue(arr) {
  if (arr.length === 0) {
    // If the array is empty, return null or an appropriate value
    return null;
  }

  let minValue = arr[0];
  let minIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
      minIndex = i;
    }
  }

  return minIndex;
}

function calculateDistance(obj1, obj2) {
  const dx = obj2.x - obj1.x;
  const dy = obj2.y - obj1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

class MapObject {
  constructor(name) {
    this.name = name;
    this.x = generate_coord();
    this.y = generate_coord();
  }
}

objects = [
  { name: "rock", colour: "red", items: [], new_items: [] },
  { name: "paper", colour: "green", items: [], new_items: [] },
  { name: "scissor", colour: "blue", items: [], new_items: [] },
]

catchMap = {
  "rock": "scissor",
  "scissor": "paper",
  "paper": "rock"
}

for (const obj of objects) {
  for (let i = 0; i < items_to_draw; i++) {
    new_obj = new MapObject(obj.name);
    obj.items.push(new_obj);
  }
}

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(255); // Set the background to white
  for (const obj of objects) {
    fill(obj.colour);
    obj.items.map((item) => {

      // draw object
      ellipse(item.x, item.y, size, size);

      // move object
      to_catch = catchMap[obj.name];
      catch_items = objects.filter((search_obj) => search_obj.name === to_catch)[0].items;
      dists = catch_items.map((ci) => calculateDistance(ci, item));
      index_cci = findIndexOfMinValue(dists);
      closest_catch_item = catch_items[index_cci];
      if (closest_catch_item.x === item.x && closest_catch_item.y === item.y) {
        closest_catch_item.name = obj.name;
        obj.new_items.push(closest_catch_item);
        obj.new_items.push(item);

      } else {
        dx = closest_catch_item.x - item.x
        dy = closest_catch_item.y - item.y
        if (dx > 0) {
          item.x += speed;
        } else {
          item.x -= speed;
        }
        if (dy > 0) {
          item.y += speed;
        } else {
          item.y -= speed;
        }

        item.x = max(0, min(item.x, upper));
        item.y = max(0, min(item.y, upper));
        if (obj.name == item.name) {
          obj.new_items.push(item);
        }
      }
    })
  }
  for (const obj of objects) {
    obj.items = obj.new_items;
    obj.new_items = [];
    select("#" + obj.name).html(obj.name + " value: " + obj.items.length);
  }
}