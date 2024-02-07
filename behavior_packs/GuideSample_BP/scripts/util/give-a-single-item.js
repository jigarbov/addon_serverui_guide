import { world, ItemStack } from '@minecraft/server';

const giveASingleItem = ({ itemTypeId }) => {
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

export { giveASingleItem as default, giveASingleItem };
