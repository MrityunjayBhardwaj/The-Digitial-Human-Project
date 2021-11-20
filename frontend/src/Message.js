// @flow
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import breaks from "remark-breaks";
import { formatDistance } from "date-fns";
import classnames from "classnames";
import type { ChatMessage } from "./Chatroom";
import { noop } from "./utils";
import customMapComponenet from "./customMapComponent.js";

type MessageTimeProps = {
  time: number,
  isBot: boolean,
};

const isCustomMessageSupported = (message) => message.content.therapists;

function sendUnsupportedCustomMessageError() {
  return (
    <p style={{ backgroundColor: "red" }}>
      Error: retrived json from custom rasa response doesn't contain property
      named 'therapists'.{" "}
    </p>
  );
}

export const MessageTime = ({ time, isBot }: MessageTimeProps) => {
  if (time === 0) return null;

  const messageTime = Math.min(Date.now(), time);
  const messageTimeObj = new Date(messageTime);
  return (
    <li
      className={classnames("time", isBot ? "left" : "right")}
      title={messageTimeObj.toISOString()}
    >
      {formatDistance(messageTimeObj, Date.now())}
    </li>
  );
};

type MessageProps = {
  chat: ChatMessage,
  onButtonClick?: (title: string, payload: string) => void,
  voiceLang?: ?string,
};

const supportSpeechSynthesis = () => "SpeechSynthesisUtterance" in window;

const speakUsingNativeSpeechSynthesis = (
  message: string,
  voiceLang: string
) => {
  const synth = window.speechSynthesis;
  let voices = [];
  voices = synth.getVoices();
  const toSpeak = new SpeechSynthesisUtterance(message);
  toSpeak.voice = voices.find((voice) => voice.lang === voiceLang);
  synth.speak(toSpeak);
};

const speakUsingTacotron = (message: string, voiceLang: string) => {
  callTacotron = fetch("http://localhost:4001/speak")
    .then((response) => response.json())
    .then((data) => console.log(data));
  const rawResponse = await fetch('http://localhost:4001/speak', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({message: message, voiceLang: voiceLang})
  });
  const content = await rawResponse.json();
  audio_file_name = content.audio_file_name;
  var audio = new Audio(audio_file_name);
  audio.play();
  console.log(content);

};



const Message = ({ chat, onButtonClick, voiceLang = null }: MessageProps) => {
  const message = chat.message;
  const isBot = chat.username === "bot";

  useEffect(() => {
    if (
      isBot &&
      voiceLang != null &&
      message.type === "text" &&
      supportSpeechSynthesis()
    ) {
      speakUsingNativeSpeechSynthesis(message.text, voiceLang);
    }
  }, []);

  switch (message.type) {
    case "button":
      return (
        <ul className="chat-buttons">
          {message.buttons.map(({ payload, title, selected }) => (
            <li
              className={classnames("chat-button", {
                "chat-button-selected": selected,
                "chat-button-disabled": !onButtonClick,
              })}
              key={payload}
              onClick={
                onButtonClick != null
                  ? () => onButtonClick(title, payload)
                  : noop
              }
            >
              <Markdown
                source={title}
                skipHtml={false}
                allowedTypses={["root", "break"]}
                renderers={{
                  paragraph: ({ children }) => <span>{children}</span>,
                }}
                plugins={[breaks]}
              />
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <li className={`chat ${isBot ? "left" : "right"} chat-img`}>
          <img src={message.image} alt="" />
        </li>
      );
    case "text":
      return (
        <li className={classnames("chat", isBot ? "left" : "right")}>
          <Markdown
            className="text"
            source={message.text}
            skipHtml={false}
            allowedTypses={[
              "root",
              "break",
              "paragraph",
              "emphasis",
              "strong",
              "link",
              "list",
              "listItem",
              "image",
            ]}
            renderers={{
              paragraph: ({ children }) => <span>{children}</span>,
              link: ({ href, children }) => (
                <a href={href} target="_blank">
                  {children}
                </a>
              ),
            }}
            plugins={[breaks]}
          />
        </li>
      );

    case "custom":
      console.log("message: ", message.content);
      return (
        <li
          className={classnames("chat", isBot ? "left" : "right")}
          style={{ padding: "5px;" }}
        >
          {isCustomMessageSupported(message)
            ? customMapComponenet(message.content.therapists)
            : sendUnsupportedCustomMessageError()}
        </li>
      );

    default:
      return null;
  }
};
export default Message;
