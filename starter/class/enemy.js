const {Character} = require('./character');


class Enemy extends Character {
  constructor(name, description, currentRoom) {
    super(name, description, currentRoom);
    this.cooldown = 3000;
    this.attackTarget = null;
  }

  setPlayer(player) {
    this.player = player;
  }


  randomMove() {
    const exits = this.currentRoom.getExits();
    if (exits.length > 0){
      const direction = exits[Math.floor(Math.random() * exits.length)];
      const nextRoom = this.currentRoom.getRoomInDirection(direction);
      this.currentRoom = nextRoom;
      this.cooldown += 500;
      this.alert(`${this.name} has moved to ${nextRoom.name}`)
    }
  }

  takeSandwich() {
    const sandwich = this.currentRoom.getItemByName('sandwich');
    if (sandwich) {
      this.items.push(sandwich);
      this.currentRoom.items = this.currentRoom.items.filter(item => item !== sandwich);
      this.alert(`${this.name} has picked up a sandwich`);
    }
  }

  // Print the alert only if player is standing in the same room
  alert(message) {
    if (this.player && this.player.currentRoom === this.currentRoom) {
      console.log(message);
    }
  }

  rest() {
    // Wait until cooldown expires, then act
    const resetCooldown = function() {
      this.cooldown = 0;
      this.act();
    };
    setTimeout(resetCooldown, this.cooldown);
  }

  attack() {
    if (this.attackTarget && this.attackTarget.currentRoom === this.currentRoom){
      const damage = Math.floor(Math.random() * this.strength + 1);
      this.attackTarget.applyDamage(damage);
      this.cooldown += 3000;
      this.alert(`${this.name} attacks ${this.player.name} for ${damage} damage`);
    }
  }

  applyDamage(amount) {
    super.applyDamage(amount);
    this.alert(`${this.name} takes ${amount} damage`);
    if (this.player) {
      this.attackTarget = this.player;
    }
  }



  act() {
    if (this.health <= 0) {
      // Dead, do nothing;
    } else if (this.cooldown > 0) {
      this.rest();
    } else {
      if (this.attackTarget && this.attackTarget.currentRoom === this.currentRoom){
        this.attack();
      } else {
        const actions = [this.scratchNose.bind(this), this.randomMove.bind(this), this.takeSandwich.bind(this)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        randomAction();
      }
      this.rest();
    }

    // Fill this in
  }


  scratchNose() {
    this.cooldown += 1000;

    this.alert(`${this.name} scratches its nose`);

  }


}

module.exports = {
  Enemy,
};
