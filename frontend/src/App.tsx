import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const App = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: { username: string; text: string }) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, `${data.username}: ${data.text}`]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  function sendMessage() {
    if (!message || !username || !room) return;
    socket.emit("send_message", { username, text: message, room });
    setMessage("");
  }
  return (
    <div className="min-h-dvh w-full bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/80">
              Realtime chat
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Socket Chat
            </h1>
          </div>
          <div className="border-t border-white/10 bg-slate-950/80 p-4 sm:p-5">
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
            />
            <button
              onClick={joinRoom}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 active:scale-[0.99]"
            >
              Join Room
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const ind = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={ind ? "flex justify-start" : "flex justify-end"}
                >
                  <p className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-slate-900/80 px-4 py-3 text-sm leading-6 text-slate-100 shadow-lg shadow-black/10 sm:max-w-[70%]">
                    {msg}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-white/10 bg-slate-950/80 p-4 sm:p-5">
          <div className="flex gap-3 rounded-3xl border border-white/10 bg-white/5 p-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
            />
            <p className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 active:scale-[0.99]">
              Username
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 bg-slate-950/80 p-4 sm:p-5">
          <div className="flex gap-3 rounded-3xl border border-white/10 bg-white/5 p-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
            />
            <button
              onClick={sendMessage}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 active:scale-[0.99]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
