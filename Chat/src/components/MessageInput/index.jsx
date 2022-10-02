import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { sendMessage, sendMessageBot } from "../../services/firebase";
import "./styles.css";
import axios from "axios"




function MessageInput({ roomId }) {
  const { user } = useAuth();
  const [value, setValue] = React.useState("");

 async function callBot(){

    let message = value;

const trackOrder = "To track your order, please go to insertname.com and enter your order number."
const shippingPolicy = "We ship to anywhere internationally besides insertNotIncludedCountries. Shipping usually takes 1-2 weeks."
const refunds = "We allow refunds, exchange and returns only within two weeks on the item being delivered and you must still have your order id. To start a refund, return or exchange request, email insertemail@insert.com"
axios.post(
    'https://api.cohere.ai/classify',
    // '{\n    "model": "large",\n    "inputs": ["Am I still able to return my order?", "When can I expect my package?"],\n    "examples": [{"text": "Do you offer same day shipping?", "label": "Shipping and handling policy"}, {"text": "Can you ship to Italy?", "label": "Shipping and handling policy"}, {"text": "How long does shipping take?", "label": "Shipping and handling policy"}, {"text": "Can I buy online and pick up in store?", "label": "Shipping and handling policy"}, {"text": "What are your shipping options?", "label": "Shipping and handling policy"}, {"text": "My order arrived damaged, can I get a refund?", "label": "Start return or exchange"}, {"text": "You sent me the wrong item", "label": "Start return or exchange"}, {"text": "I want to exchange my item for another colour", "label": "Start return or exchange"}, {"text": "I ordered something and it wasn\u2019t what I expected. Can I return it?", "label": "Start return or exchange"}, {"text": "What\u2019s your return policy?", "label": "Start return or exchange"}, {"text": "Where\u2019s my package?", "label": "Track order"}, {"text": "When will my order arrive?", "label": "Track order"}, {"text": "What\u2019s my shipping number?", "label": "Track order"}, {"text": "Which carrier is my package with?", "label": "Track order"}, {"text": "Is my package delayed?", "label": "Track order"}]\n  }',
    {
        'model': 'large',
        'inputs': [
          message
        ],
        'examples': [
            {
                'text': 'Do you offer same day shipping?',
                'label': 'Shipping and handling policy'
            },
            {
                'text': 'Can you ship to Italy?',
                'label': 'Shipping and handling policy'
            },
            {
                'text': 'How long does shipping take?',
                'label': 'Shipping and handling policy'
            },
            {
                'text': 'Can I buy online and pick up in store?',
                'label': 'Shipping and handling policy'
            },
            {
                'text': 'What are your shipping options?',
                'label': 'Shipping and handling policy'
            },
            {
                'text': 'My order arrived damaged, can I get a refund?',
                'label': 'Start return or exchange'
            },
            {
                'text': 'You sent me the wrong item',
                'label': 'Start return or exchange'
            },
            {
                'text': 'I want to exchange my item for another colour',
                'label': 'Start return or exchange'
            },
            {
                'text': 'I ordered something and it wasn\u2019t what I expected. Can I return it?',
                'label': 'Start return or exchange'
            },
            {
                'text': 'What\u2019s your return policy?',
                'label': 'Start return or exchange'
            },
            {
                'text': 'Where\u2019s my package?',
                'label': 'Track order'
            },
            {
                'text': 'When will my order arrive?',
                'label': 'Track order'
            },
            {
                'text': 'What\u2019s my shipping number?',
                'label': 'Track order'
            },
            {
                'text': 'Which carrier is my package with?',
                'label': 'Track order'
            },
            {
                'text': 'Is my package delayed?',
                'label': 'Track order'
            }
        ]
    },
    {
        headers: {
            'Authorization': 'BEARER gorDToBtztoyZFNIXY8g5LdEXiYO17TeKYGA8deP',
            'Content-Type': 'application/json'
        }
    }
).then(function (response) {


  const upres = JSON.stringify(response.data.classifications)
  const word1 = upres.search("prediction")
  const word2 = upres.search("confidences")
  const res = upres.slice(word1, word2)
  
  if (res.includes("Track order")){
    sendMessageBot("help", trackOrder)
  } else if (res.includes("Start return or exchange")){
      sendMessageBot("help", refunds)
  } else if (res.includes("Shipping and handling policy")){
    sendMessageBot("help", shippingPolicy)
  }


})
.catch(function (error) {
  console.log(error);
});

}


  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(roomId, user, value);
    setValue("");
    callBot()
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-container">
      <input
        type="text"
        placeholder="Enter a message"
        value={value}
        onChange={handleChange}
        className="message-input"
        required
        minLength={1}
      />
      <button type="submit" disabled={value < 1} className="send-message">
        Send
      </button>
    </form>
  );

}
export { MessageInput };

