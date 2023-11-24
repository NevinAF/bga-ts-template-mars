class VLayout {
  constructor(public game: GameXBody) {}

  setupPlayer(playerInfo: any) {
    if (!this.game.isLayoutFull()) return;
    const color = playerInfo.color;
    const name = playerInfo.name;
    const div = $("main_area");
    const board = $(`player_area_${color}`);
    div.appendChild(board);

    dojo.destroy(`tableau_${color}_cards_3vp`);
    dojo.destroy(`tableau_${color}_cards_1vp`);
    dojo.place(`tableau_${color}_corp`, `pboard_${color}`, "after");
    dojo.place(`player_controls_${color}`, `player_board_header_${color}`);
    dojo.removeClass(`tableau_${color}_corp_effect`, "corp_effect");
    //dojo.place(`player_area_name_${color}`, `tableau_${color}_corp`, "first");

    const headerNode = this.game.createDivNode(`playerboard_side_${color}`,"playerboard_side");
    //dojo.place(`tableau_${color}_corp_logo`, headerNode, "first");
    dojo.place(headerNode,  `player_area_${color}`, "first");
    const settingNode = $(`player_board_header_${color}`);
    dojo.place(settingNode, `player_area_${color}`,"first");    
    settingNode.style.display = 'none';
    const gear = this.game.createDivNode(`playerboard_side_gear_${color}`,"playerboard_side_gear", headerNode);
    gear.addEventListener('click',()=>{
      if (  settingNode.style.display == 'none') {
        settingNode.style.display = 'flex';
      } else {
        settingNode.style.display = 'none';
      }
    });

    const namediv = this.game.createDivNode(`playerboard_side_name_${color}`,"playerboard_side_name", headerNode);
    namediv.setAttribute("data-player-name", name);


    const places = ["tracker_city", "tracker_forest", "tracker_land"];
    for (const key of places) {
      //alt_tracker_city_ff0000
      dojo.place($(`alt_${key}_${color}`), `miniboardentry_${color}`);
    }

    // dojo.place(`player_viewcards_2_${color}`, `miniboardentry_${color}`);
    // dojo.place(`player_viewcards_1_${color}`, `miniboardentry_${color}`);
    // dojo.place(`player_viewcards_3_${color}`, `miniboardentry_${color}`);

    dojo.place("alt_tracker_gen", "map_left");
    dojo.destroy("outer_generation");

    dojo.place("deck_main", "decks_area");
    dojo.place("discard_main", "decks_area");
    dojo.place("oceans_pile", "map_middle");
    dojo.destroy("deck_holder");
    dojo.destroy("discard_holder");

    // dojo.place(`player_controls_${color}`,`miniboardentry_${color}`);

    dojo.place(`fpholder_${color}`, `miniboardentry_${color}`);

    dojo.place(`counter_draw_${color}`, `limbo`);

    for (let i = 0; i <= 3; i++) {
      $("tableau_" + color).dataset["visibility_" + i] = "1";
      $("player_viewcards_" + i + "_" + color).dataset.selected = "1";
    }



    // var parent = document.querySelector(".debug_section"); // studio only
    // if (!parent)
    //     $(`pboard_${color}`).style.display  = 'none'; // disable for now
  }

  setupDone() {
    if (!this.game.isLayoutFull()) return;
    const togglehtml = this.game.getTooptipHtml(_("Player board visibility toggle"), "", "*", _("Click to show or hide player board"));

    document.querySelectorAll(".viewcards_button[data-cardtype='0']").forEach((node) => {
      // have to attach tooltip directly, this element does not have a game model
      this.game.addTooltipHtml(node.id, togglehtml, this.game.defaultTooltipDelay);
    });
  }

  renderSpecificToken(tokenNode: HTMLElement) {
    if (!this.game.isLayoutFull()) return;
    if (tokenNode.id.startsWith("tracker_tr")) {
      // debugger;
      const marker = "marker_" + tokenNode.id;
      let markerNode = $(marker);
      const color = getPart(tokenNode.id, 2);
      if (!markerNode) {
        markerNode = this.game.createDivNode(marker, "marker marker_tr marker_" + color, "main_board");
        this.convertInto3DCube(markerNode, color);
      }

      let state = parseInt(tokenNode.getAttribute("data-state"));
      //this.game.setDomTokenState(markerNode, state);
      let bp = 0;
      let lp = 0;
      state = state % 100;
      let off = state % 25;
      let mul = 100 / 25;
      if (state <= 25) {
        lp = 0;
        bp = mul * off;
      } else if (state < 50) {
        lp = mul * off;
        bp = 100;
      } else if (state <= 75) {
        lp = 100;
        bp = 100 - mul * off;
      } else if (state < 50) {
        lp = 100 - mul * off;
        bp = 0;
      }
      markerNode.style.left = `calc(10px + ${lp}% * 0.95)`;
      markerNode.style.bottom = `calc(10px + ${bp}% * 0.95)`;
      return;
    }
    const ptrackers = ["pm", "ps", "pu", "pp", "pe", "ph"];
    const rtrackers = ["m", "s", "u", "p", "e", "h"];

    if (tokenNode.id.startsWith("tracker_")) {
      const type = getPart(tokenNode.id, 1);
      if (ptrackers.includes(type)) {
        const color = getPart(tokenNode.id, 2);
        const marker = "marker_" + tokenNode.id;
        let markerNode = $(marker);

        if (!markerNode) {
          markerNode = this.game.createDivNode(marker, `marker marker_${type} marker_${color}`, `pboard_${color}`);
          this.convertInto3DCube(markerNode, color);
        }

        const state = parseInt(tokenNode.getAttribute("data-state"));
        const rem = state % 10;
        let x = rem;
        let y = 0;
        if (rem > 5) {
          x = rem - 5;
          y = 1;
        } else if (state < 0) {
          x = state + 6;
          y = -1;
        }
        let xp = x * 3.7;
        let yp = y * 4;
        markerNode.style.marginLeft = `${xp}%`;
        markerNode.style.marginTop = `${yp}%`;
      } else if (rtrackers.includes(type)) {
        const color = getPart(tokenNode.id, 2);
        const state = parseInt(tokenNode.getAttribute("data-state"));
        new ScatteredResourceZone(this.game, `resarea_${type}_${color}`).setValue(state);
      }
    }
  }

  convertInto3DCube(tokenNode: HTMLElement, color?: string) {
    dojo.addClass(tokenNode, "mcube");
    if (color) dojo.addClass(tokenNode, "mcube-" + color);
    for (let i = 0; i <= 5; i++) {
      dojo.place(`<div class="mcube-face  mcube-face-${i}"></div>`, tokenNode);
    }
  }

  createHtmlForToken(tokenNode: HTMLElement, displayInfo: TokenDisplayInfo) {
    if (displayInfo.mainType == "marker") {
      this.convertInto3DCube(tokenNode, displayInfo.color);
    }
  }
}
