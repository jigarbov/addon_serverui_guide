import { world, ItemStack } from '@minecraft/server';

export interface GiveASingleItemOptions {
  itemTypeId: string;
}

export interface GiveASingleItem {
  (options: GiveASingleItemOptions): void;
}

export const giveASingleItem: GiveASingleItem = ({ itemTypeId }) => {
  const propertyGiven = itemTypeId + '_given';

  world.afterEvents.playerSpawn.subscribe(async (event) => {
    if (event.player.getDynamicProperty(propertyGiven) === undefined) {
      const playerPosition = event.player.location;
      const item = new ItemStack(itemTypeId, 1);

      event.player.dimension.spawnItem(item, playerPosition);
      event.player.setDynamicProperty(propertyGiven, 1);
    }
  });
};

export default giveASingleItem;
