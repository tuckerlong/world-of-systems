const ITEM_TYPE = {
	WEAPON: 'weapon',
	ARMOR: 'armor'
}

const ITEM_MAP = {
	WOOD_SWORD: 0,
	CLOTH_ARMOR: 1
};

const ITEM_DATA = {
	[ITEM_MAP.WOOD_SWORD]: {
		type: ITEM_TYPE.WEAPON,
		name: "Wooden Sword",
		img: "crossed-swords.svg",
		min_attack: 2,
		max_attack: 4
	},
	[ITEM_MAP.CLOTH_ARMOR]: {
		type: ITEM_TYPE.ARMOR,
		name: "Cloth Armor",
		img: "kevlar.svg",
		def: 2
	}
}