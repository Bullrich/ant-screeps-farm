export module roleUpgrader {
  export function run(creep: Creep): void {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.working) {
      const controller: StructureController | undefined = creep.room.controller;
      if (controller) {
        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE)
          creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffffff" } });
      } else if (Game.time % 3 == 0) creep.say("No controller!");
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
}

// module.exports = roleUpgrader;
