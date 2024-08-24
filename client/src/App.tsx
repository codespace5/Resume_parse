import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppRouter from "./routes";
import { ConfigProvider, message } from "antd";

export const MessageContext = React.createContext<any>(null);

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Provider store={store}>
      <ConfigProvider>
        <MessageContext.Provider value={messageApi}>
          {contextHolder}
          <AppRouter />
        </MessageContext.Provider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
