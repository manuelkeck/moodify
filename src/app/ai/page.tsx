'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';

function interpolateColor(startColor: string, endColor: string, step: number, steps: number): string {
    const startRGB = startColor.match(/\d+/g)!.map(Number);
    const endRGB = endColor.match(/\d+/g)!.map(Number);

    const r = Math.round(startRGB[0] + (endRGB[0] - startRGB[0]) * (step / steps));
    const g = Math.round(startRGB[1] + (endRGB[1] - startRGB[1]) * (step / steps));
    const b = Math.round(startRGB[2] + (endRGB[2] - startRGB[2]) * (step / steps));

    return `rgb(${r},${g},${b})`;
}

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();
    const messageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageContainerRef.current) {
            const container = messageContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="h-full sm:w-1/2 w-80 flex flex-col">

            {/*Chat window with input*/}
            <div className="w-full p-3 font-medium flex-col flex-grow items-center justify-center text-white bg-gradient-to-t from-gray-800 to-black rounded-b-2xl">
                <div className="flex flex-col h-full">
                    <div className="flex-grow overflow-auto" ref={messageContainerRef} style={{ maxHeight: 'calc(90vh - 210px)' }}>
                        {/* Messages window */}
                        <div className="flex flex-col p-4 space-y-4 justify-end">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`rounded-lg px-3 py-1 max-w-md ${message.role === 'user' ? 'self-end ml-10' : 'self-start mr-10'}`}
                                    style={{
                                        backgroundColor: interpolateColor(
                                            'rgb(5, 19, 168)',  // Blue
                                            'rgb(255, 0, 255)',  // Magenta
                                            index,
                                            messages.length - 1
                                        )
                                    }}
                                >
                                    {message.role === 'user' ? (
                                        <div className="">
                                            <p className="mb-1 text-xs">You:</p>
                                            <p>{message.content}</p>
                                        </div>
                                    ) : (
                                        <div className="">
                                            <p className="mb-1 text-xs">AI:</p>
                                            <p>{message.content}</p>
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <form onSubmit={handleSubmit} className="w-full flex justify-between">
                            <input
                                className="w-full border border-gray-300 rounded-3xl m-1 shadow-xl p-2"
                                style={{color: 'black'}}
                                value={input}
                                onChange={handleInputChange}
                            />
                            <div className="ml-auto flex justify-center">
                                <button className="mx-3">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/*Information about used LLM*/}
            <div className="mt-5 mx-10 text-center">
                <p className="text-xs font-normal">
                    Currently used LLM
                </p>
                <p className="text-xs font-normal" style={{fontFamily: 'Consolas, monospace'}}>
                    OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5
                </p>
            </div>
        </div>
    );
}