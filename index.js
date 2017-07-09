"use strict";

module.exports = function (md, options) {

  function parseVariableBlock(state, startLine, endLine, silent) {

    var ch, tmp,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

    if (pos >= max) {
      return false;
    }

    ch = state.src.charCodeAt(pos);

    if (ch !== 0x24/* # */ || pos >= max) {
      return false;
    }

    ch = state.src.charCodeAt(++pos);
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

  function parsePlaceholderBlock(state, startLine, endLine, silent) {

    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    const REGEX = /^{{([^}{]*)}}$/;

    if (!state.src.slice(pos, max).match(REGEX)) {
      return false
    }

    state.line = startLine + 1;

    state.tokens.push({
      type: 'placeholder',
      content: state.src.slice(pos, max).trim(),
      lines: [startLine, state.line],
    });

    return true;

  }

  function parseCommentBlock(state, startLine, endLine, silent) {

    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    const REGEX = /^\/\/\s(.*)$/;

    if (!state.src.slice(pos, max).match(REGEX)) {
      return false
    }

    state.line = startLine + 1;

    // state.tokens.push({
    //   type: 'comment',
    //   content: state.src.slice(pos, max).trim(),
    //   lines: [startLine, state.line],
    // });

    return true;

  }


  md.block.ruler.before('code', 'variable', parseVariableBlock, options);
  md.block.ruler.before('code', 'placeholder', parsePlaceholderBlock, options);
  md.block.ruler.before('code', 'commend', parseCommentBlock, options);

};