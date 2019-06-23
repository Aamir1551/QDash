function qtable(numStates, numActions) {
  this.table = new Array(numStates).fill(0).map(a=>new Array(numActions).fill(0));
}

qtable.prototype.updateCell = function(l_r, gamma, reward, state, action, newState) {
  this.table[state][action] += l_r * (reward + gamma * Math.max(...this.table[newState]) - this.table[state][action]);
}

qtable.prototype.getBestActionForState = function(state, legalActions) {
  let bestActionIndex = -1;
  let maxExpectedReward = Number.NEGATIVE_INFINITY;
  for(let i=0; i<legalActions.length; i++) {
    if(this.table[state][legalActions[i]] > maxExpectedReward) {
      bestActionIndex = legalActions[i];
      maxExpectedReward = this.table[state][legalActions[i]];
    }

  }
  return bestActionIndex;
}

//actionMap is an array of the actions that can be done
function agent(_actionMap, _getStateID) {
  this.state = []
  this.actionMap = _actionMap;
  this.getStateID = _getStateID;
}

//actionProbs is an array contianing probability of actions
agent.prototype.chooseRandomAction = function() {
  let legalActions = this.getLegalActions();
  return legalActions[Math.floor(Math.random() * legalActions.length)]
}

agent.prototype.getLegalActions = function() {
  return this.actionMap(this.state.toString());
}

actionMap = function(state) {return ['0', '1', '2']};
let g = Math.floor(431/20);
getStateID = function(state) { return Math.floor(state[0]/20)+(state[1] - 420)*g+Math.floor(state[2]/20)*g*7+Math.floor(state[3]/20)*g*7*g}; 
