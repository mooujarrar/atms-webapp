import { lazy, Suspense } from 'react';

import { AiOutlineDisconnect } from "@react-icons/all-files/ai/AiOutlineDisconnect";
import { ImEnter } from "@react-icons/all-files/im/ImEnter";
import { ImExit } from "@react-icons/all-files/im/ImExit";
import './Content.scss'
import logo from '../assets/app-icon.png'; // Tell webpack this JS file uses this image
import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { IEntry } from '../model/Entry';

const Table = lazy(() => import('react-bootstrap/Table'));
const Navbar = lazy(() => import('react-bootstrap/Navbar'));
const NavbarBrand = lazy(() => import('react-bootstrap/NavbarBrand'));

const Container = lazy(() => import('react-bootstrap/Container'));
const Badge = lazy(() => import('react-bootstrap/Badge'));
const Spinner = lazy(() => import('react-bootstrap/Spinner'));
const Button = lazy(() => import('react-bootstrap/Button'));
const Tabs = lazy(() => import('react-bootstrap/Tabs'));
const Tab = lazy(() => import('react-bootstrap/Tab'));


function Content() {
    const [tab, setTab] = useState<string>('time-entries');
    const [entries, setEntries] = useState<IEntry[]>([]);
    const [socketUrl, setSocketUrl] = useState(`ws://${window.location.hostname}/ws`);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const isFake = false;
    useEffect(() => {
        const fetchData = async () => {
            // Your existing logic for updating entries based on lastMessage
            if (lastMessage !== null) {
                setEntries((JSON.parse(lastMessage.data) as IEntry[]).sort((a, b) => (a.date > b.date ? -1 : 1)));
            }

            // Update entries with fakeEntries if isFake is true
            if (isFake) {
                const { FAKE_ENTRIES } = await import('../data/fake_sink');

                setEntries((FAKE_ENTRIES as IEntry[]).sort((a, b) => (a.date > b.date ? -1 : 1)));
            }
        };
        fetchData();
    }, [lastMessage, setEntries, isFake]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const onResetClicked = useCallback(() => sendMessage('reset_db'), []);

    const toggleTab = (tab: string) => {
        // TODO: Prepare the processed list with time intervals if the tab is 
        setTab(tab);
    }

    return (
        <div className="app">
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary header">
                    <Container>
                        <NavbarBrand href="#">
                            <img
                                alt="App Icon"
                                src={logo}
                                width="50"
                                height="50"
                                className="d-inline-block align-center logo"
                            />{' '}Attendance System
                        </NavbarBrand>
                    </Container>
                </Navbar>
                <div style={{ padding: "20px" }}>
                    <Tabs
                        id="my-tab"
                        activeKey={tab}
                        onSelect={(k: string | null) => k && toggleTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="time-entries" title="Time entries">
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
                        </Tab>
                        <Tab eventKey="time-intervals" title="Time intervals">
                            Tab content for the Processed time intervals table
                        </Tab>
                    </Tabs>
                </div>
            </Suspense>
            <div>
                <h5 className='d-flex justify-content-end px-2'>
                    <Badge bg="dark">Created by: Mohyiddine Oujarrar, 2023</Badge>
                </h5>
            </div>
        </div>
    );
}

export default Content;
