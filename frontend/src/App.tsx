import * as React from "react";
import SnippetListContainer from "./components/SnippetListContainer";
import Menu from "./components/Menu";
import { connect } from "react-redux";
import { hot } from "react-hot-loader/root";
import HomePage from "./components/HomePage";

document.title = "Code Snippets";

interface Props {
  activeMenuItem?: string;
}

class App extends React.Component<Props, {}> {
  render() {
    const { activeMenuItem } = this.props;
    return (
      <>
        <Menu activeMenuItem />
        {activeMenuItem === "snippet-lists" && <SnippetListContainer />}
        {activeMenuItem === "home" && <HomePage />}
      </>
    );
  }
}

const mapStateToProps = (state: { activeMenuItem: string }) => {
  return {
    activeMenuItem: state.activeMenuItem
  };
};

export default connect(mapStateToProps, null)(hot(App));
