<?php

declare(strict_types=1);


class Operation_buycard extends AbsOperation {
    function effect(string $color, int $inc): int {
        $card_id = $this->getCheckedArg('target');
        $this->game->effect_incCount($color, 'm', -3, ['message' => '']);
        $this->game->dbSetTokenLocation($card_id, "hand_$color", MA_CARD_STATE_SELECTED, clienttranslate('${player_name} buys a card ${token_name}'), [
            "_private"=>true
        ],  $this->game->getPlayerIdByColor($color));
        $this->game->notifyCounterChanged("hand_$color", ["nod" => true]);
        return 1;
    }

    function isVoid(): bool {
        if ($this->getMinCount() == 0) return false;
        if ($this->noValidTargets()) return true;
        return $this->game->isVoidSingle("3nm", $this->color);
    }

    function argPrimaryDetails() {
        $color = $this->color;
        $keys = array_keys($this->game->tokens->getTokensOfTypeInLocation("card_main","draw_${color}"));
        $hasmoney = !$this->game->isVoidSingle("3nm", $color);

        return $this->game->createArgInfo($color, $keys, function ($color, $tokenId) use ($hasmoney) {
            if ($hasmoney) return 0;
            return MA_ERR_COST;
        });
    }


    function canResolveAutomatically() {
        return false;
    }
}
