/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * TSTemplateExamples implementation : © VictoriaLa, NevinAF
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

import Gamegui = require("bga-ts-template/typescript/types/ebg/core/gamegui");
import { TokenDisplayInfo } from "./GameTokens";

// If you have any imports/exports in this file, 'declare global' is access/merge your game specific types with framework types. 'export {};' is used to avoid possible confusion with imports/exports.
declare global {

	/** @gameSpecific Add game specific notifications / arguments here. See {@link NotifTypes} for more information. */
	interface NotifTypes {
		[name: string]: any; // Uncomment to remove type safety on notification names and arguments
	}

	/** @gameSpecific Add game specific gamedatas arguments here. See {@link Gamedatas} for more information. */
	interface Gamedatas {
		// [key: string | number]: Record<keyof any, any>; // Uncomment to remove type safety on game state arguments
		tokens: Record<string, any>;
		token_types: any;
		CON: any;
	}

	//
	// When gamestates.jsonc is enabled in the config, the following types are automatically generated. And you should not add to anything to 'GameStates' or 'PlayerActions'. If gamestates.jsonc is enabled, 'GameStates' and 'PlayerActions' can be removed from this file.
	//

	interface GameStates {
		// [id: number]: string | { name: string, argsType: object} | any; // Uncomment to remove type safety with ids, names, and arguments for game states
		1: 'gameSetup';
		99: { name: 'gameEnd', argsType: {  } };
		12: "playerConfirm";
		6: "multiplayerChoice";
		4: "multiplayerDispatch";
		11: 'playerTurnChoice';
		10: 'gameDispatch';
		15: "client_collect";
	}

	/** @gameSpecific Add game specific player actions / arguments here. See {@link PlayerActions} for more information. */
	interface PlayerActions {
		[action: string]: Record<keyof any, any>; // Uncomment to remove type safety on player action names and arguments
	}

	class GameXBody extends Gamegui {
		isLayoutFull(): boolean;
		getSetting(key: string): string;
		slideAndPlace(
			token: ElementOrId,
			finalPlace: ElementOrId,
			tlen?: number,
			mobileStyle?: StringProperties,
			onEnd?: (node?: HTMLElement) => void
		);
		getTokenName(tokenId: string): string;
		stripPosition(token: ElementOrId);
		placeTokenLocal(tokenId: string, location: string, state?: number, args?: any);
		createDivNode(id?: string | undefined, classes?: string, location?: ElementOrId): HTMLDivElement;
		productionTrackers: string[];
		resourceTrackers: string[];
		getTokenDisplayInfo(tokenId: string): TokenDisplayInfo;
		generateItemTooltip(displayInfo: TokenDisplayInfo): string;
		generateTooltipSection(label: string, body: string, optional?: boolean, additional_class?: string): string;
		getTooptipHtmlForTokenInfo(tokenInfo: TokenDisplayInfo): string;
	}

	type eventhandler = (event?: any) => void;

	type ElementOrId = Element | string;
	type StringProperties = { [key: string]: string };
}

export {}; // Force this file to be a module.