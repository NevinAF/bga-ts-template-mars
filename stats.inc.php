<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * game implementation : © Alena Laskavaia <laskava@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * stats.inc.php
 *
 * game statistics description
 *
 */

/*
    In this file, you are describing game statistics, that will be displayed at the end of the
    game.
    
    !! After modifying this file, you must use "Reload  statistics configuration" in BGA Studio backoffice
    ("Control Panel" / "Manage Game" / "Your Game")
    
    There are 2 types of statistics:
    _ table statistics, that are not associated to a specific player (ie: 1 value for each game).
    _ player statistics, that are associated to each players (ie: 1 value for each player in the game).

    Statistics types can be "int" for integer, "float" for floating point values, and "bool" for boolean
    
    Once you defined your statistics there, you can start using "initStat", "setStat" and "incStat" method
    in your game logic, using statistics names defined below.
    
    !! It is not a good idea to modify this file when a game is running !!

    If your game is already public on BGA, please read the following before any change:
    http://en.doc.boardgamearena.com/Post-release_phase#Changes_that_breaks_the_games_in_progress
    
    Notes:
    * Statistic index is the reference used in setStat/incStat/initStat PHP method
    * Statistic index must contains alphanumerical characters and no space. Example: 'turn_played'
    * Statistics IDs must be >=10
    * Two table statistics can't share the same ID, two player statistics can't share the same ID
    * A table statistic can have the same ID than a player statistics
    * Statistics ID is the reference used by BGA website. If you change the ID, you lost all historical statistic data. Do NOT re-use an ID of a deleted statistic
    * Statistic name is the English description of the statistic as shown to players
    
*/

$stats_type = array(

    // Statistics global to table
    "table" => array(

        "turns_number" => array(
            "id" => 10,
            "name" => totranslate("Number of turns"),
            "type" => "int"
        ),
        "game_gen" => array(
            "id" => 11,
            "name" => totranslate("Number of generations"),
            "type" => "int"
        ),

        /*
        Examples:


        "table_teststat1" => array(   "id"=> 10,
                                "name" => totranslate("table test stat 1"), 
                                "type" => "int" ),
                                
        "table_teststat2" => array(   "id"=> 11,
                                "name" => totranslate("table test stat 2"), 
                                "type" => "float" )
*/
    ),

    // Statistics existing for each player
    "player" => array(

        "turns_number" => array(
            "id" => 10,
            "name" => totranslate("Number of turns"),
            "type" => "int"
        ),
        "game_vp_cards" => array(
            "id" => 11,
            "name" => totranslate("VP from cards"),
            "type" => "int"
        ),
        "game_vp_cities" => [
            "id" => 12,
            "name" => totranslate("VP from cities"),
            "type" => "int"
        ],
        "game_vp_forest" => [
            "id" => 13,
            "name" => totranslate("VP from greeneries"),
            "type" => "int"
        ],
        "game_vp_tr" => [
            "id" => 14,
            "name" => totranslate("VP from Terraforming Rating"),
            "type" => "int"
        ],
        "game_vp_ms" => [
            "id" => 15,
            "name" => totranslate("VP from Milestones"),
            "type" => "int"
        ],
        "game_vp_award" => [
            "id" => 16,
            "name" => totranslate("VP from Awards"),
            "type" => "int"
        ],
        "game_vp_total" => [
            "id" => 20,
            "name" => totranslate("VP total"),
            "type" => "int"
        ],

        "game_actions" => [
            "id" => 30,
            "name" => totranslate("Number of actions"),
            "type" => "int"
        ],
        "game_corp" => [
            "id" => 31,
            "name" => totranslate("Corporation"),
            "type" => "int"
        ],
        "game_theme" => [
            "id" => 51,
            "name" => totranslate("User Interface Theme"),
            "type" => "int"
        ]
    ),
    "value_labels" => array(
        31 => array(
            1=>totranslate('Beginner Corp'),
            2=>totranslate('CrediCor'),
            3=>totranslate('Ecoline'),
            4=>totranslate('Helion'),
            5=>totranslate('Interplanetary Cinematics'),
            6=>totranslate('Inventrix'),
            7=>totranslate('Mining Guild'),
            8=>totranslate('Saturn Systems'),
            9=>totranslate('PhoboLog'),
            10=>totranslate('Teractor'),
            11=>totranslate('Tharsis Republic'),
            12=>totranslate('ThorGate'),
            13=>totranslate('United Nations Mars Initiative')
        ),
        51 => [
                0 => totranslate("None"),
                1 => totranslate("Digital"),
                2 => totranslate("Cardboard")
        ]
    )

);
