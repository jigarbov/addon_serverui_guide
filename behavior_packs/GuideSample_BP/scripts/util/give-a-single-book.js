import { world,ItemStack } from "@minecraft/server";

const giveASingleBook = ({
	itemTypeId
  }) => {
	world.afterEvents.playerSpawn.subscribe(async (event) => {
		if(event.player.getDynamicProperty(itemTypeId) === undefined){
			let playerpos = event.player.location
			let item = new ItemStack(itemTypeId,1)
			event.player.dimension.spawnItem(item, playerpos)
			event.player.setDynamicProperty(itemTypeId, 1);
		}
	});
  };
  
  export default giveASingleBook;

