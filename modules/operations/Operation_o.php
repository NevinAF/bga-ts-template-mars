<?php

declare(strict_types=1);

class Operation_o extends AbsOperation {
    function effect(string $owner, int $inc): int {
        $this->game->effect_increaseParam($owner, $this->mnemonic, $inc);
        return $inc;
    }

    function getPrimaryArgType() {
        return '';
    }

    function getMax() {
        $max = $this->game->getRulesFor($this->game->getTrackerId('', $this->getMnemonic()), 'max', 0);
        return $max;
    }



    function requireConfirmation() {
        $current = $this->game->getTrackerValue('', $this->getMnemonic());
        if ($current >= $this->getMax()) {
            return true;
        }
        return false;
    }

    function getPrompt(){
        if ($this->requireConfirmation()) return clienttranslate('Oxygen is already at maximum: you may proceed with this action without raising Oxygen further');
        return parent::getPrompt();
    }
}
