// This code is to create function of basic movements of characters in-game
// (character = image)

// Plan:
// 1. Load images with transparancy 100%
// 2. When appear, use DOM to set the style to change transparancy to 0% with timestamp.
// 3. Use animation library to change the position (s) to certain location. These location will be divided by left, center, right functions accordingly.
// 4. Therefore, this program should get height and width of the character and let vectors of the image to be <0 based on x-y coordinate graph that is used in math.

class character {
  constructor() {
    /* this.name = document.getElementById() */
    /* this.origin = character.style.margin */
  }
}

function getParam() {
  let character = document.getElementById('character');
  let height = character.clientHeight;
  let width = character.clientWidth;
}
