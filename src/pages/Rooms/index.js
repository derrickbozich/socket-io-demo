import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import styles from './RoomsPage.css';
import ControlsDrawer from '../controls/ControlsDrawer';
import { useMatterCollab } from '../app/hooks/useMatterCollab';
import { makeStyles } from '@material-ui/core/styles';
import {
    Fade,
    Modal,
    Fab,
    Drawer,
    Button,
    IconButton,
} from '@material-ui/core';
import Chat from '../Chat/Chat';
import DrawingRoom from './DrawingRoom';
import SoloModal from './SoloModal';
import HelpIcon from '@material-ui/icons/Help';
import copy from 'copy-to-clipboard';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 400,
        backgroundColor: 'transparent',
        border: '10px solid ',
        borderImage: ' linear-gradient(45deg, #FFCED8, #D4BEEE ) 100 10%',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    logo: {
        width: '100%',
    },
    dotContainer: {
        width: '50%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    dots: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'lightgrey',
    },
    dotFilled: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#FFCED8',
    },
    inlineChat: {
        position: 'static',
    },
    button: {
        backgroundImage: 'url(begin.png)',
        margin: '.5rem',
    },
    plastic: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        maxHeight: '100vh',
        border: '10px solid ',
        borderImage: ' linear-gradient(45deg, #FFCED8, #D4BEEE ) 100 10%',
    },
}));

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const RoomsPage = ({ userId }) => {
    const classes = useStyles();
    const { room, roomId } = useParams();
    const history = useHistory();

    let canvasX, canvasY;

    if (room === 'collab') {
        canvasX = window.innerWidth;
        canvasY = window.innerHeight;
    } else {
        canvasX = window.innerWidth;
        canvasY = window.innerHeight;
    }

    const noFriendButStillCool = room === 'solo';

    const [soloOpen, setSoloOpen] = useState(noFriendButStillCool);
    const [clipboard, setClipboard] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [drawerView, setDrawerView] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setDrawerView(open);
    };

    const {
        sceneRef,
        bodyControls,
        pause,
        gravity,
        reverbAmount,
        vibe,
        participants,
        open,
        users,
        handleBodyControls,
        handleSettingTheVibe,
        handleReverbChange,
        handleGravityChange,
        handlePause,
        handleUndo,
        handleStatic,
        handleLoop,
        handleBegin,
        handleUserColor,
        handleClearAll,
    } = useMatterCollab({
        noFriendButStillCool,
        canvasX,
        canvasY,
        roomId,
        userId,
    });

    const handleClipboard = () => {
        copy(`https://socketjockey-dev.netlify.app${history.location.pathname}`);
        setClipboard(true);
    };

    return (
        <main>
            {room === 'collab' && !open && (
                <Fade in={!open} timeout={{ enter: 2500, exit: 600 }}>
                    <header className={styles.header}>
                        <IconButton
                            style={{ position: 'absolute', left: '.5rem', top: '.5rem' }}
                            onClick={() => setSoloOpen(true)}
                        >
                            <HelpIcon />
                            {/* </Fade> */}
                        </IconButton>
                        {/* <Fade in={!open} timeout={{ enter: 2500, exit: 600 }}> */}
                        <ControlsDrawer
                            color={users[userId]}
                            handleBodyControls={handleBodyControls}
                            bodyControls={bodyControls}
                            maxCanvas={canvasX}
                            handleUndo={handleUndo}
                            pause={pause}
                            handlePause={handlePause}
                            gravity={gravity}
                            handleGravityChange={handleGravityChange}
                            vibe={vibe}
                            handleSettingTheVibe={handleSettingTheVibe}
                            reverbAmount={reverbAmount}
                            handleReverbChange={handleReverbChange}
                            handleStatic={handleStatic}
                            handleLoop={handleLoop}
                            handleClearAll={handleClearAll}
                        />
                    </header>
                </Fade>
            )}
            {room === 'collab' && !open && (
                <Fade in={!open} timeout={{ enter: 2500, exit: 600 }}>
                    <Chat color={users[userId]} />
                </Fade>
            )}
            <Modal
                open={room === 'collab' && open}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                hideBackdrop={true}
            >
                <Fade in={open} timeout={{ enter: 5800, exit: 600 }}>
                    <div style={modalStyle} className={classes.paper}>
                        <img
                            src="https://i.imgur.com/CZrIZin.png"
                            alt=""
                            className={classes.logo}
                        />
                        <section
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <Fab
                                variant="round"
                                onClick={() => {
                                    handleUserColor('#FB998E');
                                }}
                                disabled={Object.values(users).includes('#FB998E')}
                                style={{
                                    backgroundColor: '#FB998E',
                                    margin: '1rem',
                                }}
                            >
                                {' '}
                            </Fab>
                            <Fab
                                variant="round"
                                onClick={() => {
                                    handleUserColor('#A3E5FF');
                                }}
                                disabled={Object.values(users).includes('#A3E5FF')}
                                style={{
                                    backgroundColor: '#A3E5FF',
                                    margin: '1rem',
                                }}
                            >
                                {' '}
                            </Fab>
                            <Fab
                                variant="round"
                                onClick={() => {
                                    handleUserColor('#D4BEEE');
                                }}
                                disabled={Object.values(users).includes('#D4BEEE')}
                                style={{
                                    backgroundColor: '#D4BEEE',
                                    margin: '1rem',
                                }}
                            >
                                {' '}
                            </Fab>
                        </section>
                        <img
                            src="https://i.imgur.com/6j7l3kL.png"
                            alt=""
                            className={classes.logo}
                        />
                        {roomId && (
                            <div className={styles.shareLink}>
                                <Button onClick={handleClipboard} style={{ color: 'black' }}>
                                    {!clipboard
                                        ? 'share your custom room link'
                                        : 'copied to clipboard!'}
                                </Button>
                            </div>
                        )}
                        <section className={classes.dotContainer}>
                            <div className={classes.dotFilled}></div>
                            <div
                                className={participants >= 2 ? classes.dotFilled : classes.dots}
                            ></div>
                            <div
                                className={
                                    participants === 3 ? classes.dotFilled : classes.dots
                                }
                            ></div>
                        </section>
                        <img
                            onClick={handleBegin}
                            src="/begin.png"
                            alt="begin session"
                            style={{
                                marginTop: '2rem',
                                width: '25%',
                                cursor: 'pointer',
                            }}
                        />
                        <Button onClick={toggleDrawer(true)}>
                            <img
                                src="https://i.imgur.com/vV1M5YO.png"
                                alt="open drawing canvas"
                                style={{
                                    width: '50%',
                                    cursor: 'pointer',
                                }}
                            />
                        </Button>
                        <Drawer
                            anchor={'left'}
                            open={drawerView}
                            onClose={toggleDrawer(false)}
                            style={{
                                opacity: '0.8',
                                width: '50%',
                                height: '200px',
                            }}
                        >
                            <DrawingRoom />
                        </Drawer>
                    </div>
                </Fade>
            </Modal>
            <SoloModal
                soloOpen={soloOpen}
                setSoloOpen={setSoloOpen}
                room={room}
                classes={classes}
                modalStyle={modalStyle}
            />
            <section
                ref={sceneRef}
                className={room === 'solo' ? styles.solo : styles.collab}
            ></section>
        </main>
    );
};

RoomsPage.propTypes = {
    userId: PropTypes.string.isRequired,
};
export default RoomsPage;