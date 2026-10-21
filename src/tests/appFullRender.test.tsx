import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';

describe('App Full Mount Verification', () => {
  it('renders <App /> to string without crashing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('DivyaJyoti');
    console.log('App HTML length:', html.length);
  });
});
