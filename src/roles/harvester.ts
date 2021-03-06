export module roleHarvester {
  /** @param {Creep} creep **/
  export function run(creep: Creep): void {
    if (creep.carry.energy < creep.carryCapacity) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
        if (Game.time % 5 == 0) creep.say("🔄 harvest");
      }
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
          if (Game.time % 5 == 0) creep.say("🚚 deposit");
        }
      } else {
        creep.moveTo(30, 30);
        if (Game.time % 5 == 0) creep.say("⛩ idle");
      }
    }
  }
}
