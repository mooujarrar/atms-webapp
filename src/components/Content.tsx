import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { AiOutlineDisconnect } from "@react-icons/all-files/ai/AiOutlineDisconnect";
import { ImEnter } from "@react-icons/all-files/im/ImEnter";
import { ImExit } from "@react-icons/all-files/im/ImExit";
import './Content.scss'
import logo from '../assets/app-icon.png'; // Tell webpack this JS file uses this image
import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { FAKE_ENTRIES } from '../data/fake_sink';
import { IEntry } from '../model/Entry';


function Content() {
    const [entries, setEntries] = useState<IEntry[]>([]);
    const [socketUrl, setSocketUrl] = useState(`ws://${window.location.hostname}/ws`);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const isFake = false;
    useEffect(() => {
        if (lastMessage !== null) {
            setEntries((JSON.parse(lastMessage.data) as IEntry[]).sort((a, b) => (a.date > b.date ? -1 : 1)));
        }
        if (isFake) {
            setEntries(FAKE_ENTRIES.sort((a, b) => (a.date > b.date ? -1 : 1)));
        }
    }, [lastMessage, setEntries, isFake]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const onResetClicked = useCallback(() => sendMessage('reset_db'), []);

    return (
        <div className="app">
            <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary header">
                <Container>
                    <Navbar.Brand href="#">
                        <img
                            alt="App Icon"
                            src={logo}
                            width="50"
                            height="50"
                            className="d-inline-block align-center logo"
                        />{' '}Attendance System
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <div className="content d-flex flex-column">
                {/*<div className="status">Connection state to the Hardware: {connectionStatus}</div>*/}
                <div className="table-container">
                    {(readyState === ReadyState.OPEN || isFake) ?
                        <div style={{ width: "100%" }}>
                            <Table striped bordered variant="dark">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tag</th>
                                        <th>Date</th>
                                        <th>Direction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((listValue, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>{listValue.tag}</td>
                                                <td>{new Date(listValue.date * 1000).toLocaleDateString()} - {new Date(listValue.date * 1000).toLocaleTimeString()}</td>
                                                <td>{listValue.direction === 0 ?
                                                    <ImEnter style={{ width: "48px", height: "48px" }} />
                                                    : <ImExit style={{ width: "48px", height: "48px" }} />}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                            <div className='actions'>
                                <Button variant="light" onClick={onResetClicked}>Reset entries</Button>
                            </div>
                        </div> :
                        <div className="d-flex flex-column align-items-center">
                            {
                                readyState === ReadyState.CONNECTING ?
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        role="status"
                                        aria-hidden="true"
                                        variant="primary"
                                    /> : <AiOutlineDisconnect style={{ color: "#B71C1C" }} size="3em" />
                            }
                            <span style={{ color: readyState === ReadyState.CLOSED ? "#B71C1C" : "white", fontWeight: "bold" }}>{connectionStatus}</span>
                        </div>
                    }
                </div>
            </div>
            <div>
                <h5 className='d-flex justify-content-end px-2'>
                    <Badge bg="dark">Created by: Mohyiddine Oujarrar, 2023</Badge>
                </h5>
            </div>
        </div>
    );
}

export default Content;
