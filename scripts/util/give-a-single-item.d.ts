interface GiveASingleItemOptions {
    itemTypeId: string;
}
interface GiveASingleItem {
    (options: GiveASingleItemOptions): void;
}
declare const giveASingleItem: GiveASingleItem;
export { giveASingleItem as default, giveASingleItem, GiveASingleItemOptions, GiveASingleItem };
