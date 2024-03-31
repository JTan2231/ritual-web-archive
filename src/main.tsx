import { useState, useRef } from 'react';
import { marked } from 'marked';

type Chat = {
    role: string;
    content: string;
};

export function Main() {
    const [chatHistory, setChatHistory] = useState([] as Chat[]);
    const chatRef = useRef<HTMLInputElement>(null);

    return (
        <div id="container" style={{ fontFamily: 'monospace', cursor: 'text', border: '1px solid #0a0a0a', position: 'fixed', width: '70vw', height: '40vh', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} onClick={() => {
            document.getElementById("chatbox")!.focus();
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#efefef' }}>
                <div id="conversation" ref={chatRef} style={{ flexGrow: 1, margin: '1rem', fontSize: '14px', overflowY: 'auto' }}>
                    {chatHistory.map(c => <div dangerouslySetInnerHTML={{ __html: marked(c.content) as string }} />)}
                </div>
                <input id="chatbox" type="text" style={{ padding: '1rem', fontFamily: 'monospace', border: 0, outline: 0, width: 'calc(100% - 2rem)', alignSelf: 'flex-end' }} placeholder="What have you been up to?" onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        fetch("http://localhost:5000/webchat", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Basic ${btoa('joey:password')}`,
                            },
                            body: JSON.stringify({
                                chat: (document.getElementById('chatbox')! as HTMLInputElement).value,
                            }),
                        })
                            .then((response) => {
                                const reader = response!.body!.getReader();
                                let decoder = new TextDecoder();

                                let chunk = "";

                                function processText(text: string) {
                                    chunk += text;
                                    setChatHistory((oldHistory) => {
                                        const newHistory = oldHistory.length ? oldHistory.slice(0, oldHistory.length - 1) : oldHistory;

                                        newHistory.push({
                                            role: "assistant",
                                            content: chunk,
                                        });

                                        return newHistory;
                                    });

                                    chatRef.current!.scrollTop =
                                        chatRef.current!.scrollHeight;
                                }

                                return new ReadableStream({
                                    async start(controller) {
                                        while (true) {
                                            const { done, value } = await reader.read();
                                            if (done) {
                                                processText(decoder.decode());
                                                controller.close();

                                                break;
                                            }

                                            const textChunk = decoder.decode(value, {
                                                stream: true,
                                            });

                                            processText(textChunk);
                                        }
                                    },
                                });
                            })
                            .catch((err) => console.error(err));
                    }
                }} />
            </div>
        </div>
    );
}
