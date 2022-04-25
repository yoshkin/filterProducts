// @ts-check

import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import { screen } from '@testing-library/dom';
import testingLibraryUserEvent from '@testing-library/user-event';

import run from '../src/application.js';

const laptops = [
  {
    model: 'v1', processor: 'intel', frequency: 1.7, memory: 16,
  },
  {
    model: 'd3', processor: 'intel', frequency: 3.5, memory: 8,
  },
  {
    model: 'd2', processor: 'amd', frequency: 2.5, memory: 16,
  },
];

const userEvent = testingLibraryUserEvent.default;

beforeEach(() => {
  const initHtml = fs.readFileSync(path.join('__fixtures__', 'index.html')).toString();
  document.body.innerHTML = initHtml;
  run(laptops);
});

test('working process', async () => {
  const result = document.querySelector('.result');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');

  const frequencyMin = await screen.findByLabelText('Frequency Min');
  userEvent.type(frequencyMin, '3');
  expect(result).toHaveTextContent('d3');
  expect(result).not.toHaveTextContent('v1');
  expect(result).not.toHaveTextContent('d2');

  userEvent.clear(frequencyMin);
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');

  userEvent.type(frequencyMin, '4');
  expect(result).toBeEmptyDOMElement();

  userEvent.clear(frequencyMin);
  userEvent.type(frequencyMin, '1');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');

  const frequencyMax = await screen.findByLabelText('Frequency Max');
  userEvent.type(frequencyMax, '2');
  expect(result).toHaveTextContent('v1');
  expect(result).not.toHaveTextContent('d3');
  expect(result).not.toHaveTextContent('d2');

  userEvent.clear(frequencyMin);
  userEvent.clear(frequencyMax);
  const memory = await screen.findByLabelText('Memory');
  userEvent.selectOptions(memory, '16');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d2');
  expect(result).not.toHaveTextContent('d3');
});

test('initial state', async () => {
  const result = document.querySelector('.result');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');
});
