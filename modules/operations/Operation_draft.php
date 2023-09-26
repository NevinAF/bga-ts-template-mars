<?php

declare(strict_types=1);


class Operation_draft extends AbsOperation {
    function effect(string $color, int $inc): int {
        $card_id = $this->getCheckedArg('target');
        $this->game->effect_moveCard($color, $card_id, "draw_$color", MA_CARD_STATE_SELECTED, clienttranslate('${player_name} drafts a card ${token_name}'), [
            "_private"=>true
        ]);
        //$this->game->notifyCounterChanged("draft_$color", ["nod" => true]);
        return 1;
    }

    function argPrimary() {
        $color = $this->color;
        $keys = array_keys($this->game->tokens->getTokensOfTypeInLocation("card_main","draft_${color}"));
        return $keys;
    }

    function canResolveAutomatically() {
        $arg = $this->arg();
        if ( count($arg['target']) == 1) return true;
        return false;
    }


    function noValidTargets(): bool {
        $arg = $this->arg();
        return count($arg['target']) == 0;
    }
}