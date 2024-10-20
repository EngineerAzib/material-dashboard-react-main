import React, { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LowStockNotification = () => {
    const connectionRef = useRef(null); // To keep track of the SignalR connection
    const isHandlerAttached = useRef(false); // To ensure handler is attached only once

    useEffect(() => {
        if (!connectionRef.current) {
            // Create a new SignalR connection
            const connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7171/notificationHub") // Your SignalR hub URL
                .configureLogging(signalR.LogLevel.Information) // Set logging level
                .build();

            connectionRef.current = connection;

            // Start the connection
            connection.start()
                .then(() => {
                    console.log("Connected to SignalR hub");

                    // Attach the handler only once, after connection starts
                    if (!isHandlerAttached.current) {
                        connectionRef.current.on("ReceiveMessage", handleMessage);
                        isHandlerAttached.current = true; // Mark handler as attached
                    }
                })
                .catch(err => console.error("SignalR connection error: ", err));
        }

        // Clean up: stop connection and remove the handler when component unmounts
        return () => {
            if (connectionRef.current) {
                connectionRef.current.off("ReceiveMessage", handleMessage); // Detach handler
                connectionRef.current.stop() // Stop connection
                    .then(() => console.log("Disconnected from SignalR hub"))
                    .catch(err => console.error("SignalR disconnection error: ", err));
                connectionRef.current = null; // Clear reference
                isHandlerAttached.current = false; // Reset handler flag
            }
        };
    }, []); // Empty dependency ensures this runs only once

    // Handle receiving messages
    const handleMessage = (message) => {
        console.log("Received message:", message);
        toast.info(message, { autoClose: false, closeOnClick: true ,  containerId: "noti" }); // No timer, only closes on click
    };

    return (
        <div>
             <ToastContainer containerId="noti" position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default LowStockNotification;
