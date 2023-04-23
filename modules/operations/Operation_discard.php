<?php

declare(strict_types=1);


class Operation_discard extends AbsOperation {
    function effect(string $color, int $inc): int {
        $card_id = $this->getCheckedArg('target');
        $this->game->dbSetTokenLocation($card_id, "discard_main", 0, clienttranslate('${player_name} discards ${token_name}'), [],  $this->game->getPlayerIdByColor($color));
        return 1;
    }

    function argPrimary() {
        $color = $this->color;
        $keys = array_keys($this->game->tokens->getTokensInLocation("hand_${color}"));
        return $keys;
    }
}
