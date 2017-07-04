const assert = require('assert');

const Remarkable = require('remarkable');
const RemarkableVariables = require('./index');
const md = new Remarkable();
md.use(RemarkableVariables);


describe('remarkable-variables', () => {


  it('one variable in heading', () => {

    md.variables = [];

    const text = `$ world = "world"

# Hello {{world}}
`;

    const res = md.parse(text, {});

    console.log(res)

    assert.deepEqual("heading_open", res[0].type);

    assert.deepEqual("inline", res[1].type);
    assert.deepEqual("Hello {{world}}", res[1].content);

    assert.deepEqual("heading_close", res[2].type);

    assert.equal(1, md.variables.length);
    assert.deepEqual("world = \"world\"", md.variables[0]);
  });

  it('two variable in paragraph', () => {

    md.variables = [];

    const text = `$ hello = "Hello"

$ world = "world"

{{hello}} {{world}}
`;

    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.deepEqual(res[0].type, "paragraph_open");

    assert.deepEqual(res[1].type, "inline");
    assert.deepEqual(res[1].content, "{{hello}} {{world}}");

    assert.deepEqual(res[2].type, "paragraph_close");

    assert.equal(md.variables.length, 2);
    assert.deepEqual(md.variables[0], 'hello = \"Hello\"');
    assert.deepEqual(md.variables[1], 'world = \"world\"');
  });

  it('three variable in block quore', () => {

    md.variables = [];

    const text = `$ hello = "Hello"

$ world = "world"

> {{hello}} {{world}} {{today}}

$ today = "today"
`;

    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.deepEqual(res[0].type, "blockquote_open");

    assert.deepEqual(res[2].type, "inline");
    assert.deepEqual(res[2].content, "{{hello}} {{world}} {{today}}");

    assert.deepEqual(res[4].type, "blockquote_close");

    assert.equal(md.variables.length, 3);
    assert.deepEqual(md.variables[0], 'hello = \"Hello\"');
    assert.deepEqual(md.variables[1], 'world = \"world\"');
    assert.deepEqual(md.variables[2], 'today = \"today\"');
  });

  it('no space', () => {

    md.variables = [];

    const text = `# test 1
$ hello = "Hello"
$ world = "world"
{{hello}} {{world}}
# test 2
$ today = "today"
Test text
`;

    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.deepEqual(res[0].type, "heading_open");

    assert.deepEqual(res[3].type, "paragraph_open");
    assert.deepEqual(res[4].type, "inline");
    assert.deepEqual(res[4].content, "{{hello}} {{world}}");
    assert.deepEqual(res[5].type, "paragraph_close");

    assert.deepEqual(res[6].type, "heading_open");

    assert.deepEqual(res[9].type, "paragraph_open");
    assert.deepEqual(res[10].type, "inline");
    assert.deepEqual(res[10].content, "Test text");
    assert.deepEqual(res[11].type, "paragraph_close");

    assert.equal(md.variables.length, 3);
    assert.deepEqual(md.variables[0], 'hello = \"Hello\"');
    assert.deepEqual(md.variables[1], 'world = \"world\"');
    assert.deepEqual(md.variables[2], 'today = \"today\"');
  });

  it('placeholder', () => {

    md.variables = [];

    const text = `{{world}}`;

    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.deepEqual(res[0].type, "placeholder");

  });


});