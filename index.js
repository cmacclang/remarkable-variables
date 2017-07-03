"use strict";

module.exports = function (md, options) {

  function parseBlock(state, startLine, endLine, silent) {

    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];

    if (pos >= max) {
      return false;
    }

    var ch = state.src.charCodeAt(pos);

    if (ch !== 0x24/* # */ || pos >= max) {
      return false;
    }

    // count heading level
    var level = 1;
    ch = state.src.charCodeAt(++pos);
    while (ch === 0x24/* # */ && pos < max && level <= 6) {
      level++;
      ch = state.src.charCodeAt(++pos);
    }

    if (level > 6 || (pos < max && ch !== 0x20/* space */)) {
      return false;
    }

    if (silent) {
      return true;
    }

    // Let's cut tails like '    ###  ' from the end of string
    max = state.skipCharsBack(max, 0x20, pos); // space
    const tmp = state.skipCharsBack(max, 0x24, pos); // #
    if (tmp > pos && state.src.charCodeAt(tmp - 1) === 0x20/* space */) {
      max = tmp;
    }

    state.line = startLine + 1;

    // only if header is not empty
    if (pos < max) {

      md.variables = md.variables || [];
      const content = state.src.slice(pos, max).trim()
      md.variables.push(state.src.slice(pos, max).trim());
    }

    return true;

  }

  md.block.ruler.before('code', 'variable', parseBlock, options);

};