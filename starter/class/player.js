const {Character} = require('./character');
const {Enemy} = require('./enemy');
const {Food} = require('./food');

class Player extends Character {

  constructor(name, startingRoom) {
    super(name, "main character", startingRoom);
  }

  move(direction) {

    const nextRoom = this.currentRoom.getRoomInDirection(direction);

    // If the next room is valid, set the player to be in that room
    if (nextRoom) {
      this.currentRoom = nextRoom;

      nextRoom.printRoom(this);
    } else {
      console.log("You cannot move in that direction");
    }
  }

  printInventory() {
    if (this.items.length === 0) {
      console.log(`${this.name} is not carrying anything.`);
    } else {
      console.log(`${this.name} is carrying:`);
      for (let i = 0 ; i < this.items.length ; i++) {
        console.log(`  ${this.items[i].name}`);
      }
    }
  }

  takeItem(itemName) {
    const item = this.currentRoom.getItemByName(itemName);
    if (item) {
      this.items.push(item);
      this.currentRoom.items = this.currentRoom.items.filter(i => i !== item);
      console.log(`${this.name} picked up ${item.name}`);
    } else {
      console.log(`There is no item named ${itemName} here.`);
    }
  }

  dropItem(itemName) {
    const item = this.getItemByName(itemName);
    if (item) {
      this.currentRoom.items.push(item);
      this.items = this.items.filter(i => i !== item);
      console.log(`${this.name} dropped ${item.name}`);
    } else {
      console.log(`You are not carrying an item named ${itemName}`);
    }
  }

  eatItem(itemName) {
    const food = this.getItemByName(itemName);
    if (food instanceof Food) {
      this.health += food.healthValue;
      this.items = this.items.filter(i => i !== food);
      console.log(`${this.name} ate ${food.name} and gained ${food.healthValue} health.`);
    } else {
      console.log(`${itemName} is not a food item.`);
    }
  }

  getItemByName(name) {
    return this.items.find(item => item.name === name);
  }

  hit(name) {
    const enemy = this.currentRoom.getEnemyByName(name);
    if (enemy){
      enemy.applyDamage(this.strength);
      console.log(`${this.name} hits ${enemy.name} for ${this.strength} damage.`);
    } else {
      console.log(`There is no enemy named ${name} here.`)
    }
  }

  die() {
    console.log("You are dead!");
    process.exit();
  }

}

module.exports = {
  Player,
};
