export type ArmorType = "Heavy" | "Medium" | "Light";

export interface SetPiece {
  slot: string;
  item: string;
}

export interface ArmorSet {
  id: string;
  name: string;
  type: ArmorType;
  manufacturer: string;
  where: string;
  how: string;
  value: string;
  setPieces: SetPiece[];
  variants: string[];
  variantNote?: string;
  image: string | null;
  rare: boolean;
}

export type CheckedState = Record<string, boolean>;
