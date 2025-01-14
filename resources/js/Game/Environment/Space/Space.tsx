import {memo} from 'react';
import {Stars} from './Stars';
import {Planets} from './Planets';
import { Nebula } from './Nebula';

export const Space = memo(() => {
    return (
        <>
            <Stars />
            <Planets />
            <Nebula />
        </>
    );
});
