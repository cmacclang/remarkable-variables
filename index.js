"use strict";

module.exports = function (md, options) {

  function parseBlock(state, startLine, endLine, silent) {

    var ch, level, tmp,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

    if (pos >= max) {
      return false;
    }

    ch  = state.src.charCodeAt(pos);

    if (ch !== 0x24/* # */ || pos >= max) {
      return false;
    }

    // count heading level
    ch = state.src.charCodeAt(++pos);
    while (ch === 0x24/* # */ && pos < max && level <= 6) {
      ch = state.src.charCodeAt(++pos);
    }

    if (pos < max && ch !== 0x20/* space */) {
      return false;
    }

    if (silent) {
      return true;
    }

    max = state.skipCharsBack(max, 0x20, pos); // space
    tmp = state.skipCharsBack(max, 0x24, pos); // #
    if (tmp > pos && state.src.charCodeAt(tmp - 1) === 0x20/* space */) {
      max = tmp;
    }

    state.line = startLine + 1;

    if (pos < max) {
      md.variables = md.variables || [];
      md.variables.push(state.src.slice(pos, max).trim());
    }

    return true;

  }

  md.block.ruler.before('code', 'variable', parseBlock, options);

};