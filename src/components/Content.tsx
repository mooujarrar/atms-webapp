import { Table, Navbar, Container, Badge } from 'react-bootstrap';
import './Content.scss'
import logo from '../assets/app-icon.png'; // Tell webpack this JS file uses this image
import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export interface IEntry {
    tag: string;
    date: number;
    direction: number;
}


function Content() {
    const [entries, setEntries] = useState<IEntry[]>([]);
    const [socketUrl, setSocketUrl] = useState(`ws://${window.location.hostname}/ws`);
    const { lastMessage, readyState } = useWebSocket(socketUrl);
    useEffect(() => {
        console.log('**** Message', lastMessage);
        if (lastMessage !== null) {
            setEntries(JSON.parse(lastMessage.data) as IEntry[]);
        }
    }, [lastMessage, setEntries]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

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
                <div>Connection state to the Hardware: { connectionStatus }</div>
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
                                    <td>{listValue.direction}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <div>
                <h5 className='d-flex justify-content-end'>
                    <Badge bg="dark">Created by: Mohyiddine Oujarrar, 2023</Badge>
                </h5>
            </div>
        </div>
    );
}

export default Content;
