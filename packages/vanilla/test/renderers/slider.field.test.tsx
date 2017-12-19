import '../helpers/setup';
import * as React from 'react';
import test from 'ava';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  initJsonFormsStore,
  JsonForms,
  JsonSchema,
  update
} from '@jsonforms/core';
import SliderField, { sliderFieldTester } from '../../src/fields/slider.field';
import HorizontalLayoutRenderer from '../../src/layouts/horizontal.layout';
import {
  change,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from '../helpers/binding';
import { Provider } from 'react-redux';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]);
});

test.beforeEach(t => {
  t.context.data = {'foo': 5};
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        maximum: 10,
        minimum: 2
      },
    },
  };
  t.context.uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo',
    }
  };
});

test.failing('autofocus on first element', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            firstSliderField: { type: 'number', minimum: 5, maximum: 10 },
            secondSliderField: { type: 'number', minimum: 5, maximum: 10 }
        }
    };
    const firstControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/firstSliderField'
        },
        options: {
            focus: true
        }
    };
    const secondControlElement: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/secondSliderField'
        },
        options: {
            focus: true
        }
    };
    const uischema: HorizontalLayout = {
        type: 'HorizontalLayout',
        elements: [
            firstControlElement,
            secondControlElement
        ]
    };
    const data = {
        'firstSliderField': 3.14,
        'secondSliderField': 5.12
    };
    const store = initJsonFormsStore(
        data,
        schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
          <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
        </Provider>
    );

    const inputs = scryRenderedDOMElementsWithTag(tree, 'input');
    t.not(document.activeElement, inputs[0]);
    t.is(document.activeElement, inputs[1]);
});

test('autofocus active', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        options: {
            focus: true
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <SliderField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        options: {
            focus: false
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <SliderField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('autofocus inactive by default', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <SliderField schema={t.context.schema} uischema={uischema}/>
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.autofocus);
});

test('tester', t => {
  t.is(sliderFieldTester(undefined, undefined), -1);
  t.is(sliderFieldTester(null, undefined), -1);
  t.is(sliderFieldTester({type: 'Foo'}, undefined), -1);
  t.is(sliderFieldTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong schema type', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    sliderFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          }
        }
      }
    ),
    -1
  );
});

test('tester with wrong schema type, but sibling has correct one', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    sliderFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'number'
          }
        }
      }
    ),
    -1
  );
});

test('tester with correct schema type, but missing maximum and minimum fields', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    sliderFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number'
          }
        }
      }
    ),
    -1
  );
});

test('tester with correct schema type, but missing maximum', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    sliderFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            minimum: 2
          }
        }
      }
    ),
    -1
  );
});

test('tester with correct schema type,but missing minimum', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    sliderFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10
          }
        }
      }
    ),
    -1
  );
});

test('tester with matching schema type (number)', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    sliderFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10,
            minimum: 2
          }
        }
      }
    ),
    4
  );
});

test('tester with matching schema type (integer)', t => {
  const control: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  t.is(
    sliderFieldTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'integer',
            maximum: 10,
            minimum: 2
          }
        }
      }
    ),
    4
  );
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        maximum: 10,
        minimum: 2
      }
    }
  };
  const store = initJsonFormsStore({ 'foo': 5 }, schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={schema} uischema={t.context.uischema}/>
    </Provider>
  );

  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'range');
  t.is(input.value, '5');
});

test('update via input event', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  input.value = '3';
  change(input);
  t.is(getData(store.getState()).foo, 3);
});

test('update via action', t => {
  const store = initJsonFormsStore({ 'foo': 3 }, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '3');
  store.dispatch(update('foo', () => 4));
  setTimeout(() => t.is(input.value, 'Bar'), 4);
});
// FIXME this moves the slider and changes the value
test.failing('update with undefined value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '');
});
// FIXME this moves the slider and changes the value
test.failing('update with null value', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 11));
  t.is(input.value, '5');
});

test('update with null ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 3));
  t.is(input.value, '5');
});

test('update with undefined ref', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  store.dispatch(update(undefined, () => 13));
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '5');
});

test('disable', t => {
  const store = initJsonFormsStore(
    t.context.data,
    t.context.schema,
    t.context.uischema
  );
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema} enabled={false}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <SliderField schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  );
  const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});