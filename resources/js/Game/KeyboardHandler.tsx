import { useInterfaceState } from "@/Store/interface_state";
import { KeyboardControls, KeyboardControlsEntry, useKeyboardControls } from "@react-three/drei";
import { PropsWithChildren, useEffect } from "react";

enum Controls {
    rotateLeft = 'rotateLeft',
    flip = 'flip',
    rotateRight = 'rotateRight',
  }

type Props = PropsWithChildren

const controls: KeyboardControlsEntry<Controls>[] = [
    { name: Controls.rotateLeft, keys: ['ArrowLeft', 'KeyL'] },
    { name: Controls.flip, keys: ['ArrowDown', 'ArrowUp','KeyF'] },
    { name: Controls.rotateRight, keys: ['ArrowRight', 'KeyR'] },
  ]

export const KeyboardHandler = ({children}: Props) => {
    return (
        <>
            <KeyboardControls map={controls}>
             <KeyboardConsumer>
                 {children}
             </KeyboardConsumer>
            </KeyboardControls>
        </>
    );
};

const KeyboardConsumer = ({children}: Props) => {
    const [sub, get] = useKeyboardControls<Controls>()
    const setAction = useInterfaceState(s=>s.setAction);
    useEffect(() => {

        return sub(
            (state) => state,
            (pressed) => {
                if(pressed.flip){
                    setAction('flip');
                }else if(pressed.rotateLeft){
                    setAction('rotate_pos');
                }else if(pressed.rotateRight){
                    setAction('rotate_neg');
                }
            }
        )

    }, [])
    return (
        <>
        {children}
        </>
    );
};
