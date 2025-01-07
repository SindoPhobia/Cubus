import useUserEvents from '@/Connection/useUserEvents';
import { Portrait } from '@/Icons/Portrait';
import { Icon } from '@/Icons/SVG';
import { Button } from '@/Inputs/Button';
import { List, ListElement } from '@/Inputs/List';
import { RadioButton } from '@/Inputs/RadioButton';
import { TextInput } from '@/Inputs/TextInput';
import { Popup, PopupContainer } from '@/Popup';
import { PageProps } from '@/types';
import { User } from '@/types/models/tables/User';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

export default function Welcome({ user, flash }: PageProps<{ user: User }>) {
    let { connectionState } = useUserEvents();
    let [ mockId, setMockId ] = useState('');

    console.log('INITIAL: ', {window, route: route('index')});

    let UserData = () => (
        <div>
            <h2 className="font-black text-xl">User Info</h2>
            <p>{ user.name }</p>
            {
                user.icon && (
                    <div>
                        <p>Icon Preview</p>
                        <img src={user.icon} className='object-cover w-[128px] h-[128px]' />
                    </div>
                )
            }

            <a href={route('logout')}>Logout</a>
        </div>
    );

    return (
        <div className='p-8'>
            <div className='pb-16'>
                <h1 className='font-black text-3xl'>Lord of the Rings Card Game</h1>
                <p>Connection: {connectionState}</p>
                { user && <UserData /> }
            </div>

            {
                flash &&
                <div>
                    <p className='text-red-500'>{ flash }</p>
                </div>
            }

            <p className='font-black text-lg'>Navigate to:</p>
            <ul className='list-["-"] list-inside'>
                <li><a
                    href={`${import.meta.env.VITE_APPS_LOGIN}&state=${location.pathname}`}
                    target='_blank'
                    className='text-blue-600'>
                    Login
                </a></li>

                <li>
                    <input placeholder='mock id' value={mockId} onChange={(e) => setMockId(e.target.value)} />
                    <a href={route('login.mock', mockId)} className='text-blue-600'>Mock Login</a>
                </li>

                { user &&
                    <Fragment>
                        <li><a href={route('profile.edit', {profile: user.name })} className='text-blue-600'>Edit</a></li>
                        <li><a href={route('lobby.index')} className='text-blue-600'>Lobbies</a></li>
                    </Fragment>
                }
            </ul>

            <div className='flex flex-col gap-2'>
                <Button text='Hello World' icon={Icon.play} />
                <Button text='Hello World' color='red' />
                <Button color='red' icon={Icon.xmark} />
                <TextInput placeholder='Test' />
                <RadioButton name='test' value='value1' label='Value 1' />
                <RadioButton name='test' value='value2' label='Value 2' />
                <List title='Funky List' onClick={(value) => console.log(value)}>
                    <ListElement value='test'><p>Cringe</p></ListElement>
                    <ListElement value='test 2'><p>Cringe 2</p></ListElement>
                </List>

                <Portrait url="/portraits/white-wizard.jpg" />
            </div>

            <PopupContainer />
        </div>
    );
}
