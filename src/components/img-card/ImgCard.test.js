import React from 'react';
import { render, cleanup } from 'react-testing-library'
import ImgCard from './ImgCard';

afterEach(cleanup);

it('renders header without crashing', () => {
    render(<ImgCard src='some url' />);
});

it('renders crashing', () => {
    const { getByTestId } = render(<ImgCard src='some url' />);
    const element = getByTestId('image');
    expect(element.className).toEqual('ImgCard-img');
});