/** Game class */

class GameXBody extends GameTokens {
  private reverseIdLookup: any;
  private custom_placement:any;

  constructor() {


    super();
  }

  setup(gamedatas: any) {
    this.defaultTooltipDelay = 800;

    //custom destinations for tokens
    this.custom_placement={
      'tracker_t':'temperature_map',
      'tracker_o':'oxygen_map'
    }

    super.setup(gamedatas);
    this.connectClass("hex", "onclick", "onToken");



    document.querySelectorAll(".hex").forEach(node=>{
      this.updateTooltip(node.id);
    });


    console.log("Ending game setup");
  }



  syncTokenDisplayInfo(tokenNode: HTMLElement) {
    if (!tokenNode.getAttribute("data-info")) {
      const displayInfo = this.getTokenDisplayInfo(tokenNode.id);
      const classes = displayInfo.imageTypes.split(/  */);
      tokenNode.classList.add(...classes);
      tokenNode.setAttribute("data-info", "1");

      // use this to generate some fake parts of card, remove this when use images
      if (displayInfo.mainType == "card") {
        const div = this.createDivNode(null, "card_info_box", tokenNode.id);
        div.innerHTML = `
        <div class='token_title'>${displayInfo.name}</div>
        <div class='token_cost'>${displayInfo.cost}</div>
        <div class='token_rules'>${displayInfo.r}</div>
        <div class='token_descr'>${displayInfo.tooltip}</div>
        `;
        tokenNode.appendChild(div);

        tokenNode.setAttribute("data-card-type", displayInfo.t);

        this.connect(tokenNode, "onclick", "onToken");
      }
    }
  }

  renderSpecificToken(tokenNode: HTMLElement) {

    const displayInfo = this.getTokenDisplayInfo(tokenNode.id);
    if (tokenNode && displayInfo && tokenNode.parentNode && displayInfo.location) {
      const originalHtml=tokenNode.outerHTML;
      console.log("checking",tokenNode.id,'maintype',displayInfo.mainType,'location inc', displayInfo.location.includes('miniboard_'));
      if (displayInfo.mainType=='tracker' && displayInfo.location.includes('miniboard_')) {
        const  rpDiv = document.createElement('div');
        rpDiv.classList.add('outer_tracker','outer_'+displayInfo.typeKey);
        rpDiv.innerHTML = '<div class="token_img '+displayInfo.typeKey+'"></div>'+originalHtml;
        tokenNode.parentNode.replaceChild(rpDiv, tokenNode);

      }
    }
  }

  getPlaceRedirect(tokenInfo: Token): TokenMoveInfo {
    let result = super.getPlaceRedirect(tokenInfo);
    if (tokenInfo.key.startsWith("tracker") && $(tokenInfo.key)) {
      console.log('succes in interceptiong ',tokenInfo.key,'to', result.location );
      result.location = ($(tokenInfo.key).parentNode as HTMLElement).id;
    } else if (this.custom_placement[tokenInfo.key]) {
      result.location=this.custom_placement[tokenInfo.key];
    }
    console.log('redirecting ',tokenInfo.key,'to', result.location );
    return result;
  }

  //finer control on how to place things
  createDivNode(id?: string | undefined, classes?: string, location?: string):HTMLDivElement {

    console.log("placing ",id);
    if (id && location && this.custom_placement[id]) {

      location = this.custom_placement[id];
      console.log("placing id elsewhere: ",id,'at location ',location);
    }
    return super.createDivNode(id,classes,location);
  }


  updateTokenDisplayInfo(tokenDisplayInfo: TokenDisplayInfo) {
    // override to generate dynamic tooltips and such
    if (tokenDisplayInfo.mainType == "card") {
      tokenDisplayInfo.imageTypes += " infonode";
      tokenDisplayInfo.tooltip =
        (tokenDisplayInfo.ac ? "(" + this.getTr(tokenDisplayInfo.ac) + ")<br>" : "") +
        this.getTr(tokenDisplayInfo.text) +
        "<br>" +
        _("Number: " + tokenDisplayInfo.num) +
        (tokenDisplayInfo.tags ? "<br>" + _("Tags: " + tokenDisplayInfo.tags) : "");
    }

    if (this.isLocationByType(tokenDisplayInfo.key)) {
      tokenDisplayInfo.imageTypes += " infonode";
    }
  }


  sendActionResolve(op: string, args?: any) {
    if (!args) args = {};
    this.ajaxuseraction("resolve", {
      ops: [{ op: op, ...args }],
    });
  }

  sendActionDecline(op: string) {
    this.ajaxuseraction("decline", {
      ops: [{ op: op }],
    });
  }
  sendActionSkip() {
    this.ajaxuseraction("skip", {});
  }

  getButtonNameForOperation(op: any) {
    if (op.typeexpr) return this.getButtonNameForOperationExp(op.typeexpr);
    else return this.getButtonNameForOperationExp(op.type);
  }

  getButtonNameForOperationExp(opex: any) {
    if (typeof opex !== "object") {
      const op = opex;
      const rules = this.getRulesFor("op_" + op, "*");
      if (rules && rules.name) return this.getTr(rules.name);
      return op;
    }

    const xop = opex[0] ?? "!";

    if (xop != "!") {
      // multiplier

      const count = opex[2];
      const mincount = opex[1];
      if (count == 1) return opex;
      const name = this.getButtonNameForOperationExp(opex[3]);
      return this.format_string_recursive("${op} x ${count}", {
        op: name,
        count: count,
      });
    }

    return opex; // XXX create combined
  }
  getOperationRules(opInfo: string | Operation) {
    if (typeof opInfo == "string") return this.getRulesFor("op_" + opInfo, "*");
    return this.getRulesFor("op_" + opInfo.type, "*");
  }

  onUpdateActionButtons_playerConfirm(args) {
    this.addActionButton("button_0", _("Confirm"), () => {
      this.ajaxuseraction("confirm");
    });
  }

  onUpdateActionButtons_playerTurnChoice(args) {
    let operations = args.operations;
    this.clientStateArgs.call = "resolve";
    this.clientStateArgs.ops = [];
    this.clientStateArgs.index = 0;
    this.reverseIdLookup = new Map<String, any>();
    const single = Object.keys(operations).length == 1;

    for (const opId in operations) {
      const opInfo = operations[opId];
      const rules = this.getRulesFor("op_" + opInfo.type, "*");
      const name = this.getButtonNameForOperation(opInfo);

      if (rules && rules.params) {
        const param_name = rules.params.split(",")[0]; // XXX can be more than one
        const opargs = args.operations[opId].args;
        const paramargs = opargs[param_name];
        if (!paramargs) {
          console.error(`Missing ${param_name} arg in args for ${opInfo.type}`);
        }
        this.setActiveSlots(paramargs);
        paramargs.forEach((tid: string) => {
          this.reverseIdLookup.set(tid, {
            op: opId,
            param_name: param_name,
          });
        });
        if (single) {
          this.setDescriptionOnMyTurn(rules.prompt);
        } else
          this.addActionButton("button_" + opId, name, () => {
            this.clientStateArgs.ops[this.clientStateArgs.index] = {
              op: opId,
            };
            const clstate = "client_" + opInfo.type;

            this.setClientStateUpdOn(
              clstate,
              (args) => {
                // on update action buttons
                this.setDescriptionOnMyTurn(rules.prompt);
                this.setActiveSlots(paramargs);
              },
              (id: string) => {
                // onToken
                this.clientStateArgs.ops[this.clientStateArgs.index][param_name] = id;
                this.ajaxuseraction(this.clientStateArgs.call, this.clientStateArgs);
              }
            );
          });
      } else {
        this.addActionButton("button_" + opId, name, () => {
          this.sendActionResolve(opId);
        });
      }
      // add done (skip)
      if (single) {
        if (opInfo.mcount <= 0)
          this.addActionButton("button_skip", _("Stop Here"), () => {
            this.sendActionSkip();
          });
      }
    }
  }

  clientCollectParams(opInfo, param_name) {
    if (param_name == "payment") {
      // get id of the selected card
      const id = this.clientStateArgs.ops[this.clientStateArgs.index].target;
      // get cost
      const cost = this.getRulesFor(id, "cost");
      // check if can be auto
      const auto = true;
      // create payment prompt
      const clstate = "client_payment";
      this.setClientStateUpdOn(
        clstate,
        (args) => {
          // on update action buttons

          this.setDescriptionOnMyTurn(_("Confirm payment") + ": " + this.getButtonNameForOperationExp(["/", cost, cost, "nm"]));
          this.addActionButton("button_confirm", _("Confirm"), () => {
            this.clientStateArgs.ops[this.clientStateArgs.index].payment = "auto";
            this.ajaxuseraction(this.clientStateArgs.call, this.clientStateArgs);
          });
        },
        (id: string) => {
          // onToken
          this.clientStateArgs.ops[this.clientStateArgs.index][param_name] = id;
          this.ajaxuseraction(this.clientStateArgs.call, this.clientStateArgs);
        }
      );
    } else {
      throw new Error("Not supported param: " + param_name);
    }
  }

  onUpdateActionButtons_after(stateName: string, args: any): void {
    if (this.isCurrentPlayerActive()) {
      // add undo on every state
      if (this.on_client_state) this.addCancelButton();
      else this.addActionButton("button_undo", _("Undo"), () => this.ajaxcallwrapper("undo"), undefined, undefined, "red");
    }
  }

  // on click hooks
  onToken_playerTurnChoice(tid: string) {
    const info = this.reverseIdLookup.get(tid);
    if (info) {
      let index = this.clientStateArgs.index ?? 0;
      this.clientStateArgs.index = index;
      let curload = this.clientStateArgs.ops[index] ?? undefined;
      if (curload && curload.op != info.op) {
        this.clientStateArgs.index++;
        index = this.clientStateArgs.index;
        curload = this.clientStateArgs.ops[index];
      }
      if (!curload) curload = this.clientStateArgs.ops[index] = { op: info.op };

      curload[info.param_name] = tid;
      const opInfo = this.gamedatas.gamestate.args.operations[info.op];
      const rules = this.getOperationRules(opInfo);
      if (rules.params != info.param_name) {
        // more params
        const params = rules.params.split(",");
        const curindex = params.indexOf(info.param_name);
        const nextparam = params[curindex + 1];
        this.clientCollectParams(opInfo, nextparam);
      } else {
        this.ajaxuseraction(this.clientStateArgs.call, this.clientStateArgs);
      }
    }
  }

  // notifications
  setupNotifications(): void {
    super.setupNotifications();
  }
}

class Operation {
  type: string;
}
