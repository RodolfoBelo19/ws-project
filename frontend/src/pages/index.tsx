import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:9876/myWebsocket");
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log("Conectado ao servidor");
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      const { data } = event;
      console.log("Mensagem recebida:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    newSocket.onclose = () => {
      console.log("Desconectado do servidor");
      setSocket(null);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("Socket desconectado");
        setSocket(null);
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(messageInput);
      setMessageInput("");
      console.log("Enviou a mensagem");
    } else {
      console.log("Socket não está conectado ou não existe");
    }
  };

  return (
    <main className="flex justify-center flex-col bg-zinc-900 h-screen items-center">
      <div className="bg-white p-1 w-64 rounded-t-xl">
        <div className="flex flex-col gap-2">
          <h2>Chat</h2>{" "}
          {messages.map((msg, index) => (
            <>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-gray-400 h-12 w-12"></div>
                <div className="p-1" key={index}>
                  {msg}
                </div>
              </div>
            </>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      <div className="p-1 w-64 flex gap-2 mt-1 justify-center">
        {" "}
        <input
          className="bg-zinc-100 p-2 shadow-sm rounded-b-lg"
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />{" "}
        <button
          className="bg-zinc-400 p-2 shadow-sm rounded-b-lg text-white"
          onClick={sendMessage}
          disabled={!socket || socket.readyState !== WebSocket.OPEN}
        >
          {" "}
          Enviar{" "}
        </button>{" "}
      </div>{" "}
    </main>
  );
}
