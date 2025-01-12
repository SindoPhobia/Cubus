import {PIECE_GEOMETRY} from '@/Constants/geometries';
import {useBoardState} from '@/Store/board_state';
import {useGameDimensions} from '@/Store/game_dimensions';
import {PieceMaterialComponent} from '../Piece/PieceModel';
import {COLORS} from '@/Constants/colors';

export const BoardPlacedPieces = () => {
    const blockSize = useGameDimensions(state => state.blockSize);
    const placedPieces = useBoardState(s => s.gameState.board_state);
    const addBoardPiece = useBoardState(state => state.addBoardPiece);

    return (
        <>
            {(placedPieces ?? []).map((position, index) => {
                return (
                    <group
                        ref={_ref => {
                            if (_ref) {
                                addBoardPiece(_ref);
                            }
                        }}
                        key={index}>
                        <mesh
                            key={index}
                            position={[
                                (position.x - blockSize) / 2 - 3,
                                0.2,
                                (position.y - blockSize) / 2 - 3,
                            ]}
                            geometry={PIECE_GEOMETRY['block']}>
                            <PieceMaterialComponent
                                playerColor={position.data}
                                enableGlow={false}
                                color={COLORS[position.data]}
                            />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
};
