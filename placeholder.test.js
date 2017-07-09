const assert = require('assert');

const Remarkable = require('remarkable');
const RemarkableVariables = require('./index');
const md = new Remarkable();
md.use(RemarkableVariables);


describe('remarkable-variables', () => {



  it('placeholder', () => {

    md.variables = [];

    const text = `{{world}}`;

    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.equal(res.length, 1);

    assert.deepEqual(res[0].type, "placeholder");
    assert.deepEqual(res[0].content, "{{world}}");
    assert.deepEqual(res[0].variable, "world");

  });

  it('header and placeholder', () => {

    md.variables = [];

    const text = `# Test

{{world}}`;

    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.equal(res.length, 4);

    assert.deepEqual(res[0].type, "heading_open");
    assert.deepEqual(res[1].type, "inline");
    assert.deepEqual(res[2].type, "heading_close");
    assert.deepEqual(res[3].type, "placeholder");
    assert.deepEqual(res[3].content, "{{world}}");
    assert.deepEqual(res[3].variable, "world");

  });

  it('inline and placeholder', () => {

    const text = `# Test {{world}}`;
    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.equal(res.length, 3);
    assert.equal(res[1].children.length, 2);

    assert.equal(res[0].type, 'heading_open');

    assert.equal(res[1].type, 'inline');
    assert.equal(res[1].children[0].type, 'text');
    assert.equal(res[1].children[0].content, 'Test ');
    assert.equal(res[1].children[1].type, 'placeholder');
    assert.equal(res[1].children[1].content, '{{world}}');
    assert.equal(res[1].children[1].variable, 'world');

    assert.equal(res[2].type, 'heading_close');

  });

  it('inline and placeholder', () => {

    const text = `# Test {{hello}} {{world}}`;
    const res = md.parse(text, {});

    console.log(res)
    console.log(md.variables)

    assert.equal(res.length, 3);

    assert.equal(res[0].type, 'heading_open');
    assert.equal(res[1].children.length, 3);

    assert.equal(res[1].type, 'inline');
    assert.equal(res[1].children[0].type, 'text');
    assert.equal(res[1].children[0].content, 'Test ');
    assert.equal(res[1].children[1].type, 'placeholder');
    assert.equal(res[1].children[1].content, '{{hello}}');
    assert.equal(res[1].children[1].variable, 'hello');
    assert.equal(res[1].children[2].type, 'placeholder');
    assert.equal(res[1].children[2].content, '{{world}}');
    assert.equal(res[1].children[2].variable, 'world');

    assert.equal(res[2].type, 'heading_close');

  });



});