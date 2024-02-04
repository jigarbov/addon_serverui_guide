import { world,ItemStack } from "@minecraft/server";

const giveASingleBook = ({
	itemTypeId
  }) => {
	let guide_checker = itemTypeId+"_given"
	world.afterEvents.playerSpawn.subscribe(async (event) => {
		if(event.player.getDynamicProperty(guide_checker) === undefined){
			let playerpos = event.player.location
			let item = new ItemStack(guide_checker,1)
			event.player.dimension.spawnItem(item, playerpos)
			event.player.setDynamicProperty(guide_checker, 1);
		}
	});
  };
  
  export default giveASingleBook;

