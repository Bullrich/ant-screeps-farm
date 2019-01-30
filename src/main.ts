import { ErrorMapper } from "utils/ErrorMapper";
import { roleUpgrader } from "./roles/upgrader";
import { roleHarvester } from "./roles/harvester";
import { roleBuilder } from "./roles/builder";
import { spawn } from "child_process";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  const totalCreeps: number = Object.keys(Game.creeps).length;
  const roles: { [index: string]: number } = { harvester: 3, upgrader: 1, builder: 1 };
  // const roles = RoleSpecification[] = [{role:'harvester', amount:3}];
  const spawnName: string = "Spawn1";
  const defaultSpawn: StructureSpawn = Game.spawns[spawnName];
  if (defaultSpawn) {
    const roomName: string = defaultSpawn.room.name;
    if (totalCreeps < 10 && !defaultSpawn.spawning) {
      for (const role in roles) {
        var amountOfRole = _.filter(Game.creeps, creep => creep.memory.role == role);
        if (amountOfRole.length < roles[role]) {
          var newName = role + Game.time;

          console.log(`Spawning new ${role}: ${newName}`);
          const spawnOptions: SpawnOptions = { memory: { role: role, room: roomName, working: false } };
          defaultSpawn.spawnCreep([WORK, CARRY, MOVE], newName, spawnOptions);
        }
      }
    }

    if (defaultSpawn.spawning) {
      var spawningCreep = Game.creeps[defaultSpawn.spawning.name];
      defaultSpawn.room.visual.text("🛠️" + spawningCreep.memory.role, defaultSpawn.pos.x + 1, defaultSpawn.pos.y, {
        align: "left",
        opacity: 0.8
      });
    }
  }

  /*
  var tower: StructureTower | null = Game.getObjectById('TOWER_ID');
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure: StructureController) => structure.hits < structure.hitsMax
    });
    if (closestDamagedStructure)
      tower.repair(closestDamagedStructure);
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile)
      tower.attack(closestHostile);
  }
  */

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (!creep) {
      delete Memory.creeps[name];
      return;
    }

    switch (creep.memory.role) {
      case "harvester":
        roleHarvester.run(creep);
        break;
      case "upgrader":
        roleBuilder.run(creep);
        break;
      case "upgrader":
        roleUpgrader.run(creep);
        break;
    }
  }
});
