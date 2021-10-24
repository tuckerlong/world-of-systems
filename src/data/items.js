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
		min_attack: 1,
		max_attack: 2
	},
	[ITEM_MAP.CLOTH_ARMOR]: {
		type: ITEM_TYPE.ARMOR,
		name: "Cloth Armor",
		def: 2
	}
}